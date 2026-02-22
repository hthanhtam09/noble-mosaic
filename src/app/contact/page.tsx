'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-stone-50">
        {/* Page Header */}
        <div className="bg-white border-b border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">
              Contact Us
            </h1>
            <p className="mt-2 text-neutral-600">
              Have questions? We&apos;d love to hear from you.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Email Us</h3>
                  <p className="text-neutral-600 text-sm mb-2">
                    For general inquiries and support
                  </p>
                  <a href="mailto:hello@noblemosaic.com" className="text-neutral-900 font-medium hover:underline">
                    hello@noblemosaic.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Response Time</h3>
                  <p className="text-neutral-600 text-sm">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Frequently Asked</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-neutral-900">Where can I buy your books?</p>
                      <p className="text-neutral-600">All our books are available on Amazon.</p>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Do you offer wholesale?</p>
                      <p className="text-neutral-600">Yes, contact us for wholesale inquiries.</p>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Custom designs?</p>
                      <p className="text-neutral-600">We don&apos;t currently offer custom designs.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
                        Thank You!
                      </h2>
                      <p className="text-neutral-600 mb-6">
                        Your message has been sent successfully. We&apos;ll get back to you soon.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">
                        Send a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                              className="border-neutral-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                              className="border-neutral-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            rows={6}
                            className="border-neutral-200 resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
