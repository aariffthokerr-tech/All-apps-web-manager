import React, { useState } from 'react';
import {
  Check,
  Cloud,
  Download,
  Edit3,
  FolderPlus,
  Layers,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  CloudSyncConfig,
  ProjectCategory,
  ProjectFormInput,
  ProjectItem,
  ProjectType,
} from '../types/project';
import { DEFAULT_ICONS, DEFAULT_SCREENSHOTS } from '../utils/svgAssets';
import {
  parseImportedProjectsJson,
  validateProjectInput,
} from '../utils/storeLogic';
import { SmartImage } from './SmartImage';

interface AdminStudioModalProps {
  isOpen: boolean;
  projects: ProjectItem[];
  cloudConfig: CloudSyncConfig;
  currentPin: string;
  onClose: () => void;
  onSaveProject: (input: ProjectFormInput, editingId: string | null) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleFeatured: (projectId: string) => void;
  onImportProjects: (projects: ProjectItem[]) => void;
  onResetDefaultProjects: () => void;
  onSaveCloudConfig: (config: CloudSyncConfig) => void;
  onTriggerCloudSyncNow: (direction: 'push' | 'pull') => Promise<string>;
  onUpdateAdminPin: (newPin: string) => void;
}

const EMPTY_FORM: ProjectFormInput = {
  title: '',
  tagline: '',
  description: '',
  changelog: '',
  type: 'apk',
  category: 'Android APKs',
  iconUrl: '',
  screenshots: [],
  apkUrl: '',
  webUrl: '',
  version: 'v1.0.0',
  fileSize: '15.0 MB',
  techStack: ['Kotlin', 'Android'],
  isFeatured: false,
};

