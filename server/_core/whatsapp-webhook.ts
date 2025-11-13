import type { Express, Request, Response } from "express";
import crypto from "crypto";
import { parseWhatsappText } from "./whatsapp-parser";
import {
  addExpense,
  addDailyRevenue,
  getDailyRevenueByMonth,
  getDefaultActorUserId,
  getExpenses,
  getExpensesByMonth,
  getHouseholdByPhoneNumber,
  getItems,
  getTotalExpensesByMonth,
  getTotalFixedExpenses,
} from "./db";
import { autoCategorize } from "./auto-categorize";
import { notifyExpenseAdded } from "./whatsapp";

function toBRL(valueCents: number): string {
  return (valueCents / 100).toFixed(2);
}

function replyTwiML(res: Response, message: string) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response><Message>${message}</Message></Response>`;
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(xml);
}

export function registerWhatsappWebhook(app: Express) {
  app.post("/api/trpc/whatsapp.webhook", async (req: Request, res: Response) => {
    try {
      // Verify Twilio signature to ensure request authenticity
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const signatureHeader = req.get("X-Twilio-Signature") || req.get("x-twilio-signature");
      if (!authToken || !signatureHeader) {
        return res.status(401).send("Unauthorized");
      }
      // Build the expected signature according to Twilio docs:
      // expected = Base64( HMAC-SHA1( authToken, url + concat(sortedParams) ) )
      const protocol = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
      const host = req.get("host");
      const url = `${protocol}://${host}${req.originalUrl}`;
      const params = req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};
      const sortedKeys = Object.keys(params).sort();
      let data = url;
      for (const key of sortedKeys) {
        const value = params[key];
        data += key + String(value ?? "");
      }
      const expectedSignature = crypto.createHmac("sha1", authToken).update(data).digest("base64");
      const safeEqual = (a: string, b: string) => {
        const aBuf = Buffer.from(a);
        const bBuf = Buffer.from(b);
        if (aBuf.length !== bBuf.length) return false;
        return crypto.timingSafeEqual(aBuf, bBuf);
      };
      if (!safeEqual(expectedSignature, signatureHeader)) {
        return res.status(401).send("Invalid signature");
      }

      const body = typeof req.body?.Body === "string" ? req.body.Body : "";
      const from = typeof req.body?.From === "string" ? req.body.From : "";

      if (!body || !from) {
        return replyTwiML(res, "Mensagem inválida. Use 'ajuda' para comandos.");
      }

      const householdId = await getHouseholdByPhoneNumber(from);
      if (!householdId) {
        return replyTwiML(
          res,
          "Número não vinculado. Acesse o sistema e configure seu WhatsApp."
        );
      }

      const actorUserId = await getDefaultActorUserId(householdId);
      if (!actorUserId) {
        return replyTwiML(
          res,
          "Nenhum usuário encontrado no household. Faça login ao menos uma vez."
        );
      }

      const cmd = parseWhatsappText(body);
      if (!cmd) {
        return replyTwiML(res, "Comando não reconhecido. Envie 'ajuda' para opções.");
      }

      if (cmd.type === "help") {
        return replyTwiML(
          res,
          [
            "Comandos:",
            "- gasto <valor> <descrição>",
            "- saldo",
            "- despesas",
            "- itens",
            "- ajuda",
          ].join("\n")
        );
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      if (cmd.type === "saldo" || cmd.type === "resumo") {
        const totalExpenses = await getTotalExpensesByMonth(householdId, year, month);
        const totalFixed = await getTotalFixedExpenses(householdId);
        const revenue = await getDailyRevenueByMonth(householdId, year, month);
        const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
        const balance = totalRevenue - totalExpenses - totalFixed;

        const msg = `Faturamento: R$ ${toBRL(totalRevenue)}\nDespesas variáveis: R$ ${toBRL(totalExpenses)}\nDespesas fixas: R$ ${toBRL(totalFixed)}\nSaldo: R$ ${toBRL(balance)}`;
        return replyTwiML(res, msg);
      }

      if (cmd.type === "despesas") {
        const list = await getExpenses(householdId, 5, 0);
        if (list.length === 0) return replyTwiML(res, "Sem despesas registradas.");
        const lines = list
          .slice(-5)
          .map((e) => `- ${e.description}: R$ ${toBRL(e.amount)}`);
        return replyTwiML(res, ["Últimas despesas:", ...lines].join("\n"));
      }

      if (cmd.type === "itens") {
        const items = await getItems(householdId);
        const pending = items.filter((i) => i.status === "pending");
        if (pending.length === 0) return replyTwiML(res, "Sem itens pendentes.");
        const lines = pending.slice(0, 5).map((i) => {
          const amt = i.amount ? ` - R$ ${toBRL(i.amount)}` : "";
          return `- ${i.itemName}${amt}`;
        });
        return replyTwiML(res, ["Itens pendentes:", ...lines].join("\n"));
      }

      if (cmd.type === "gasto") {
        const categoryId = await autoCategorize(householdId, cmd.description);
        await addExpense(
          householdId,
          actorUserId,
          cmd.description,
          cmd.amountCents,
          categoryId,
          new Date(),
          "whatsapp"
        );

        // Notify via Manus (optional, keeps owners informed)
        await notifyExpenseAdded("WhatsApp", cmd.description, cmd.amountCents / 100);

        return replyTwiML(
          res,
          `Despesa adicionada: ${cmd.description} - R$ ${(cmd.amountCents / 100).toFixed(2)}`
        );
      }

      if (cmd.type === "receita") {
        await addDailyRevenue(
          householdId,
          cmd.amountCents,
          new Date(),
          cmd.description
        );
        return replyTwiML(
          res,
          `Receita adicionada: ${cmd.description} - R$ ${(cmd.amountCents / 100).toFixed(2)}`
        );
      }

      return replyTwiML(res, "Comando não suportado.");
    } catch (error) {
      console.error("[WhatsApp] webhook error:", error);
      return replyTwiML(res, "Erro ao processar a mensagem.");
    }
  });
}