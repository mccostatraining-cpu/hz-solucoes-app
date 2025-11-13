import { notifyOwner } from "./_core/notification";

/**
 * Envia notificação para WhatsApp quando uma despesa é adicionada
 */
export async function notifyExpenseAdded(
  userName: string,
  description: string,
  amount: number
): Promise<void> {
  await notifyOwner({
    title: "Nova Despesa Registrada",
    content: `${userName} adicionou: ${description} - R$ ${amount.toFixed(2)}`,
  });
}

/**
 * Envia notificação quando meta é atingida
 */
export async function notifyTargetReached(
  projectName: string,
  amount: number
): Promise<void> {
  await notifyOwner({
    title: "Meta Atingida!",
    content: `Parabens! Voce atingiu a meta de ${projectName}: R$ ${amount.toFixed(2)}`,
  });
}

/**
 * Envia notificação quando item é marcado como pago
 */
export async function notifyItemPaid(
  itemName: string,
  amount?: number
): Promise<void> {
  const msg = amount 
    ? `${itemName} foi marcado como pago - R$ ${amount.toFixed(2)}`
    : `${itemName} foi marcado como pago`;
  
  await notifyOwner({
    title: "Item Pago",
    content: msg,
  });
}

/**
 * Envia resumo financeiro do mes
 */
export async function notifyMonthlySummary(
  totalRevenue: number,
  totalExpenses: number,
  balance: number
): Promise<void> {
  await notifyOwner({
    title: "Resumo Financeiro do Mes",
    content: `Faturamento: R$ ${totalRevenue.toFixed(2)} | Despesas: R$ ${totalExpenses.toFixed(2)} | Saldo: R$ ${balance.toFixed(2)}`,
  });
}
