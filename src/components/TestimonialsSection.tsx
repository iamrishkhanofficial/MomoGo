import React from 'react';
import { Quote, Star } from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface Review {
  _id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  createdAt: string;
}

const defaultTestimonials: Omit<Review, '_id' | 'createdAt'>[] = [
  {
    name: 'Nusrat Jahan',
    role: 'Corporate Team Lead',
    quote:
      'We order from Momogo for weekly team lunches. Delivery is punctual, packaging is clean, and quality is consistently excellent.',
    rating: 5,
  },
  {
    name: 'Rafid Hasan',
    role: 'Product Designer',
    quote:
      'The ordering experience is simple and professional. The food arrives hot, and the flavors feel authentic every single time.',
    rating: 5,
  },
  {
    name: 'Mahi Rahman',
    role: 'Operations Manager',
    quote:
      'What stands out is reliability. Even during peak hours, their delivery and support remain dependable.',
    rating: 5,
  },
  {
    name: 'Shahriar Ahmed',
    role: 'Startup Founder',
    quote:
      'Momogo has become our default catering choice for client meetings. Great presentation and trusted quality.',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
  });

  React.useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest<Review[]>('/api/reviews?limit=10');
        setReviews(response);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'rating') {
      setFormData((previous) => ({ ...previous, rating: Number(value) }));
      return;
    }

    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.quote.trim()) {
      toast({
        title: 'Missing details',
        description: 'Please provide your name and review message before submitting.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await apiRequest<Review>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          role: formData.role.trim() || 'Customer',
          quote: formData.quote.trim(),
          rating: formData.rating,
        }),
      });

      setReviews((previous) => [created, ...previous]);
      setFormData({ name: '', role: '', quote: '', rating: 5 });

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback. Your review is now visible on the homepage.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit your review';
      toast({
        title: 'Submission failed',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedReviews = reviews.length > 0
    ? reviews
    : defaultTestimonials.map((item, index) => ({
        ...item,
        _id: `default-${index}`,
        createdAt: new Date().toISOString(),
      }));

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">Customer Reviews</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">Trusted by food lovers and busy teams</h2>
          <p className="mt-4 text-muted-foreground">
            Real feedback from customers who rely on Momogo for quality, speed, and consistency.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{ align: 'start', loop: true }}
            className="w-full px-12 sm:px-14"
          >
            <CarouselContent>
              {displayedReviews.map((item, index) => (
                <CarouselItem key={item._id} className="md:basis-1/2 lg:basis-1/2">
                  <article
                    className="h-full rounded-2xl border border-border bg-card/90 p-6 shadow-card animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Quote className="h-7 w-7 text-primary/70" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">“{item.quote}”</p>

                    <div className="mt-6 border-t border-border pt-4">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-0 h-10 w-10 border-primary/30 bg-background text-foreground hover:bg-primary/10" />
            <CarouselNext className="right-0 h-10 w-10 border-primary/30 bg-background text-foreground hover:bg-primary/10" />
          </Carousel>

          <div className="mt-6 flex items-center justify-center gap-2">
            {displayedReviews.map((item, index) => (
              <button
                key={item._id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === index ? 'w-8 bg-primary' : 'w-2.5 bg-primary/30 hover:bg-primary/60'
                }`}
              />
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isLoading ? 'Loading latest reviews...' : `${displayedReviews.length} review(s) shown`}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card/90 p-6 md:p-8 shadow-card">
            <h3 className="text-xl font-bold text-foreground">Share Your Review</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Ordered from MoMoGo recently? Tell others about your experience.
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
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Your role (optional)"
                />
              </div>

              <div>
                <label htmlFor="rating" className="text-sm font-medium text-foreground">
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={(event) => setFormData((previous) => ({ ...previous, rating: Number(event.target.value) }))}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>

              <Textarea
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                placeholder="Write your review"
                className="min-h-[120px]"
                required
              />

              <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
