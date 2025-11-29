import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Scissors, Palette, Heart } from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: Scissors,
      title: "Corte y Peinado",
      description:
        "Estilos personalizados que realzan tu belleza natural con técnicas profesionales.",
    },
    {
      icon: Palette,
      title: "Coloración",
      description:
        "Tintes de alta calidad y técnicas modernas para el color perfecto.",
    },
    {
      icon: Sparkles,
      title: "Tratamientos Capilares",
      description:
        "Restaura y nutre tu cabello con nuestros tratamientos especializados.",
    },
    {
      icon: Heart,
      title: "Manicure & Pedicure",
      description:
        "Cuidado completo para tus manos y pies con diseños únicos.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-secondary/20 to-background py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              Expression Salon
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Donde tu belleza se expresa
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Descubre un espacio dedicado a realzar tu belleza natural.
              Ofrecemos servicios profesionales de peluquería, coloración,
              tratamientos capilares y cuidado de uñas en Sabanilla de Alajuela.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/productos">
                <Button size="lg" className="w-full sm:w-auto">
                  Ver Productos
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Contáctanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios profesionales para cuidar
              de tu imagen y bienestar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="border-border hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/servicios">
              <Button variant="outline" size="lg">
                Ver Todos los Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para tu transformación?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Agenda tu cita hoy y descubre la experiencia Expression Salon.
            Nuestro equipo de profesionales está listo para atenderte.
          </p>
          <Link href="/contacto">
            <Button
              size="lg"
              variant="secondary"
              className="bg-card text-card-foreground hover:bg-card/90"
            >
              Agendar Cita
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra selección de productos profesionales para el
              cuidado del cabello y las uñas.
            </p>
          </div>

          <div className="text-center">
            <Link href="/productos">
              <Button size="lg">Explorar Productos</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
