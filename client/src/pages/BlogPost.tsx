import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4">Artículo no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Blog
          </Button>
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            {post.publishedAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
            )}
          </header>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-lg mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver Más Artículos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
