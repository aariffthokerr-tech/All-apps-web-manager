import {
  ProjectCategory,
  ProjectFormInput,
  ProjectItem,
} from '../types/project';
import { DEFAULT_ICONS, DEFAULT_SCREENSHOTS } from './svgAssets';

export const DEFAULT_ADMIN_PIN = '2026';

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'pb_1730480000',
    title: '3D Live Wallpaper Pro',
    tagline: 'Interactive multi-mode 3D graphics wallpaper for Android.',
    description:
      'Custom-built 3D interactive live wallpaper with touch physics, gyroscope parallax support, and battery-saving AMOLED rendering. Includes 12 custom shader scenes crafted from scratch with zero background drain when the screen is off.',
    changelog:
      'v2.1.0 — Added Cyber Prism & Liquid Obsidian shader modes, 120Hz ProMotion frame pacing, and reduced memory footprint by 32%.',
    type: 'apk',
    category: 'Android APKs',
    iconUrl: DEFAULT_ICONS.wallpaper3d,
    screenshots: [
      DEFAULT_SCREENSHOTS.wallpaperHero1,
      DEFAULT_SCREENSHOTS.wallpaperHero2,
    ],
    apkUrl: 'https://pocketbawal.dev/releases/3d-live-wallpaper-pro-v2.1.0.apk',
    webUrl: '',
    version: 'v2.1.0',
    fileSize: '14.8 MB',
    techStack: ['Kotlin', 'OpenGL', '3D', 'Shaders'],
    downloads: 1240,
    isFeatured: true,
    createdAt: '2026-11-01T12:00:00Z',
  },
  {
    id: 'pb_1730480100',
    title: 'Bawal Synth Studio',
    tagline: 'Polyphonic WebAudio modular synthesizer & loop workstation.',
    description:
      'Zero-latency browser-based modular synth featuring dual wavetable oscillators, analog-modeled ladder filters, real-time oscilloscope visualizer, and 1-click WAV stem export.',
    changelog:
      'v1.8.4 — Added MIDI controller auto-detection, arpeggiator pattern bank, and dark glass rack layout.',
    type: 'web',
    category: 'Web Apps',
    iconUrl: DEFAULT_ICONS.bawalSynth,
    screenshots: [DEFAULT_SCREENSHOTS.synthScreen1],
    apkUrl: '',
    webUrl: 'https://synth.pocketbawal.dev',
    version: 'v1.8.4',
    fileSize: 'Cloud',
    techStack: ['HTML5', 'WebAudio', 'TypeScript', 'Canvas'],
    downloads: 895,
    isFeatured: false,
    createdAt: '2026-10-28T15:30:00Z',
  },
  {
    id: 'pb_1730480200',
    title: 'Neural Lens Camera',
    tagline: 'On-device night vision & computational RAW camera utility.',
    description:
      'Bypasses standard ISP compression to capture multi-frame burst RAW photos with on-device neural denoising, manual focus peaking, and real-time zebras on Android devices.',
    changelog:
      'v3.0.2 — Improved low-light burst alignment speed by 45% on Snapdragon & Tensor chips.',
    type: 'both',
    category: 'AI Tools',
    iconUrl: DEFAULT_ICONS.neuralLens,
    screenshots: [DEFAULT_SCREENSHOTS.neuralScreen1],
    apkUrl: 'https://pocketbawal.dev/releases/neural-lens-v3.0.2.apk',
    webUrl: 'https://lens.pocketbawal.dev',
    version: 'v3.0.2',
    fileSize: '22.4 MB',
    techStack: ['Kotlin', 'Camera2 API', 'TFLite', 'AI'],
    downloads: 2150,
    isFeatured: false,
    createdAt: '2026-10-24T09:15:00Z',
  },
  {
    id: 'pb_1730480300',
    title: 'Orbit Drifter: Zero-G',
    tagline: 'Newtonian physics space drift racer with ghost leaderboards.',
    description:
      'Master inertia and vector thrusters across 24 handcrafted orbital rings. Play directly in your browser or install the native Android APK with haptic DualSense & gamepad support.',
    changelog:
      'v1.4.0 — Added 6 new Kuiper Belt time-trial sectors and 120 FPS native Android touch controls.',
    type: 'both',
    category: 'Games',
    iconUrl: DEFAULT_ICONS.orbitDrifter,
    screenshots: [DEFAULT_SCREENSHOTS.orbitScreen1],
    apkUrl: 'https://pocketbawal.dev/releases/orbit-drifter-v1.4.0.apk',
    webUrl: 'https://orbit.pocketbawal.dev',
    version: 'v1.4.0',
    fileSize: '31.2 MB',
    techStack: ['WebGL', 'Kotlin', 'Physics', 'WebView'],
    downloads: 1680,
    isFeatured: false,
    createdAt: '2026-10-19T18:00:00Z',
  },
  {
    id: 'pb_1730480400',
    title: 'APK Inspector & Signer',
    tagline: 'Verify APK signatures, permissions, and manifest trees.',
    description:
      'Lightweight developer utility for Android power users. Inspect package permissions, minSdk targets, certificate SHA-256 fingerprints, and split bundle contents offline.',
    changelog:
      'v1.2.1 — Added Android 15 target SDK badge analyzer and instant manifest XML search.',
    type: 'apk',
    category: 'Android APKs',
    iconUrl: DEFAULT_ICONS.apkForge,
    screenshots: [DEFAULT_SCREENSHOTS.wallpaperHero2],
    apkUrl: 'https://pocketbawal.dev/releases/apk-inspector-v1.2.1.apk',
    webUrl: '',
    version: 'v1.2.1',
    fileSize: '8.6 MB',
    techStack: ['Kotlin', 'Jetpack', 'Security'],
    downloads: 740,
    isFeatured: false,
    createdAt: '2026-10-12T11:20:00Z',
  },
  {
    id: 'pb_1730480500',
    title: 'PromptFlow Studio Hub',
    tagline: 'Visual node-based workflow builder for structured AI prompts.',
    description:
      'Chain system instructions, few-shot examples, and JSON schema validators in an interactive node canvas. Export ready-to-run TypeScript or Kotlin snippets in one click.',
    changelog:
      'v2.0.0 — Added instant JSON schema tester and local browser IndexedDB workspace snapshots.',
    type: 'web',
    category: 'AI Tools',
    iconUrl: DEFAULT_ICONS.promptCraft,
    screenshots: [DEFAULT_SCREENSHOTS.synthScreen1],
    apkUrl: '',
    webUrl: 'https://promptflow.pocketbawal.dev',
    version: 'v2.0.0',
    fileSize: 'Cloud',
    techStack: ['React', 'TypeScript', 'AI', 'HTML5'],
    downloads: 1120,
    isFeatured: false,
    createdAt: '2026-10-05T14:45:00Z',
  },
];

