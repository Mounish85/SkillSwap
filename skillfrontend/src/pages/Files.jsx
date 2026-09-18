import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FileCard from '../components/FileCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export const Files = () => {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Delete modal state
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const loadFiles = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      const res = await api.get('/files');
      if (res.data?.files) {
        setFiles(res.data.files);
      }
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUploadFile = async (fileToUpload) => {
    if (!fileToUpload) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await api.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setToast({
        type: 'success',
        message: `File "${fileToUpload.name}" uploaded to Google Drive!`,
      });

      if (res.data?.file) {
        setFiles((prev) => [res.data.file, ...prev]);
      } else {
        await loadFiles();
      }
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to upload file to Google Drive.';
      setUploadError(msg);
      setToast({ type: 'error', message: msg });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleUploadFile(selected);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleUploadFile(droppedFile);
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/files/${fileToDelete.fileId}`);
      setToast({
        type: 'success',
        message: 'File removed from Google Drive.',
      });
      setFiles((prev) => prev.filter((f) => f.fileId !== fileToDelete.fileId));
      setFileToDelete(null);
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to delete file.';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Accessing cloud file storage..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Resource & File Storage
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Store learning materials, practice exercises, and study notes directly in Google Drive.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            loadingText="Uploading to Drive..."
          >
            ☁️ Upload Learning File
          </Button>
        </div>
      </div>

      {/* Drag and Drop Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`glass-panel p-8 md:p-12 text-center border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-fuchsia-400 bg-fuchsia-500/10 scale-[1.01]'
            : 'border-white/20 hover:border-white/40 hover:bg-white/10'
        }`}
      >
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 mx-auto flex items-center justify-center text-3xl mb-4 text-cyan-300">
          {isUploading ? (
            <svg className="animate-spin h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            '📁'
          )}
        </div>

        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
          {isUploading ? 'Uploading file to Google Drive...' : 'Drag & drop study files here, or browse'}
        </h3>
        <p className="text-xs md:text-sm text-white/50 max-w-md mx-auto">
          Share PDFs, code snippets, presentations, notes, or sample projects with your swap partner.
        </p>

        {uploadError && (
          <p className="mt-4 text-xs font-semibold text-rose-400">
            ⚠️ {uploadError}
          </p>
        )}
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <EmptyState
          title="No files uploaded yet"
          description="Upload resources to easily share knowledge assets during your skill swaps."
          actionText="Upload First File"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              Your Shared Files ({files.length})
            </h3>
            <span className="text-xs text-white/50 font-mono">
              Synced with Google Drive
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <FileCard
                key={file.fileId}
                file={file}
                onDelete={() => setFileToDelete(file)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete File Confirmation Modal */}
      <Modal
        isOpen={Boolean(fileToDelete)}
        onClose={() => setFileToDelete(null)}
        title="Delete Cloud File?"
      >
        <div className="space-y-6">
          <p className="text-white/80">
            Are you sure you want to permanently delete{' '}
            <strong className="text-white font-semibold">{fileToDelete?.fileName}</strong>?
            This will permanently remove the file from Google Drive and unlink it from your SkillSwap account.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setFileToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Yes, Delete File
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Files;

