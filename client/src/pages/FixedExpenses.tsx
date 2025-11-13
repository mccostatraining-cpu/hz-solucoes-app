import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function FixedExpenses() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const { data: fixedExpenses, refetch } = trpc.fixedExpenses.list.useQuery(undefined, { enabled: !!user });

  const addFixedExpenseMutation = trpc.fixedExpenses.add.useMutation({
    onSuccess: () => {
      setName("");
      setAmount("");
      setDueDate("1");
      refetch();
    },
  });

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    setIsLoading(true);
    try {
      await addFixedExpenseMutation.mutateAsync({
        name,
        amount: parseFloat(amount),
        dueDay: parseInt(dueDate),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Despesa Fixa</CardTitle>
            <CardDescription>Adicione contas recorrentes (aluguel, agua, luz, etc)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    placeholder="Ex: Aluguel, Agua, Luz..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Valor (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Vencimento (dia do mes)</label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Salvando..." : "Adicionar Despesa Fixa"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Fixas</CardTitle>
            <CardDescription>Suas contas recorrentes</CardDescription>
          </CardHeader>
          <CardContent>
            {fixedExpenses && fixedExpenses.length > 0 ? (
              <div className="space-y-3">
                {fixedExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{expense.name}</p>
                      <p className="text-xs text-gray-500">Vence no dia {expense.dueDay}</p>
                    </div>
                    <p className="font-semibold text-red-600">-R$ {(expense.amount / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma despesa fixa adicionada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
