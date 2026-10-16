import { cn } from "@/lib/utils";

export function Avatar({ speaking, listening, size = 180 }: { speaking?: boolean; listening?: boolean; size?: number }) {
  return (
    <div className="relative flex flex-col items-center" aria-hidden>
      <div className="relative animate-floaty" style={{ width: size, height: size }}>
        {(speaking || listening) && (
          <span className={cn("absolute inset-0 rounded-full animate-ring", speaking ? "bg-violet/40" : "bg-success/40")} />
        )}
        <svg viewBox="0 0 200 200" className="relative h-full w-full drop-shadow-xl">
          <defs>
            <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--navy-foreground)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#bg)" />
          {/* shoulders */}
          <path d="M40 190 Q100 140 160 190 Z" fill="var(--navy)" opacity="0.9" />
          <path d="M92 152 L100 170 L108 152 Z" fill="var(--success)" />
          {/* head */}
          <ellipse cx="100" cy="92" rx="46" ry="52" fill="url(#face)" />
          {/* hair */}
          <path d="M54 82 Q56 38 100 38 Q146 38 146 82 Q132 60 100 60 Q70 60 54 82 Z" fill="var(--navy)" />
          {/* eyes */}
          <g className="animate-blink">
            <ellipse cx="82" cy="92" rx="5" ry="6" fill="var(--navy)" />
            <ellipse cx="118" cy="92" rx="5" ry="6" fill="var(--navy)" />
          </g>
          <path d="M74 80 Q82 76 90 80" stroke="var(--navy)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M110 80 Q118 76 126 80" stroke="var(--navy)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="72" cy="108" r="5" fill="var(--violet)" opacity="0.25" />
          <circle cx="128" cy="108" r="5" fill="var(--violet)" opacity="0.25" />
          {/* mouth */}
          {speaking ? (
            <ellipse cx="100" cy="118" rx="9" ry="7" fill="var(--navy)" className="animate-talk" />
          ) : (
            <path d="M88 116 Q100 126 112 116" stroke="var(--navy)" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </div>
      <div className="mt-3 flex h-6 items-end gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "w-1 rounded-full transition-all",
              speaking ? "bg-violet animate-wave h-6" : listening ? "bg-success animate-wave h-5" : "h-1.5 bg-muted-foreground/30",
            )}
            style={{ animationDelay: `${(i % 5) * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}
