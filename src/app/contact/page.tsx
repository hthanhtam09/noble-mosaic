import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Noble Mosaic. Have questions about our mosaic color by number books? We\'d love to hear from you. Email us or use the contact form.',
  alternates: {
    canonical: 'https://noblemosaic.com/contact',
  },
  openGraph: {
    title: 'Contact Us | Noble Mosaic',
    description:
      'Have questions about our mosaic color by number books? Get in touch with the Noble Mosaic team.',
    url: 'https://noblemosaic.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
