import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";

function formatMonthYear(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function Dues() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const utils = trpc.useUtils();
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthYear = useMemo(() => formatMonthYear(currentDate), [currentDate]);
  const { data } = trpc.dues.byMonth.useQuery({ monthYear }, { enabled: !!user });

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  const addEvent = trpc.dues.add.useMutation({
    onSuccess: async () => {
      setTitle("");
      setDueDate("");
      setNotifyWhatsapp(true);
      await utils.dues.byMonth.invalidate({ monthYear });
    }
  });

  const updateStatus = trpc.dues.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.dues.byMonth.invalidate({ monthYear });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    await addEvent.mutateAsync({ title, dueDate: new Date(dueDate), notifyWhatsapp });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Vencimentos</CardTitle>
            <CardDescription>Eventos por mês</CardDescription>
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
              {data && data.length > 0 ? (
                data.map(ev => (
                  <div key={ev.id} className="flex justify-between border-b py-2">
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-xs text-gray-500">Vencimento: {new Date(ev.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${ev.status === 'completed' ? 'bg-green-100 text-green-700' : ev.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>{ev.status}</span>
                      {ev.status !== 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: ev.id, status: 'completed' })}>Concluir</Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Sem eventos para o mês</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novo Evento</CardTitle>
            <CardDescription>Adicione um vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Título</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Data de vencimento</label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
              <div className="flex items-center gap-2 md:col-span-3">
                <input id="notify" type="checkbox" checked={notifyWhatsapp} onChange={(e) => setNotifyWhatsapp(e.target.checked)} />
                <label htmlFor="notify" className="text-sm">Notificar via WhatsApp</label>
              </div>
              <div className="md:col-span-3">
                <Button type="submit">Adicionar Evento</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}