import { useId } from "react"

export function BrandMark({ className }: { className?: string }) {
  const gradientId = useId()
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={gradientId}
          x1="6"
          y1="8"
          x2="27"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" style={{ stopColor: "var(--lens-teal)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--lens-blue)" }} />
          <stop offset="1" style={{ stopColor: "var(--lens-violet)" }} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="2" className="fill-foreground" />
      <rect x="7" y="8" width="18" height="2.4" rx="1.2" fill={`url(#${gradientId})`} />
      <rect x="7" y="12.8" width="13" height="2.4" rx="1.2" fill={`url(#${gradientId})`} />
      <rect x="7" y="17.6" width="16" height="2.4" rx="1.2" fill={`url(#${gradientId})`} />
      <rect x="7" y="22.4" width="9" height="2.4" rx="1.2" fill={`url(#${gradientId})`} />
    </svg>
  )
}

export function BrandLockup() {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark className="size-7 shrink-0" />
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold tracking-tight text-foreground">
          OneFlow
        </span>
        <span className="block text-[10px] font-medium text-muted-foreground">by Datalens</span>
      </span>
    </span>
  )
}
