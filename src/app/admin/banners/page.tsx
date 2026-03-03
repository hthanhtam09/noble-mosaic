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
  const [newImage, setNewImage] = useState<File | null>(null);
  const isCreating = createBannerMutation.isPending || uploadMediaMutation.isPending;
  const createImageRef = useRef<HTMLInputElement>(null);

  // Edit dialog state
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editOrder, setEditOrder] = useState('0');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editImage, setEditImage] = useState<File | null>(null);
  const isEditing = updateBannerMutation.isPending || uploadMediaMutation.isPending;
  const editImageRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [bannerToDelete, setBannerToDelete] = useState<{ id: string; title: string } | null>(null);
  const isDeleting = deleteBannerMutation.isPending;

  // Create banner
  const handleCreate = async () => {
    if (!newLink.trim() || !newImage) {
      toast({
        title: "Validation Error",
        description: "Image and Link are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      let imageUrl = '';
      if (newImage) {
        const uploadResult: any = await uploadMediaMutation.mutateAsync({
          file: newImage,
          folder: 'banners'
        });
        imageUrl = uploadResult.url;
      }

      createBannerMutation.mutate({
        title: newTitle.trim(),
        subtitle: newSubtitle.trim(),
        link: newLink.trim(),
        image: imageUrl,
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
      let imageUrl = editingBanner.image;
      if (editImage) {
        const uploadResult: any = await uploadMediaMutation.mutateAsync({
          file: editImage,
          folder: 'banners'
        });
        imageUrl = uploadResult.url;
      }

      updateBannerMutation.mutate({
        id: editingBanner._id,
        data: {
          title: editTitle.trim(),
          subtitle: editSubtitle.trim(),
          link: editLink.trim(),
          image: imageUrl,
          order: parseInt(editOrder) || 0,
          isActive: editIsActive
        }
      }, {
        onSuccess: () => {
          setEditingBanner(null);
          setEditImage(null);
          if (editImageRef.current) editImageRef.current.value = '';
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
    setNewImage(null);
    if (createImageRef.current) createImageRef.current.value = '';
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setEditTitle(banner.title || '');
    setEditSubtitle(banner.subtitle || '');
    setEditLink(banner.link);
    setEditOrder(banner.order.toString());
    setEditIsActive(banner.isActive);
    setEditImage(null);
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
                  src={banner.image}
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Banner Image *</label>
                {newImage && (
                  <div className="relative w-full aspect-[21/9] mb-2 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <Image
                      src={URL.createObjectURL(newImage)}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewImage(null);
                        if (createImageRef.current) createImageRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <Input
                  ref={createImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
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
                disabled={!newImage || !newLink.trim() || isCreating}
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Banner Image *</label>
                {(editingBanner.image || editImage) && (
                  <div className="relative w-full aspect-[21/9] mb-2 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <Image
                      src={editImage ? URL.createObjectURL(editImage) : editingBanner.image}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    {editImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditImage(null);
                          if (editImageRef.current) editImageRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
                <Input
                  ref={editImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
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
