import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BadgeCheck, Clock, Heart, ShieldCheck, Sparkles, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Heart, label: 'Handmade Daily', value: '100%' },
  { icon: Award, label: 'Years Experience', value: '5+' },
  { icon: Clock, label: 'Avg Delivery', value: '30 min' },
  { icon: Users, label: 'Happy Customers', value: '2000+' },
];

const trustPillars = [
  {
    icon: ShieldCheck,
    title: 'Food Safety First',
    description: 'Daily hygiene checks, sealed packaging, and monitored prep standards in every shift.',
  },
  {
    icon: Sparkles,
    title: 'Consistency in Every Order',
    description: 'Chef-led recipes and measured preparation deliver the same taste and quality every day.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery Network',
    description: 'Optimized dispatch and route planning keep your order fresh and on time.',
  },
];

const milestones = [
  { year: '2019', title: 'Founded in Dhaka', detail: 'Started from a home kitchen with family momo recipes.' },
  { year: '2021', title: '1,000+ Deliveries', detail: 'Expanded from neighborhood orders to broader city service.' },
  { year: '2024', title: 'Trusted Daily Brand', detail: 'Serving households and teams with consistent quality and speed.' },
];

const standards = ['Fresh ingredients sourced daily', 'Sealed and secure food packaging', 'Responsive support for every order'];

const AboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Made with Love, <br />
              <span className="text-primary">Served with Care</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                MoMoGo started from a simple passion – bringing authentic, homemade momos to 
                everyone's doorstep. Founded by Sanjida Rahman Shatabdi, our journey began in 
                a home kitchen with traditional family recipes passed down through generations.
              </p>
              <p>
                Every momo we make is handcrafted with love, using fresh ingredients and 
                time-honored techniques. We believe great food brings people together, and 
                that's exactly what we aim to do – one momo at a time.
              </p>
              <p>
                From our kitchen to your table, experience the authentic taste of homemade 
                momos without leaving your home. Order now and taste the difference!
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm uppercase tracking-[0.15em] text-primary font-semibold">Our Mission</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Deliver authentic momo experiences with reliable service, transparent quality, and customer-first care.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm uppercase tracking-[0.15em] text-primary font-semibold">Our Vision</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Become Bangladesh&apos;s most trusted momo delivery brand for homes, offices, and events.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-5">
          {trustPillars.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Growth Journey</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">Milestones that shaped MoMoGo</h3>

            <div className="mt-6 space-y-5">
              {milestones.map((item) => (
                <div key={item.year} className="flex gap-4">
                  <div className="min-w-16 text-sm font-bold text-primary">{item.year}</div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 md:p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Founder Note</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">Built with care, run with standards</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We started MoMoGo to make authentic, handcrafted momos accessible without compromising on quality or trust.
              Every order reflects the same care we would serve at our own family table.
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">Sanjida Rahman Shatabdi</p>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Founder, MoMoGo</p>

            <ul className="mt-5 space-y-2">
              {standards.map((item) => (
                <li key={item} className="text-sm text-foreground flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Experience MoMoGo</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">Ready to taste handcrafted momos today?</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate('/menu')}>
              Order Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
