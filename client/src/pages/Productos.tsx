import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export default function Productos() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Nuestros Productos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Productos profesionales de alta calidad para el cuidado de tu
              cabello y uñas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Nuestros Productos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Productos profesionales de alta calidad para el cuidado de tu
              cabello y uñas.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Próximamente tendremos productos disponibles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Nuestros Productos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Productos profesionales de alta calidad para el cuidado de tu
            cabello y uñas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <CardTitle className="mb-2">{product.name}</CardTitle>
                {product.description && (
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                )}
                {product.category && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {product.category}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl font-bold text-primary">
                    ₡{product.price.toLocaleString()}
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-xs text-green-600">
                      En stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-xs text-destructive">
                      Agotado
                    </span>
                  )}
                </div>
                <Link href={`/productos/${product.id}`}>
                  <Button className="w-full" variant="outline">
                    Ver Detalles
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
