'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Form state
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [bulletPoints, setBulletPoints] = useState<string[]>(['', '', '']);
  const [featured, setFeatured] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    theme: '',
    difficulty: 'beginner',
    amazonLink: '',
    price: '',
    rating: '4.5',
    reviewCount: '0',
  });

  // A+ Content state
  const [aplusBlocks, setAplusBlocks] = useState<any[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'noble-mosaic/products');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        if (type === 'cover') {
          setCoverImage(data.url);
        } else {
          setGalleryImages([...galleryImages, data.url]);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addBulletPoint = () => {
    setBulletPoints([...bulletPoints, '']);
  };

  const removeBulletPoint = (index: number) => {
    setBulletPoints(bulletPoints.filter((_, i) => i !== index));
  };

  const updateBulletPoint = (index: number, value: string) => {
    const updated = [...bulletPoints];
    updated[index] = value;
    setBulletPoints(updated);
  };

  const addAplusBlock = (type: string) => {
    const newBlock = {
      type,
      title: '',
      content: '',
      image: '',
      images: [],
      items: [],
    };
    setAplusBlocks([...aplusBlocks, newBlock]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          coverImage,
          galleryImages,
          bulletPoints: bulletPoints.filter(bp => bp.trim()),
          featured,
          rating: parseFloat(formData.rating),
          reviewCount: parseInt(formData.reviewCount),
          aPlusContent: aplusBlocks,
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
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
        <div className="flex items-center gap-3">
 <div className="flex items-center gap-2">
            <Label htmlFor="featured" className="text-sm text-neutral-600">Featured</Label>
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-neutral-200">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="aplus">A+ Content</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="mt-4 space-y-4">
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

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme *</Label>
                        <Select
                          value={formData.theme}
                          onValueChange={(value) => setFormData({ ...formData, theme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Animals">Animals</SelectItem>
                            <SelectItem value="Flowers">Flowers</SelectItem>
                            <SelectItem value="Mandala">Mandala</SelectItem>
                            <SelectItem value="Nature">Nature</SelectItem>
                            <SelectItem value="Geometric">Geometric</SelectItem>
                            <SelectItem value="Abstract">Abstract</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select
                          value={formData.difficulty}
                          onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Input
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="Brief description for product cards (max 100 chars)"
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Full Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed product description..."
                        rows={5}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="mt-4 space-y-4">
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
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-4 space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Amazon & Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amazonLink">Amazon Product Link *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="amazonLink"
                          value={formData.amazonLink}
                          onChange={(e) => setFormData({ ...formData, amazonLink: e.target.value })}
                          placeholder="https://amazon.com/dp/..."
                          required
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => window.open(formData.amazonLink, '_blank')}
                          disabled={!formData.amazonLink}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (optional)</Label>
                        <Input
                          id="price"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="$12.99"
                        />
                      </div>
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
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Bullet Points</CardTitle>
                    <CardDescription>Key features and benefits (shown on product page)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bulletPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-500 flex-shrink-0">
                          {index + 1}
                        </div>
                        <Input
                          value={point}
                          onChange={(e) => updateBulletPoint(index, e.target.value)}
                          placeholder="e.g., 50+ unique mosaic designs"
                          className="flex-1"
                        />
                        {bulletPoints.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBulletPoint(index)}
                            className="text-neutral-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBulletPoint}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bullet Point
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* A+ Content Tab */}
              <TabsContent value="aplus" className="mt-4 space-y-4">
                <Card className="border-0 shadow-sm bg-neutral-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-sm text-neutral-600">
                        <p className="font-medium text-neutral-900 mb-1">A+ Content</p>
                        <p>Add rich content blocks to enhance your product page, similar to Amazon's A+ content. These blocks appear below the main product info.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {aplusBlocks.map((block, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{block.type}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAplusBlocks(aplusBlocks.filter((_, i) => i !== index))}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Block title"
                        value={block.title}
                        onChange={(e) => {
                          const updated = [...aplusBlocks];
                          updated[index].title = e.target.value;
                          setAplusBlocks(updated);
                        }}
                        className="mb-2"
                      />
                      <Textarea
                        placeholder="Block content"
                        value={block.content}
                        onChange={(e) => {
                          const updated = [...aplusBlocks];
                          updated[index].content = e.target.value;
                          setAplusBlocks(updated);
                        }}
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                ))}

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => addAplusBlock('fullWidth')}>
                    + Full Width
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addAplusBlock('twoColumn')}>
                    + Two Column
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addAplusBlock('featureHighlight')}>
                    + Features
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addAplusBlock('previewGrid')}>
                    + Image Grid
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
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
                  <p className="text-xs text-neutral-500">{formData.theme || 'Theme'}</p>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.amazonLink || !coverImage}
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

                {(!formData.title || !formData.amazonLink || !coverImage) && (
                  <div className="text-xs text-neutral-500 space-y-1">
                    <p className="font-medium">Required fields:</p>
                    <ul className="space-y-0.5">
                      <li className={formData.title ? 'text-green-600' : 'text-red-500'}>
                        {formData.title ? '✓' : '○'} Title
                      </li>
                      <li className={formData.amazonLink ? 'text-green-600' : 'text-red-500'}>
                        {formData.amazonLink ? '✓' : '○'} Amazon Link
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
      </form>
    </div>
  );
}
