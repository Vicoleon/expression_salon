import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link, Redirect } from "wouter";
import { ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminOrdenes() {
  const { user, loading: authLoading } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: orders, isLoading, refetch } = trpc.admin.orders.list.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: orderDetails } = trpc.admin.orders.getById.useQuery(
    { id: selectedOrderId! },
    { enabled: selectedOrderId !== null }
  );

  const updateStatusMutation = trpc.admin.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Estado actualizado exitosamente");
      refetch();
    },
    onError: (error) => {
      toast.error("Error al actualizar estado", { description: error.message });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "Pendiente" },
      paid: { variant: "default", label: "Pagada" },
      processing: { variant: "default", label: "Procesando" },
      shipped: { variant: "default", label: "Enviada" },
      completed: { variant: "default", label: "Completada" },
      cancelled: { variant: "destructive", label: "Cancelada" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-7xl">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Panel
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Gestión de Órdenes</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Órdenes ({orders?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.customerEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₡{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "d MMM yyyy", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="paid">Pagada</SelectItem>
                              <SelectItem value="processing">Procesando</SelectItem>
                              <SelectItem value="shipped">Enviada</SelectItem>
                              <SelectItem value="completed">Completada</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No hay órdenes registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog
          open={selectedOrderId !== null}
          onOpenChange={(open) => !open && setSelectedOrderId(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalles de la Orden</DialogTitle>
              <DialogDescription>
                {orderDetails?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            {orderDetails && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Información del Cliente</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Nombre:</strong> {orderDetails.customerName}</p>
                      <p><strong>Email:</strong> {orderDetails.customerEmail}</p>
                      {orderDetails.customerPhone && (
                        <p><strong>Teléfono:</strong> {orderDetails.customerPhone}</p>
                      )}
                      {orderDetails.customerAddress && (
                        <p><strong>Dirección:</strong> {orderDetails.customerAddress}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Información de la Orden</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Estado:</strong> {getStatusBadge(orderDetails.status)}</p>
                      <p><strong>Método de Pago:</strong> {orderDetails.paymentMethod}</p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {format(new Date(orderDetails.createdAt), "d 'de' MMMM, yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {orderDetails.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notas</h3>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.notes}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Productos</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetails.items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₡{item.price.toLocaleString()}</TableCell>
                          <TableCell>
                            ₡{(item.price * item.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          ₡{orderDetails.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
