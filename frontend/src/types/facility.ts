import { Flame, Leaf, Moon, Sparkles, Trees, Waves, Heart, type LucideIcon } from 'lucide-react'

// Mirrors TourAPI WellnessTursmService's wellnessThemaCd table exactly (7 codes) —
// see tourAPI.py. Facility radar is powered by this real API, not mock data.
export type FacilityType =
  | 'hot_spring_sauna_spa'
  | 'jjimjilbang'
  | 'hanbang_experience'
  | 'healing_meditation'
  | 'beauty_spa'
  | 'other_wellness'
  | 'nature_healing'

export type FacilityFilter = FacilityType | 'all'

export interface Facility {
  id: string
  type: FacilityType
  name: string
  address: string
  distance: number
  lat: number
  lng: number
  tel?: string
  image?: string
}

export interface FacilityTypeMeta {
  id: FacilityType
  themeCode: string
  icon: LucideIcon
  /** Text color, e.g. badge label/icon. */
  color: string
  /** Tinted background, e.g. badge fill. */
  bg: string
  /** Solid background for map pins — kept as its own literal class (not
   * derived from `color`/`bg` at runtime) because Tailwind's compiler only
   * picks up classes it can find as literal strings in source. */
  pinBg: string
  labelKey: string
}

// Single source of truth for facility-type metadata — add/remove a type here
// only (mirrors PLACE_CATEGORIES in types/place.ts). Colors use standard
// Tailwind palette tokens (not custom theme tokens) since these only need to
// visually distinguish 7 pin/badge colors, not carry semantic meaning the
// way crowd-low/mid/high do.
export const FACILITY_TYPE_META: FacilityTypeMeta[] = [
  { id: 'hot_spring_sauna_spa', themeCode: 'EX050100', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-500/10', pinBg: 'bg-blue-500', labelKey: 'radar.facility_types.hot_spring_sauna_spa' },
  { id: 'jjimjilbang', themeCode: 'EX050200', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-500/10', pinBg: 'bg-amber-500', labelKey: 'radar.facility_types.jjimjilbang' },
  { id: 'hanbang_experience', themeCode: 'EX050300', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10', pinBg: 'bg-emerald-500', labelKey: 'radar.facility_types.hanbang_experience' },
  { id: 'healing_meditation', themeCode: 'EX050400', icon: Moon, color: 'text-violet-500', bg: 'bg-violet-500/10', pinBg: 'bg-violet-500', labelKey: 'radar.facility_types.healing_meditation' },
  { id: 'beauty_spa', themeCode: 'EX050500', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-500/10', pinBg: 'bg-pink-500', labelKey: 'radar.facility_types.beauty_spa' },
  { id: 'other_wellness', themeCode: 'EX050600', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', pinBg: 'bg-rose-500', labelKey: 'radar.facility_types.other_wellness' },
  { id: 'nature_healing', themeCode: 'EX050700', icon: Trees, color: 'text-teal-500', bg: 'bg-teal-500/10', pinBg: 'bg-teal-500', labelKey: 'radar.facility_types.nature_healing' },
]

export function getFacilityTypeMeta(type: FacilityType): FacilityTypeMeta {
  return FACILITY_TYPE_META.find((meta) => meta.id === type) ?? FACILITY_TYPE_META[0]
}

export function getFacilityTypeByThemeCode(themeCode: string | null | undefined): FacilityType {
  return FACILITY_TYPE_META.find((meta) => meta.themeCode === themeCode)?.id ?? 'other_wellness'
}
