import React from 'react';
import { Clock3, Heart, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const accountLinks = [
  { label: 'Sign In', path: '/auth' },
  { label: 'My Orders', path: '/my-orders' },
  { label: 'Profile', path: '/profile' },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden bg-foreground text-primary-foreground pt-14 pb-6">
      <div className="absolute inset-0 -z-0">
        <div className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative z-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-warm group-hover:scale-105 transition-transform">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">
                Momo<span className="text-primary">Go</span>
              </span>
            </button>

            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75 max-w-xs">
              Fast, reliable momo delivery with consistent quality, transparent service, and a customer-first experience.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-foreground/90">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Hygiene-first preparation & sealed packaging
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-sm text-primary-foreground/75 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Account</h3>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-sm text-primary-foreground/75 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1601210121</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@momogo.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                <span>10AM - 10PM Daily</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 mt-10 pt-5 border-t border-primary-foreground/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-primary-foreground/55">
          <p>© {new Date().getFullYear()} MoMoGo. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
