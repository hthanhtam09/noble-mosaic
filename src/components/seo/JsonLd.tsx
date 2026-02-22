// JSON-LD Structured Data Components for SEO
// See: https://developers.google.com/search/docs/advanced/structured-data

const BASE_URL = 'https://noblemosaic.com';

// Organization Schema - for the brand
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Noble Mosaic',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      'Premium mosaic color by number books designed for mindful relaxation and creative expression.',
    sameAs: [
      'https://www.facebook.com/noblemosaic',
      'https://www.instagram.com/noblemosaic',
      'https://twitter.com/noblemosaic',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@noblemosaic.com',
      contactType: 'customer service',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite Schema - for sitelinks search box
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Noble Mosaic',
    url: BASE_URL,
    description:
      'Discover premium mosaic color by number books designed for mindful relaxation and creative expression.',
    publisher: {
      '@type': 'Organization',
      name: 'Noble Mosaic',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product Schema - for individual product pages
interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  url: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
  availability?: boolean;
}

export function ProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  rating,
  reviewCount,
  availability = true,
}: ProductJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Noble Mosaic',
    },
    category: 'Books > Activity Books > Coloring Books',
  };

  if (price) {
    // Extract numeric value from price string (e.g., "$9.99" -> "9.99")
    const numericPrice = price.replace(/[^0-9.]/g, '');
    schema.offers = {
      '@type': 'Offer',
      price: numericPrice,
      priceCurrency: 'USD',
      availability: availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Noble Mosaic',
      },
    };
  }

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema - for blog posts
interface ArticleJsonLdProps {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  category?: string;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  category,
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: 'Noble Mosaic',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Noble Mosaic',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(category && {
      articleSection: category,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList Schema - for breadcrumb navigation
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema - for FAQ sections
interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// CollectionPage Schema - for shop/blog listing pages
interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function CollectionPageJsonLd({
  name,
  description,
  url,
}: CollectionPageJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Noble Mosaic',
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
