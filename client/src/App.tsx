import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Servicios from "./pages/Servicios";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import { CartProvider } from "./contexts/CartContext";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminOrdenes from "./pages/admin/AdminOrdenes";
import Checkout from "./pages/Checkout";

import Login from "./pages/Login";
import { useUser } from "./hooks/use-user"; // Assuming this hook exists or we use trpc directly
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path="/servicios" component={Servicios} />
          <Route path="/productos" component={Productos} />
          <Route path="/productos/:id" component={ProductoDetalle} />
          <Route path="/carrito" component={Carrito} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contacto" component={Contacto} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/login" component={Login} />

          {/* Protected Admin Routes */}
          <Route path="/admin">
            {user?.role === "admin" ? <AdminDashboard /> : <Redirect to="/login" />}
          </Route>
          <Route path="/admin/productos">
            {user?.role === "admin" ? <AdminProductos /> : <Redirect to="/login" />}
          </Route>
          <Route path="/admin/blog">
            {user?.role === "admin" ? <AdminBlog /> : <Redirect to="/login" />}
          </Route>
          <Route path="/admin/ordenes">
            {user?.role === "admin" ? <AdminOrdenes /> : <Redirect to="/login" />}
          </Route>

          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
