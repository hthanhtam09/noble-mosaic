/**
 * Utility to automatically generate SEO metadata from blog content.
 */

/**
 * Generates a clean excerpt from markdown/HTML content.
 */
export function generateExcerpt(content: string, length: number = 160): string {
  if (!content) return '';
  
  // Strip HTML tags
  let text = content.replace(/<[^>]*>/g, '');
  
  // Strip Markdown patterns
  text = text
    .replace(/[#*`~_]/g, '') // Headers, bold, code, strike, italic
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1') // Links [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^\)]*\)/g, '') // Images ![alt](url) -> empty
    .replace(/>\s+/g, '') // Blockquotes
    .replace(/\+/g, '') // Bullet points
    .replace(/\n+/g, ' ') // New lines to spaces
    .trim();

  if (text.length <= length) return text;
  
  // Cut at last space before the limit
  const trimmed = text.substring(0, length);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
}

/**
 * Extracts SEO keywords from title and content.
 */
export function extractKeywords(title: string, content: string): string[] {
  const combined = `${title} ${content.substring(0, 1000)}`;
  
  // Simple keyword extraction logic
  // 1. Convert to lowercase and get words
  const words = combined.toLowerCase().match(/\b(\w{4,})\b/g) || [];
  
  // 2. Count frequencies
  const freq: Record<string, number> = {};
  words.forEach(word => {
    // Skip very common stop words (minimal set)
    if (['this', 'that', 'with', 'from', 'your', 'guide', 'post', 'blog'].includes(word)) return;
    freq[word] = (freq[word] || 0) + 1;
  });

  // 3. Sort by frequency and take top 10
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
