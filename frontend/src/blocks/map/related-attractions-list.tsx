import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { fetchRelatedAttractions } from '@/api/attractions'
import { LoadingSkeleton } from '@/blocks/common/loading-skeleton'

interface RelatedAttractionsListProps {
  lat: number
  lng: number
}

// Self-contained data fetching (same pattern as landing/trending-keywords.tsx) —
// this block only needs the current center coordinate, so it queries independently
// instead of MapPage owning yet another piece of fetched state.
export function RelatedAttractionsList({ lat, lng }: RelatedAttractionsListProps) {
  const { t } = useTranslation()
  const { data: attractions = [], isLoading } = useQuery({
    queryKey: ['related-attractions', lat, lng],
    queryFn: () => fetchRelatedAttractions({ lat, lng }),
  })

  const groups = useMemo(() => {
    const byAttraction = new Map<string, typeof attractions>()
    for (const item of attractions) {
      const group = byAttraction.get(item.attractionName) ?? []
      group.push(item)
      byAttraction.set(item.attractionName, group)
    }
    return [...byAttraction.entries()]
  }, [attractions])

  if (isLoading) {
    return (
      <div className="space-y-3 border-t border-border px-4 pt-4">
        <p className="text-sm font-bold text-foreground">{t('map.related_attractions_title')}</p>
        <LoadingSkeleton variant="list" count={3} />
      </div>
    )
  }

  if (groups.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 border-t border-border px-4 pt-4">
      <p className="text-sm font-bold text-foreground">{t('map.related_attractions_title')}</p>
      {groups.map(([attractionName, items]) => (
        <div key={attractionName} className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">{attractionName}</p>
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li
                key={item.relatedContentId}
                className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.rank}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{item.relatedName}</span>
                {item.categorySmall && (
                  <span className="shrink-0 text-xs text-muted-foreground">{item.categorySmall}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
