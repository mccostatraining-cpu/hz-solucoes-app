import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Debts() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const utils = trpc.useUtils();
  const { data: debts } = trpc.debts.list.useQuery(undefined, { enabled: !!user });

  const [creditorName, setCreditorName] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [notes, setNotes] = useState("");

  const addDebt = trpc.debts.add.useMutation({
    onSuccess: async () => {
      setCreditorName("");
      setPrincipalAmount("");
      setNotes("");
      await utils.debts.list.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditorName || !principalAmount) return;
    await addDebt.mutateAsync({
      creditorName,
      principalAmount: parseFloat(principalAmount),
      notes: notes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dívidas</CardTitle>
            <CardDescription>Controle dívidas e pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {debts && debts.length > 0 ? (
                debts.map((d) => (
                  <div key={d.id} className="border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{d.creditorName}</div>
                        <div className="text-xs text-gray-500">Principal: R$ {d.principalAmount.toFixed(2)}</div>
                      </div>
                    </div>
                    <DebtPayments debtId={d.id} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhuma dívida registrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nova Dívida</CardTitle>
            <CardDescription>Adicione uma dívida</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Credor</label>
                <Input value={creditorName} onChange={(e) => setCreditorName(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Valor (R$)</label>
                <Input type="number" step="0.01" value={principalAmount} onChange={(e) => setPrincipalAmount(e.target.value)} required />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium">Observações</label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <Button type="submit">Adicionar Dívida</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DebtPayments({ debtId }: { debtId: number }) {
  const { data } = trpc.debts.payments.useQuery({ debtId });
  const utils = trpc.useUtils();
  const [amount, setAmount] = useState("");
  const addPayment = trpc.debts.addPayment.useMutation({
    onSuccess: async () => {
      setAmount("");
      await utils.debts.payments.invalidate({ debtId });
    }
  });
  return (
    <div className="mt-3">
      <div className="text-sm font-medium mb-2">Pagamentos</div>
      <div className="space-y-2">
        {data?.map(p => (
          <div key={p.id} className="flex items-center justify-between">
            <div>
              <span className="text-sm">R$ {p.amount.toFixed(2)}</span>
              <span className="ml-2 text-xs text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</span>
              <span className="ml-2 text-xs text-gray-500">{p.method}</span>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <Input placeholder="Valor (R$)" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button variant="outline" onClick={() => amount && addPayment.mutate({ debtId, amount: parseFloat(amount) })}>Adicionar pagamento</Button>
        </div>
      </div>
    </div>
  );
}