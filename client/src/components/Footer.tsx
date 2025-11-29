import { Link } from "wouter";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <img
              src="/logo.png"
              alt="Expression Salon"
              className="h-20 w-20 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold mb-3">Expression Salon</h3>
            <p className="text-sm text-muted-foreground">
              Tu salón de belleza en Sabanilla de Alajuela. Especialistas en
              cuidado capilar, manicure, pedicure y más.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    Servicios
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/productos">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    Productos
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    Blog
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contacto">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    Contacto
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Sabanilla de Alajuela, Costa Rica
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+50612345678"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +506 1234-5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@expressionsalon.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  info@expressionsalon.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Expression Salon. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
