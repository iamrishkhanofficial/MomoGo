import React from 'react';
import { BadgeCheck, ChefHat, Clock3, ShieldCheck, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalHighlightsProps {
  onBrowseMenu: () => void;
}

const serviceStats = [
  { label: 'Orders Delivered', value: '12,000+', icon: Truck },
  { label: 'Average Delivery Time', value: '28 min', icon: Clock3 },
  { label: 'Customer Satisfaction', value: '4.9/5', icon: Users },
  { label: 'Quality Checks Daily', value: '50+', icon: ShieldCheck },
];

const qualityPillars = [
  {
    title: 'Certified Food Safety',
    description: 'Daily hygiene checks, temperature-controlled prep, and sealed packaging for every order.',
    icon: BadgeCheck,
  },
  {
    title: 'Chef-Crafted Consistency',
    description: 'Standardized recipes with fresh ingredients so every plate tastes exactly as expected.',
    icon: ChefHat,
  },
  {
    title: 'Reliable Delivery Window',
    description: 'Real-time order flow and optimized routing to keep deliveries on-time across the city.',
    icon: Truck,
  },
];

const ProfessionalHighlights: React.FC<ProfessionalHighlightsProps> = ({ onBrowseMenu }) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24 bg-gradient-to-b from-background via-secondary/40 to-background">
      <div className="absolute inset-0 -z-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">Why Professionals Choose Momogo</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">A dependable food experience built for consistency</h2>
          <p className="mt-4 text-muted-foreground">
            From kitchen standards to last-mile delivery, every step is designed to deliver restaurant quality at home and at work.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {serviceStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-card hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </article>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {qualityPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="rounded-2xl border border-border bg-background/95 p-6 shadow-soft animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/25 text-foreground mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/10 p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Ready To Order</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">Browse the menu and place your next delivery in minutes</h3>
          </div>
          <Button variant="default" size="lg" onClick={onBrowseMenu} className="md:min-w-44">
            Browse Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalHighlights;
