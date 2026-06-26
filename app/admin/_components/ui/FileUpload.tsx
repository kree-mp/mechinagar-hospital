'use client';

import { useCallback, useRef, useState } from 'react';
import type { CloudinaryFileInput } from '@/lib/validations/cms';

interface FileUploadProps {
  value: CloudinaryFileInput | null;
  onChange: (file: CloudinaryFileInput | null) => void;
  accept?: string;
  folder?: string;
  label?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = 'image/*,application/pdf',
  folder = 'mechinagar-cms',
  label = 'Upload file',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback(
    async (file: File) => {
      setError('');
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', folder);
        const res = await fetch('/api/cms/upload', { method: 'POST', body: fd });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? 'Upload failed');
        }
        const data: CloudinaryFileInput = await res.json();
        onChange(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (value) {
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value.url);
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.url} alt="" className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">{value.publicId.split('/').pop()}</p>
          <p className="text-xs text-gray-400">{(value.bytes / 1024).toFixed(1)} KB · {value.format.toUpperCase()}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
      >
        {uploading ? (
          <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
        <p className="text-xs text-gray-500">{uploading ? 'Uploading…' : label}</p>
        <p className="text-xs text-gray-400">or drag & drop</p>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  );
}
