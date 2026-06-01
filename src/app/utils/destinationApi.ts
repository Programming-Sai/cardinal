/**
 * destinationApi.ts
 *
 * Destination data layer for the globe component.
 * Swap the implementation of `fetchDestinations` to pull from any source:
 *   – Supabase:  supabase.from('destinations').select('*')
 *   – REST API:  fetch('/api/destinations').then(r => r.json())
 *   – CMS:       fetch('https://your-cms.io/api/destinations')...
 *   – Static:    just return FALLBACK_DESTINATIONS directly (current default)
 *
 * The shape of `GlobeDestination` is the only contract GlobeCanvas cares about.
 */

export interface GlobeDestination {
  /** Display name shown in tag chips and marker labels */
  name: string;
  /** Latitude  –  decimal degrees, –90 … +90  */
  lat: number;
  /** Longitude – decimal degrees, –180 … +180 */
  lng: number;
  /** Optional: link to a program page for this destination */
  href?: string;
}

// ---------------------------------------------------------------------------
// Static fallback — used when no DB / API is configured
// Replace or augment these coordinates freely.
// ---------------------------------------------------------------------------
export const FALLBACK_DESTINATIONS: GlobeDestination[] = [
  { name: "Singapore", lat: 1.3521, lng: 103.8198, href: "/programs" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, href: "/programs" },
  { name: "Turkey", lat: 39.9334, lng: 32.8597, href: "/programs" },
  { name: "United States", lat: 38.8951, lng: -77.0364, href: "/programs" },
  { name: "United Kingdom", lat: 51.5074, lng: -0.1278, href: "/programs" },
  { name: "France", lat: 48.8566, lng: 2.3522, href: "/programs" },
];

// ---------------------------------------------------------------------------
// Main fetch function — replace the body to use your real data source
// ---------------------------------------------------------------------------
export async function fetchDestinations(): Promise<GlobeDestination[]> {
  // ── Supabase example ──────────────────────────────────────────────────────
  // import { supabase } from '../lib/supabase';
  // const { data, error } = await supabase
  //   .from('destinations')
  //   .select('name, lat, lng, href')
  //   .order('name');
  // if (error) throw error;
  // return data as GlobeDestination[];

  // ── REST API example ──────────────────────────────────────────────────────
  // const res = await fetch('/api/destinations');
  // if (!res.ok) throw new Error('Failed to fetch destinations');
  // return res.json() as Promise<GlobeDestination[]>;

  // ── Static fallback (default) ─────────────────────────────────────────────
  return FALLBACK_DESTINATIONS;
}
