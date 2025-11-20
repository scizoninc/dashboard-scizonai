import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    navigate("/auth");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 md:ml-64 p-6 md:p-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1 border-border animate-slide-up">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      JS
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>João Silva</CardTitle>
                <CardDescription>joao.silva@email.com</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Administrador</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>joao.silva@email.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>(11) 98765-4321</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
              </CardContent>
            </Card>

            {/* Edit Form */}
            <Card className="lg:col-span-2 border-border animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados cadastrais</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input id="firstName" defaultValue="João" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input id="lastName" defaultValue="Silva" disabled={isLoading} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="joao.silva@email.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="(11) 98765-4321" disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" defaultValue="São Paulo, SP" disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Sobre</Label>
                    <textarea
                      id="bio"
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      defaultValue="Desenvolvedor e entusiasta de tecnologia."
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button type="button" variant="outline" disabled={isLoading}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
