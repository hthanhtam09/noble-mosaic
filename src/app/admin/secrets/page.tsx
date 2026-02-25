'use client';

import { useState, useRef } from 'react';
import { useAdminSecretBooks, useAdminSecrets } from '@/hooks/api/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Trash2, ArrowLeft, Upload, Loader2,
  ImageIcon, Plus, BookOpen, KeyRound, LockOpen
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SecretBook {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  secretKey?: string;
  amazonUrlStandard?: string;
  amazonUrlPremium?: string;
}

interface SecretImage {
  _id: string;
  secretBook: string | SecretBook;
  colorImageUrl: string;
  uncolorImageUrl: string;
  order: number;
  isActive: boolean;
}

export default function AdminSecretsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: books = [], isLoading: isLoadingBooks } = useAdminSecretBooks();

  const [selectedBook, setSelectedBook] = useState<SecretBook | null>(null);

  const { data: secrets = [], isLoading: isLoadingSecrets } = useAdminSecrets(selectedBook?._id);

  // Create Book state
  const [showCreateBook, setShowCreateBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookImage, setNewBookImage] = useState<File | null>(null);
  const [newBookKey, setNewBookKey] = useState('');
  const [newBookAmazonUrlStandard, setNewBookAmazonUrlStandard] = useState('');
  const [newBookAmazonUrlPremium, setNewBookAmazonUrlPremium] = useState('');
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  // Upload Secrets state
  const [showAddForm, setShowAddForm] = useState(false);
  const [colorImages, setColorImages] = useState<File[]>([]);
  const [uncolorImages, setUncolorImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);

  const colorInputRef = useRef<HTMLInputElement>(null);
  const uncolorInputRef = useRef<HTMLInputElement>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Dialog states for deletion
  const [bookToDelete, setBookToDelete] = useState<SecretBook | null>(null);
  const [secretToDelete, setSecretToDelete] = useState<string | null>(null);

  // Book Settings state
  const [showBookSettingsModal, setShowBookSettingsModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCoverImage, setEditCoverImage] = useState<File | null>(null);
  const [editKey, setEditKey] = useState('');
  const [editAmazonUrlStandard, setEditAmazonUrlStandard] = useState('');
  const [editAmazonUrlPremium, setEditAmazonUrlPremium] = useState('');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // Delete All state
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const generateSecretKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSelectBook = (book: SecretBook) => {
    setSelectedBook(book);
  };

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

  const handleCreateBook = async () => {
    if (!newBookTitle || !newBookImage) {
      toast({
        title: "Missing fields",
        description: "Please provide a title and a cover image.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingBook(true);
    try {
      const coverImageUrl = await uploadFile(newBookImage, 'secrets/covers');

      const res = await fetch('/api/admin/secret-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBookTitle,
          coverImage: coverImageUrl,
          secretKey: newBookKey || undefined,
          amazonUrlStandard: newBookAmazonUrlStandard || undefined,
          amazonUrlPremium: newBookAmazonUrlPremium || undefined,
        })
      });

      if (res.ok) {
        setShowCreateBook(false);
        setNewBookTitle('');
        setNewBookImage(null);
        setNewBookKey('');
        setNewBookAmazonUrlStandard('');
        setNewBookAmazonUrlPremium('');
        queryClient.invalidateQueries({ queryKey: ['admin-secret-books'] });
        toast({
          title: "Book created",
          description: "Your secret book has been created successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create book.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the book.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBook(false);
    }
  };

  const [isDeletingBook, setIsDeletingBook] = useState(false);

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    const id = bookToDelete._id;
    setIsDeletingBook(true);

    try {
      const res = await fetch(`/api/admin/secret-books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        queryClient.setQueryData(['admin-secret-books'], (old: SecretBook[] | undefined) => {
          if (!old) return [];
          return old.filter(b => b._id !== id);
        });
        if (selectedBook?._id === id) {
          setSelectedBook(null);
        }
        toast({
          title: "Book Deleted",
          description: "The secret book has been deleted successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the book.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the book.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingBook(false);
      setBookToDelete(null);
    }
  };

  const handleDeleteBook = (e: React.MouseEvent, book: SecretBook) => {
    e.stopPropagation();
    setBookToDelete(book);
  };

  const handleUpdateBookSettings = async () => {
    if (!selectedBook) return;
    if (!editTitle) {
      toast({
        title: "Missing fields",
        description: "Please provide a title.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingSettings(true);
    try {
      let coverImageUrl = selectedBook.coverImage;
      if (editCoverImage) {
        coverImageUrl = await uploadFile(editCoverImage, 'secrets/covers');
      }

      const res = await fetch(`/api/admin/secret-books/${selectedBook._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          coverImage: coverImageUrl,
          secretKey: editKey || undefined,
          amazonUrlStandard: editAmazonUrlStandard || undefined,
          amazonUrlPremium: editAmazonUrlPremium || undefined,
        })
      });

      if (res.ok) {
        setShowBookSettingsModal(false);
        const updatedBook = {
          ...selectedBook,
          title: editTitle,
          coverImage: coverImageUrl,
          secretKey: editKey || undefined,
          amazonUrlStandard: editAmazonUrlStandard || undefined,
          amazonUrlPremium: editAmazonUrlPremium || undefined,
        };
        setSelectedBook(updatedBook);
        queryClient.setQueryData(['admin-secret-books'], (old: SecretBook[] | undefined) => {
          if (!old) return [];
          return old.map(b => b._id === updatedBook._id ? updatedBook : b);
        });
        toast({
          title: "Settings updated",
          description: "Book settings have been successfully saved."
        });
      } else {
        const error = await res.json();
        toast({
          title: "Update failed",
          description: error.error || 'Unknown error occurred.',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Extract number from filename, assuming filenames are like "1.png", "image 10.jpg" etc
  const getNumberFromFilename = (filename: string): number => {
    const match = filename.match(/\d+/);
    return match ? parseInt(match[0], 10) : 999999;
  };

  const handleColorFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Filter out non-images (like DS_Store) and sort numerically by name
      const fileArray = Array.from(files)
        .filter(f => f.type.startsWith('image/'))
        .sort((a, b) => getNumberFromFilename(a.name) - getNumberFromFilename(b.name));
      setColorImages(fileArray);
    }
  };

  const handleUncolorFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files)
        .filter(f => f.type.startsWith('image/'))
        .sort((a, b) => getNumberFromFilename(a.name) - getNumberFromFilename(b.name));
      setUncolorImages(fileArray);
    }
  };

  const handleAddSecretsBulk = async () => {
    if (!selectedBook) return;
    if (colorImages.length === 0 || uncolorImages.length === 0) {
      toast({
        title: "Missing folders",
        description: "Please select both color and uncolor folders.",
        variant: "destructive"
      });
      return;
    }

    if (colorImages.length !== uncolorImages.length) {
      toast({
        title: "Mismatched counts",
        description: `You selected ${colorImages.length} color images and ${uncolorImages.length} uncolor images. They must contain the exact same amount.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setTotalUploads(colorImages.length);
    setUploadProgress(0);

    try {
      let successCount = 0;
      let existingMaxOrder = secrets.length > 0 ? Math.max(...secrets.map(s => s.order || 0)) : 0;

      for (let i = 0; i < colorImages.length; i++) {
        try {
          // Both arrays are sorted numerically, so index 'i' in color matches index 'i' in uncolor.
          // Upload pairs
          const colorImageUrl = await uploadFile(colorImages[i], `secrets/${selectedBook.slug}/color`);
          const uncolorImageUrl = await uploadFile(uncolorImages[i], `secrets/${selectedBook.slug}/uncolor`);

          const order = existingMaxOrder + 1;

          // Save to DB
          const res = await fetch('/api/admin/secrets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secretBook: selectedBook._id,
              colorImageUrl,
              uncolorImageUrl,
              order,
              isActive: true
            })
          });

          if (res.ok) {
            successCount++;
            existingMaxOrder++;
          } else {
            console.error(`Failed to save pair index ${i} to database`);
          }
        } catch (err) {
          console.error(`Failed to upload pair index ${i}`, err);
        }
        setUploadProgress(i + 1);
      }

      if (successCount > 0) {
        setShowAddForm(false);
        setColorImages([]);
        setUncolorImages([]);
        if (colorInputRef.current) colorInputRef.current.value = '';
        if (uncolorInputRef.current) uncolorInputRef.current.value = '';
        queryClient.invalidateQueries({ queryKey: ['admin-secrets', selectedBook._id] });

        toast({
          title: "Upload complete",
          description: `Successfully added ${successCount} out of ${colorImages.length} pairs.`
        });
      } else if (successCount < colorImages.length) {
        toast({
          title: "Upload partial/failed",
          description: `Only added ${successCount} out of ${colorImages.length} pairs. Check console for details.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Fatal Error",
        description: "A fatal error occurred during the batch upload process.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteSecret = async () => {
    if (!secretToDelete) return;
    const id = secretToDelete;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/secrets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        queryClient.setQueryData(['admin-secrets', selectedBook?._id], (old: SecretImage[] | undefined) => {
          if (!old) return [];
          return old.filter(s => s._id !== id);
        });
        toast({
          title: "Secret Deleted",
          description: "The secret image pair has been deleted successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the secret.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
      setSecretToDelete(null);
    }
  };

  const handleDeleteSecret = (id: string) => {
    setSecretToDelete(id);
  };

  const handleDeleteAllSecrets = async () => {
    if (!selectedBook) return;
    setIsDeletingAll(true);
    try {
      const res = await fetch(`/api/admin/secrets?bookId=${selectedBook._id}`, { method: 'DELETE' });
      if (res.ok) {
        queryClient.setQueryData(['admin-secrets', selectedBook._id], []);
        setShowDeleteAllModal(false);
        toast({
          title: "Deleted All",
          description: "All images in this folder have been deleted."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete all images.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting all secrets:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (selectedBook) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedBook(null)} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-neutral-900">{selectedBook.title} - Secrets</h1>
                <div className="flex items-center gap-2 mt-1">
                  {selectedBook.secretKey ? (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      <KeyRound className="h-3 w-3 mr-1" /> Key: {selectedBook.secretKey}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-neutral-100 text-neutral-500 border-neutral-200">
                      <LockOpen className="h-3 w-3 mr-1" /> Public
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2 text-neutral-500 hover:text-neutral-900"
                    onClick={() => {
                      setEditTitle(selectedBook.title || '');
                      setEditCoverImage(null);
                      setEditKey(selectedBook.secretKey || '');
                      setEditAmazonUrlStandard(selectedBook.amazonUrlStandard || '');
                      setEditAmazonUrlPremium(selectedBook.amazonUrlPremium || '');
                      setShowBookSettingsModal(true);
                    }}
                  >
                    Edit Settings
                  </Button>
                </div>
              </div>
              <p className="text-neutral-500 text-sm mt-0.5">Manage secret images for this book</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {secrets.length > 0 && (
              <Button onClick={() => setShowDeleteAllModal(true)} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" /> Delete All
              </Button>
            )}
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90 text-white">
              {showAddForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Upload Folders</>}
            </Button>
          </div>
        </div>

        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Folders</DialogTitle>
              <DialogDescription>
                Please select the <strong>entire folder</strong> containing your color images, and the <strong>entire folder</strong> containing your uncolor images. Make sure both folders contain the exact same amount of images (e.g. 50). The system will automatically sort them from 1 to 50 based on their filenames and pair them together.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 mt-4">
              <div className="border border-neutral-200 p-4 rounded-md bg-neutral-50">
                <label className="block text-sm font-semibold mb-2">1. Select Color Folder</label>
                <p className="text-xs text-neutral-500 mb-3">Contains colored versions (e.g., 1.jpg, 2.jpg...)</p>
                <Input
                  ref={colorInputRef}
                  type="file"
                  // @ts-expect-error - webkitdirectory is standard in most modern browsers but missing from generic React types
                  webkitdirectory="true"
                  directory="true"
                  multiple
                  onChange={handleColorFolderSelect}
                  className="cursor-pointer bg-white"
                />
                {colorImages.length > 0 && (
                  <p className="text-sm mt-3 font-medium text-[var(--mosaic-teal)]">✓ Found {colorImages.length} color images</p>
                )}
              </div>
              <div className="border border-neutral-200 p-4 rounded-md bg-neutral-50">
                <label className="block text-sm font-semibold mb-2">2. Select Uncolor Folder</label>
                <p className="text-xs text-neutral-500 mb-3">Contains uncolored versions (e.g., 1.jpg, 2.jpg...)</p>
                <Input
                  ref={uncolorInputRef}
                  type="file"
                  // @ts-expect-error - webkitdirectory is standard in most modern browsers but missing from generic React types
                  webkitdirectory="true"
                  directory="true"
                  multiple
                  onChange={handleUncolorFolderSelect}
                  className="cursor-pointer bg-white"
                />
                {uncolorImages.length > 0 && (
                  <p className="text-sm mt-3 font-medium text-[var(--mosaic-teal)]">✓ Found {uncolorImages.length} uncolor images</p>
                )}
              </div>
            </div>

            {isSubmitting && (
              <div className="mb-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      Uploading secret pairs... Please wait.
                    </p>
                    <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${totalUploads > 0 ? (uploadProgress / totalUploads) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-800 mt-1">{uploadProgress} of {totalUploads} completed</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 mt-2 border-t border-neutral-100">
              <Button onClick={() => setShowAddForm(false)} variant="outline" className="mr-2" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSecretsBulk}
                disabled={colorImages.length === 0 || uncolorImages.length === 0 || colorImages.length !== uncolorImages.length || isSubmitting}
                className="bg-neutral-900 text-white whitespace-nowrap"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {isSubmitting ? 'Uploading & Saving Folders...' : `Upload ${colorImages.length} Pairs`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {isLoadingSecrets ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-neutral-400" /></div>
        ) : secrets.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">No secret images added yet. Select folders to upload above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secrets.map((secret) => (
              <Card key={secret._id} className="overflow-hidden group">
                <div className="grid grid-cols-2 gap-1 bg-neutral-100 p-2">
                  <div className="relative aspect-[3/4] bg-white rounded-md overflow-hidden shadow-sm">
                    <Image src={secret.colorImageUrl} alt="Color" fill className="object-cover" unoptimized={true} />
                    <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">Color</div>
                  </div>
                  <div className="relative aspect-[3/4] bg-white rounded-md overflow-hidden shadow-sm">
                    <Image src={secret.uncolorImageUrl} alt="Uncolor" fill className="object-cover" unoptimized={true} />
                    <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">Uncolor</div>
                  </div>
                </div>
                <CardContent className="p-3 flex items-center justify-between border-t border-neutral-100">
                  <Badge variant="outline">Order: {secret.order}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteSecret(secret._id)}
                    disabled={deletingId === secret._id}
                  >
                    {deletingId === secret._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!secretToDelete} onOpenChange={(open) => !open && !deletingId && setSecretToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this secret pair and remove its images from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
              <Button onClick={confirmDeleteSecret} disabled={!!deletingId} className="bg-red-600 hover:bg-red-700 text-white">
                {deletingId ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Book Settings Modal */}
        <AlertDialog open={showBookSettingsModal} onOpenChange={setShowBookSettingsModal}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="pb-4 border-b border-neutral-100 mb-2">
              <AlertDialogTitle>Book Settings</AlertDialogTitle>
              <AlertDialogDescription>
                Configure the secret key, Amazon product link, and the preview image displayed on the lock screen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 line-clamp-1">Book Title <span className="text-red-500">*</span></label>
                <Input
                  type="text"
                  placeholder="e.g. Animals Volume 1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cover Image</label>
                <div className="flex gap-2 items-center">
                  <div className="relative w-12 h-16 rounded overflow-hidden shadow-sm bg-neutral-100 flex-shrink-0">
                    <Image
                      src={editCoverImage ? URL.createObjectURL(editCoverImage) : selectedBook.coverImage}
                      alt="Current Cover"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCoverImage(e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Leave empty to keep current cover.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 line-clamp-1">Secret Key (6 Characters)</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. SECRET"
                    value={editKey}
                    onChange={(e) => setEditKey(e.target.value.toUpperCase().slice(0, 6))}
                    className="uppercase"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setEditKey(generateSecretKey())}
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Leave blank for a public book, or enter exactly 6 characters.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amazon Standard Link</label>
                <Input
                  type="url"
                  placeholder="https://amazon.com/dp/XXXXXX"
                  value={editAmazonUrlStandard}
                  onChange={(e) => setEditAmazonUrlStandard(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amazon Premium Link</label>
                <Input
                  type="url"
                  placeholder="https://amazon.com/dp/XXXXXX"
                  value={editAmazonUrlPremium}
                  onChange={(e) => setEditAmazonUrlPremium(e.target.value)}
                />
              </div>

            </div>
            <AlertDialogFooter className="border-t border-neutral-100 pt-4 mt-2">
              <AlertDialogCancel disabled={isUpdatingSettings}>Cancel</AlertDialogCancel>
              <Button onClick={handleUpdateBookSettings} disabled={isUpdatingSettings} className="bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90 text-white">
                {isUpdatingSettings ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Settings
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete All Modal */}
        <AlertDialog open={showDeleteAllModal} onOpenChange={setShowDeleteAllModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete All Images?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete all {secrets.length} images in this folder? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingAll}>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteAllSecrets} disabled={isDeletingAll} className="bg-red-600 hover:bg-red-700 text-white">
                {isDeletingAll ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Yes, Delete All
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Secret Books Manager</h1>
          <p className="text-neutral-500 text-sm mt-1">Select a book to manage its secrets, or add a new book.</p>
        </div>
        <Button onClick={() => setShowCreateBook(!showCreateBook)} className="bg-neutral-900 hover:bg-neutral-800 text-white">
          {showCreateBook ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Add New Book</>}
        </Button>
      </div>

      <Dialog open={showCreateBook} onOpenChange={setShowCreateBook}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Secret Book</DialogTitle>
            <DialogDescription>
              Add a new coloring book for users to explore. Include the Amazon link and a secret key if it requires purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div>
              <label className="block text-sm font-medium mb-1">Book Title <span className="text-red-500">*</span></label>
              <Input
                type="text"
                placeholder="e.g. Animals Volume 1"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image <span className="text-red-500">*</span></label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewBookImage(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secret Key (Optional)</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. SECRET"
                  value={newBookKey}
                  onChange={(e) => setNewBookKey(e.target.value.toUpperCase().slice(0, 6))}
                  className="uppercase"
                />
                <Button
                  variant="outline"
                  onClick={() => setNewBookKey(generateSecretKey())}
                  className="whitespace-nowrap px-3"
                >
                  Gen
                </Button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Leave blank for public, or enter 6 chars.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amazon Standard Link (Optional)</label>
              <Input
                type="url"
                placeholder="https://amazon.com/..."
                value={newBookAmazonUrlStandard}
                onChange={(e) => setNewBookAmazonUrlStandard(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amazon Premium Link (Optional)</label>
              <Input
                type="url"
                placeholder="https://amazon.com/..."
                value={newBookAmazonUrlPremium}
                onChange={(e) => setNewBookAmazonUrlPremium(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 mt-2 border-t border-neutral-100">
            <Button onClick={() => setShowCreateBook(false)} variant="outline" className="mr-2" disabled={isCreatingBook}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBook}
              disabled={!newBookTitle || !newBookImage || isCreatingBook}
              className="bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90 text-white"
            >
              {isCreatingBook ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isCreatingBook ? 'Creating...' : 'Create Book'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoadingBooks ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-neutral-400" /></div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 bg-white rounded-lg border border-neutral-200">
          <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900">No Secret Books Found</h3>
          <p className="mt-1">Click "Add New Book" above to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <Card
              key={book._id}
              className="border border-neutral-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
              onClick={() => handleSelectBook(book)}
            >
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-10 w-10 text-neutral-300" />
                  </div>
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 shadow-md"
                    onClick={(e) => handleDeleteBook(e, book)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {book.secretKey && (
                  <div className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-sm flex items-center font-mono font-medium gap-1.5 border border-white/10">
                    <KeyRound className="h-3 w-3 text-amber-400" />
                    {book.secretKey}
                  </div>
                )}
              </div>
              <CardContent className="p-3 bg-white flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900 line-clamp-2">{book.title}</p>
                {!book.secretKey && <LockOpen className="h-4 w-4 text-neutral-300 flex-none ml-2" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && !isDeletingBook && setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Secret Book?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete `{bookToDelete?.title}`? This will completely drop the book, its images, and all related records from our servers. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingBook}>Cancel</AlertDialogCancel>
            <Button onClick={confirmDeleteBook} disabled={isDeletingBook} className="bg-red-600 hover:bg-red-700 text-white">
              {isDeletingBook ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
