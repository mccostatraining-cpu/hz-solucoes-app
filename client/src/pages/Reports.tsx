import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: summary } = trpc.dashboard.summary.useQuery(
    { year, month },
    { enabled: !!user }
  );

  const { data: expenses } = trpc.expenses.list.useQuery(
    { limit: 100, offset: 0 },
    { enabled: !!user }
  );

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const monthName = new Date(year, month - 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Relatorios</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevMonth}>
              Anterior
            </Button>
            <Button variant="outline" disabled>
              {monthName}
            </Button>
            <Button variant="outline" onClick={handleNextMonth}>
              Proximo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                R$ {summary?.totalRevenue?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Gasto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                R$ {(summary ? (summary.totalExpenses + summary.totalFixedExpenses) : 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas Variaveis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {summary?.totalExpenses?.toFixed(2) || "0.00"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas Fixas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {summary?.totalFixedExpenses?.toFixed(2) || "0.00"}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Saldo do Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${summary?.balance! >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {summary?.balance?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ultimas Despesas</CardTitle>
            <CardDescription>Transacoes do mes</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses && expenses.length > 0 ? (
              <div className="space-y-2">
                {expenses.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm">{expense.description}</span>
                    <span className="font-semibold text-red-600">-R$ {(expense.amount / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma despesa neste mes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
