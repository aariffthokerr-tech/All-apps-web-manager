import React from 'react';
import {
  Check,
  Download,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Github,
  Youtube,
  Instagram,
} from 'lucide-react';
import { ProjectItem } from '../types/project';
import { SmartImage } from './SmartImage';

interface HeroSpotlightProps {
  project: ProjectItem;
  downloadState: 'idle' | 'downloading' | 'done';
  onTriggerApkDownload: (project: ProjectItem, e: React.MouseEvent) => void;
  onTriggerWebLaunch: (project: ProjectItem, e: React.MouseEvent) => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  project,
  downloadState,
  onTriggerApkDownload,
  onTriggerWebLaunch,
  onSelectProject,
}) => {
  const heroBackdrop = project.screenshots[0] || project.iconUrl;
  const isApkPrimary = project.type === 'apk' || project.type === 'both';

  return (
    <section
      aria-label="Bawal Drop of the Week"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4"
    >
      {/* Creator Identity & Social Links Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-white/[0.07]">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#94A3B8]">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-semibold text-[#F8FAFC]">Verified Creator</span>
          <span aria-hidden="true">·</span>
          <span>Official App Store &amp; Web Hub — Built from Scratch, Ready in One Click</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-[#94A3B8]">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PocketBawal on YouTube"
            className="inline-flex items-center gap-1.5 hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
          >
            <Youtube className="w-4 h-4 text-[#06B6D4]" />
            <span>YouTube</span>
          </a>
          <span aria-hidden="true" className="text-white/15">·</span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PocketBawal on Instagram"
            className="inline-flex items-center gap-1.5 hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
          >
            <Instagram className="w-4 h-4 text-[#7C3AED]" />
            <span>Instagram</span>
          </a>
          <span aria-hidden="true" className="text-white/15">·</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PocketBawal on GitHub"
            className="inline-flex items-center gap-1.5 hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
          >
            <Github className="w-4 h-4 text-[#F8FAFC]" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Main Spotlight Card */}
      <div className="glass-surface rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Column: Editorial Spotlight Details */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#06B6D4]">
              <span>Bawal Drop of the Week</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#10B981]">New Release</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#94A3B8]">{project.category}</span>
            </div>

            <div className="flex items-start gap-4 sm:gap-5">
              <SmartImage
                src={project.iconUrl}
                alt={`${project.title} icon`}
                fallbackLabel={project.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 shadow-lg border border-white/10"
              />
              <div className="space-y-1.5 min-w-0">
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F8FAFC]"
                  style={{ textWrap: 'balance' }}
                >
                  {project.title}
                </h1>
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                  {project.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#94A3B8]/90 leading-relaxed line-clamp-2 max-w-2xl">
              {project.description}
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {/* Unboxed Metadata Row with Tabular Numerals */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono tabular-nums text-[#94A3B8]">
              <span className="text-[#F8FAFC] font-medium">{project.version}</span>
              <span aria-hidden="true">·</span>
              <span>{project.fileSize}</span>
              <span aria-hidden="true">·</span>
              <span>{project.downloads.toLocaleString()} downloads</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#10B981]">100% Safe &amp; Scanned</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {isApkPrimary ? (
                <button
                  type="button"
                  onClick={(e) => onTriggerApkDownload(project, e)}
                  className={`min-h-[46px] px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    downloadState === 'done'
                      ? 'bg-[#10B981] text-[#07070B]'
                      : 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-95 text-white shadow-lg shadow-[#7C3AED]/20'
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
                      <span>Download APK ({project.fileSize})</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => onTriggerWebLaunch(project, e)}
                  className="min-h-[46px] px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-95 text-white shadow-lg shadow-[#7C3AED]/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Web App</span>
                </button>
              )}

              {project.type === 'both' && project.webUrl && (
                <button
                  type="button"
                  onClick={(e) => onTriggerWebLaunch(project, e)}
                  className="min-h-[46px] px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] text-[#F8FAFC] border border-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#06B6D4]" />
                  <span>Launch Web</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="min-h-[46px] px-4 py-2.5 rounded-xl font-medium text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Inspect Details &amp; Changelog
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Backdrop Artwork */}
        <div
          onClick={() => onSelectProject(project)}
          role="button"
          tabIndex={0}
          aria-label={`Inspect ${project.title} screenshots and details`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectProject(project);
            }
          }}
          className="lg:col-span-5 relative min-h-[240px] sm:min-h-[280px] lg:h-full overflow-hidden cursor-pointer group border-t lg:border-t-0 lg:border-l border-white/[0.08]"
        >
          <SmartImage
            src={heroBackdrop}
            alt={`${project.title} preview backdrop`}
            fallbackLabel={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070B]/85 via-[#07070B]/20 to-transparent flex items-end p-6">
            <div className="text-xs font-mono text-[#F8FAFC]/90">
              {project.techStack.join(' · ')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
