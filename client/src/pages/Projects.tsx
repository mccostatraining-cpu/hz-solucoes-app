import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Projects() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetMonths, setTargetMonths] = useState("12");
  const [isLoading, setIsLoading] = useState(false);

  const { data: projects, refetch } = trpc.projects.list.useQuery(undefined, { enabled: !!user });

  const addProjectMutation = trpc.projects.add.useMutation({
    onSuccess: () => {
      setName("");
      setTargetAmount("");
      refetch();
    },
  });

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    setIsLoading(true);
    try {
      await addProjectMutation.mutateAsync({
        name,
        targetAmount: parseFloat(targetAmount),
        targetMonths: parseInt(targetMonths),
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
            <CardTitle>Nova Meta</CardTitle>
            <CardDescription>Crie metas de economia ou projetos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome da Meta</label>
                <Input
                  placeholder="Ex: Viagem, Carro, Casa..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Valor Alvo (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Meses</label>
                  <Input
                    type="number"
                    min="1"
                    value={targetMonths}
                    onChange={(e) => setTargetMonths(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Salvando..." : "Criar Meta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suas Metas</CardTitle>
            <CardDescription>Acompanhe o progresso de cada meta</CardDescription>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => {
                  const progress = (project.savedAmount / project.targetAmount) * 100;
                  return (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-gray-500">
                            R$ {(project.savedAmount / 100).toFixed(2)} de R$ {(project.targetAmount / 100).toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma meta criada ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
