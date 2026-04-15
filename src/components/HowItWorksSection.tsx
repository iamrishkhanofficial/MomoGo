import React from 'react';
import { CheckCircle2, CookingPot, PackageCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HowItWorksSectionProps {
  onStartOrder: () => void;
}

const steps = [
  {
    title: 'Choose Your Favorites',
    description: 'Browse the menu, compare options, and select your preferred momo styles in a few taps.',
    icon: Smartphone,
  },
  {
    title: 'Fresh Prep In Kitchen',
    description: 'Our chefs prepare your order fresh using standardized recipes and quality-controlled ingredients.',
    icon: CookingPot,
  },
  {
    title: 'Tracked Delivery To You',
    description: 'Your order is securely packed and dispatched with optimized routing for timely delivery.',
    icon: PackageCheck,
  },
];

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartOrder }) => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">How It Works</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">Professional service in 3 clear steps</h2>
          <p className="mt-4 text-muted-foreground">
            Transparent process, predictable quality, and fast delivery from checkout to your door.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-9 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />

          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-card animate-fade-in-up">
                  <div className="relative z-10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button variant="hero" size="lg" onClick={onStartOrder}>
            Start Your Order
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
