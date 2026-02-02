import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, Redirect } from "wouter";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminServices() {
    const { user, loading: authLoading } = useAuth();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
        imageUrl: "",
    });

    const { data: services, isLoading, refetch } = trpc.admin.services.list.useQuery(undefined, {
        enabled: user?.role === "admin",
    });

    const createMutation = trpc.admin.services.create.useMutation({
        onSuccess: () => {
            toast.success("Servicio creado exitosamente");
            setIsCreateOpen(false);
            resetForm();
            refetch();
        },
        onError: (error) => {
            toast.error("Error al crear servicio", { description: error.message });
        },
    });

    const updateMutation = trpc.admin.services.update.useMutation({
        onSuccess: () => {
            toast.success("Servicio actualizado exitosamente");
            setEditingService(null);
            resetForm();
            refetch();
        },
        onError: (error) => {
            toast.error("Error al actualizar servicio", { description: error.message });
        },
    });

    const deleteMutation = trpc.admin.services.delete.useMutation({
        onSuccess: () => {
            toast.success("Servicio eliminado exitosamente");
            refetch();
        },
        onError: (error) => {
            toast.error("Error al eliminar servicio", { description: error.message });
        },
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            duration: "",
            category: "",
            imageUrl: "",
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            description: formData.description || undefined,
            price: parseInt(formData.price),
            duration: parseInt(formData.duration),
            category: formData.category || undefined,
            imageUrl: formData.imageUrl || undefined,
        };

        if (editingService) {
            updateMutation.mutate({ id: editingService.id, ...data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (service: any) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description || "",
            price: service.price.toString(),
            duration: service.duration.toString(),
            category: service.category || "",
            imageUrl: service.imageUrl || "",
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este servicio?")) {
            deleteMutation.mutate({ id });
        }
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin">
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al Panel
                            </Button>
                        </Link>
                        <h1 className="text-4xl font-bold">Gestión de Servicios</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Servicios ({services?.length || 0})</CardTitle>
                        <Dialog open={isCreateOpen || !!editingService} onOpenChange={(open) => {
                            if (!open) {
                                setIsCreateOpen(false);
                                setEditingService(null);
                                resetForm();
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setIsCreateOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Servicio
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingService ? "Editar Servicio" : "Nuevo Servicio"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingService
                                            ? "Actualiza la información del servicio"
                                            : "Completa los datos del nuevo servicio"}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Nombre *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">Descripción</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="price">Precio (₡) *</Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="duration">Duración (min) *</Label>
                                                <Input
                                                    id="duration"
                                                    type="number"
                                                    value={formData.duration}
                                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="category">Categoría</Label>
                                            <Input
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="imageUrl">URL de Imagen</Label>
                                            <Input
                                                id="imageUrl"
                                                type="url"
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-6">
                                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                            {editingService ? "Actualizar" : "Crear"} Servicio
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Duración</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services && services.length > 0 ? (
                                    services.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell className="font-medium">{service.name}</TableCell>
                                            <TableCell>{service.category || "-"}</TableCell>
                                            <TableCell>₡{service.price.toLocaleString()}</TableCell>
                                            <TableCell>{service.duration} min</TableCell>
                                            <TableCell>
                                                {service.isActive === 1 ? (
                                                    <span className="text-green-600">Activo</span>
                                                ) : (
                                                    <span className="text-destructive">Inactivo</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(service)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(service.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No hay servicios registrados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
