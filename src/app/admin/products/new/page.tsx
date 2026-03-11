'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useCreateProduct } from '@/hooks/api/useProducts';
import { useUploadMedia } from '@/hooks/api/useMedia';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft, Plus, X, Loader2, Upload, Image as ImageIcon,
  Star, Check, ExternalLink, Info, Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import dynamic from 'next/dynamic';

const MarkdownEditor = dynamic(() => import('@/components/ui/markdown-editor'), { ssr: false });

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createProductMutation = useCreateProduct();
  const uploadMediaMutation = useUploadMedia();

  const isLoading = createProductMutation.isPending;

  // Form state
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    generalDescription: '',
    description: '',
    amazonLink: '',
    asin: '',
    price: '',
    rating: '',
    reviewCount: '0',
    showRating: true,
    isComingSoon: false,
    dimensions: '',
    printLength: '',
  });

  // A+ Content state
  const [aplusImages, setAplusImages] = useState<string[]>([]);

  // Editions state
  const [editions, setEditions] = useState<{ name: string; link: string; asin: string; price: string; description?: string; coverImage?: string; aPlusContent?: string[] }[]>([{
    name: 'Premium',
    link: '',
    asin: '',
    price: '',
    description: '',
    coverImage: '',
    aPlusContent: []
  }]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery' | 'aplus') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(file =>
        uploadMediaMutation.mutateAsync({ file, folder: 'noble-mosaic/products' })
      );

      const results = await Promise.all(uploadPromises);
      const urls = results.map((data: any) => data.url);

      if (type === 'cover') {
        setCoverImage(urls[0]);
      } else if (type === 'gallery') {
        setGalleryImages(prev => [...prev, ...urls]);
      } else if (type === 'aplus') {
        setAplusImages(prev => [...prev, ...urls]);
      }

      toast({
        title: "Upload Successful",
        description: `${urls.length} image(s) uploaded successfully.`,
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred during upload.",
        variant: "destructive"
      });
    }
  };






  const formatPrice = (value: string) => {
    let cleanValue = value.replace(/[^0-9.]/g, '');
    if (cleanValue) {
      return value.startsWith('$') ? value : `$${cleanValue}`;
    }
    return '';
  };

  const updateEdition = (field: string, value: string) => {
    const updated = [...editions];
    updated[0] = { ...updated[0], [field]: value };
    setEditions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createProductMutation.mutate({
      ...formData,
      coverImage,
      galleryImages,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : undefined,
      aPlusContent: aplusImages,
      editions,
    }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Product created successfully.",
        });
        router.push('/admin/products');
      },
      onError: (error: any) => {
        console.error('Error creating product:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to create product.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Add New Product</h1>
          <p className="text-neutral-500 text-sm mt-1">Create a detailed product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-8">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Mosaic Animals Color By Number"
                        className="text-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>General Description (Mô tả chung) *</Label>
                      <MarkdownEditor
                        value={formData.generalDescription}
                        onChange={(val) => setFormData({ ...formData, generalDescription: val || '' })}
                        height={200}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Standard Description (Mô tả standard) *</Label>
                      <MarkdownEditor
                        value={formData.description}
                        onChange={(val) => setFormData({ ...formData, description: val || '' })}
                        height={250}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Premium Description (Mô tả Premium) *</Label>
                      <MarkdownEditor
                        value={editions[0]?.description || ''}
                        onChange={(val) => updateEdition('description', val || '')}
                        height={250}
                      />
                    </div>


                  </CardContent>
                </Card>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Cover Image</CardTitle>
                    <CardDescription>Main product image (recommended: 800x1200px)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      {coverImage ? (
                        <div className="relative w-32 h-44 rounded-lg overflow-hidden bg-neutral-100 group">
                          <Image src={coverImage} alt="Cover" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => setCoverImage('')}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-32 h-44 rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                          <Upload className="h-6 w-6 text-neutral-400 mb-2" />
                          <span className="text-xs text-neutral-500">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'cover')}
                          />
                        </label>
                      )}
                      <div className="flex-1 text-sm text-neutral-500">
                        <p className="mb-2">Tips for great cover images:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Use high-resolution images (at least 800x1200px)</li>
                          <li>• Show the actual book cover design</li>
                          <li>• Ensure good lighting and clear visibility</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Gallery Images</CardTitle>
                    <CardDescription>Additional product images (interior pages, back cover, etc.)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {galleryImages.map((img, index) => (
                        <div key={index} className="relative w-24 h-32 rounded-lg overflow-hidden bg-neutral-100 group">
                          <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      ))}
                      <label className="w-24 h-32 rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                        <Plus className="h-5 w-5 text-neutral-400" />
                        <span className="text-xs text-neutral-500 mt-1">Add</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Amazon & Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="asin">Standard Amazon ASIN *</Label>
                        <Input
                          id="asin"
                          value={formData.asin}
                          onChange={(e) => setFormData({ ...formData, asin: e.target.value.trim() })}
                          placeholder="e.g., B0GS1TS5HF"
                          required
                          className="flex-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premiumAsin">Premium Amazon ASIN *</Label>
                        <Input
                          id="premiumAsin"
                          value={editions[0]?.asin || ''}
                          onChange={(e) => updateEdition('asin', e.target.value.trim())}
                          placeholder="e.g., B0GS1TS5HF"
                          required
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Standard Price (optional)</Label>
                        <Input
                          id="price"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: formatPrice(e.target.value) })}
                          placeholder="$12.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premiumPrice">Premium Price (optional)</Label>
                        <Input
                          id="premiumPrice"
                          value={editions[0]?.price || ''}
                          onChange={(e) => updateEdition('price', formatPrice(e.target.value))}
                          placeholder="$19.99"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rating">Initial Rating</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="rating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                          />
                          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="space-y-0.5">
                          <Label htmlFor="showRating" className="text-base font-semibold text-amber-900">Show Rating</Label>
                          <p className="text-sm text-amber-700">Display this rating on the public store pages</p>
                        </div>
                        <Switch
                          id="showRating"
                          checked={formData.showRating}
                          onCheckedChange={(checked) => setFormData({ ...formData, showRating: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="space-y-0.5">
                          <Label htmlFor="isComingSoon" className="text-base font-semibold text-blue-900">Coming Soon</Label>
                          <p className="text-sm text-blue-700">Flag this product as coming soon</p>
                        </div>
                        <Switch
                          id="isComingSoon"
                          checked={formData.isComingSoon}
                          onCheckedChange={(checked) => setFormData({ ...formData, isComingSoon: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* A+ Content Section */}
              <div className="space-y-4">
                <Card className="border-0 shadow-sm bg-neutral-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-sm text-neutral-600">
                        <p className="font-medium text-neutral-900 mb-1">A+ Content</p>
                        <p>Upload full-size images to enhance your product page below the main product info. Recommended size: 970 x 600 px.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Product Specs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          value={formData.dimensions}
                          onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                          placeholder="e.g., 8.5 x 0.26 x 11 inches"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="printLength">Print Length</Label>
                        <Input
                          id="printLength"
                          value={formData.printLength}
                          onChange={(e) => setFormData({ ...formData, printLength: e.target.value })}
                          placeholder="e.g., 107 pages"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">A+ Image Gallery</CardTitle>
                    <CardDescription>Upload multiple images (970x600px)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {aplusImages.map((img, index) => (
                        <div key={index} className="relative w-40 h-24 rounded-lg overflow-hidden bg-neutral-100 group">
                          <Image src={img} alt={`A+ Image ${index + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => setAplusImages(aplusImages.filter((_, i) => i !== index))}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      ))}
                      <label className="w-40 h-24 rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                        <Plus className="h-5 w-5 text-neutral-400" />
                        <span className="text-xs text-neutral-500 mt-1">Add Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'aplus')}
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>


            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm sticky top-20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Draft</Badge>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-sm font-medium mb-3">Product Preview</h3>
                  {coverImage ? (
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-3">
                      <Image src={coverImage} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
                      <ImageIcon className="h-8 w-8 text-neutral-300" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {formData.title || 'Product Title'}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.asin || !coverImage}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/products">Cancel</Link>
                  </Button>
                </div>

                {(!formData.title || !formData.asin || !coverImage) && (
                  <div className="text-xs text-neutral-500 space-y-1">
                    <p className="font-medium">Required fields:</p>
                    <ul className="space-y-0.5">
                      <li className={formData.title ? 'text-green-600' : 'text-red-500'}>
                        {formData.title ? '✓' : '○'} Title
                      </li>
                      <li className={formData.asin ? 'text-green-600' : 'text-red-500'}>
                        {formData.asin ? '✓' : '○'} ASIN
                      </li>
                      <li className={coverImage ? 'text-green-600' : 'text-red-500'}>
                        {coverImage ? '✓' : '○'} Cover Image
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form >
    </div >
  );
}
