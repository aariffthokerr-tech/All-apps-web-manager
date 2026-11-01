import React from 'react';
import { Check, Download, ExternalLink, Loader2 } from 'lucide-react';
import { ProjectItem } from '../types/project';
import { SmartImage } from './SmartImage';

interface ProjectCardProps {
  project: ProjectItem;
  downloadState: 'idle' | 'downloading' | 'done';
  onTriggerApkDownload: (project: ProjectItem, e: React.MouseEvent) => void;
  onTriggerWebLaunch: (project: ProjectItem, e: React.MouseEvent) => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  downloadState,
  onTriggerApkDownload,
  onTriggerWebLaunch,
  onSelectProject,
}) => {
  const typeLabel =
    project.type === 'apk'
      ? 'APK'
      : project.type === 'web'
      ? 'WEB'
      : 'APK · WEB';

  return (
    <article
      onClick={() => onSelectProject(project)}
      className="glass-surface rounded-2xl p-5 flex flex-col justify-between gap-5 hover:-translate-y-0.5 hover:border-white/20 transition-all duration-150 cursor-pointer group"
    >
      {/* Top Row: 64x64 Squircle Icon + Title + Category/Type Kicker */}
      <div className="space-y-3.5">
        <div className="flex items-start gap-4">
          <SmartImage
            src={project.iconUrl}
            alt={`${project.title} icon`}
            fallbackLabel={project.title}
            className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-md border border-white/10"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8]">
              <span
                className={
                  project.type === 'apk' || project.type === 'both'
                    ? 'text-[#10B981] font-semibold'
                    : 'text-[#06B6D4] font-semibold'
                }
              >
                {typeLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{project.category}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors truncate">
              {project.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] line-clamp-1">
              {project.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Metadata + 1-Click Execution CTA */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono tabular-nums text-[#94A3B8] min-w-0">
          <span className="text-[#F8FAFC]/90 shrink-0">{project.version}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0">{project.fileSize}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0" title="Total Downloads / Launches">
            {project.downloads.toLocaleString()}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {project.type === 'apk' && (
            <button
              type="button"
              onClick={(e) => onTriggerApkDownload(project, e)}
              aria-label={`Get APK for ${project.title}`}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                downloadState === 'done'
                  ? 'bg-[#10B981] text-[#07070B]'
                  : 'bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-[#07070B] border border-[#10B981]/30'
              }`}
            >
              {downloadState === 'downloading' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : downloadState === 'done' ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Downloaded ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get APK</span>
                </>
              )}
            </button>
          )}

          {project.type === 'web' && (
            <button
              type="button"
              onClick={(e) => onTriggerWebLaunch(project, e)}
              aria-label={`Launch App ${project.title}`}
              className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 bg-[#06B6D4]/15 hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#07070B] border border-[#06B6D4]/30 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch App</span>
            </button>
          )}

          {project.type === 'both' && (
            <>
              <button
                type="button"
                onClick={(e) => onTriggerApkDownload(project, e)}
                aria-label={`Get APK for ${project.title}`}
                className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  downloadState === 'done'
                    ? 'bg-[#10B981] text-[#07070B]'
                    : 'bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-[#07070B] border border-[#10B981]/30'
                }`}
              >
                {downloadState === 'downloading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : downloadState === 'done' ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Downloaded ✓</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Get APK</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => onTriggerWebLaunch(project, e)}
                aria-label={`Launch Web version of ${project.title}`}
                title="Launch Live Web App"
                className="min-h-[40px] px-2.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1 bg-white/[0.06] hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#07070B] border border-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Web</span>
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
