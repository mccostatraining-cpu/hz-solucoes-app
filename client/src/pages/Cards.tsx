import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Cards() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const utils = trpc.useUtils();
  const { data: cards } = trpc.cards.list.useQuery(undefined, { enabled: !!user });

  const [name, setName] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [issuer, setIssuer] = useState("");
  const [benefits, setBenefits] = useState("");

  const addCardMutation = trpc.cards.add.useMutation({
    onSuccess: async () => {
      setName("");
      setCreditLimit("");
      setClosingDay("");
      setDueDay("");
      setBrand(undefined);
      setIssuer("");
      setBenefits("");
      await utils.cards.list.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !creditLimit || !closingDay || !dueDay) return;
    await addCardMutation.mutateAsync({
      name,
      creditLimit: parseFloat(creditLimit),
      closingDay: parseInt(closingDay, 10),
      dueDay: parseInt(dueDay, 10),
      brand: brand as any,
      issuer: issuer || undefined,
      benefits: benefits || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cartões</CardTitle>
            <CardDescription>Gerencie seus cartões de crédito</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cards && cards.length > 0 ? (
                cards.map((c) => (
                  <div key={c.id} className="flex justify-between border-b py-2">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">Fechamento: dia {c.closingDay} • Vencimento: dia {c.dueDay}</div>
                    </div>
                    <div className="text-sm">Limite: R$ {c.creditLimit.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum cartão cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novo Cartão</CardTitle>
            <CardDescription>Adicione um novo cartão</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Limite (R$)</label>
                <Input type="number" step="0.01" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Dia de fechamento</label>
                <Input type="number" value={closingDay} onChange={(e) => setClosingDay(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Dia de vencimento</label>
                <Input type="number" value={dueDay} onChange={(e) => setDueDay(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Bandeira</label>
                <Input placeholder="visa, mastercard..." value={brand ?? ""} onChange={(e) => setBrand(e.target.value || undefined)} />
              </div>
              <div>
                <label className="text-sm font-medium">Emissor</label>
                <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Benefícios</label>
                <Input value={benefits} onChange={(e) => setBenefits(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit">Adicionar Cartão</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}