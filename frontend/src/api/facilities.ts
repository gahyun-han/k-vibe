import { apiClient } from '@/api/client'
import { FACILITY_TYPE_META, getFacilityTypeByThemeCode, type Facility, type FacilityFilter, type FacilityType } from '@/types/facility'

// Facility radar is backed by the real TourAPI WellnessTursmService (via our
// backend's /amenities endpoint) — see backend/externelAPI_services/tourAPI.py.
// No mock fallback here: coverage genuinely varies by region (dense in Seoul,
// sparse in e.g. Hwaseong), and faking Seoul-shaped data would misrepresent
// that as a bug. A failed call surfaces as a real error (isError in
// RadarPage's useQuery), same as any other live data fetch.

interface WellnessApiItem {
  contentId: string | null
  title: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  distance: number | null
  themeCode: string | null
  image: string | null
  tel: string | null
}

export interface FacilityQuery {
  lat: number
  lng: number
  radius: number
  filter: FacilityFilter
  locale?: string
}

function toFacility(item: WellnessApiItem): Facility | null {
  if (item.latitude == null || item.longitude == null) return null
  return {
    id: item.contentId ?? `${item.latitude},${item.longitude}`,
    type: getFacilityTypeByThemeCode(item.themeCode),
    name: item.title ?? '',
    address: item.address ?? '',
    distance: item.distance != null ? Math.round(item.distance) : 0,
    lat: item.latitude,
    lng: item.longitude,
    tel: item.tel ?? undefined,
    image: item.image ?? undefined,
  }
}

export async function fetchFacilities({ lat, lng, radius, filter }: FacilityQuery): Promise<Facility[]> {
  const themeCode = filter === 'all' ? undefined : FACILITY_TYPE_META.find((meta) => meta.id === filter)?.themeCode
  const { data } = await apiClient.get<WellnessApiItem[]>('/amenities', {
    params: { lat, lng, radius, theme: themeCode },
  })
  return data
    .map(toFacility)
    .filter((facility): facility is Facility => facility !== null)
    .sort((a, b) => a.distance - b.distance)
}

export type { Facility, FacilityType, FacilityFilter }
