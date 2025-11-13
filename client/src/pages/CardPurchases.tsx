import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useState } from "react";

export default function CardPurchases() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const utils = trpc.useUtils();
  const { data: cards } = trpc.cards.list.useQuery(undefined, { enabled: !!user });

  const [cardId, setCardId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [installments, setInstallments] = useState("1");
  const [merchant, setMerchant] = useState("");
  const [firstDueDate, setFirstDueDate] = useState("");

  useEffect(() => {
    if (cards && cards.length > 0 && cardId === null) {
      setCardId(cards[0].id);
    }
  }, [cards]);

  const purchasesQuery = trpc.purchases.byCard.useQuery(
    { cardId: cardId ?? 0 },
    { enabled: !!user && !!cardId }
  );

  const addPurchaseMutation = trpc.purchases.add.useMutation({
    onSuccess: async () => {
      setDescription("");
      setTotalAmount("");
      setInstallments("1");
      setMerchant("");
      setFirstDueDate("");
      await utils.purchases.byCard.invalidate({ cardId: cardId! });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardId || !description || !totalAmount) return;
    await addPurchaseMutation.mutateAsync({
      cardId,
      description,
      totalAmount: parseFloat(totalAmount),
      installments: parseInt(installments, 10),
      merchant: merchant || undefined,
      firstDueDate: firstDueDate ? new Date(firstDueDate) : undefined,
    });
  };

  const purchases = useMemo(() => purchasesQuery.data ?? [], [purchasesQuery.data]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Compras no Cartão</CardTitle>
            <CardDescription>Registre compras e gere parcelas automaticamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium">Cartão</label>
                <select
                  className="w-full border rounded h-10 px-2"
                  value={cardId ?? ''}
                  onChange={(e) => setCardId(parseInt(e.target.value, 10))}
                >
                  {cards?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Total (R$)</label>
                <Input type="number" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Parcelas</label>
                <Input type="number" value={installments} onChange={(e) => setInstallments(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Loja</label>
                <Input value={merchant} onChange={(e) => setMerchant(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Primeiro vencimento</label>
                <Input type="date" value={firstDueDate} onChange={(e) => setFirstDueDate(e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <Button type="submit">Adicionar Compra</Button>
              </div>
            </form>

            <div className="mt-6 space-y-3">
              {purchases.length > 0 ? (
                purchases.map((p) => (
                  <div key={p.id} className="border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{p.description}</div>
                        <div className="text-xs text-gray-500">Total: R$ {p.totalAmount.toFixed(2)} • {p.installmentsCount}x</div>
                      </div>
                    </div>
                    <InstallmentsList purchaseId={p.id} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhuma compra para este cartão</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InstallmentsList({ purchaseId }: { purchaseId: number }) {
  const { data } = trpc.purchases.installments.useQuery({ purchaseId });
  const utils = trpc.useUtils();
  const markPaid = trpc.purchases.markPaid.useMutation({
    onSuccess: async () => {
      await utils.purchases.installments.invalidate({ purchaseId });
    }
  });
  return (
    <div className="mt-3">
      <div className="text-sm font-medium mb-2">Parcelas</div>
      <div className="space-y-2">
        {data?.map(i => (
          <div key={i.id} className="flex items-center justify-between">
            <div>
              <span className="text-sm">Parcela {i.installmentNumber}/{i.totalInstallments} • R$ {(i.amount/100).toFixed(2)}</span>
              <span className="ml-2 text-xs text-gray-500">Vencimento: {new Date(i.dueDate).toLocaleDateString()}</span>
              <span className={`ml-2 text-xs px-2 py-1 rounded ${i.status === 'paid' ? 'bg-green-100 text-green-700' : i.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>{i.status}</span>
            </div>
            {i.status !== 'paid' && (
              <Button size="sm" variant="outline" onClick={() => markPaid.mutate({ installmentId: i.id })}>Marcar paga</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}