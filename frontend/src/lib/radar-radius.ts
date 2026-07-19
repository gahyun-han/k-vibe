// 임시: 화성시 등 웰니스 시설이 드문 지역 테스트를 위해 20km까지 확장 (테스트 후 원복 예정)
export const RADAR_RADIUS_STEPS = [300, 500, 800, 1000, 1500, 3000, 5000, 10000, 20000] as const

export function getNextRadarRadius(value: number): number | null {
  return RADAR_RADIUS_STEPS.find((step) => step > value) ?? null
}