export const AdminStudioModal: React.FC<AdminStudioModalProps> = ({
  isOpen,
  projects,
  cloudConfig,
  currentPin,
  onClose,
  onSaveProject,
  onDeleteProject,
  onToggleFeatured,
  onImportProjects,
  onResetDefaultProjects,
  onSaveCloudConfig,
  onTriggerCloudSyncNow,
  onUpdateAdminPin,
}) => {
  const [activeTab, setActiveTab] = useState<'publish' | 'manage' | 'cloud'>(
    'publish'
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormInput>(EMPTY_FORM);
  const [techInput, setTechInput] = useState('Kotlin, Android');
  const [screenshotUrlInput, setScreenshotUrlInput] = useState('');
  const [formError, setFormError] = useState('');
  const [statusBanner, setStatusBanner] = useState('');

  // Cloud & Backup state
  const [localCloud, setLocalCloud] = useState<CloudSyncConfig>(cloudConfig);
  const [importJsonText, setImportJsonText] = useState('');
  const [newPinInput, setNewPinInput] = useState(currentPin);
  const [syncMessage, setSyncMessage] = useState('');

  if (!isOpen) return null;

  const showStatus = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(''), 3200);
  };

  const handleStartEdit = (project: ProjectItem) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      changelog: project.changelog || '',
      type: project.type,
      category: project.category,
      iconUrl: project.iconUrl,
      screenshots: [...project.screenshots],
      apkUrl: project.apkUrl,
      webUrl: project.webUrl,
      version: project.version,
      fileSize: project.fileSize,
      techStack: [...project.techStack],
      isFeatured: project.isFeatured,
    });
    setTechInput(project.techStack.join(', '));
    setFormError('');
    setActiveTab('publish');
  };

  const handleResetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTechInput('Kotlin, Android');
    setScreenshotUrlInput('');
    setFormError('');
  };

  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'icon' | 'screenshot'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        if (!result) return;
        if (target === 'icon') {
          setForm((prev) => ({ ...prev, iconUrl: result }));
        } else {
          setForm((prev) => ({
            ...prev,
            screenshots: [...prev.screenshots, result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleApkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const objectUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      apkUrl: objectUrl,
      fileSize: `${sizeMb} MB`,
    }));
    showStatus(`Attached ${file.name} (${sizeMb} MB)`);
    e.target.value = '';
  };

  const handleAddScreenshotUrl = () => {
    if (!screenshotUrlInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, screenshotUrlInput.trim()],
    }));
    setScreenshotUrlInput('');
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedStack = techInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: ProjectFormInput = {
      ...form,
      techStack: parsedStack.length > 0 ? parsedStack : ['Kotlin'],
      iconUrl: form.iconUrl.trim() || DEFAULT_ICONS.wallpaper3d,
      screenshots:
        form.screenshots.length > 0
          ? form.screenshots
          : [DEFAULT_SCREENSHOTS.wallpaperHero1],
    };

    const validation = validateProjectInput(payload);
    if (!validation.valid) {
      setFormError(validation.error || 'Please check required fields.');
      return;
    }

    onSaveProject(payload, editingId);
    showStatus(
      editingId
        ? `Updated "${payload.title}" in PocketBawal!`
        : `Published "${payload.title}" to PocketBawal!`
    );
    handleResetForm();
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pocketbawal-store-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showStatus('Exported PocketBawal JSON backup!');
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      const parsed = parseImportedProjectsJson(content);
      if (parsed.error || !parsed.projects) {
        setSyncMessage(parsed.error || 'Failed to import JSON.');
      } else {
        onImportProjects(parsed.projects);
        setSyncMessage(
          `Successfully imported ${parsed.projects.length} creations!`
        );
        showStatus(`Imported ${parsed.projects.length} creations!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportFromTextarea = () => {
    const parsed = parseImportedProjectsJson(importJsonText);
    if (parsed.error || !parsed.projects) {
      setSyncMessage(parsed.error || 'Invalid JSON.');
      return;
    }
    onImportProjects(parsed.projects);
    setImportJsonText('');
    setSyncMessage(`Imported ${parsed.projects.length} creations from JSON!`);
    showStatus(`Imported ${parsed.projects.length} creations!`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-studio-heading"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-surface-elevated w-full max-w-4xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden border border-white/15 shadow-2xl"
      >
        {/* Studio Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2
              id="creator-studio-heading"
              className="text-lg sm:text-xl font-extrabold text-[#F8FAFC]"
            >
              PocketBawal No-Code Creator Studio
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Publish APKs, launch web hubs, and manage cloud sync without touching source code
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Creator Studio"
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.08] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-[#090B14] border-b border-white/[0.08] flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('publish')}
              className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'publish'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-white/[0.04]'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>{editingId ? 'Edit Creation' : 'Publish Creation'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-white/[0.04]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Manage Creations ({projects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cloud')}
              className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'cloud'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-white/[0.04]'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Cloud Database &amp; Backup</span>
            </button>
          </div>

          {statusBanner && (
            <div
              role="status"
              className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>{statusBanner}</span>
            </div>
          )}
        </div>

        {/* Studio Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ADD / EDIT PROJECT FORM */}
          {activeTab === 'publish' && (
            <form onSubmit={handlePublishSubmit} className="space-y-6">
              {editingId && (
                <div className="p-3.5 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-[#F8FAFC]">
                    Editing existing project: {form.title}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs font-semibold text-[#06B6D4] hover:underline cursor-pointer"
                  >
                    Switch to New Project
                  </button>
                </div>
              )}

              {formError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs font-semibold text-rose-300"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="proj-title"
                    className="block text-xs font-semibold text-[#94A3B8]"
                  >
                    Project Title *
                  </label>
                  <input
                    id="proj-title"
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g., Bawal Shader Engine Pro"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B12] border border-white/15 text-sm text-[#F8FAFC] focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="proj-tagline"
                      className="block text-xs font-semibold text-[#94A3B8]"
                    >
                      Short Tagline *
                    </label>
                    <span className="text-[11px] font-mono tabular-nums text-[#94A3B8]">
                      {form.tagline.length}/80
                    </span>
                  </div>
                  <input
                    id="proj-tagline"
                    type="text"
                    maxLength={80}
                    value={form.tagline}
                    onChange={(e) =>
                      setForm({ ...form, tagline: e.target.value })
                    }
                    placeholder="1-line punchy hook (max 80 chars)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B12] border border-white/15 text-sm text-[#F8FAFC] focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>
              </div>

              {/* Project Type Segmented Selector & Category Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-[#94A3B8]">
                    Project Type *
                  </span>
                  <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#090B12] border border-white/10">
                    {(
                      [
                        { id: 'apk', label: 'Android APK' },
                        { id: 'web', label: 'Live Website' },
                        { id: 'both', label: 'Both' },
                      ] as { id: ProjectType; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            type: opt.id,
                            fileSize:
                              opt.id === 'web'
                                ? 'Cloud'
                                : form.fileSize === 'Cloud'
                                ? '14.5 MB'
                                : form.fileSize,
                          })
                        }
                        className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                          form.type === opt.id
                            ? 'bg-[#7C3AED] text-white'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="proj-category"
                    className="block text-xs font-semibold text-[#94A3B8]"
                  >
                    Store Category *
                  </label>
                  <select
                    id="proj-category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B12] border border-white/15 text-sm text-[#F8FAFC] focus:border-[#06B6D4] focus:outline-none"
                  >
                    <option value="Android APKs">Android APKs</option>
                    <option value="Web Apps">Web Apps</option>
                    <option value="AI Tools">AI Tools</option>
                    <option value="Games">Games</option>
                  </select>
                </div>
              </div>

              {/* Conditional APK Source Fields */}
              {(form.type === 'apk' || form.type === 'both') && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#10B981]">
                      Android APK Package Configuration
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06B6D4] hover:underline cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload .APK File from Device</span>
                      <input
                        type="file"
                        accept=".apk,application/vnd.android.package-archive"
                        onChange={handleApkFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label
                        htmlFor="proj-apk-url"
                        className="block text-xs text-[#94A3B8]"
                      >
                        Direct APK Download URL *
                      </label>
                      <input
                        id="proj-apk-url"
                        type="text"
                        value={form.apkUrl}
                        onChange={(e) =>
                          setForm({ ...form, apkUrl: e.target.value })
                        }
                        placeholder="https://github.com/.../app-release.apk"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label
                          htmlFor="proj-version"
                          className="block text-xs text-[#94A3B8]"
                        >
                          Version
                        </label>
                        <input
                          id="proj-version"
                          type="text"
                          value={form.version}
                          onChange={(e) =>
                            setForm({ ...form, version: e.target.value })
                          }
                          placeholder="v1.0.0"
                          className="w-full px-3 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="proj-size"
                          className="block text-xs text-[#94A3B8]"
                        >
                          File Size
                        </label>
                        <input
                          id="proj-size"
                          type="text"
                          value={form.fileSize}
                          onChange={(e) =>
                            setForm({ ...form, fileSize: e.target.value })
                          }
                          placeholder="18.2 MB"
                          className="w-full px-3 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Website URL Field */}
              {(form.type === 'web' || form.type === 'both') && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <span className="block text-xs font-bold text-[#06B6D4]">
                    Live Web Application Configuration
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label
                        htmlFor="proj-web-url"
                        className="block text-xs text-[#94A3B8]"
                      >
                        Live Website URL (https://) *
                      </label>
                      <input
                        id="proj-web-url"
                        type="url"
                        value={form.webUrl}
                        onChange={(e) =>
                          setForm({ ...form, webUrl: e.target.value })
                        }
                        placeholder="https://my-web-app.pocketbawal.dev"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                      />
                    </div>
                    {form.type === 'web' && (
                      <div className="space-y-1">
                        <label
                          htmlFor="proj-web-version"
                          className="block text-xs text-[#94A3B8]"
                        >
                          Release Version
                        </label>
                        <input
                          id="proj-web-version"
                          type="text"
                          value={form.version}
                          onChange={(e) =>
                            setForm({ ...form, version: e.target.value })
                          }
                          placeholder="v1.0.0"
                          className="w-full px-3 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Description & Changelog */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="proj-desc"
                    className="block text-xs font-semibold text-[#94A3B8]"
                  >
                    Full Description *
                  </label>
                  <textarea
                    id="proj-desc"
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Explain key features, architecture, and device requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B12] border border-white/15 text-sm text-[#F8FAFC] focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="proj-changelog"
                    className="block text-xs font-semibold text-[#94A3B8]"
                  >
                    What&apos;s New / Changelog
                  </label>
                  <textarea
                    id="proj-changelog"
                    rows={3}
                    value={form.changelog}
                    onChange={(e) =>
                      setForm({ ...form, changelog: e.target.value })
                    }
                    placeholder="v1.0.0 — Added AMOLED dark theme and 120Hz touch support..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B12] border border-white/15 text-sm text-[#F8FAFC] focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>
              </div>

              {/* App Icon & Screenshots Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Icon Uploader */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="proj-icon-url"
                      className="text-xs font-semibold text-[#94A3B8]"
                    >
                      App Squircle Icon (URL or Gallery)
                    </label>
                    <label className="inline-flex items-center gap-1 text-xs font-semibold text-[#06B6D4] hover:underline cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'icon')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <SmartImage
                      src={form.iconUrl || DEFAULT_ICONS.wallpaper3d}
                      alt="Icon preview"
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <input
                      id="proj-icon-url"
                      type="text"
                      value={form.iconUrl}
                      onChange={(e) =>
                        setForm({ ...form, iconUrl: e.target.value })
                      }
                      placeholder="Paste image URL or upload from gallery"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Screenshots Manager */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="proj-screenshot-url"
                      className="text-xs font-semibold text-[#94A3B8]"
                    >
                      Screenshots ({form.screenshots.length})
                    </label>
                    <label className="inline-flex items-center gap-1 text-xs font-semibold text-[#06B6D4] hover:underline cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Screenshots</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageFileUpload(e, 'screenshot')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="proj-screenshot-url"
                      type="text"
                      value={screenshotUrlInput}
                      onChange={(e) => setScreenshotUrlInput(e.target.value)}
                      placeholder="Paste screenshot URL..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddScreenshotUrl}
                      aria-label="Add screenshot URL"
                      className="min-h-[38px] px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-[#F8FAFC] inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                  {form.screenshots.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pt-1">
                      {form.screenshots.map((shot, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-10 rounded-lg overflow-hidden border border-white/15 shrink-0 group"
                        >
                          <SmartImage
                            src={shot}
                            alt={`Screenshot ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                screenshots: prev.screenshots.filter(
                                  (_, i) => i !== idx
                                ),
                              }))
                            }
                            aria-label={`Remove screenshot ${idx + 1}`}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center pt-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="proj-tech"
                    className="block text-xs font-semibold text-[#94A3B8]"
                  >
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    id="proj-tech"
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Kotlin, OpenGL, AI, WebView"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] font-mono focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer select-none mt-2 sm:mt-5">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#7C3AED] rounded"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#F8FAFC]">
                      Set as &ldquo;Bawal Drop of the Week&rdquo; Hero Spotlight
                    </span>
                    <span className="block text-[11px] text-[#94A3B8]">
                      Features this creation at the top of the public storefront
                    </span>
                  </div>
                </label>
              </div>

              {/* Sticky Submit Button Bar */}
              <div className="sticky -bottom-6 sm:-bottom-8 -mx-6 sm:-mx-8 px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-[#0B0D16]/95 backdrop-blur-md flex items-center justify-between gap-3">
                <span className="text-xs text-[#94A3B8]">
                  Instant zero-code publishing to live storefront
                </span>
                <div className="flex items-center gap-3">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="min-h-[44px] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-[#7C3AED]/25 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Publish to PocketBawal
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: MANAGE EXISTING CREATIONS */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#94A3B8]">
                  Click the star icon to set the Hero Spotlight, or edit/delete any creation.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('publish');
                  }}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#7C3AED]/20 text-[#06B6D4] border border-[#7C3AED]/40 hover:bg-[#7C3AED]/30 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Creation</span>
                </button>
              </div>

              <div className="divide-y divide-white/[0.07] border border-white/10 rounded-2xl overflow-hidden bg-[#090B12]">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <SmartImage
                        src={item.iconUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#F8FAFC] truncate">
                            {item.title}
                          </span>
                          {item.isFeatured && (
                            <span className="text-[11px] font-mono text-[#06B6D4]">
                              · Featured Drop
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono tabular-nums text-[#94A3B8]">
                          {item.category} · {item.version} · {item.fileSize} ·{' '}
                          {item.downloads.toLocaleString()} installs
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(item.id)}
                        aria-label={`Set ${item.title} as Featured Drop`}
                        title="Set as Hero Featured Drop"
                        className={`min-h-[38px] min-w-[38px] rounded-xl inline-flex items-center justify-center border transition-colors cursor-pointer ${
                          item.isFeatured
                            ? 'bg-[#7C3AED]/25 border-[#7C3AED] text-[#06B6D4]'
                            : 'bg-white/[0.04] border-white/10 text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            item.isFeatured ? 'fill-current' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        aria-label={`Edit ${item.title}`}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-[#F8FAFC] border border-white/10 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onDeleteProject(item.id);
                          showStatus(`Deleted "${item.title}"`);
                        }}
                        aria-label={`Delete ${item.title}`}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/25 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD DATABASE & JSON BACKUP */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              {/* 1-Click JSON Export & Import */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">
                      1-Click LocalStorage &amp; JSON Snapshot Backup
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      All creations automatically persist in LocalStorage. Export or import your entire catalog as a portable JSON file anytime.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-[#07070B] border border-[#10B981]/30 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Store JSON</span>
                    </button>

                    <label className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#06B6D4]/15 hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#07070B] border border-[#06B6D4]/30 inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import JSON File</span>
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleImportJsonFile}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        onResetDefaultProjects();
                        showStatus('Restored default PocketBawal catalog');
                      }}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/10 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label
                    htmlFor="raw-json-import"
                    className="block text-xs text-[#94A3B8]"
                  >
                    Or paste raw ProjectItem[] JSON array directly:
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="raw-json-import"
                      type="text"
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder='[{"id":"pb_1","title":"My App",...}]'
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs font-mono text-[#F8FAFC] focus:border-[#06B6D4] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleImportFromTextarea}
                      className="min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-[#F8FAFC] shrink-0 cursor-pointer"
                    >
                      Load JSON
                    </button>
                  </div>
                </div>
              </div>

              {/* Cloud Database Sync Config (Firebase / Supabase / JSONBin) */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">
                    Cloud Database Config (Firebase / Supabase / JSONBin)
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Optionally connect your live cloud endpoint so newly published APKs and Web Apps sync globally across all visitor devices in real time.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="cloud-provider"
                      className="block text-xs text-[#94A3B8]"
                    >
                      Cloud Provider
                    </label>
                    <select
                      id="cloud-provider"
                      value={localCloud.provider}
                      onChange={(e) =>
                        setLocalCloud({
                          ...localCloud,
                          provider: e.target
                            .value as CloudSyncConfig['provider'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B12] border border-white/15 text-xs sm:text-sm text-[#F8FAFC]"
                    >
                      <option value="none">LocalStorage Only (Default)</option>
                      <option value="jsonbin">JSONBin.io v3 Bin</option>
                      <option value="firebase">Firebase Realtime DB REST</option>
                      <option value="supabase">Supabase REST Endpoint</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="cloud-endpoint"
                      className="block text-xs text-[#94A3B8]"
                    >
                      Cloud Endpoint / Bin URL
                    </label>
                    <input
                      id="cloud-endpoint"
                      type="text"
                      value={localCloud.endpointUrl}
                      onChange={(e) =>
                        setLocalCloud({
                          ...localCloud,
                          endpointUrl: e.target.value,
                        })
                      }
                      placeholder="https://api.jsonbin.io/v3/b/YOUR_BIN_ID"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs font-mono text-[#F8FAFC]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="cloud-apikey"
                      className="block text-xs text-[#94A3B8]"
                    >
                      API Key / Master Token
                    </label>
                    <input
                      id="cloud-apikey"
                      type="password"
                      value={localCloud.apiKey}
                      onChange={(e) =>
                        setLocalCloud({
                          ...localCloud,
                          apiKey: e.target.value,
                        })
                      }
                      placeholder="X-Master-Key or Bearer token"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs font-mono text-[#F8FAFC]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSaveCloudConfig(localCloud);
                        setSyncMessage('Saved Cloud Database configuration.');
                        showStatus('Saved Cloud Config');
                      }}
                      className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white cursor-pointer"
                    >
                      Save Cloud Config
                    </button>

                    {localCloud.provider !== 'none' &&
                      localCloud.endpointUrl && (
                        <>
                          <button
                            type="button"
                            onClick={async () => {
                              onSaveCloudConfig(localCloud);
                              const msg = await onTriggerCloudSyncNow('push');
                              setSyncMessage(msg);
                            }}
                            className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.07] hover:bg-white/[0.14] text-[#F8FAFC] cursor-pointer"
                          >
                            Push Store to Cloud
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              onSaveCloudConfig(localCloud);
                              const msg = await onTriggerCloudSyncNow('pull');
                              setSyncMessage(msg);
                            }}
                            className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.07] hover:bg-white/[0.14] text-[#F8FAFC] cursor-pointer"
                          >
                            Pull from Cloud
                          </button>
                        </>
                      )}
                  </div>

                  {syncMessage && (
                    <span className="text-xs font-mono text-[#06B6D4]">
                      {syncMessage}
                    </span>
                  )}
                </div>
              </div>

              {/* Security PIN Customization */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">
                    Creator Studio Security PIN
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Default PIN is 2026. Customize your owner PIN for unlocking this dashboard.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    aria-label="New Creator PIN"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl bg-[#090B12] border border-white/15 text-xs font-mono text-center text-[#F8FAFC]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPinInput.trim()) {
                        onUpdateAdminPin(newPinInput.trim());
                        showStatus('Updated Creator PIN!');
                      }
                    }}
                    className="min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-[#F8FAFC] cursor-pointer"
                  >
                    Update PIN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
