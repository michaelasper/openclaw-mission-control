'use client';

import { useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface DeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null;
  filename: string;
  filepath: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function DeliverableModal({
  isOpen,
  onClose,
  content,
  filename,
  filepath,
  loading = false,
  error = null,
  onRetry,
}: DeliverableModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Add/remove event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="modal-backdrop absolute inset-0 bg-void/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal-container relative w-[92vw] h-[90vh] max-w-6xl flex flex-col rounded-2xl overflow-hidden">
        {/* Glass background with gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface/95 to-deep/95 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-2xl border border-cyan/20" />
        
        {/* Top accent glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
        <div className="absolute top-0 left-1/4 right-1/4 h-24 bg-cyan/5 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-8 py-5 border-b border-elevated/30">
          <div className="flex items-center gap-4">
            {/* Document icon */}
            <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <div>
              <h2 className="font-display text-lg font-semibold tracking-wide text-text-primary">
                {filename}
              </h2>
              <p className="font-mono text-xs text-text-muted tracking-wider mt-0.5">
                {filepath}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="group p-2 rounded-xl hover:bg-elevated/50 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-text-muted group-hover:text-text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content area */}
        <div className="relative flex-1 overflow-y-auto modal-scroll">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="cyber-spinner mb-6" />
              <p className="font-mono text-sm text-cyan tracking-wider uppercase animate-pulse">
                Loading Document
              </p>
              <p className="font-mono text-xs text-text-muted mt-2">
                Fetching content...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-20 h-20 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Failed to Load
              </h3>
              <p className="font-body text-text-secondary mb-2">{error}</p>
              <p className="font-mono text-xs text-text-muted mb-6">Path: {filepath}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-6 py-3 rounded-xl btn-glow text-void font-mono text-sm tracking-wider uppercase"
                >
                  Retry
                </button>
              )}
            </div>
          ) : content ? (
            <div className="px-8 py-10 lg:px-16 lg:py-12">
              {/* Reading-optimized markdown */}
              <article className="prose-reading">
                <ReactMarkdown>{content}</ReactMarkdown>
              </article>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-xl bg-elevated/50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-mono text-sm text-text-muted">No content available</p>
            </div>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="relative px-8 py-3 border-t border-elevated/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 font-mono text-[10px] text-text-muted tracking-wider uppercase">
              <kbd className="px-2 py-1 rounded bg-elevated/50 border border-elevated/50 text-text-secondary">
                ESC
              </kbd>
              to close
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-[10px] text-success tracking-wider uppercase">
              Deliverable
            </span>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 right-16 w-12 h-12 border-t border-r border-cyan/10 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-12 left-4 w-12 h-12 border-b border-l border-violet/10 rounded-bl-xl pointer-events-none" />
      </div>
    </div>
  );
}
