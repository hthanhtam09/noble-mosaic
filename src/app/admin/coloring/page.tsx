'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Trash2, FolderOpen, ArrowLeft, Upload, Loader2,
  ImageIcon, X, MoreVertical, Pencil, FolderPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColoringFolder {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  order: number;
  isActive: boolean;
  pageCount: number;
  createdAt: string;
}

interface ColoringPage {
  _id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  folder: string;
  order: number;
  createdAt: string;
}

export default function AdminColoringPage() {
  // Folder list state
  const [folders, setFolders] = useState<ColoringFolder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  // Selected folder state
  const [selectedFolder, setSelectedFolder] = useState<ColoringFolder | null>(null);
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  // Create folder dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Edit folder dialog
  const [editingFolder, setEditingFolder] = useState<ColoringFolder | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderDesc, setEditFolderDesc] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deleting state
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    try {
      setIsLoadingFolders(true);
      const res = await fetch('/api/coloring-folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setIsLoadingFolders(false);
    }
  }, []);

  // Fetch pages for selected folder
  const fetchPages = useCallback(async (folderId: string) => {
    try {
      setIsLoadingPages(true);
      const res = await fetch(`/api/coloring-folders/${folderId}`);
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoadingPages(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch('/api/coloring-folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim(), description: newFolderDesc.trim() }),
      });
      if (res.ok) {
        setShowCreateDialog(false);
        setNewFolderName('');
        setNewFolderDesc('');
        await fetchFolders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  // Edit folder
  const handleEditFolder = async () => {
    if (!editingFolder || !editFolderName.trim()) return;
    setIsEditing(true);
    try {
      const res = await fetch(`/api/coloring-folders/${editingFolder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editFolderName.trim(), description: editFolderDesc.trim() }),
      });
      if (res.ok) {
        setEditingFolder(null);
        await fetchFolders();
        // Update selected folder name if editing the currently selected one
        if (selectedFolder?._id === editingFolder._id) {
          setSelectedFolder(prev => prev ? { ...prev, name: editFolderName.trim(), description: editFolderDesc.trim() } : null);
        }
      }
    } catch (error) {
      console.error('Error editing folder:', error);
    } finally {
      setIsEditing(false);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Delete folder "${folderName}" and ALL its images? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/coloring-folders/${folderId}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedFolder?._id === folderId) {
          setSelectedFolder(null);
          setPages([]);
        }
        await fetchFolders();
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  // Select folder
  const handleSelectFolder = async (folder: ColoringFolder) => {
    setSelectedFolder(folder);
    await fetchPages(folder._id);
  };

  // Upload images
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !selectedFolder) return;

    setIsUploading(true);
    setUploadProgress({ uploaded: 0, total: files.length });

    const formData = new FormData();
    formData.append('folder', selectedFolder._id);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/coloring-pages/batch', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadProgress({ uploaded: data.uploaded, total: files.length });
        if (data.errors?.length) {
          alert(`Uploaded ${data.uploaded}/${files.length}. Failed: ${data.errors.join(', ')}`);
        }
        await fetchPages(selectedFolder._id);
        await fetchFolders(); // refresh counts
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Delete page
  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Delete this coloring page? This cannot be undone.')) return;
    setDeletingPageId(pageId);
    try {
      const res = await fetch(`/api/coloring-pages/${pageId}`, { method: 'DELETE' });
      if (res.ok) {
        setPages(prev => prev.filter(p => p._id !== pageId));
        await fetchFolders(); // refresh counts
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setDeletingPageId(null);
    }
  };

  // Go back to folder list
  const handleBack = () => {
    setSelectedFolder(null);
    setPages([]);
  };

  // ===== RENDER =====

  // Dialog overlay for create/edit folder
  const renderDialog = (
    title: string,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: () => void,
    nameValue: string,
    setNameValue: (v: string) => void,
    descValue: string,
    setDescValue: (v: string) => void,
    isSubmitting: boolean,
    submitLabel: string,
  ) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Folder Name *</label>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="e.g. Animal, Car, Mandala..."
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
                rows={3}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 p-5 border-t border-neutral-100">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!nameValue.trim() || isSubmitting}
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

  // Folder detail view (pages grid)
  if (selectedFolder) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-neutral-900">{selectedFolder.name}</h1>
              <p className="text-neutral-500 text-sm mt-0.5">
                {selectedFolder.description || 'No description'} · {pages.length} pages
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading {uploadProgress.uploaded}/{uploadProgress.total}...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Upload progress bar */}
        {isUploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Uploading images... Please wait.
                </p>
                <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.uploaded / uploadProgress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pages Grid */}
        {isLoadingPages ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : pages.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-10 w-10 text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No coloring pages yet</h3>
              <p className="text-neutral-500 mb-6">
                Upload images to start building this collection.
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {pages.map((page) => (
              <div key={page._id} className="group relative">
                <Card className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-[3/4] bg-neutral-100">
                    <Image
                      src={page.imageUrl}
                      alt={page.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                    {/* Delete overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all"
                        onClick={() => handleDeletePage(page._id)}
                        disabled={deletingPageId === page._id}
                      >
                        {deletingPageId === page._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-2">
                    <p className="text-xs text-neutral-600 truncate">{page.title}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ===== FOLDER LIST VIEW =====
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Free Coloring Pages</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage coloring page collections by folder</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-neutral-900 hover:bg-neutral-800 text-white"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">Total Folders</p>
            <p className="text-2xl font-bold text-neutral-900">{folders.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">Total Pages</p>
            <p className="text-2xl font-bold text-neutral-900">
              {folders.reduce((sum, f) => sum + f.pageCount, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Folders Grid */}
      {isLoadingFolders ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : folders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-10 w-10 text-neutral-300" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No folders yet</h3>
            <p className="text-neutral-500 mb-6">
              Create your first folder to start organizing coloring pages.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Create First Folder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <Card
              key={folder._id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleSelectFolder(folder)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 group-hover:text-purple-700 transition-colors">
                        {folder.name}
                      </h3>
                      {folder.description && (
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{folder.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-600">
                      {folder.pageCount} pages
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => {
                          setEditingFolder(folder);
                          setEditFolderName(folder.name);
                          setEditFolderDesc(folder.description || '');
                        }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Folder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteFolder(folder._id, folder.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Folder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Folder Dialog */}
      {renderDialog(
        'Create New Folder',
        showCreateDialog,
        () => { setShowCreateDialog(false); setNewFolderName(''); setNewFolderDesc(''); },
        handleCreateFolder,
        newFolderName,
        setNewFolderName,
        newFolderDesc,
        setNewFolderDesc,
        isCreating,
        'Create Folder',
      )}

      {/* Edit Folder Dialog */}
      {renderDialog(
        'Edit Folder',
        !!editingFolder,
        () => setEditingFolder(null),
        handleEditFolder,
        editFolderName,
        setEditFolderName,
        editFolderDesc,
        setEditFolderDesc,
        isEditing,
        'Save Changes',
      )}
    </div>
  );
}
