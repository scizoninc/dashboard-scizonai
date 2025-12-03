import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Importar o componente Button
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, ShoppingCart, DollarSign, Upload } from "lucide-react"; // Importar o ícone Upload
import { useNavigate } from "react-router-dom";

const salesData = [
  { name: "Jan", valor: 4000 },
  { name: "Fev", valor: 3000 },
  { name: "Mar", valor: 5000 },
  { name: "Abr", "valor": 4500 },
  { name: "Mai", valor: 6000 },
  { name: "Jun", valor: 5500 },
];

const userData = [
  { name: "Seg", usuarios: 120 },
  { name: "Ter", usuarios: 150 },
  { name: "Qua", usuarios: 180 },
  { name: "Qui", usuarios: 140 },
  { name: "Sex", usuarios: 200 },
  { name: "Sáb", usuarios: 170 },
  { name: "Dom", usuarios: 160 },
];

const stats = [
  {
    title: "Receita Total",
    value: "R$ 45.231",
    change: "+20.1%",
    icon: DollarSign,
  },
  {
    title: "Usuários Ativos",
    value: "2.350",
    change: "+15.3%",
    icon: Users,
  },
  {
    title: "Vendas",
    value: "1.453",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "Taxa de Conversão",
    value: "3.2%",
    change: "+2.5%",
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/auth");
  };

  // Nova função para a ação do botão de importação
  const handleImport = () => {
    alert("Funcionalidade de Importar Arquivo acionada!");
    // Implemente aqui a lógica real de importação de arquivo
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 md:ml-64 p-6 md:p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          {/* Flexbox para alinhar título e botão */}
          <div className="mb-8 animate-slide-up flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Scizon AI Dashboard</h1>
              <p className="text-muted-foreground">Indicadores</p>
            </div>
            
            {/* Botão de Importar Arquivo */}
            <Button onClick={handleImport} className="ml-4">
              <Upload className="mr-2 h-4 w-4" />
              Importar Arquivo
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.title}
                className="border-border hover:shadow-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-foreground font-medium">{stat.change}</span> desde o mês passado
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border animate-slide-up" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle>Vendas Mensais</CardTitle>
                <CardDescription>Evolução das vendas nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="valor" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle>Usuários Ativos</CardTitle>
                <CardDescription>Atividade de usuários na última semana</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usuarios"
                      stroke="hsl(var(--foreground))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--foreground))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}