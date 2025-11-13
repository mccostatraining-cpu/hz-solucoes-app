import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EvolutionData {
  month: string;
  revenue: number;
  expenses: number;
  balance: number;
}

interface EvolutionChartProps {
  data: EvolutionData[];
  title?: string;
}

export function EvolutionChart({ data, title }: EvolutionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Nenhum dado disponivel</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `R$ ${(value / 100).toFixed(2)}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            name="Faturamento"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            name="Despesas"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            name="Saldo"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
