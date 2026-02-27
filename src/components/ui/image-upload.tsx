'use client';

/**
 * ImageUpload Component
 *
 * Reusable file upload input for admin forms.
 * Uploads images to Supabase Storage and returns the public URL.
 *
 * FEATURES:
 * - Drag & drop or click to select
 * - Shows preview of selected/uploaded image
 * - Progress indicator during upload
 * - Accepts jpg, png, webp, svg, gif
 * - Max file size: 5MB
 * - Silver luxury design
 *
 * USAGE:
 *   <ImageUpload
 *     value={form.image}
 *     onChange={(url) => setForm({ ...form, image: url })}
 *     bucket="images"
 *     folder="products"
 *   />
 */

import { useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
    label?: string;
    required?: boolean;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

export function ImageUpload({
    value,
    onChange,
    bucket = 'images',
    folder = 'uploads',
    label = 'الصورة',
    required = false,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const uploadFile = useCallback(async (file: File) => {
        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('نوع الملف غير مدعوم. استخدم JPG, PNG, WEBP, SVG, أو GIF');
            return;
        }

        // Validate size
        if (file.size > MAX_SIZE) {
            setError('حجم الملف يتجاوز 10MB');
            return;
        }

        setError('');
        setUploading(true);

        try {
            // Generate unique filename
            const ext = file.name.split('.').pop() || 'png';
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                console.error('[Upload] Error:', uploadError);
                setError('فشل رفع الصورة: ' + uploadError.message);
                setUploading(false);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl);
        } catch (err) {
            console.error('[Upload] Unexpected error:', err);
            setError('حدث خطأ غير متوقع');
        }

        setUploading(false);
    }, [bucket, folder, onChange, supabase]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const clearImage = () => {
        onChange('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs text-ultra-silver-muted mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>

            {value ? (
                /* Preview */
                <div className="relative group">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-ultra-surface border border-ultra-border">
                        <Image src={value} alt="Preview" fill className="object-cover" />
                    </div>
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-ultra-bg/80 backdrop-blur-sm text-ultra-silver-muted hover:text-ultra-silver-bright transition-all opacity-0 group-hover:opacity-100"
                    >
                        <X size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-ultra-bg/80 backdrop-blur-sm text-xs text-ultra-silver-muted hover:text-ultra-silver-bright transition-all opacity-0 group-hover:opacity-100"
                    >
                        تغيير
                    </button>
                </div>
            ) : (
                /* Upload Zone */
                <div
                    onClick={() => !uploading && inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        flex flex-col items-center justify-center gap-2 p-6
                        border-2 border-dashed rounded-xl cursor-pointer
                        transition-all duration-ultra
                        ${dragActive
                            ? 'border-ultra-silver-muted bg-ultra-surface/50'
                            : 'border-ultra-border bg-ultra-surface hover:border-ultra-silver-dark hover:bg-ultra-surface/80'
                        }
                        ${uploading ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    {uploading ? (
                        <>
                            <Loader2 size={28} className="text-ultra-silver-muted animate-spin" />
                            <p className="text-xs text-ultra-silver-muted">جاري الرفع...</p>
                        </>
                    ) : (
                        <>
                            {dragActive ? (
                                <Upload size={28} className="text-ultra-silver-bright" />
                            ) : (
                                <ImageIcon size={28} className="text-ultra-silver-dark" />
                            )}
                            <p className="text-xs text-ultra-silver-muted text-center">
                                اسحب الصورة هنا أو <span className="text-ultra-silver-bright">اضغط للاختيار</span>
                            </p>
                            <p className="text-[10px] text-ultra-silver-dark">
                                JPG, PNG, WEBP, SVG — حد أقصى 5MB
                            </p>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
