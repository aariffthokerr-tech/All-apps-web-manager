import React, { useState } from 'react';
import {
  Check,
  Download,
  ExternalLink,
  Loader2,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { ProjectItem } from '../types/project';
import { SmartImage } from './SmartImage';

interface AppDetailSheetProps {
  project: ProjectItem | null;
  downloadState: 'idle' | 'downloading' | 'done';
  onClose: () => void;
  onTriggerApkDownload: (project: ProjectItem, e: React.MouseEvent) => void;
  onTriggerWebLaunch: (project: ProjectItem, e: React.MouseEvent) => void;
}

export const AppDetailSheet: React.FC<AppDetailSheetProps> = ({
  project,
  downloadState,
  onClose,
  onTriggerApkDownload,
  onTriggerWebLaunch,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!project) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?app=${encodeURIComponent(
      project.id
    )}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-sheet-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-surface-elevated w-full max-w-3xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/15"
      >
        {/* Mobile Drag Handle + Top Bar */}
        <div className="pt-3 px-6 pb-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="w-10 h-1.5 bg-white/20 rounded-full sm:hidden mx-auto absolute left-1/2 -translate-x-1/2 top-2.5" />
          <div className="flex items-center gap-2 text-xs font-medium text-[#10B981]">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Safe &amp; Scanned · Official PocketBawal Build</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close app details"
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* App Header */}
          <div className="flex items-start gap-4 sm:gap-5">
            <SmartImage
              src={project.iconUrl}
              alt={`${project.title} icon`}
              fallbackLabel={project.title}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-lg border border-white/10"
            />
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#06B6D4]">
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#94A3B8]">
                  {project.type === 'apk'
                    ? 'Android APK'
                    : project.type === 'web'
                    ? 'Live Web App'
                    : 'Android APK & Live Web'}
                </span>
              </div>
              <h2
                id="detail-sheet-title"
                className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]"
              >
                {project.title}
              </h2>
              <p className="text-sm text-[#94A3B8]">{project.tagline}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono tabular-nums text-[#94A3B8]">
                <span className="text-[#F8FAFC]">{project.version}</span>
                <span aria-hidden="true">·</span>
                <span>{project.fileSize}</span>
                <span aria-hidden="true">·</span>
                <span>{project.downloads.toLocaleString()} total installs/launches</span>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Screenshots Carousel */}
          {project.screenshots.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold tracking-wider text-[#94A3B8]">
                Preview Gallery ({project.screenshots.length})
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
                {project.screenshots.map((shot, idx) => (
                  <div
                    key={`${project.id}_shot_${idx}`}
                    className="snap-start shrink-0 w-72 sm:w-96 aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0A0D16]"
                  >
                    <SmartImage
                      src={shot}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      fallbackLabel={`${project.title} Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About This Creation */}
          <div className="space-y-2 pt-2 border-t border-white/[0.07]">
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              About this Creation
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* What's New Changelog */}
          {project.changelog && (
            <div className="space-y-2 pt-4 border-t border-white/[0.07]">
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                What&apos;s New ({project.version})
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed font-mono">
                {project.changelog}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-2 pt-4 border-t border-white/[0.07]">
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              Built With Tech Stack
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#06B6D4]">
              {project.techStack.map((tech, idx) => (
                <React.Fragment key={tech}>
                  {idx > 0 && <span aria-hidden="true" className="text-white/20">·</span>}
                  <span>{tech}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="p-4 sm:px-8 sm:py-4 border-t border-white/[0.08] bg-[#0B0D16]/95 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {(project.type === 'apk' || project.type === 'both') && (
              <button
                type="button"
                onClick={(e) => onTriggerApkDownload(project, e)}
                className={`min-h-[46px] px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer flex-1 sm:flex-initial ${
                  downloadState === 'done'
                    ? 'bg-[#10B981] text-[#07070B]'
                    : 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-95'
                }`}
              >
                {downloadState === 'downloading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : downloadState === 'done' ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Downloaded ✓</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Get APK ({project.fileSize})</span>
                  </>
                )}
              </button>
            )}

            {(project.type === 'web' || project.type === 'both') && (
              <button
                type="button"
                onClick={(e) => onTriggerWebLaunch(project, e)}
                className={`min-h-[46px] px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer flex-1 sm:flex-initial ${
                  project.type === 'web'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-95'
                    : 'bg-white/[0.08] hover:bg-white/[0.14] text-[#F8FAFC] border border-white/10'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Web App</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="min-h-[46px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-[#F8FAFC] border border-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981]">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#94A3B8]" />
                <span>Share App Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
