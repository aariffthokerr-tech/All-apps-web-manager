import test from 'node:test';
import assert from 'node:assert/strict';
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
  validateProjectInput,
  verifyAdminPin,
} from './storeLogic';
import { ProjectFormInput } from '../types/project';

test('filterProjects filters by category and real-time search query', () => {
  const all = filterProjects(INITIAL_PROJECTS, 'All Creations', '');
  assert.equal(all.length, INITIAL_PROJECTS.length);

  const games = filterProjects(INITIAL_PROJECTS, 'Games', '');
  assert.equal(games.length, 1);
  assert.equal(games[0].title, 'Orbit Drifter: Zero-G');

  const searchShader = filterProjects(INITIAL_PROJECTS, 'All Creations', 'shader');
  assert.equal(searchShader.length, 1);
  assert.equal(searchShader[0].id, 'pb_1730480000');
});

test('getFeaturedProject returns the project marked isFeatured', () => {
  const featured = getFeaturedProject(INITIAL_PROJECTS);
  assert.ok(featured);
  assert.equal(featured.id, 'pb_1730480000');
  assert.equal(featured.isFeatured, true);
});

test('incrementProjectCount increments downloads for the target project', () => {
  const before = INITIAL_PROJECTS[0].downloads;
  const updated = incrementProjectCount(INITIAL_PROJECTS, INITIAL_PROJECTS[0].id);
  assert.equal(updated[0].downloads, before + 1);
  assert.equal(updated[1].downloads, INITIAL_PROJECTS[1].downloads);
});

test('validateProjectInput enforces required fields and 80-char tagline limit', () => {
  const emptyTitle: ProjectFormInput = {
    title: '   ',
    tagline: 'Valid tagline',
    description: 'Full description',
    changelog: '',
    type: 'apk',
    category: 'Android APKs',
    iconUrl: '',
    screenshots: [],
    apkUrl: 'https://example.com/app.apk',
    webUrl: '',
    version: 'v1.0',
    fileSize: '10 MB',
    techStack: ['Kotlin'],
    isFeatured: false,
  };
  assert.equal(validateProjectInput(emptyTitle).valid, false);

  const tooLongTagline: ProjectFormInput = {
    ...emptyTitle,
    title: 'Valid App',
    tagline: 'x'.repeat(81),
  };
  assert.equal(validateProjectInput(tooLongTagline).valid, false);

  const missingApkUrl: ProjectFormInput = {
    ...emptyTitle,
    title: 'Valid App',
    apkUrl: '',
  };
  assert.equal(validateProjectInput(missingApkUrl).valid, false);

  const validInput: ProjectFormInput = {
    ...emptyTitle,
    title: 'Valid App',
  };
  assert.equal(validateProjectInput(validInput).valid, true);
});

test('upsertProject creates new featured project and unsets previous featured project', () => {
  const input: ProjectFormInput = {
    title: 'Bawal Cyber Launcher',
    tagline: 'Minimalist gesture launcher for Android 15.',
    description: 'Fast glassmorphic home replacement with instant app search.',
    changelog: 'v1.0.0 — Initial release',
    type: 'apk',
    category: 'Android APKs',
    iconUrl: '',
    screenshots: [],
    apkUrl: 'https://pocketbawal.dev/cyber-launcher.apk',
    webUrl: '',
    version: '1.0.0',
    fileSize: '9.4 MB',
    techStack: ['Kotlin', 'Jetpack Compose'],
    isFeatured: true,
  };

  const updated = upsertProject(INITIAL_PROJECTS, input, null, '2026-11-01T15:00:00Z');
  assert.equal(updated.length, INITIAL_PROJECTS.length + 1);
  assert.equal(updated[0].title, 'Bawal Cyber Launcher');
  assert.equal(updated[0].version, 'v1.0.0');
  assert.equal(updated[0].isFeatured, true);
  assert.equal(updated[1].isFeatured, false);
});

test('deleteProject and toggleFeaturedProject preserve at least one featured item', () => {
  const toggled = toggleFeaturedProject(INITIAL_PROJECTS, INITIAL_PROJECTS[1].id);
  assert.equal(toggled[1].isFeatured, true);
  assert.equal(toggled[0].isFeatured, false);

  const afterDelete = deleteProject(toggled, INITIAL_PROJECTS[1].id);
  assert.equal(afterDelete.length, INITIAL_PROJECTS.length - 1);
  assert.equal(afterDelete.some((p) => p.isFeatured), true);
});

test('verifyAdminPin validates PIN 2026 accurately', () => {
  assert.equal(verifyAdminPin('2026', DEFAULT_ADMIN_PIN), true);
  assert.equal(verifyAdminPin(' 2026 ', DEFAULT_ADMIN_PIN), true);
  assert.equal(verifyAdminPin('1234', DEFAULT_ADMIN_PIN), false);
});

test('parseImportedProjectsJson parses valid JSON and rejects malformed input', () => {
  const exported = JSON.stringify(INITIAL_PROJECTS.slice(0, 2));
  const result = parseImportedProjectsJson(exported);
  assert.ok(result.projects);
  assert.equal(result.projects.length, 2);

  const invalid = parseImportedProjectsJson('{bad json');
  assert.ok(invalid.error);
});

test('getSafeApkFilename formats clean downloadable APK filename', () => {
  const filename = getSafeApkFilename(INITIAL_PROJECTS[0]);
  assert.equal(filename, '3d-live-wallpaper-pro-v2.1.0.apk');
});
