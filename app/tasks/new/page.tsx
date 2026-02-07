'use client';

import Link from 'next/link';
import CreateTaskForm from '@/components/CreateTaskForm';

export default function NewTaskPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8">
          <Link 
            href="/" 
            className="font-mono text-xs text-text-muted tracking-wider uppercase hover:text-cyan transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Command
          </Link>
          <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-xs text-cyan tracking-wider uppercase">
            Deploy Task
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan to-magenta rounded-full" />
            <h1 className="font-display text-3xl font-bold tracking-wider text-text-primary">
              DEPLOY NEW TASK
            </h1>
          </div>
          <p className="font-body text-text-secondary ml-5">
            Initialize a new mission for the Growth Crew. Tasks enter the backlog by default.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface/90 to-deep/90 backdrop-blur-xl" />
          
          {/* Border */}
          <div className="absolute inset-0 rounded-2xl border border-elevated/50" />
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan/50 via-violet/50 to-magenta/50" />
          
          {/* Content */}
          <div className="relative p-8">
            <CreateTaskForm />
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan/20 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-violet/20 rounded-bl-xl pointer-events-none" />
        </div>
        
        {/* Decorative background elements */}
        <div className="fixed top-1/4 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-1/4 w-80 h-80 bg-violet/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
