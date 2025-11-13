import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Items() {
  const { user } = useAuth();
  const [itemName, setItemName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: items, refetch } = trpc.items.list.useQuery(undefined, { enabled: !!user });

  const addItemMutation = trpc.items.add.useMutation({
    onSuccess: () => {
      setItemName("");
      refetch();
    },
  });

  const updateStatusMutation = trpc.items.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    setIsLoading(true);
    try {
      await addItemMutation.mutateAsync({
        itemName,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (itemId: number, newStatus: "pending" | "purchased" | "paid") => {
    await updateStatusMutation.mutateAsync({
      itemId,
      status: newStatus,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Item</CardTitle>
            <CardDescription>Adicione um item para controlar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="flex gap-2">
              <Input
                placeholder="Ex: Leite, Pao, Remedio..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "..." : "Adicionar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens de Controle</CardTitle>
            <CardDescription>Gerencie seus itens</CardDescription>
          </CardHeader>
          <CardContent>
            {items && items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      <p className="text-xs text-gray-500">
                        Status: {item.status === "pending" ? "Pendente" : item.status === "purchased" ? "Comprado" : "Pago"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {item.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(item.id, "purchased")}
                          >
                            Comprado
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(item.id, "paid")}
                          >
                            Pago
                          </Button>
                        </>
                      )}
                      {item.status === "purchased" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(item.id, "paid")}
                        >
                          Marcar Pago
                        </Button>
                      )}
                      {item.status === "paid" && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Concluido
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum item adicionado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
