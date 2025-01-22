'use client';

import { useState } from 'react';

export default function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    
    const formData = new FormData(e.target);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 p-4 rounded-lg border border-gray-700">
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Video Title
            <input
              type="text"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white"
              required
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Video File
            <input
              type="file"
              name="video"
              accept="video/*"
              className="mt-1 block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>

        {uploading && (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </form>
    </div>
  );
}