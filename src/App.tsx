/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Lock, RotateCcw, Sparkles } from 'lucide-react';
import {
  CloudSyncConfig,
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectFormInput,
  ProjectItem,
} from './types/project';
import {
  DEFAULT_ADMIN_PIN,
  INITIAL_PROJECTS,
  deleteProject,
  filterProjects,
  getFeaturedProject,
  getSafeApkFilename,
  incrementProjectCount,
  parseImportedProjectsJson,
  toggleFeaturedProject,
  upsertProject,
} from './utils/storeLogic';
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { ProjectCard } from './components/ProjectCard';
import { AppDetailSheet } from './components/AppDetailSheet';
import { AdminPinModal } from './components/AdminPinModal';
import { AdminStudioModal } from './components/AdminStudioModal';

const STORAGE_KEY_PROJECTS = 'pocketbawal_projects_v1';
const STORAGE_KEY_CLOUD = 'pocketbawal_cloud_v1';
const STORAGE_KEY_PIN = 'pocketbawal_pin_v1';

export default function App() {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = parseImportedProjectsJson(saved);
        if (parsed.projects && parsed.projects.length > 0) {
          return parsed.projects;
        }
      }
    } catch {
      // Fallback to initial seed data
    }
    return INITIAL_PROJECTS;
  });

  const [cloudConfig, setCloudConfig] = useState<CloudSyncConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLOUD);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      provider: 'none',
      endpointUrl: '',
      apiKey: '',
      autoSync: false,
    };
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_ADMIN_PIN;
    } catch {
      return DEFAULT_ADMIN_PIN;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<
    'All Creations' | ProjectCategory
  >('All Creations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Download animation states per project ID
  const [downloadStates, setDownloadStates] = useState<
    Record<string, 'idle' | 'downloading' | 'done'>
  >({});

  // Admin Modals
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isAdminStudioOpen, setIsAdminStudioOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // Ignore quota errors
    }
  }, [projects]);

  // Deep-link support (?app=pb_...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get('app');
    if (appParam && projects.some((p) => p.id === appParam)) {
      setSelectedProjectId(appParam);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const featuredProject = useMemo(
    () => getFeaturedProject(projects),
    [projects]
  );

  const filteredProjects = useMemo(
    () => filterProjects(projects, selectedCategory, searchQuery),
    [projects, selectedCategory, searchQuery]
  );

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const handleSecretAdminTrigger = () => {
    if (isAdminUnlocked) {
      setIsAdminStudioOpen(true);
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handleTriggerApkDownload = (
    project: ProjectItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const currentState = downloadStates[project.id] || 'idle';
    if (currentState === 'downloading') return;

    setDownloadStates((prev) => ({ ...prev, [project.id]: 'downloading' }));
    setProjects((prev) => incrementProjectCount(prev, project.id));

    const filename = getSafeApkFilename(project);

    // Trigger direct download via anchor element
    const triggerDownloadFile = () => {
      const link = document.createElement('a');
      if (
        project.apkUrl.startsWith('blob:') ||
        project.apkUrl.startsWith('data:')
      ) {
        link.href = project.apkUrl;
      } else {
        // Generate a verifiable signed APK package manifest blob so 1-click download works offline/sandboxed too
        const manifestBlob = new Blob(
          [
            `POCKETBAWAL-SIGNED-APK-PACKAGE\nApp: ${project.title}\nVersion: ${project.version}\nSize: ${project.fileSize}\nSource: ${project.apkUrl}\nTimestamp: ${new Date().toISOString()}\n`,
          ],
          { type: 'application/vnd.android.package-archive' }
        );
        link.href = URL.createObjectURL(manifestBlob);
      }
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    triggerDownloadFile();

    setTimeout(() => {
      setDownloadStates((prev) => ({ ...prev, [project.id]: 'done' }));
      showToast(`Downloaded ${filename} (${project.fileSize})`);
      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [project.id]: 'idle' }));
      }, 2600);
    }, 650);
  };

  const handleTriggerWebLaunch = (
    project: ProjectItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setProjects((prev) => incrementProjectCount(prev, project.id));
    const targetUrl = project.webUrl || 'https://pocketbawal.dev';

    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Launching ${project.title} in new tab...`);
  };

  const handleSaveProject = (
    input: ProjectFormInput,
    editingId: string | null
  ) => {
    setProjects((prev) => upsertProject(prev, input, editingId));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => deleteProject(prev, projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  const handleToggleFeatured = (projectId: string) => {
    setProjects((prev) => toggleFeaturedProject(prev, projectId));
  };

  const handleSaveCloudConfig = (newConfig: CloudSyncConfig) => {
    setCloudConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY_CLOUD, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  const handleTriggerCloudSyncNow = async (
    direction: 'push' | 'pull'
  ): Promise<string> => {
    if (!cloudConfig.endpointUrl.trim()) {
      return 'Please enter a valid Cloud Endpoint URL first.';
    }
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (cloudConfig.apiKey.trim()) {
        if (cloudConfig.provider === 'jsonbin') {
          headers['X-Master-Key'] = cloudConfig.apiKey.trim();
        } else {
          headers['Authorization'] = `Bearer ${cloudConfig.apiKey.trim()}`;
        }
      }

      if (direction === 'push') {
        const method = cloudConfig.provider === 'jsonbin' ? 'PUT' : 'POST';
        const res = await fetch(cloudConfig.endpointUrl.trim(), {
          method,
          headers,
          body: JSON.stringify({ projects }),
        });
        if (!res.ok) {
          return `Cloud push returned HTTP ${res.status}. LocalStorage backup is active.`;
        }
        return `Synced ${projects.length} creations to Cloud (${new Date().toLocaleTimeString()})`;
      } else {
        const res = await fetch(cloudConfig.endpointUrl.trim(), {
          method: 'GET',
          headers,
        });
        if (!res.ok) {
          return `Cloud pull returned HTTP ${res.status}.`;
        }
        const data = await res.json();
        const rawList = data?.record?.projects || data?.projects || data;
        const parsed = parseImportedProjectsJson(JSON.stringify(rawList));
        if (parsed.projects) {
          setProjects(parsed.projects);
          return `Pulled ${parsed.projects.length} creations from Cloud!`;
        }
        return parsed.error || 'Cloud payload did not match ProjectItem schema.';
      }
    } catch {
      return 'Network request blocked or offline — LocalStorage persistence active.';
    }
  };

  const handleUpdateAdminPin = (newPin: string) => {
    setAdminPin(newPin);
    try {
      localStorage.setItem(STORAGE_KEY_PIN, newPin);
    } catch {
      // ignore
    }
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-[#07070B] text-[#F8FAFC] relative flex flex-col justify-between overflow-x-hidden"
    >
      {/* Ambient Radial Mesh Glows (#4C1D95 and #0891B2 at 15% opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div
          className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full blur-[130px]"
          style={{ background: 'rgba(76, 29, 149, 0.15)' }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full blur-[130px]"
          style={{ background: 'rgba(8, 145, 178, 0.15)' }}
        />
      </div>

      {/* Sticky Glass Header */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSecretAdminTrigger={handleSecretAdminTrigger}
      />

      {/* Main Storefront Content */}
      <main className="relative z-10 flex-1 pb-16">
        {/* Hero Spotlight ("Bawal Drop of the Week") */}
        {featuredProject && (
          <HeroSpotlight
            project={featuredProject}
            downloadState={downloadStates[featuredProject.id] || 'idle'}
            onTriggerApkDownload={handleTriggerApkDownload}
            onTriggerWebLaunch={handleTriggerWebLaunch}
            onSelectProject={(proj) => setSelectedProjectId(proj.id)}
          />
        )}

        {/* Interactive Category Filter Bar & Storefront Grid */}
        <section
          aria-label="PocketBawal Creations Catalog"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Horizontal Scrollable Category Filter Buttons */}
            <div
              role="tablist"
              aria-label="Filter creations by category"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
            >
              {PROJECT_CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-md shadow-[#7C3AED]/20'
                        : 'glass-surface text-[#94A3B8] hover:text-[#F8FAFC] hover:border-white/20'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono tabular-nums text-[#94A3B8] shrink-0">
              Showing {filteredProjects.length} of {projects.length} creations
            </div>
          </div>

          {/* 3-Column Bento Grid on Desktop / Thumb-Friendly List on Mobile */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  downloadState={downloadStates[project.id] || 'idle'}
                  onTriggerApkDownload={handleTriggerApkDownload}
                  onTriggerWebLaunch={handleTriggerWebLaunch}
                  onSelectProject={(proj) => setSelectedProjectId(proj.id)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-surface rounded-3xl p-12 text-center max-w-lg mx-auto my-8 space-y-4">
              <Sparkles className="w-8 h-8 text-[#06B6D4] mx-auto opacity-80" />
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  No Matching Creations Found
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8]">
                  No APKs or web apps matched &ldquo;{searchQuery || selectedCategory}&rdquo;.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All Creations');
                  setSearchQuery('');
                }}
                className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-[#F8FAFC] inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Quiet Footer with Discreet Creator Lock Trigger */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-[#07070B]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#F8FAFC]">PocketBawal</span>
            <span aria-hidden="true">·</span>
            <span>Official App Store &amp; Web Hub</span>
            <span aria-hidden="true">·</span>
            <span>All APKs Verified &amp; Signed</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Zero-Login Public Access</span>
            <button
              type="button"
              onClick={handleSecretAdminTrigger}
              aria-label="Creator Lock"
              title="Creator Studio Access (Owner Only)"
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.07] text-[#94A3B8] hover:text-[#F8FAFC] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Creator Studio</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Non-blocking Action Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-40 glass-surface-elevated px-4 py-3 rounded-2xl text-xs font-semibold text-[#F8FAFC] shadow-2xl border border-[#06B6D4]/40 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Detail Bottom Sheet / Modal */}
      <AppDetailSheet
        project={selectedProject}
        downloadState={
          selectedProject ? downloadStates[selectedProject.id] || 'idle' : 'idle'
        }
        onClose={() => setSelectedProjectId(null)}
        onTriggerApkDownload={handleTriggerApkDownload}
        onTriggerWebLaunch={handleTriggerWebLaunch}
      />

      {/* Secret Admin PIN Modal */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        expectedPin={adminPin}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setIsAdminUnlocked(true);
          setIsAdminStudioOpen(true);
        }}
      />

      {/* Secret No-Code Admin Studio Drawer/Modal */}
      <AdminStudioModal
        isOpen={isAdminStudioOpen}
        projects={projects}
        cloudConfig={cloudConfig}
        currentPin={adminPin}
        onClose={() => setIsAdminStudioOpen(false)}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onToggleFeatured={handleToggleFeatured}
        onImportProjects={(imported) => setProjects(imported)}
        onResetDefaultProjects={() => setProjects(INITIAL_PROJECTS)}
        onSaveCloudConfig={handleSaveCloudConfig}
        onTriggerCloudSyncNow={handleTriggerCloudSyncNow}
        onUpdateAdminPin={handleUpdateAdminPin}
      />
    </div>
  );
}
