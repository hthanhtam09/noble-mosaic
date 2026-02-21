import Image from 'next/image';

interface APlusContentBlockProps {
  block: {
    type: 'fullWidth' | 'twoColumn' | 'featureHighlight' | 'lifestyle';
    title?: string;
    content?: string;
    image?: string;
    images?: string[];
    items?: { title: string; description: string; icon?: string }[];
  };
}

export function FullWidthBlock({ block }: APlusContentBlockProps) {
  return (
    <div className="relative w-full min-h-[400px] md:min-h-[500px] overflow-hidden rounded-xl">
      {block.image && (
        <Image
          src={block.image}
          alt={block.title || ''}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
        <div className="px-8 md:px-16 max-w-2xl">
          {block.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{block.title}</h2>
          )}
          {block.content && (
            <p className="text-lg text-white/90 leading-relaxed">{block.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TwoColumnBlock({ block }: APlusContentBlockProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={block.image ? 'order-2 md:order-1' : ''}>
        {block.title && (
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">{block.title}</h3>
        )}
        {block.content && (
          <p className="text-lg text-neutral-600 leading-relaxed">{block.content}</p>
        )}
      </div>
      {block.image && (
        <div className={`relative aspect-[4/3] rounded-xl overflow-hidden ${block.image ? 'order-1 md:order-2' : ''}`}>
          <Image
            src={block.image}
            alt={block.title || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
    </div>
  );
}

export function FeatureHighlightBlock({ block }: APlusContentBlockProps) {
  return (
    <div className="bg-stone-50 rounded-xl p-8 md:p-12">
      {block.title && (
        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-8">{block.title}</h3>
      )}
      {block.items && block.items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.items.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              {item.icon && (
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
              )}
              <h4 className="font-semibold text-neutral-900 mb-2">{item.title}</h4>
              <p className="text-sm text-neutral-600">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LifestyleBlock({ block }: APlusContentBlockProps) {
  return (
    <div className="relative min-h-[300px] md:min-h-[400px] rounded-xl overflow-hidden">
      {block.image && (
        <Image
          src={block.image}
          alt={block.title || ''}
          fill
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
        <div className="p-8 md:p-12">
          {block.title && (
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{block.title}</h3>
          )}
          {block.content && (
            <p className="text-white/90 max-w-xl">{block.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}



export default function APlusContent({ block }: APlusContentBlockProps) {
  switch (block.type) {
    case 'fullWidth':
      return <FullWidthBlock block={block} />;
    case 'twoColumn':
      return <TwoColumnBlock block={block} />;
    case 'featureHighlight':
      return <FeatureHighlightBlock block={block} />;
    case 'lifestyle':
      return <LifestyleBlock block={block} />;
    default:
      return null;
  }
}
