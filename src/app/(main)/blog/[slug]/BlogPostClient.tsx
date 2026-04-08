'use client';

import { useBlogPost } from '@/hooks/api/useBlog';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { Clock, Loader2 } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { renderBlogContent } from '@/lib/blogRenderer';

interface TocItem {
  id: string;
  label: string;
  level: 'h2' | 'h3';
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Extract TOC items from raw markdown/content string */
function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();

  const patterns = [
    { re: /🧩 Step \d+: (.+)/g, level: 'h2' as const },
    { re: /🎨 Step \d+: (.+)/g, level: 'h2' as const },
    { re: /✨ Step \d+: (.+)/g, level: 'h2' as const },
    { re: /## (.+)/g, level: 'h2' as const },
    { re: /### (.+)/g, level: 'h3' as const },
  ];

  // Process line by line to preserve order
  const lines = content.split('\n');
  for (const line of lines) {
    for (const { re, level } of patterns) {
      re.lastIndex = 0;
      const m = re.exec(line);
      if (m) {
        const label = m[1].trim();
        let id = slugify(label);
        const count = seen.get(id) ?? 0;
        seen.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;
        items.push({ id, label, level });
        break;
      }
    }
  }
  return items;
}

/** Inject id anchors into the rendered HTML string */
function injectAnchors(html: string, toc: TocItem[]): string {
  let result = html;
  const used = new Map<string, number>();
  for (const item of toc) {
    const baseId = slugify(item.label);
    const count = used.get(baseId) ?? 0;
    used.set(baseId, count + 1);
    const id = count > 0 ? `${baseId}-${count}` : baseId;
    // Replace the first unanchored h2/h3 containing this label text
    result = result.replace(
      new RegExp(`(<h[23][^>]*>)(${escapeRegex(item.label)})(<\/h[23]>)`, ''),
      `$1<span id="${id}" class="scroll-target">$2</span>$3`
    );
  }
  return result;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Sticky Table of Contents Sidebar */
function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <ol className="relative border-l border-neutral-200 space-y-0.5 ml-2">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li key={item.id} className="relative pl-5">
            {/* timeline dot */}
            <span
              className={`absolute -left-1.5 top-3 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${isActive
                ? 'border-orange-500 bg-orange-500 scale-110 shadow-[0_0_0_3px_rgba(249,115,22,0.2)]'
                : 'border-neutral-300 bg-white'
              }`}
            />
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`block py-1.5 px-2 rounded-md text-sm leading-snug transition-all duration-200 ${
                item.level === 'h3' ? 'pl-4 text-xs' : ''
              } ${isActive
                ? 'bg-orange-50 text-orange-700 font-semibold'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}


interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
}

export default function BlogPostClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError: notFound } = useBlogPost(slug);
  const post = data?.post || null;
  const relatedPosts = data?.relatedPosts || [];

  // Estimate read time from content
  const readTime = post ? `${Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))} min read` : '';

  // Build TOC from raw content (available after post loads)
  const toc = useMemo(() => (post ? extractToc(post.content || '') : []), [post]);

  // Build rendered HTML with anchor IDs injected into headings
  const renderedHtml = useMemo(() => {
    if (!post) return '';
    const raw = renderBlogContent(post.content || '');
    return injectAnchors(raw, toc);
  }, [post, toc]);


  if (isLoading) {
    return (
      <>
        <div className="flex-grow flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
        </div>
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-4">Post Not Found</h1>
          <p className="text-neutral-500 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild variant="outline">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Structured Data */}
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt || ''}
        image={post.thumbnail || 'https://noblemosaic.com/images/default-blog.jpg'}
        url={`https://noblemosaic.com/blog/${post.slug}`}
        datePublished={post.createdAt}
        dateModified={post.createdAt}
        category={post.category}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://noblemosaic.com' },
          { name: 'Blog', url: 'https://noblemosaic.com/blog' },
          { name: post.title, url: `https://noblemosaic.com/blog/${post.slug}` },
        ]}
      />

      <div className="grow bg-white">

        {/* ── HEADER (text only) ──────────────────────────────────────── */}
        <div className="px-4 sm:px-6 lg:px-8 pt-10 pb-8 max-w-7xl mx-auto">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400 mb-5">
            <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-neutral-700 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-neutral-600 line-clamp-1">{post.title}</span>
          </nav>

          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 mb-4 text-xs tracking-wider uppercase">
            {post.category}
          </Badge>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readTime}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-b border-neutral-200" />

        {/* ── BODY: TOC sidebar + article ──────────────────── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">

          {/* Two-column layout */}
          <div className="flex gap-12 items-start">

            {/* ── STICKY TOC SIDEBAR ────────────────────────────────── */}
            <aside className="hidden xl:block w-64 shrink-0 self-start sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                On this page
              </p>
              <nav aria-label="Table of contents">
                <TableOfContents items={toc} />
              </nav>
            </aside>

            {/* ── MAIN ARTICLE COLUMN ───────────────────────────────── */}
            <div className="min-w-0 flex-1 overflow-x-hidden">
              {/* Excerpt / lead paragraph */}
              {post.excerpt && (
                <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-8 md:mb-10 border-l-4 border-orange-200 pl-4">
                  {post.excerpt}
                </p>
              )}
              <article className="prose prose-lg prose-neutral prose-headings:font-serif max-w-none text-neutral-700">
                <div
                  className="story-content space-y-6"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              </article>
            </div>{/* end article column */}
          </div>{/* end two-col */}

        </div>{/* end body container */}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-stone-50 mt-10 border-t border-neutral-100">
            <div className="layout-inner py-12">
              <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] bg-neutral-100">
                      {relatedPost.thumbnail ? (
                        <Image
                          src={relatedPost.thumbnail}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100 flex items-center justify-center">
                          <span className="text-3xl">🎨</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Badge variant="secondary" className="bg-stone-100 text-neutral-600 mb-2 text-xs">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-serif text-base font-bold text-neutral-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
