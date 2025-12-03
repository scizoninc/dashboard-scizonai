import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, ShoppingCart, DollarSign, Upload, Loader2, XCircle } from "lucide-react"; 
import { useNavigate } from "react-router-dom";


const Sidebar = ({ onLogout }) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-card p-6 shadow-xl hidden md:flex flex-col z-10 border-r border-border">
      <div className="flex-1">
        <h2 className="text-2xl font-extrabold mb-10 text-primary">Scizon AI</h2>
        <div className="space-y-4">
            <div className="flex items-center text-foreground font-medium p-2 rounded-lg bg-accent/50">
                <TrendingUp className="h-5 w-5 mr-3" /> Dashboard
            </div>
            <div className="flex items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors p-2 rounded-lg">
                <Users className="h-5 w-5 mr-3" /> Utilizadores
            </div>
            <div className="flex items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors p-2 rounded-lg">
                <DollarSign className="h-5 w-5 mr-3" /> Faturas
            </div>
        </div>
      </div>
      <Button variant="destructive" onClick={onLogout} className="w-full">
        Sair
      </Button>
    </nav>
  );
};


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
  { title: "Receita Total", value: "R$ 45.231", change: "+20.1%", icon: DollarSign },
  { title: "Usuários Ativos", value: "2.350", change: "+15.3%", icon: Users },
  { title: "Vendas", value: "1.453", change: "+8.2%", icon: ShoppingCart },
  { title: "Taxa de Conversão", value: "3.2%", change: "+2.5%", icon: TrendingUp },
];

// --- Componente Principal ---

export default function Dashboard() {
  const navigate = useNavigate();
  // Estado para gerenciar o processo de upload e feedback
  const [isUploading, setIsUploading] = useState(false);
  const [importFeedback, setImportFeedback] = useState({ message: '', type: null }); // type: 'success' | 'error'

  const handleLogout = () => {
    // Apenas simula a navegação
    navigate("/auth"); 
  };

  // Função simples para simular o parsing de CSV (idealmente usaria Papaparse)
  const parseCSV = useCallback((csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    // Tenta detectar o delimitador (virgula ou ponto e vírgula)
    const delimiter = lines[0].includes(';') ? ';' : ','; 
    const headers = lines[0].split(delimiter).map(header => header.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter);
      const row = {};
      headers.forEach((header, index) => {
        // Conversão simples para número se for aplicável
        const value = values[index] ? values[index].trim() : null;
        row[header] = isNaN(Number(value)) || value === '' ? value : Number(value);
      });
      data.push(row);
    }
    return data;
  }, []);

  // Simulação do envio de dados para o servidor/API
  const sendDataToServer = useCallback(async (data) => {
    setIsUploading(true);
    setImportFeedback({ message: '', type: null });

    // Simulação de uma chamada de API com sucesso ou falha
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      // Aqui, você faria um fetch(POST) para o seu endpoint de importação
      // const response = await fetch('/api/import-data', { ... });
      
      // Simulação: 80% de chance de sucesso
      if (Math.random() < 0.8) {
        console.log("Dados a serem enviados (mock):", data);
        setImportFeedback({ message: `Sucesso: ${data.length} registos importados.`, type: 'success' });
      } else {
        throw new Error("Erro de processamento no servidor (Simulado).");
      }
    } catch (error) {
      setImportFeedback({ message: error.message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Processa o conteúdo lido pelo FileReader
  const processFileContent = useCallback((content, mimeType) => {
    let parsedData = [];

    try {
      if (mimeType.includes("json")) {
        parsedData = JSON.parse(content);
      } else if (mimeType.includes("csv")) {
        parsedData = parseCSV(content);
      }
      
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        setImportFeedback({ message: "O ficheiro está vazio ou o formato é inválido.", type: 'error' });
        return;
      }

      sendDataToServer(parsedData);

    } catch (error) {
      console.error("Erro ao fazer parsing do ficheiro:", error);
      setImportFeedback({ message: `Erro ao analisar o ficheiro: ${error.message}`, type: 'error' });
    }
  }, [parseCSV, sendDataToServer]);

  // Handler principal que é disparado quando um ficheiro é selecionado
  const handleFileChange = useCallback((event) => {
    setImportFeedback({ message: '', type: null }); // Limpa o feedback anterior
    const file = event.target.files?.[0]; 

    if (!file) return;

    // Validação de tipo de ficheiro
    if (!file.type.includes("csv") && !file.type.includes("json")) {
        setImportFeedback({ message: "Tipo de ficheiro não suportado. Use CSV ou JSON.", type: 'error' });
        event.target.value = null; // Limpa o input
        return;
    }
    
    // 1. Cria o leitor
    const reader = new FileReader();

    // 2. Define o que fazer quando a leitura terminar
    reader.onload = (e) => {
      const content = e.target.result;
      processFileContent(content, file.type);
      event.target.value = null; // Limpa o input após a leitura
    };

    // 3. Define o que fazer em caso de erro
    reader.onerror = () => {
      setImportFeedback({ message: "Erro ao carregar o ficheiro.", type: 'error' });
      event.target.value = null;
    };

    // 4. Inicia a leitura do ficheiro como texto
    reader.readAsText(file);
  }, [processFileContent]);

  // Função dummy, não é mais usada diretamente no clique, mas sim para o <label>
  const handleImportClick = () => {
    // Apenas garante que o feedback anterior é limpo ao tentar abrir
    setImportFeedback({ message: '', type: null });
  }

  // Define o estilo de feedback baseado no estado
  const feedbackClass = importFeedback.type === 'success' 
    ? "bg-green-100 text-green-700 border-green-300" 
    : "bg-red-100 text-red-700 border-red-300";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 md:ml-64 p-6 md:p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 animate-slide-up flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Scizon AI Dashboard</h1>
              <p className="text-muted-foreground">Visão geral dos seus indicadores</p>
            </div>
            
            {/* Componente de Importação de Ficheiro */}
            <div className="flex flex-col items-end">
                {/* 1. Input escondido */}
                <input
                    id="file-upload"
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                />
                
                {/* 2. Label que atua como o botão */}
                <label htmlFor="file-upload" onClick={handleImportClick}>
                    <Button 
                        className="ml-4 transition-colors"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        {isUploading ? "A Importar..." : "Importar Ficheiro"}
                    </Button>
                </label>
            </div>
          </div>

          {/* Feedback de Importação (Mensagem de sucesso/erro) */}
          {importFeedback.message && (
            <div 
                className={`flex items-center p-3 mb-6 rounded-lg border shadow-md transition-all duration-300 animate-fade-in ${feedbackClass}`}
                role="alert"
            >
                {importFeedback.type === 'success' ? (
                    <svg className="h-5 w-5 mr-2 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                ) : (
                    <XCircle className="h-5 w-5 mr-2 text-red-700" />
                )}
                <span className="font-medium">{importFeedback.message}</span>
                <button 
                    onClick={() => setImportFeedback({ message: '', type: null })}
                    className="ml-auto p-1 rounded-full hover:bg-opacity-50 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          )}

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