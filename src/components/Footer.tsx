import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom"; 

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">UVA</h3>
            <p className="text-sm text-primary-foreground/80">
              Wear the Future
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">T-Shirts</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Hoodies</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Jeans</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Jackets</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent transition-colors">AI Try-On</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Custom Design</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Coins & Rewards</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Size Guide</a></li>
            <li>
  <Link
    to="/careers"
    className="hover:text-accent transition-colors"
  >
    Careers
  </Link>
</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2025 UVA. All rights reserved. Built with precision and passion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
