import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AddRevenue() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [revenueDate, setRevenueDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);

  const addRevenueMutation = trpc.revenue.add.useMutation({
    onSuccess: () => {
      setDescription("");
      setAmount("");
      setLocation("/");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setIsLoading(true);
    try {
      await addRevenueMutation.mutateAsync({
        description,
        amount: parseFloat(amount),
        revenueDate: new Date(revenueDate),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Ganho</CardTitle>
            <CardDescription>Registre um novo faturamento ou receita</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Data</label>
                <Input
                  type="date"
                  value={revenueDate}
                  onChange={(e) => setRevenueDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descricao</label>
                <Input
                  placeholder="Ex: Salario, Freelance, Bonus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Salvando..." : "Adicionar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setLocation("/")} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
