import React from 'react';
import Button from './Button';

export const FileCard = ({ file, onDelete, isDeleting = false }) => {
  const { fileId, fileName, fileType, uploadedAt, driveUrl } = file;

  const formattedDate = uploadedAt
    ? new Date(uploadedAt).toLocaleDateString(undefined, {
        dateStyle: 'medium',
      })
    : 'Unknown date';

  // Get file type icon
  const getFileIcon = (type) => {
    if (type?.includes('image')) return '🖼️';
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('zip') || type?.includes('tar')) return '📦';
    if (type?.includes('audio')) return '🎵';
    if (type?.includes('video')) return '🎬';
    if (type?.includes('text')) return '📝';
    return '📁';
  };

  return (
    <div className="glass-panel p-6 flex flex-col justify-between hover:border-white/30 transition-all duration-300">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 border border-white/10 flex items-center justify-center text-2xl shrink-0">
            {getFileIcon(fileType)}
          </div>
          <div className="min-w-0 flex-1">
            <h4
              className="text-base font-bold text-white truncate hover:text-fuchsia-300 transition-colors"
              title={fileName}
            >
              {fileName}
            </h4>
            <p className="text-xs text-white/50 truncate font-mono mt-0.5">
              {fileType || 'binary/octet-stream'}
            </p>
          </div>
        </div>

        <p className="text-xs text-white/40 mb-4">
          Uploaded on {formattedDate}
        </p>
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center gap-3">
        {driveUrl ? (
          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" variant="secondary" className="w-full">
              ↗ View on Drive
            </Button>
          </a>
        ) : (
          <Button size="sm" variant="secondary" disabled className="flex-1">
            Drive link unavailable
          </Button>
        )}

        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete && onDelete(fileId)}
          disabled={isDeleting}
          aria-label={`Delete ${fileName}`}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};

export default FileCard;

