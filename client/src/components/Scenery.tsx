interface Props {
  className?: string
}

export function Scenery({ className }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}>
      <div className="absolute inset-0 bg-sky" />

      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[38%] w-full"
        shapeRendering="crispEdges"
      >
        <rect x="0" y="6" width="100" height="34" fill="var(--color-grass)" />
        <rect x="0" y="6" width="100" height="3" fill="var(--color-grass-dark)" />
        <g fill="var(--color-grass-dark)">
          <rect x="4" y="3" width="2" height="4" />
          <rect x="9" y="2" width="2" height="5" />
          <rect x="14" y="4" width="2" height="3" />
          <rect x="40" y="3" width="2" height="4" />
          <rect x="46" y="2" width="2" height="5" />
          <rect x="70" y="3" width="2" height="4" />
          <rect x="88" y="2" width="2" height="5" />
          <rect x="94" y="4" width="2" height="3" />
        </g>
      </svg>

      <svg
        viewBox="0 0 40 60"
        className="absolute bottom-[30%] left-[3%] h-[45%]"
        shapeRendering="crispEdges"
      >
        <rect x="17" y="30" width="6" height="30" fill="var(--color-tree)" />
        <rect x="17" y="38" width="3" height="12" fill="#8a3c00" />
        <rect x="8" y="8" width="24" height="20" rx="3" fill="var(--color-grass)" />
        <rect x="4" y="14" width="12" height="14" rx="3" fill="var(--color-grass)" />
        <rect x="24" y="14" width="12" height="14" rx="3" fill="var(--color-grass)" />
        <rect x="12" y="2" width="16" height="14" rx="3" fill="var(--color-grass)" />
        <g fill="var(--color-grass-dark)">
          <rect x="10" y="10" width="3" height="3" />
          <rect x="26" y="18" width="3" height="3" />
          <rect x="18" y="6" width="3" height="3" />
        </g>
      </svg>

      <svg
        viewBox="0 0 30 16"
        className="absolute bottom-[30%] right-[6%] h-[14%]"
        shapeRendering="crispEdges"
      >
        <rect x="6" y="4" width="18" height="12" rx="4" fill="var(--color-grass)" />
        <rect x="2" y="8" width="10" height="8" rx="3" fill="var(--color-grass)" />
        <rect x="18" y="8" width="10" height="8" rx="3" fill="var(--color-grass)" />
        <rect x="10" y="9" width="3" height="3" fill="var(--color-grass-dark)" />
      </svg>
    </div>
  )
}
