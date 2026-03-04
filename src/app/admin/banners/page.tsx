'use client';

import { useState, useRef } from 'react';
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, Banner } from '@/hooks/api/useBanners';
import { useUploadMedia } from '@/hooks/api/useMedia';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Trash2, Loader2, Plus, X, Pencil, ExternalLink, Link as LinkIcon, MoreVertical, ImageIcon, Image as ImageIconLucide
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

export default function AdminBannersPage() {
  const { toast } = useToast();
  const { data: banners = [], isLoading } = useAdminBanners();
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();
  const uploadMediaMutation = useUploadMedia();

  // Create dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newOrder, setNewOrder] = useState('0');
  const [newIsActive, setNewIsActive] = useState(true);
  const [newImagePc, setNewImagePc] = useState<File | null>(null);
  const [newImageTablet, setNewImageTablet] = useState<File | null>(null);
  const [newImageMobile, setNewImageMobile] = useState<File | null>(null);
  const isCreating = createBannerMutation.isPending || uploadMediaMutation.isPending;
  const createImagePcRef = useRef<HTMLInputElement>(null);
  const createImageTabletRef = useRef<HTMLInputElement>(null);
  const createImageMobileRef = useRef<HTMLInputElement>(null);

  // Edit dialog state
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editOrder, setEditOrder] = useState('0');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editImagePc, setEditImagePc] = useState<File | null>(null);
  const [editImageTablet, setEditImageTablet] = useState<File | null>(null);
  const [editImageMobile, setEditImageMobile] = useState<File | null>(null);
  const isEditing = updateBannerMutation.isPending || uploadMediaMutation.isPending;
  const editImagePcRef = useRef<HTMLInputElement>(null);
  const editImageTabletRef = useRef<HTMLInputElement>(null);
  const editImageMobileRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [bannerToDelete, setBannerToDelete] = useState<{ id: string; title: string } | null>(null);
  const isDeleting = deleteBannerMutation.isPending;

  // Create banner
  const handleCreate = async () => {
    if (!newLink.trim() || !newImagePc || !newImageTablet || !newImageMobile) {
      toast({
        title: "Validation Error",
        description: "Link and all 3 device images (PC, Tablet, Mobile) are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      const uploadPromises = [
        uploadMediaMutation.mutateAsync({ file: newImagePc, folder: 'banners' }),
        uploadMediaMutation.mutateAsync({ file: newImageTablet, folder: 'banners' }),
        uploadMediaMutation.mutateAsync({ file: newImageMobile, folder: 'banners' })
      ];

      const [pcResult, tabletResult, mobileResult]: any = await Promise.all(uploadPromises);

      createBannerMutation.mutate({
        title: newTitle.trim(),
        subtitle: newSubtitle.trim(),
        link: newLink.trim(),
        imagePc: pcResult.url,
        imageTablet: tabletResult.url,
        imageMobile: mobileResult.url,
        order: parseInt(newOrder) || 0,
        isActive: newIsActive
      }, {
        onSuccess: () => {
          setShowCreateDialog(false);
          resetCreateForm();
          toast({
            title: "Banner created",
            description: "Your banner was successfully created."
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.error || error.message || 'Failed to create banner',
            variant: "destructive"
          });
        }
      });
    } catch (error: any) {
      console.error('Error uploading image for banner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  // Edit banner
  const handleEdit = async () => {
    if (!editingBanner || !editLink.trim()) return;

    try {
      let imagePcUrl = editingBanner.imagePc || editingBanner.image || '';
      let imageTabletUrl = editingBanner.imageTablet || editingBanner.image || '';
      let imageMobileUrl = editingBanner.imageMobile || editingBanner.image || '';

      const promises: Promise<any>[] = [];
      if (editImagePc) promises.push(uploadMediaMutation.mutateAsync({ file: editImagePc, folder: 'banners' }).then((res: any) => imagePcUrl = res.url));
      if (editImageTablet) promises.push(uploadMediaMutation.mutateAsync({ file: editImageTablet, folder: 'banners' }).then((res: any) => imageTabletUrl = res.url));
      if (editImageMobile) promises.push(uploadMediaMutation.mutateAsync({ file: editImageMobile, folder: 'banners' }).then((res: any) => imageMobileUrl = res.url));

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      updateBannerMutation.mutate({
        id: editingBanner._id,
        data: {
          title: editTitle.trim(),
          subtitle: editSubtitle.trim(),
          link: editLink.trim(),
          imagePc: imagePcUrl,
          imageTablet: imageTabletUrl,
          imageMobile: imageMobileUrl,
          order: parseInt(editOrder) || 0,
          isActive: editIsActive
        }
      }, {
        onSuccess: () => {
          setEditingBanner(null);
          setEditImagePc(null);
          setEditImageTablet(null);
          setEditImageMobile(null);
          if (editImagePcRef.current) editImagePcRef.current.value = '';
          if (editImageTabletRef.current) editImageTabletRef.current.value = '';
          if (editImageMobileRef.current) editImageMobileRef.current.value = '';
          toast({
            title: "Banner updated",
            description: "Banner details have been saved."
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || error.message || "Failed to update banner.",
            variant: "destructive"
          });
        }
      });
    } catch (error: any) {
      console.error('Error uploading image for banner edit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    deleteBannerMutation.mutate(bannerToDelete.id, {
      onSuccess: () => {
        toast({
          title: "Banner deleted",
          description: `The banner was successfully deleted.`
        });
        setBannerToDelete(null);
      },
      onError: (error: any) => {
        console.error('Error deleting banner:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to delete banner",
          variant: "destructive"
        });
      }
    });
  };

  const resetCreateForm = () => {
    setNewTitle('');
    setNewSubtitle('');
    setNewLink('');
    setNewOrder('0');
    setNewIsActive(true);
    setNewImagePc(null);
    setNewImageTablet(null);
    setNewImageMobile(null);
    if (createImagePcRef.current) createImagePcRef.current.value = '';
    if (createImageTabletRef.current) createImageTabletRef.current.value = '';
    if (createImageMobileRef.current) createImageMobileRef.current.value = '';
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setEditTitle(banner.title || '');
    setEditSubtitle(banner.subtitle || '');
    setEditLink(banner.link);
    setEditOrder(banner.order.toString());
    setEditIsActive(banner.isActive);
    setEditImagePc(null);
    setEditImageTablet(null);
    setEditImageMobile(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Banners</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage home page hero banners</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-neutral-900 hover:bg-neutral-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">Total Banners</p>
            <p className="text-2xl font-bold text-neutral-900">{banners.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">Active</p>
            <p className="text-2xl font-bold text-neutral-900">
              {banners.filter((b: Banner) => b.isActive).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : banners.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <ImageIconLucide className="h-10 w-10 text-blue-300" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No banners yet</h3>
            <p className="text-neutral-500 mb-6">
              Add your first banner to display on the home page.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner: Banner) => (
            <Card
              key={banner._id}
              className="border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col"
            >
              <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden">
                <Image
                  src={banner.imagePc || banner.image || ''}
                  alt={banner.title || 'Banner'}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] shadow-sm ${banner.isActive ? 'bg-green-500 text-white' : 'bg-neutral-600 text-white'}`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-neutral-800 text-[10px] shadow-sm">
                    Order: {banner.order}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md bg-white/90 hover:bg-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {banner.link && (
                        <DropdownMenuItem onClick={() => window.open(banner.link, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => openEditDialog(banner)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setBannerToDelete({ id: banner._id, title: banner.title || 'Banner' })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-4 bg-white flex-1 flex flex-col">
                <p className="text-lg font-semibold text-neutral-900 line-clamp-1">{banner.title || 'Untitled'}</p>
                {banner.subtitle && (
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{banner.subtitle}</p>
                )}
                <div className="mt-auto pt-3">
                  <div className="flex items-center gap-1.5 p-2 bg-neutral-50 rounded-md">
                    <LinkIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <p className="text-xs text-neutral-600 truncate">{banner.link}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateDialog(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-900">Add New Banner</h3>
              <button onClick={() => setShowCreateDialog(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Welcome to cozy world"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Optional subtitle"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">Banner Images *</label>
                
                {/* PC Image */}
                <div className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                  <label className="block text-xs font-medium text-neutral-600 mb-2">PC Version (21:9)</label>
                  {newImagePc && (
                    <div className="relative w-full aspect-[21/9] mb-2 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image src={URL.createObjectURL(newImagePc)} alt="Preview" fill className="object-cover" unoptimized />
                      <button type="button" onClick={() => { setNewImagePc(null); if (createImagePcRef.current) createImagePcRef.current.value = ''; }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <Input ref={createImagePcRef} type="file" accept="image/*" onChange={(e) => setNewImagePc(e.target.files?.[0] || null)} className="cursor-pointer bg-white" />
                </div>

                {/* Tablet Image */}
                <div className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                  <label className="block text-xs font-medium text-neutral-600 mb-2">Tablet Version (16:9)</label>
                  {newImageTablet && (
                    <div className="relative w-1/2 aspect-[16/9] mb-2 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image src={URL.createObjectURL(newImageTablet)} alt="Preview" fill className="object-cover" unoptimized />
                      <button type="button" onClick={() => { setNewImageTablet(null); if (createImageTabletRef.current) createImageTabletRef.current.value = ''; }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <Input ref={createImageTabletRef} type="file" accept="image/*" onChange={(e) => setNewImageTablet(e.target.files?.[0] || null)} className="cursor-pointer bg-white" />
                </div>

                {/* Mobile Image */}
                <div className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                  <label className="block text-xs font-medium text-neutral-600 mb-2">Mobile Version (4:3)</label>
                  {newImageMobile && (
                    <div className="relative w-1/3 aspect-[4/3] mb-2 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image src={URL.createObjectURL(newImageMobile)} alt="Preview" fill className="object-cover" unoptimized />
                      <button type="button" onClick={() => { setNewImageMobile(null); if (createImageMobileRef.current) createImageMobileRef.current.value = ''; }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <Input ref={createImageMobileRef} type="file" accept="image/*" onChange={(e) => setNewImageMobile(e.target.files?.[0] || null)} className="cursor-pointer bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Navigate Link *</label>
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="/books or https://..."
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={newOrder}
                    onChange={(e) => setNewOrder(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div className="flex flex-col justify-center translate-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="create-active"
                      checked={newIsActive}
                      onCheckedChange={setNewIsActive}
                    />
                    <label htmlFor="create-active" className="text-sm font-medium text-neutral-700 cursor-pointer">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-neutral-100">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={(!newImagePc || !newImageTablet || !newImageMobile) || !newLink.trim() || isCreating}
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Banner
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingBanner(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-900">Edit Banner</h3>
              <button onClick={() => setEditingBanner(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Welcome to cozy world"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="Optional subtitle"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">Banner Images *</label>
                
                {/* PC Image */}
                <div className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                  <label className="block text-xs font-medium text-neutral-600 mb-2">PC Version (21:9)</label>
                  {(editingBanner.imagePc || editingBanner.image || editImagePc) && (
                    <div className="relative w-full aspect-[21/9] mb-2 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image src={editImagePc ? URL.createObjectURL(editImagePc) : (editingBanner.imagePc || editingBanner.image || '')} alt="Preview" fill className="object-cover" unoptimized />
                      {editImagePc && (
                        <button type="button" onClick={() => { setEditImagePc(null); if (editImagePcRef.current) editImagePcRef.current.value = ''; }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <Input ref={editImagePcRef} type="file" accept="image/*" onChange={(e) => setEditImagePc(e.target.files?.[0] || null)} className="cursor-pointer bg-white" />
                </div>

                {/* Tablet Image */}
                <div className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                  <label className="block text-xs font-medium text-neutral-600 mb-2">Tablet Version (16:9)</label>
                  {(editingBanner.imageTablet || editingBanner.image || editImageTablet) && (
                    <div className="relative w-1/2 aspect-[16/9] mb-2 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image src={editImageTablet ? URL.createObjectURL(editImageTablet) : (editingBanner.imageTablet || editingBanner.image || '')} alt="Preview" fill className="object-cover" unoptimized />
                      {editImageTablet && (
                        <button type="button" onClick={() => { setEditImageTablet(null); if (editImageTabletRef.current) editImageTabletRef.current.value = ''; }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <Input ref={editImageTabletRef} type="file" accept="image/*" onChange={(e) => setEditImageTablet(e.target.files?.[0] || null)} className="cursor-pointer bg-white" />
                </div>

                {/* Mobile Image */}
                <div className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                  <label className="block text-xs font-medium text-neutral-600 mb-2">Mobile Version (4:3)</label>
                  {(editingBanner.imageMobile || editingBanner.image || editImageMobile) && (
                    <div className="relative w-1/3 aspect-[4/3] mb-2 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image src={editImageMobile ? URL.createObjectURL(editImageMobile) : (editingBanner.imageMobile || editingBanner.image || '')} alt="Preview" fill className="object-cover" unoptimized />
                      {editImageMobile && (
                        <button type="button" onClick={() => { setEditImageMobile(null); if (editImageMobileRef.current) editImageMobileRef.current.value = ''; }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <Input ref={editImageMobileRef} type="file" accept="image/*" onChange={(e) => setEditImageMobile(e.target.files?.[0] || null)} className="cursor-pointer bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Navigate Link *</label>
                <input
                  type="text"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  placeholder="/books or https://..."
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editOrder}
                    onChange={(e) => setEditOrder(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div className="flex flex-col justify-center translate-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-active"
                      checked={editIsActive}
                      onCheckedChange={setEditIsActive}
                    />
                    <label htmlFor="edit-active" className="text-sm font-medium text-neutral-700 cursor-pointer">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-neutral-100">
              <Button variant="outline" onClick={() => setEditingBanner(null)} disabled={isEditing}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!editLink.trim() || isEditing}
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                {isEditing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!bannerToDelete} onOpenChange={(open) => !open && !isDeleting && setBannerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? The image will be removed from storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
