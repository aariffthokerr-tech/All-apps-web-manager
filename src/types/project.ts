export type ProjectType = 'apk' | 'web' | 'both';

export type ProjectCategory =
  | 'Android APKs'
  | 'Web Apps'
  | 'AI Tools'
  | 'Games';

export const PROJECT_CATEGORIES: readonly ('All Creations' | ProjectCategory)[] = [
  'All Creations',
  'Android APKs',
  'Web Apps',
  'AI Tools',
  'Games',
] as const;

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  changelog?: string;
  type: ProjectType;
  category: ProjectCategory;
  iconUrl: string;
  screenshots: string[];
  apkUrl: string;
  webUrl: string;
  version: string;
  fileSize: string;
  techStack: string[];
  downloads: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface ProjectFormInput {
  title: string;
  tagline: string;
  description: string;
  changelog: string;
  type: ProjectType;
  category: ProjectCategory;
  iconUrl: string;
  screenshots: string[];
  apkUrl: string;
  webUrl: string;
  version: string;
  fileSize: string;
  techStack: string[];
  isFeatured: boolean;
}

export type CloudProviderType = 'none' | 'jsonbin' | 'supabase' | 'firebase';

export interface CloudSyncConfig {
  provider: CloudProviderType;
  endpointUrl: string;
  apiKey: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}
