import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useState } from "react";

function formatMonthYear(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function Limits() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const utils = trpc.useUtils();
  const { data: categories } = trpc.categories.list.useQuery(undefined, { enabled: !!user });
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthYear = useMemo(() => formatMonthYear(currentDate), [currentDate]);

  const { data: limits } = trpc.limits.byMonth.useQuery({ monthYear }, { enabled: !!user });

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  useEffect(() => {
    if (categories && categories.length > 0 && categoryId === null) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const upsert = trpc.limits.upsert.useMutation({
    onSuccess: async () => {
      setMonthlyLimit("");
      await utils.limits.byMonth.invalidate({ monthYear });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !monthlyLimit) return;
    await upsert.mutateAsync({ categoryId, monthYear, monthlyLimit: parseFloat(monthlyLimit), notifyWhatsapp });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Limites por Categoria</CardTitle>
            <CardDescription>Defina limites mensais e receba alertas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div>
                <label className="text-sm font-medium">Mês</label>
                <Input type="month" value={`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,"0")}`} onChange={(e) => {
                  const [y, m] = e.target.value.split("-");
                  setCurrentDate(new Date(parseInt(y,10), parseInt(m,10)-1, 1));
                }} />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {limits && limits.length > 0 ? (
                limits.map(l => (
                  <div key={l.id} className="flex justify-between border-b py-2">
                    <div>
                      <div className="font-medium">{categories?.find(c => c.id === l.categoryId)?.name || `Categoria ${l.categoryId}`}</div>
                      <div className="text-xs text-gray-500">Alerta WhatsApp: {l.notifyWhatsapp ? 'Sim' : 'Não'}</div>
                    </div>
                    <div>Limite: R$ {l.monthlyLimit.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum limite definido para o mês</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novo Limite</CardTitle>
            <CardDescription>Configure um limite para uma categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select className="w-full border rounded h-10 px-2" value={categoryId ?? ''} onChange={(e) => setCategoryId(parseInt(e.target.value,10))}>
                  {categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Limite (R$)</label>
                <Input type="number" step="0.01" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} required />
              </div>
              <div className="flex items-center gap-2">
                <input id="notify" type="checkbox" checked={notifyWhatsapp} onChange={(e) => setNotifyWhatsapp(e.target.checked)} />
                <label htmlFor="notify" className="text-sm">Notificar via WhatsApp</label>
              </div>
              <div className="md:col-span-3">
                <Button type="submit">Salvar Limite</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}