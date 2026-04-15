import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const contactInfo = {
  phone: '+880 1601210121',
  email: 'hello@momogo.com',
  location: 'Dhaka, Bangladesh',
  hours: '10AM - 10PM Daily',
};

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast({
      title: 'Message received',
      description: 'Thanks for contacting MoMoGo. Our team usually replies within 30 minutes during business hours.',
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or special requests? We'd love to hear from you!
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-medium text-foreground">
            <Headphones className="w-4 h-4 text-primary" />
            Response time: usually within 30 minutes during service hours
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
            <a href="tel:+8801601210121" className="text-muted-foreground hover:text-primary transition-colors">
              {contactInfo.phone}
            </a>
          </div>

          {/* Email */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Email</h3>
            <a href="mailto:hello@momogo.com" className="text-muted-foreground hover:text-primary transition-colors">
              {contactInfo.email}
            </a>
          </div>

          {/* Location */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Location</h3>
            <a
              href="https://maps.google.com/?q=Dhaka,Bangladesh"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {contactInfo.location}
            </a>
          </div>

          {/* Hours */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Hours</h3>
            <p className="text-muted-foreground">{contactInfo.hours}</p>
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-card">
            <h3 className="text-xl font-bold text-foreground">Send a quick message</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Need help with an order, event catering, or special request? Send your details and our team will contact you.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="Phone number"
                  required
                />
              </div>

              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Email address"
                required
              />

              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message"
                className="min-h-[120px]"
                required
              />

              <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          <div className="bg-card p-2 rounded-2xl shadow-card overflow-hidden">
            <iframe
              title="MoMoGo location map"
              src="https://maps.google.com/maps?q=Dhaka,Bangladesh&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[360px] rounded-xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Follow us on social media</p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://facebook.com/momogo" 
              target="_blank"
              rel="noreferrer"
              aria-label="MoMoGo on Facebook"
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/momogo" 
              target="_blank"
              rel="noreferrer"
              aria-label="MoMoGo on Instagram"
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/8801601210121" 
              target="_blank"
              rel="noreferrer"
              aria-label="MoMoGo on WhatsApp"
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
