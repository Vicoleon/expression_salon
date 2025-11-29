import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/hooks/use-user";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();
  const [orderComplete, setOrderComplete] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
  });

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setOrderComplete(true);
      clearCart();
      toast.success("Orden creada exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear la orden", { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createOrderMutation.mutate({
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone || undefined,
      customerAddress: formData.customerAddress || undefined,
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      notes: formData.notes || undefined,
    });
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4">Carrito Vacío</h1>
          <p className="text-muted-foreground mb-8">
            No tienes productos en tu carrito para proceder al pago.
          </p>
          <Link href="/productos">
            <Button size="lg">Explorar Productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-3xl">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-6">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl">¡Orden Recibida!</CardTitle>
              <CardDescription className="text-lg">
                Tu orden ha sido registrada exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Número de Orden
                </p>
                <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              </div>

              <div className="text-left space-y-4">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                  <p className="text-lg text-green-900 font-medium">
                    Gracias por confiar en nosotros, su orden esta pendiente de revision.
                  </p>
                  <p className="text-green-800 mt-2">
                    Por favor proceda a realizar la transferencia (SINPE) y envie el comprobante a{" "}
                    <a href="mailto:email@expressionsalon.com" className="font-bold underline">
                      email@expressionsalon.com
                    </a>
                    , recibira un correo con instrucciones una vez que el pago haya sido recibidp
                  </p>
                </div>

                <h3 className="font-semibold text-lg mt-6">Detalles de Pago</h3>
                <div className="bg-card border border-border p-4 rounded-lg space-y-2">
                  <div className="bg-muted p-3 rounded space-y-1 text-sm">
                    <p><strong>Banco:</strong> Banco Nacional de Costa Rica</p>
                    <p><strong>Cuenta:</strong> 100-01-000-123456-7</p>
                    <p><strong>Titular:</strong> Expression Salon</p>
                    <p><strong>Cédula Jurídica:</strong> 3-101-123456</p>
                    <p><strong>Monto:</strong> ₡{total.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Importante:</strong> Incluye el número de orden ({orderNumber})
                    en la descripción de la transferencia.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Link href="/productos" className="w-full">
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="ghost" className="w-full">
                  Volver al Inicio
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }



  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user && !isGuestCheckout) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-4xl">
          <Link href="/carrito">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Carrito
            </Button>
          </Link>

          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">¿Cómo deseas continuar?</CardTitle>
              <CardDescription>
                Elige una opción para finalizar tu compra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login">
                <Button className="w-full" size="lg">
                  Iniciar Sesión / Registrarse
                </Button>
              </Link>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    O
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => setIsGuestCheckout(true)}
              >
                Comprar como Invitado
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl">
        <Link href="/carrito">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Carrito
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>
                  Completa tus datos para procesar la orden
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Nombre Completo *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Teléfono</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                      placeholder="+506 1234-5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerAddress">Dirección</Label>
                    <Textarea
                      id="customerAddress"
                      value={formData.customerAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, customerAddress: e.target.value })
                      }
                      rows={3}
                      placeholder="Dirección completa para entrega"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      placeholder="Instrucciones especiales, preferencias de entrega, etc."
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen de la Orden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₡{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₡{total.toLocaleString()}</span>
                </div>
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Método de Pago:</p>
                  <p className="text-muted-foreground">
                    Transferencia Bancaria
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recibirás las instrucciones de pago después de confirmar la orden.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  form="checkout-form"
                  size="lg"
                  className="w-full"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending
                    ? "Procesando..."
                    : "Confirmar Orden"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
