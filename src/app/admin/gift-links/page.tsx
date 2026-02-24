'use client';

import { useState, useRef } from 'react';
import { useAdminGiftLinks } from '@/hooks/api/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Trash2, Loader2, Plus, X, Pencil, Gift,
  ExternalLink, Link as LinkIcon, MoreVertical, ImageIcon,
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

interface GiftLink {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminGiftLinksPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: links = [], isLoading } = useAdminGiftLinks();

  // Create dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const createImageRef = useRef<HTMLInputElement>(null);

  // Edit dialog state
  const [editingLink, setEditingLink] = useState<GiftLink | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editImageRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [linkToDelete, setLinkToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload helper
  const uploadFile = async (file: File, folderName: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folderName);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  // Create gift link
  const handleCreate = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setIsCreating(true);
    try {
      let thumbnailUrl = '';
      if (newImage) {
        thumbnailUrl = await uploadFile(newImage, 'gift-links/thumbnails');
      }

      const res = await fetch('/api/gift-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          url: newUrl.trim(),
          thumbnail: thumbnailUrl,
        }),
      });
      if (res.ok) {
        setShowCreateDialog(false);
        setNewTitle('');
        setNewDescription('');
        setNewUrl('');
        setNewImage(null);
        if (createImageRef.current) createImageRef.current.value = '';
        queryClient.invalidateQueries({ queryKey: ['admin-gift-links'] });
        toast({
          title: "Gift link created",
          description: "Your gift link was successfully created."
        });
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || 'Failed to create gift link',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating gift link:', error);
      toast({
        title: "Error",
        description: "Failed to create gift link",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Edit gift link
  const handleEdit = async () => {
    if (!editingLink || !editTitle.trim() || !editUrl.trim()) return;
    setIsEditing(true);
    try {
      let thumbnailUrl = editingLink.thumbnail || '';
      if (editImage) {
        thumbnailUrl = await uploadFile(editImage, 'gift-links/thumbnails');
      }

      const res = await fetch(`/api/gift-links/${editingLink._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          url: editUrl.trim(),
          thumbnail: thumbnailUrl,
        }),
      });
      if (res.ok) {
        setEditingLink(null);
        setEditImage(null);
        if (editImageRef.current) editImageRef.current.value = '';
        queryClient.invalidateQueries({ queryKey: ['admin-gift-links'] });
        toast({
          title: "Gift link updated",
          description: "Gift link details have been saved."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update gift link.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error editing gift link:', error);
    } finally {
      setIsEditing(false);
    }
  };

  // Delete gift link
  const confirmDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/gift-links/${linkToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['admin-gift-links'] });
        toast({
          title: "Gift link deleted",
          description: `The gift link "${linkToDelete.title}" was successfully deleted.`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete gift link",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting gift link:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the gift link.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setLinkToDelete(null);
    }
  };

  // Dialog renderer
  const renderDialog = (
    title: string,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: () => void,
    titleValue: string,
    setTitleValue: (v: string) => void,
    descValue: string,
    setDescValue: (v: string) => void,
    urlValue: string,
    setUrlValue: (v: string) => void,
    imageFile: File | null,
    setImageFile: (f: File | null) => void,
    imageRef: React.RefObject<HTMLInputElement | null>,
    existingThumbnail: string | undefined,
    isSubmitting: boolean,
    submitLabel: string,
  ) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                placeholder="e.g. Mosaic Coloring Book Vol.1"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
                placeholder="Optional description..."
                rows={2}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Cover Image</label>
              {(existingThumbnail || imageFile) && (
                <div className="relative w-32 h-40 mb-2 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <Image
                    src={imageFile ? URL.createObjectURL(imageFile) : existingThumbnail!}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      if (imageRef.current) imageRef.current.value = '';
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <Input
                ref={imageRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                Upload a cover image for this gift (similar to book covers)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Download Link (URL) *</label>
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                Paste a Google Drive, OneDrive, or any download link
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 p-5 border-t border-neutral-100">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!titleValue.trim() || !urlValue.trim() || isSubmitting}
              className="bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Gift Links</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage downloadable gift links for subscribers</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-neutral-900 hover:bg-neutral-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Gift Link
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">Total Links</p>
            <p className="text-2xl font-bold text-neutral-900">{links.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">Active</p>
            <p className="text-2xl font-bold text-neutral-900">
              {links.filter((l: GiftLink) => l.isActive).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Links Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : links.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100">
              <Gift className="h-10 w-10 text-purple-300" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No gift links yet</h3>
            <p className="text-neutral-500 mb-6">
              Add your first download link for subscribers.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Gift Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {links.map((link: GiftLink) => (
            <Card
              key={link._id}
              className="border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                {link.thumbnail ? (
                  <Image
                    src={link.thumbnail}
                    alt={link.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-10 w-10 text-neutral-300" />
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] shadow-sm ${link.isActive ? 'bg-green-500 text-white' : 'bg-neutral-600 text-white'}`}
                  >
                    {link.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* Actions overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md bg-white/90 hover:bg-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => window.open(link.url, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setEditingLink(link);
                        setEditTitle(link.title);
                        setEditDescription(link.description || '');
                        setEditUrl(link.url);
                        setEditImage(null);
                      }}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setLinkToDelete({ id: link._id, title: link.title })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Info */}
              <CardContent className="p-3 bg-white">
                <p className="text-sm font-semibold text-neutral-900 line-clamp-2">{link.title}</p>
                {link.description && (
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{link.description}</p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <LinkIcon className="h-3 w-3 text-neutral-400" />
                  <p className="text-[10px] text-neutral-400 truncate">{link.url}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      {renderDialog(
        'Add New Gift Link',
        showCreateDialog,
        () => { setShowCreateDialog(false); setNewTitle(''); setNewDescription(''); setNewUrl(''); setNewImage(null); },
        handleCreate,
        newTitle,
        setNewTitle,
        newDescription,
        setNewDescription,
        newUrl,
        setNewUrl,
        newImage,
        setNewImage,
        createImageRef,
        undefined,
        isCreating,
        'Add Gift Link',
      )}

      {/* Edit Dialog */}
      {renderDialog(
        'Edit Gift Link',
        !!editingLink,
        () => { setEditingLink(null); setEditImage(null); },
        handleEdit,
        editTitle,
        setEditTitle,
        editDescription,
        setEditDescription,
        editUrl,
        setEditUrl,
        editImage,
        setEditImage,
        editImageRef,
        editingLink?.thumbnail,
        isEditing,
        'Save Changes',
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!linkToDelete} onOpenChange={(open) => !open && !isDeleting && setLinkToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gift Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{linkToDelete?.title}&quot;? This action cannot be undone.
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
