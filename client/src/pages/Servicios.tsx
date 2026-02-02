import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Sparkles } from "lucide-react";

export default function Servicios() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando servicios...</p>
      </div>
    );
  }

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
          {services?.map((servicio) => (
            <Card key={servicio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3 overflow-hidden">
                  {servicio.imageUrl ? (
                    <img
                      src={servicio.imageUrl}
                      alt={servicio.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Scissors className="h-6 w-6 text-primary" />
                  )}
                </div>
                <CardTitle>{servicio.name}</CardTitle>
                <CardDescription>{servicio.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-primary">
                    ₡{servicio.price.toLocaleString()}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {servicio.duration} min
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {services?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No hay servicios disponibles en este momento.</p>
            </div>
          )}
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
