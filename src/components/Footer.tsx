import { Instagram, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">UVA</h3>
            <p className="text-sm text-primary-foreground/80">Wear the Future</p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/fashionofuva"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a  href="https://www.linkedin.com/company/uvafashion/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a  href="mailto:uvafashiontrends@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link to="/products" className="hover:text-accent transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?category=T-Shirts" className="hover:text-accent transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=Hoodies" className="hover:text-accent transition-colors">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link to="/products?category=Jeans" className="hover:text-accent transition-colors">
                  Jeans
                </Link>
              </li>
              <li>
                <Link to="/products?category=Jackets" className="hover:text-accent transition-colors">
                  Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link to="/privacy-policy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-accent transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-accent transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-accent transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2025 UVA. All rights reserved. Built with precision and passion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