export function filterProjects(
  projects: ProjectItem[],
  selectedCategory: 'All Creations' | ProjectCategory,
  searchQuery: string
): ProjectItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All Creations' ||
      project.category === selectedCategory ||
      (selectedCategory === 'Android APKs' &&
        (project.type === 'apk' || project.type === 'both')) ||
      (selectedCategory === 'Web Apps' &&
        (project.type === 'web' || project.type === 'both'));

    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const inTitle = project.title.toLowerCase().includes(normalizedQuery);
    const inTagline = project.tagline.toLowerCase().includes(normalizedQuery);
    const inDesc = project.description.toLowerCase().includes(normalizedQuery);
    const inStack = project.techStack.some((t) =>
      t.toLowerCase().includes(normalizedQuery)
    );
    const inCategory = project.category.toLowerCase().includes(normalizedQuery);

    return inTitle || inTagline || inDesc || inStack || inCategory;
  });
}

export function getFeaturedProject(
  projects: ProjectItem[]
): ProjectItem | undefined {
  return projects.find((p) => p.isFeatured) ?? projects[0];
}

export function incrementProjectCount(
  projects: ProjectItem[],
  projectId: string
): ProjectItem[] {
  return projects.map((project) =>
    project.id === projectId
      ? { ...project, downloads: project.downloads + 1 }
      : project
  );
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateProjectInput(input: ProjectFormInput): ValidationResult {
  if (!input.title.trim()) {
    return { valid: false, error: 'Project title is required.' };
  }
  if (!input.tagline.trim()) {
    return { valid: false, error: 'Short tagline is required.' };
  }
  if (input.tagline.trim().length > 80) {
    return {
      valid: false,
      error: 'Short tagline must be 80 characters or fewer.',
    };
  }
  if (!input.description.trim()) {
    return { valid: false, error: 'Project description is required.' };
  }
  if (
    (input.type === 'apk' || input.type === 'both') &&
    !input.apkUrl.trim()
  ) {
    return {
      valid: false,
      error: 'Please provide an APK file or direct download URL.',
    };
  }
  if (
    (input.type === 'web' || input.type === 'both') &&
    !input.webUrl.trim()
  ) {
    return {
      valid: false,
      error: 'Please provide a live website URL (https://...).',
    };
  }
  return { valid: true };
}

export function upsertProject(
  projects: ProjectItem[],
  input: ProjectFormInput,
  editingId?: string | null,
  nowIso: string = new Date().toISOString()
): ProjectItem[] {
  const normalizedVersion = input.version.trim()
    ? input.version.trim().startsWith('v')
      ? input.version.trim()
      : `v${input.version.trim()}`
    : 'v1.0.0';

  const defaultSize =
    input.type === 'web' ? 'Cloud' : input.fileSize.trim() || '12.0 MB';

  const cleanedScreenshots = input.screenshots
    .map((s) => s.trim())
    .filter(Boolean);

  const cleanedTechStack =
    input.techStack.length > 0
      ? input.techStack.map((t) => t.trim()).filter(Boolean)
      : input.type === 'apk'
      ? ['Kotlin', 'Android']
      : ['HTML5', 'Web'];

  const baseList = input.isFeatured
    ? projects.map((p) => ({ ...p, isFeatured: false }))
    : [...projects];

  if (editingId) {
    return baseList.map((item) => {
      if (item.id !== editingId) return item;
      return {
        ...item,
        title: input.title.trim(),
        tagline: input.tagline.trim(),
        description: input.description.trim(),
        changelog: input.changelog.trim() || item.changelog,
        type: input.type,
        category: input.category,
        iconUrl: input.iconUrl.trim() || DEFAULT_ICONS.wallpaper3d,
        screenshots:
          cleanedScreenshots.length > 0
            ? cleanedScreenshots
            : item.screenshots.length > 0
            ? item.screenshots
            : [DEFAULT_SCREENSHOTS.wallpaperHero1],
        apkUrl:
          input.type === 'web' ? '' : input.apkUrl.trim(),
        webUrl:
          input.type === 'apk' ? '' : input.webUrl.trim(),
        version: normalizedVersion,
        fileSize:
          input.type === 'web'
            ? 'Cloud'
            : input.fileSize.trim() || defaultSize,
        techStack: cleanedTechStack,
        isFeatured: input.isFeatured,
      };
    });
  }

  const newProject: ProjectItem = {
    id: `pb_${Date.now()}`,
    title: input.title.trim(),
    tagline: input.tagline.trim(),
    description: input.description.trim(),
    changelog:
      input.changelog.trim() ||
      `${normalizedVersion} — Initial official release on PocketBawal.`,
    type: input.type,
    category: input.category,
    iconUrl: input.iconUrl.trim() || DEFAULT_ICONS.wallpaper3d,
    screenshots:
      cleanedScreenshots.length > 0
        ? cleanedScreenshots
        : [DEFAULT_SCREENSHOTS.wallpaperHero1],
    apkUrl: input.type === 'web' ? '' : input.apkUrl.trim(),
    webUrl: input.type === 'apk' ? '' : input.webUrl.trim(),
    version: normalizedVersion,
    fileSize:
      input.type === 'web' ? 'Cloud' : input.fileSize.trim() || defaultSize,
    techStack: cleanedTechStack,
    downloads: 1,
    isFeatured: input.isFeatured,
    createdAt: nowIso,
  };

  return [newProject, ...baseList];
}

export function deleteProject(
  projects: ProjectItem[],
  projectId: string
): ProjectItem[] {
  const remaining = projects.filter((p) => p.id !== projectId);
  if (remaining.length > 0 && !remaining.some((p) => p.isFeatured)) {
    remaining[0] = { ...remaining[0], isFeatured: true };
  }
  return remaining;
}

export function toggleFeaturedProject(
  projects: ProjectItem[],
  projectId: string
): ProjectItem[] {
  return projects.map((p) => ({
    ...p,
    isFeatured: p.id === projectId,
  }));
}

export function verifyAdminPin(inputPin: string, expectedPin: string): boolean {
  return inputPin.trim() === expectedPin.trim() && expectedPin.trim().length > 0;
}

export function parseImportedProjectsJson(rawJson: string): {
  projects?: ProjectItem[];
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson);
    const list = Array.isArray(parsed) ? parsed : parsed?.projects;
    if (!Array.isArray(list) || list.length === 0) {
      return { error: 'JSON must contain a non-empty array of ProjectItem objects.' };
    }
    const validated: ProjectItem[] = [];
    for (const item of list) {
      if (!item || typeof item.title !== 'string' || !item.title.trim()) {
        return { error: 'Each project item in JSON must include a valid "title".' };
      }
      validated.push({
        id: String(item.id || `pb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`),
        title: item.title.trim(),
        tagline: String(item.tagline || 'Official PocketBawal creation.'),
        description: String(item.description || item.tagline || ''),
        changelog: String(item.changelog || `${item.version || 'v1.0.0'} — Verified build.`),
        type:
          item.type === 'apk' || item.type === 'web' || item.type === 'both'
            ? item.type
            : 'apk',
        category:
          item.category === 'Android APKs' ||
          item.category === 'Web Apps' ||
          item.category === 'AI Tools' ||
          item.category === 'Games'
            ? item.category
            : 'Android APKs',
        iconUrl: String(item.iconUrl || DEFAULT_ICONS.wallpaper3d),
        screenshots: Array.isArray(item.screenshots) && item.screenshots.length > 0
          ? item.screenshots.map(String)
          : [DEFAULT_SCREENSHOTS.wallpaperHero1],
        apkUrl: String(item.apkUrl || ''),
        webUrl: String(item.webUrl || ''),
        version: String(item.version || 'v1.0.0'),
        fileSize: String(item.fileSize || '14.0 MB'),
        techStack: Array.isArray(item.techStack) ? item.techStack.map(String) : ['Kotlin'],
        downloads: Number(item.downloads) || 0,
        isFeatured: Boolean(item.isFeatured),
        createdAt: String(item.createdAt || new Date().toISOString()),
      });
    }
    return { projects: validated };
  } catch {
    return { error: 'Invalid JSON syntax. Please check your backup file.' };
  }
}

export function getSafeApkFilename(project: ProjectItem): string {
  const slug = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const ver = project.version.replace(/[^a-zA-Z0-9._-]+/g, '');
  return `${slug || 'pocketbawal-app'}-${ver || 'v1.0'}.apk`;
}
