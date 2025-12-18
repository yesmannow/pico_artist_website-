/**
 * List of available audio files in the project
 * This is a static list to avoid runtime fs access in Cloudflare Workers
 * 
 * Update this list when adding new audio files to public/assets/audio/
 */

export interface AudioFile {
  filename: string;
  hasFullVersion: boolean;
}

/**
 * Known preview files in public/assets/audio/previews/
 * Manually maintained list - generated from directory scan
 */
export const PREVIEW_FILES: AudioFile[] = [
  { filename: 'Im Sorry.mp3', hasFullVersion: true },
  { filename: 'Un Dia Mas.mp3', hasFullVersion: true },
  { filename: 'F-7.mp3', hasFullVersion: true },
  { filename: 'Dejate Llevar.mp3', hasFullVersion: true },
  { filename: 'Ganja.mp3', hasFullVersion: true },
  { filename: 'Los 5.mp3', hasFullVersion: true },
  { filename: 'Amores Perdidos.mp3', hasFullVersion: true },
  { filename: 'Te Prometo.mp3', hasFullVersion: true },
  { filename: 'Sin Rencores.mp3', hasFullVersion: true },
  { filename: 'Quejas.mp3', hasFullVersion: true },
  { filename: 'Te Perdi.mp3', hasFullVersion: true },
  { filename: 'Jardin De Rosas.mp3', hasFullVersion: true },
  { filename: 'Entre Humos.mp3', hasFullVersion: true },
  { filename: 'Bungalow.mp3', hasFullVersion: true },
  { filename: 'Amor Sincero.mp3', hasFullVersion: true },
  { filename: 'Gunster.mp3', hasFullVersion: true },
  { filename: 'Falle.mp3', hasFullVersion: true },
  { filename: '12_05.mp3', hasFullVersion: true },
  { filename: 'Corazon Y Mente.mp3', hasFullVersion: true },
  { filename: 'Me Cuentan.mp3', hasFullVersion: true },
  { filename: 'El Don.mp3', hasFullVersion: true },
  { filename: 'Sentimientos.mp3', hasFullVersion: true },
  { filename: 'Party.mp3', hasFullVersion: true },
  { filename: 'Tortas De Jamon.mp3', hasFullVersion: true },
  { filename: 'Noches Enteras.mp3', hasFullVersion: true },
  { filename: 'Crussin.mp3', hasFullVersion: true },
];

/**
 * Get the public URL for a preview audio file
 */
export function getPreviewUrl(filename: string): string {
  return `/assets/audio/previews/${encodeURIComponent(filename)}`;
}

/**
 * Get the public URL for a full audio file
 */
export function getFullUrl(filename: string): string {
  return `/assets/audio/full/${encodeURIComponent(filename)}`;
}

/**
 * Get all available audio files
 */
export function getAudioFiles(): AudioFile[] {
  return PREVIEW_FILES;
}
