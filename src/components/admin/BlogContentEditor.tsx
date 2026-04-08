'use client';

import { useRef, useState, useCallback, DragEvent, ClipboardEvent } from 'react';
import { Image as ImageIcon, Eye, Edit3, Upload, Loader2 } from 'lucide-react';

interface BlogContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  renderHtml: (content: string) => string;
}

async function uploadImageFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', 'blog-content');
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.url as string;
}

export default function BlogContentEditor({ value, onChange, renderHtml }: BlogContentEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Insert text at cursor position inside textarea */
  const insertAtCursor = useCallback((before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newValue);
    // Restore cursor after state update
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    });
  }, [value, onChange]);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      insertAtCursor(`\n<img src="${url}" alt="" />\n`);
    } catch {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [insertAtCursor]);

  const handlePaste = useCallback((e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imgItem = items.find(i => i.type.startsWith('image/'));
    if (!imgItem) return;
    e.preventDefault();
    const file = imgItem.getAsFile();
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  }, [handleUpload]);

  return (
    <div className="space-y-0 border border-neutral-200 rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'write'
                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'preview'
                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>

        {/* Image upload button */}
        {tab === 'write' && (
          <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
            uploading
              ? 'text-neutral-400 cursor-not-allowed'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Add image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileInput}
            />
          </label>
        )}
      </div>

      {/* Write tab */}
      {tab === 'write' && (
        <div
          className={`relative transition-colors ${dragging ? 'bg-orange-50' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {dragging && (
            <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-orange-400 bg-orange-50/80 rounded-b-lg pointer-events-none">
              <div className="flex flex-col items-center gap-2 text-orange-600">
                <Upload className="h-8 w-8" />
                <p className="text-sm font-medium">Drop image to upload</p>
              </div>
            </div>
          )}
          <textarea
            ref={textareaRef}
            required
            rows={20}
            className="w-full px-4 py-3 focus:outline-none font-mono text-sm resize-y min-h-[400px] bg-white"
            value={value}
            onChange={e => onChange(e.target.value)}
            onPaste={handlePaste}
            placeholder={`Write your content here...

Supported syntax:
## Heading 2
### Heading 3
**bold text**
- list item
👉 callout text
💡 hint text
🧠 pro tip

Paste or drop an image to upload it automatically.`}
          />
          <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-1.5 text-xs text-neutral-400 flex items-center gap-2">
            <ImageIcon className="h-3 w-3" />
            Paste or drag an image to upload · <code className="bg-neutral-100 px-1 rounded">&lt;img src="..." /&gt;</code> will render inline
          </div>
        </div>
      )}

      {/* Preview tab */}
      {tab === 'preview' && (
        <div className="bg-white">
          {value.trim() ? (
            <div
              className="px-6 py-6 prose prose-lg prose-neutral prose-headings:font-serif max-w-none text-neutral-700 story-content space-y-4 min-h-[400px]"
              dangerouslySetInnerHTML={{ __html: renderHtml(value) }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-neutral-400 gap-2">
              <Eye className="h-8 w-8 opacity-30" />
              <p className="text-sm">Nothing to preview yet. Start writing!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
