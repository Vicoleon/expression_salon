import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Redirect } from "wouter";
import { Package, FileText, ShoppingCart, BarChart } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  const adminSections = [
    {
      title: "Productos",
      description: "Gestionar productos, precios e inventario",
      icon: Package,
      href: "/admin/productos",
      color: "text-blue-600",
    },
    {
      title: "Blog",
      description: "Crear y editar artículos del blog",
      icon: FileText,
      href: "/admin/blog",
      color: "text-green-600",
    },
    {
      title: "Órdenes",
      description: "Ver y gestionar órdenes de clientes",
      icon: ShoppingCart,
      href: "/admin/ordenes",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user.name || user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3 ${section.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Administrar
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Estadísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Las estadísticas detalladas estarán disponibles próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
