import { useEffect, useRef, useState } from "react"

interface Contribution {
  date: string
  count: number
  level: number
}

const levelClass = [
  "bg-muted-foreground/10",
  "bg-emerald-500/25",
  "bg-emerald-500/50",
  "bg-emerald-500/75",
  "bg-emerald-500",
]

const GAP = 3
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(d: Date) {
  return d.toISOString().split("T")[0]
}

function buildGrid(contributions: Contribution[], weeksToShow: number) {
  const lookup = new Map(contributions.map((c) => [c.date, c]))

  const today = new Date()
  const todayDay = today.getDay()

  const start = new Date(today)
  start.setDate(today.getDate() - weeksToShow * 7 - todayDay)

  const weeks: Contribution[][] = []
  const monthLabels: { index: number; label: string }[] = []
  let currentWeek: Contribution[] = []
  let lastMonth = -1
  const current = new Date(start)

  while (current <= today) {
    const dateStr = formatDate(current)
    const month = current.getMonth()

    if (month !== lastMonth && current.getDay() === 0) {
      monthLabels.push({ index: weeks.length, label: MONTHS[month] })
      lastMonth = month
    }

    currentWeek.push(lookup.get(dateStr) ?? { date: dateStr, count: 0, level: 0 })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }

    current.setDate(current.getDate() + 1)
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: -1 })
    }
    weeks.push(currentWeek)
  }

  return { weeks, monthLabels }
}

function displayDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-")
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`
}

export function GitHubActivity() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contributions, setContributions] = useState<Contribution[] | null>(null)
  const [cellSize, setCellSize] = useState(0)
  const [weeksToShow, setWeeksToShow] = useState(0)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null)

  // Fetch data
  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/matejhozlar")
      .then((r) => r.json())
      .then((d) => setContributions(d.contributions))
      .catch(() => {})
  }, [])

  // Measure container and calculate grid dimensions
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function measure() {
      const width = el!.clientWidth
      // Target cell size ~11px, but flex to fill width
      const targetCell = 11
      const step = targetCell + GAP
      const weeks = Math.floor((width + GAP) / step)
      // Recalculate cell size to perfectly fill width
      const size = (width - (weeks - 1) * GAP) / weeks
      setWeeksToShow(weeks)
      setCellSize(Math.floor(size * 10) / 10)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const ready = contributions && weeksToShow > 0

  let content = null
  if (ready) {
    const { weeks, monthLabels } = buildGrid(contributions, weeksToShow)

    const total = weeks
      .flat()
      .filter((d) => d.level >= 0)
      .reduce((sum, d) => sum + d.count, 0)

    const step = cellSize + GAP

    content = (
      <>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            {total.toLocaleString()} contributions in the last {weeksToShow} weeks
          </span>
          <a
            href="https://github.com/matejhozlar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            @matejhozlar
          </a>
        </div>

        {/* Month labels */}
        <div className="relative h-4 mb-0.5">
          {monthLabels.map((m) => (
            <span
              key={`${m.label}-${m.index}`}
              className="absolute text-[10px] text-muted-foreground/60 leading-none"
              style={{ left: m.index * step }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex" style={{ gap: GAP }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`rounded-[2px] ${day.level >= 0 ? levelClass[day.level] : ""}`}
                  style={{ width: cellSize, height: cellSize }}
                  onMouseEnter={(e) => {
                    if (!day.date) return
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      date: day.date,
                      count: day.count,
                    })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div ref={containerRef} className="mt-5">
      {content}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <span className="font-medium">{tooltip.count} contributions</span>
          <span className="text-muted-foreground"> on {displayDate(tooltip.date)}</span>
        </div>
      )}
    </div>
  )
}
