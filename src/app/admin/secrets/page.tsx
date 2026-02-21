'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Trash2, ArrowLeft, Upload, Loader2,
  ImageIcon, Plus, BookOpen
} from 'lucide-react';
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

interface SecretBook {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
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
  const [books, setBooks] = useState<SecretBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  const [selectedBook, setSelectedBook] = useState<SecretBook | null>(null);
  const [secrets, setSecrets] = useState<SecretImage[]>([]);
  const [isLoadingSecrets, setIsLoadingSecrets] = useState(false);

  // Create Book state
  const [showCreateBook, setShowCreateBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookImage, setNewBookImage] = useState<File | null>(null);
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

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoadingBooks(true);
      const res = await fetch('/api/admin/secret-books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (error) {
      console.error('Error fetching secret books:', error);
    } finally {
      setIsLoadingBooks(false);
    }
  }, []);

  const fetchSecrets = useCallback(async (bookId: string) => {
    try {
      setIsLoadingSecrets(true);
      const res = await fetch(`/api/admin/secrets?book=${bookId}`);
      if (res.ok) {
        const data = await res.json();
        setSecrets(data.secrets || []);
      }
    } catch (error) {
      console.error('Error fetching secrets:', error);
    } finally {
      setIsLoadingSecrets(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSelectBook = async (book: SecretBook) => {
    setSelectedBook(book);
    await fetchSecrets(book._id);
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
      alert('Please provide a title and a cover image.');
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
        })
      });

      if (res.ok) {
        setShowCreateBook(false);
        setNewBookTitle('');
        setNewBookImage(null);
        await fetchBooks();
      } else {
        alert('Failed to create book');
      }
    } catch (error) {
       console.error(error);
       alert('Error creating book');
    } finally {
       setIsCreatingBook(false);
    }
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    const id = bookToDelete._id;
    
    try {
      const res = await fetch(`/api/admin/secret-books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBooks(prev => prev.filter(b => b._id !== id));
        if (selectedBook?._id === id) {
          setSelectedBook(null);
        }
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setBookToDelete(null);
    }
  };

  const handleDeleteBook = (e: React.MouseEvent, book: SecretBook) => {
    e.stopPropagation();
    setBookToDelete(book);
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
      alert('Please select both color and uncolor folders.');
      return;
    }

    if (colorImages.length !== uncolorImages.length) {
      alert(`Mismatched file counts! You selected ${colorImages.length} color images and ${uncolorImages.length} uncolor images. They must contain the exact same amount of images.`);
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
        await fetchSecrets(selectedBook._id);
      }
      
      if (successCount < colorImages.length) {
         alert(`Completed. Successfully added ${successCount} out of ${colorImages.length} pairs.`);
      }

    } catch (error) {
      console.error(error);
      alert('Fatal error during batch upload process');
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
        setSecrets(prev => prev.filter(s => s._id !== id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
      setSecretToDelete(null);
    }
  };

  const handleDeleteSecret = (id: string) => {
    setSecretToDelete(id);
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
              <h1 className="text-2xl font-serif font-bold text-neutral-900">{selectedBook.title} - Secrets</h1>
              <p className="text-neutral-500 text-sm mt-0.5">Manage secret images for this book</p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90 text-white">
            {showAddForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Upload Folders</>}
          </Button>
        </div>

        {showAddForm && (
          <Card className="bg-neutral-50 shadow-sm border-dashed">
            <CardContent className="p-6">
              <div className="mb-4 text-sm text-neutral-500 bg-neutral-100 p-4 border border-neutral-200 rounded-md">
                <strong>Important:</strong> Please select the <strong>entire folder</strong> containing your color images, and the <strong>entire folder</strong> containing your uncolor images. Make sure both folders contain the exact same amount of images (e.g. 50). The system will automatically sort them from 1 to 50 based on their filenames and pair them together. 
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-neutral-200 p-4 rounded-md bg-white">
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
                    className="cursor-pointer"
                  />
                  {colorImages.length > 0 && (
                    <p className="text-sm mt-3 font-medium text-[var(--mosaic-teal)]">✓ Found {colorImages.length} color images</p>
                  )}
                </div>
                <div className="border border-neutral-200 p-4 rounded-md bg-white">
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
                    className="cursor-pointer" 
                  />
                  {uncolorImages.length > 0 && (
                     <p className="text-sm mt-3 font-medium text-[var(--mosaic-teal)]">✓ Found {uncolorImages.length} uncolor images</p>
                  )}
                </div>
              </div>
              
              {isSubmitting && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
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

              <div className="flex justify-end pr-1">
                <Button 
                  onClick={handleAddSecretsBulk} 
                  disabled={colorImages.length === 0 || uncolorImages.length === 0 || colorImages.length !== uncolorImages.length || isSubmitting}
                  className="bg-neutral-900 text-white whitespace-nowrap"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  {isSubmitting ? 'Uploading & Saving Folders...' : `Upload ${colorImages.length} Pairs`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

        <AlertDialog open={!!secretToDelete} onOpenChange={(open) => !open && setSecretToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this secret pair and remove its images from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteSecret} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </AlertDialogAction>
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

      {showCreateBook && (
        <Card className="bg-neutral-50 shadow-sm border-dashed">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Create New Secret Book</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Book Title</label>
                <Input 
                  type="text" 
                  placeholder="e.g. Animals Volume 1"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setNewBookImage(e.target.files?.[0] || null)} 
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleCreateBook} 
                disabled={!newBookTitle || !newBookImage || isCreatingBook}
                className="bg-[var(--mosaic-teal)] hover:bg-[var(--mosaic-teal)]/90 text-white"
              >
                {isCreatingBook ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {isCreatingBook ? 'Creating...' : 'Create Secret Book'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              </div>
              <CardContent className="p-3 bg-white">
                <p className="text-sm font-semibold text-neutral-900 line-clamp-2">{book.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Secret Book?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete `{bookToDelete?.title}`? This will completely drop the book, its images, and all related records from our servers. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBook} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
