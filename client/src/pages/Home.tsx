import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, TrendingDown, TrendingUp, Wallet, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const initHousehold = trpc.auth.initHousehold.useMutation();
  useEffect(() => {
    if (isAuthenticated && !initHousehold.isPending) {
      initHousehold.mutate();
    }
  }, [isAuthenticated]);

  const { data: summary, isLoading: summaryLoading } = trpc.dashboard.summary.useQuery(
    { year, month },
    { enabled: !!user }
  );

  const { data: expenses } = trpc.expenses.list.useQuery(
    { limit: 5, offset: 0 },
    { enabled: !!user }
  );

  const { data: items } = trpc.items.list.useQuery(undefined, { enabled: !!user });
  const dailySummary = trpc.alerts.dailySummary.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Sistema Financeiro</CardTitle>
            <CardDescription>Controle suas finanças com sua esposa via WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Gerencie despesas, projetos e metas de forma compartilhada. Receba notificações no WhatsApp!
            </p>
            <a href={getLoginUrl()}>
              <Button className="w-full">Fazer Login</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard Financeiro</h1>
            <p className="text-gray-500 mt-2">Bem-vindo, {user?.name}!</p>
          </div>
        </div>

        {summaryLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {summary?.totalRevenue?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Receita do mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {summary?.totalExpenses?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Gastos variaveis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fixas</CardTitle>
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {summary?.totalFixedExpenses?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mensais</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                  <Wallet className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${summary?.balance! >= 0 ? "text-green-600" : "text-red-600"}`}>
                    R$ {summary?.balance?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Saldo</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ultimas Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  {expenses && expenses.length > 0 ? (
                    <div className="space-y-3">
                      {expenses.slice(0, 5).map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm">{expense.description}</span>
                          <span className="text-red-600 font-semibold">-R$ {expense.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhuma despesa</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Itens Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {items && items.length > 0 ? (
                    <div className="space-y-2">
                      {items.filter(i => i.status === "pending").slice(0, 5).map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm">{item.itemName}</span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pendente</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum item</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/add-expense">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Despesa
                </Button>
              </Link>
              <Link href="/add-revenue">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ganho
                </Button>
              </Link>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => dailySummary.mutate()}
                disabled={dailySummary.isPending}
                title="Enviar resumo diário via WhatsApp"
              >
                {dailySummary.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                {dailySummary.isSuccess ? "Resumo enviado" : "Enviar Resumo Diário"}
              </Button>
              <Link href="/items">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Item
                </Button>
              </Link>
              <Link href="/fixed-expenses">
                <Button variant="outline" className="gap-2">
                  Fixas
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="gap-2">
                  Metas
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="gap-2">
                  Relatorios
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" className="gap-2">
                  Cartões
                </Button>
              </Link>
              <Link href="/purchases">
                <Button variant="outline" className="gap-2">
                  Parcelas
                </Button>
              </Link>
              <Link href="/debts">
                <Button variant="outline" className="gap-2">
                  Dívidas
                </Button>
              </Link>
              <Link href="/limits">
                <Button variant="outline" className="gap-2">
                  Limites
                </Button>
              </Link>
              <Link href="/dues">
                <Button variant="outline" className="gap-2">
                  Agenda
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
