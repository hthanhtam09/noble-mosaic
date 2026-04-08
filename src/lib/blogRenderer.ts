/**
 * Shared blog content renderer.
 * Converts markdown-like syntax + embedded <img> tags to styled HTML.
 * Used by both the public BlogPostClient and the admin Preview tab.
 */
export function renderBlogContent(raw: string): string {
  return raw
    // Step headings
    .replace(/🧩 Step (\d+): (.*)/g, '<div class="mt-12 mb-6"><span class="inline-block bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-3 shadow-sm border border-orange-200">Step $1</span><h2 class="text-3xl font-serif font-bold text-neutral-900 mt-0">$2</h2></div>')
    .replace(/🎨 Step (\d+): (.*)/g, '<div class="mt-12 mb-6"><span class="inline-block bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-3 shadow-sm border border-rose-200">Step $1</span><h2 class="text-3xl font-serif font-bold text-neutral-900 mt-0">$2</h2></div>')
    .replace(/✨ Step (\d+): (.*)/g, '<div class="mt-12 mb-6"><span class="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-3 shadow-sm border border-purple-200">Step $1</span><h2 class="text-3xl font-serif font-bold text-neutral-900 mt-0">$2</h2></div>')
    // Headings
    .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-serif font-bold text-neutral-900 mt-10 mb-5">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-serif font-semibold text-neutral-900 mt-8 mb-4">$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-neutral-900">$1</strong>')
    // Lists (bold-dash format first)
    .replace(/^- \*\*(.*?)\*\* - (.*)$/gm, '<li class="mb-3 pl-2"><strong class="text-neutral-900">$1</strong> <span class="text-neutral-500 mx-2">-</span> $2</li>')
    .replace(/^- (.+)$/gm, '<li class="mb-3 pl-5 relative"><span class="absolute left-0 top-0 text-orange-400 font-bold">•</span>$1</li>')
    // Callout blocks
    .replace(/^👉 (.+)$/gm, '<div class="pl-6 py-4 my-6 bg-stone-50 border-l-4 border-orange-400 text-lg rounded-r-xl italic shadow-sm">$1</div>')
    .replace(/^💡 (.+)$/gm, '<div class="p-6 my-8 bg-blue-50/50 rounded-2xl border border-blue-100"><div class="flex items-start gap-4"><span class="text-2xl">💡</span><div><span class="block font-semibold text-blue-900 mb-2">Hint</span><p class="text-blue-800/80 m-0">$1</p></div></div></div>')
    .replace(/^🧠 (.+)$/gm, '<div class="p-6 my-8 bg-purple-50/50 rounded-2xl border border-purple-100"><div class="flex items-start gap-4"><span class="text-2xl">🧠</span><div><span class="block font-semibold text-purple-900 mb-2">Pro Tip</span><p class="text-purple-800/80 m-0">$1</p></div></div></div>')
    // Images — strip old inline classes, ensure fill, wrap in a clean border container
    .replace(/<img(\s[^>]*?)?\s*\/?>/gi, (_, attrs = '') => {
      // Remove any existing class attribute from the img
      const cleanAttrs = (attrs as string).replace(/\s*class="[^"]*"/gi, '').trim();
      return `<figure class="my-6 rounded-xl overflow-hidden border border-neutral-200"><img${cleanAttrs ? ' ' + cleanAttrs : ''} class="w-full h-auto block" /></figure>`;
    })
    // Double newlines → breaks (do before paragraph wrapping)
    .replace(/\n\n/g, '<br/><br/>')
    // Wrap plain text lines (not already HTML tags) in <p>
    .replace(/^(?!<div|<h|<li|<br|<strong|<span)(.+)$/gm, '<p class="text-lg leading-relaxed text-neutral-700/90 mb-6">$1</p>');
}
