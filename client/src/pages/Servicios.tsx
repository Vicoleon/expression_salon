import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Droplet, Sparkles, Hand, Eye, Smile } from "lucide-react";

export default function Servicios() {
  const servicios = [
    {
      icon: Scissors,
      title: "Corte de Cabello",
      description: "Cortes personalizados para dama y caballero con técnicas modernas.",
      price: "Desde ₡8,000",
    },
    {
      icon: Droplet,
      title: "Coloración",
      description: "Tintes, mechas, balayage y técnicas de coloración avanzadas.",
      price: "Desde ₡15,000",
    },
    {
      icon: Sparkles,
      title: "Tratamientos Capilares",
      description: "Keratina, botox capilar, hidratación profunda y más.",
      price: "Desde ₡12,000",
    },
    {
      icon: Hand,
      title: "Manicure",
      description: "Manicure clásico, gel, acrílico y diseños personalizados.",
      price: "Desde ₡6,000",
    },
    {
      icon: Hand,
      title: "Pedicure",
      description: "Pedicure spa con exfoliación, masaje y esmaltado.",
      price: "Desde ₡8,000",
    },
    {
      icon: Eye,
      title: "Cejas y Pestañas",
      description: "Diseño de cejas, tinte y laminado de pestañas.",
      price: "Desde ₡5,000",
    },
    {
      icon: Smile,
      title: "Maquillaje",
      description: "Maquillaje profesional para eventos especiales.",
      price: "Desde ₡15,000",
    },
    {
      icon: Scissors,
      title: "Peinados",
      description: "Peinados para bodas, graduaciones y eventos.",
      price: "Desde ₡12,000",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una amplia variedad de servicios profesionales de belleza
            con productos de alta calidad y técnicas especializadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio, index) => {
            const Icon = servicio.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{servicio.title}</CardTitle>
                  <CardDescription>{servicio.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-primary">
                    {servicio.price}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center bg-card p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4">¿Listo para tu cita?</h2>
          <p className="text-muted-foreground mb-6">
            Contáctanos para agendar tu cita y descubre la experiencia Expression Salon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+50612345678" className="text-primary font-medium">
              📞 +506 1234-5678
            </a>
            <a href="mailto:info@expressionsalon.com" className="text-primary font-medium">
              ✉️ info@expressionsalon.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
