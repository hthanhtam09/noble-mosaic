"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Image as ImageIcon, Link as LinkIcon, MoveVertical } from "lucide-react";
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, Banner } from "@/hooks/api/useBanners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminBannersPage() {
    const { data: banners, isLoading } = useBanners();
    const createMutation = useCreateBanner();
    const updateMutation = useUpdateBanner();
    const deleteMutation = useDeleteBanner();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    // Form State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [link, setLink] = useState("");
    const [order, setOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState(true);

    const resetForm = () => {
        setEditingBanner(null);
        setImageFile(null);
        setImagePreview("");
        setLink("");
        setOrder(0);
        setIsActive(true);
    };

    const handleOpenDialog = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setImagePreview(banner.imageUrl);
            setLink(banner.link || "");
            setOrder(banner.order || 0);
            setIsActive(banner.isActive !== false);
        } else {
            resetForm();
            // Set default order to be after the last one
            if (banners && banners.length > 0) {
                const maxOrder = Math.max(...banners.map((b) => b.order || 0));
                setOrder(maxOrder + 1);
            }
        }
        setIsDialogOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        if (imageFile) {
            formData.append("image", imageFile);
        }
        formData.append("link", link);
        formData.append("order", order.toString());
        formData.append("isActive", isActive.toString());

        if (editingBanner) {
            updateMutation.mutate(
                { id: editingBanner._id, formData },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        resetForm();
                    },
                }
            );
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    resetForm();
                },
            });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-neutral-500">Loading banners...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">Homepage Banners</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage the image slider on the main page</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-neutral-900 hover:bg-neutral-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Banner
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {banners?.map((banner) => (
                    <div
                        key={banner._id}
                        className={`border rounded-xl overflow-hidden bg-white shadow-sm transition-all ${!banner.isActive ? "opacity-60 grayscale-[50%]" : ""
                            }`}
                    >
                        <div className="relative aspect-[21/9] bg-neutral-100 group">
                            <Image
                                src={banner.imageUrl}
                                alt="Banner"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {!banner.isActive && (
                                <div className="absolute top-2 right-2 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded">
                                    Inactive
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 shadow-md"
                                    onClick={() => handleOpenDialog(banner)}
                                >
                                    <Pencil className="h-4 w-4 mr-1.5" /> Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 shadow-md"
                                    onClick={() => handleDelete(banner._id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 space-y-2 text-sm">
                            {banner.link ? (
                                <div className="flex items-center text-neutral-600">
                                    <LinkIcon className="h-4 w-4 mr-2 text-neutral-400 shrink-0" />
                                    <span className="truncate" title={banner.link}>{banner.link}</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-neutral-400 italic">
                                    <LinkIcon className="h-4 w-4 mr-2 shrink-0" />
                                    No link
                                </div>
                            )}

                            <div className="flex items-center text-neutral-600">
                                <MoveVertical className="h-4 w-4 mr-2 text-neutral-400 shrink-0" />
                                <span>Order: {banner.order || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {banners?.length === 0 && (
                    <div className="col-span-full py-12 text-center text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                        <ImageIcon className="h-10 w-10 mx-auto mb-3 text-neutral-400" />
                        <p>No banners added yet.</p>
                        <Button variant="link" onClick={() => handleOpenDialog()} className="mt-2 text-neutral-900">
                            Add your first banner
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingBanner ? "Edit Banner" : "Add Banner"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Image (Desktop aspect ratio: ~21:9)</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                {(imagePreview || editingBanner?.imageUrl) && (
                                    <div className="mt-4 relative aspect-[21/9] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                                        <Image
                                            src={imagePreview || editingBanner!.imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link">Navigation Link (Optional)</Label>
                                <Input
                                    id="link"
                                    placeholder="e.g. /books or https://example.com"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                    />
                                    <p className="text-xs text-neutral-500">Lower numbers appear first</p>
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <Checkbox
                                        id="isActive"
                                        checked={isActive}
                                        onCheckedChange={(checked) => setIsActive(checked as boolean)}
                                    />
                                    <Label htmlFor="isActive" className="cursor-pointer">Active (Visible)</Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={(!imageFile && !editingBanner) || createMutation.isPending || updateMutation.isPending}
                                className="bg-neutral-900 hover:bg-neutral-800"
                            >
                                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
