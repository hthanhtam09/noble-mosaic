'use client';

import { useState, useCallback, DragEvent } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface BlogThumbnailUploaderProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BlogThumbnailUploader({ value, onChange }: BlogThumbnailUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'blog-thumbnails');
      
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      
      const json = await res.json();
      onChange(json.url);
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      alert('Failed to upload thumbnail. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

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
    <div className="space-y-3">
      <label className="text-sm font-medium">Post Thumbnail</label>
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-neutral-200 aspect-video md:aspect-[21/9] bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={value} 
            alt="Thumbnail preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="bg-white text-neutral-900 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 transition-colors">
              Change Image
              <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg backdrop-blur-sm transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
            dragging 
              ? 'border-orange-400 bg-orange-50' 
              : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100/50'
          }`}
        >
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileInput} 
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-neutral-500">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-neutral-400">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-neutral-100">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-600">Click to upload thumbnail</p>
                <p className="text-xs">or drag and drop (16:9 recommended)</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
          <ImageIcon className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Or paste external image URL..."
          className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-shadow"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
