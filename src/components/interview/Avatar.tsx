import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Mic, Volume2, Sparkles, Camera, Check } from "lucide-react";

export type AvatarState = "idle" | "speaking" | "listening" | "thinking";

export interface AvatarProps {
  state?: AvatarState;
  speaking?: boolean;
  listening?: boolean;
  thinking?: boolean;
  size?: number | "sm" | "md" | "lg" | "xl";
  className?: string;
  showStatusBadge?: boolean;
  interviewerName?: string;
  allowPhotoUpload?: boolean;
}

const STORAGE_AVATAR_KEY = "interviewmate.tesla.avatar";

export function Avatar({
  state: stateProp,
  speaking = false,
  listening = false,
  thinking = false,
  size = "lg",
  className,
  showStatusBadge = true,
  interviewerName = "Tesla",
  allowPhotoUpload = true,
}: AvatarProps) {
  const [photoSrc, setPhotoSrc] = useState<string>("/tesla.jpg");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom photo if saved in browser storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AVATAR_KEY);
      if (stored) {
        setPhotoSrc(stored);
      }
    } catch {
      /* ignore storage error */
    }
  }, []);

  const handleCustomPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) {
        setPhotoSrc(result);
        try {
          localStorage.setItem(STORAGE_AVATAR_KEY, result);
        } catch {
          /* ignore storage limits */
        }
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Compute active state
  const activeState: AvatarState =
    stateProp ?? (speaking ? "speaking" : listening ? "listening" : thinking ? "thinking" : "idle");

  const sizePx =
    typeof size === "number"
      ? size
      : size === "sm"
        ? 120
        : size === "md"
          ? 180
          : size === "lg"
            ? 240
            : 320;

  return (
    <div className={cn("relative flex flex-col items-center select-none group", className)}>
      {/* Outer Studio Frame & Aura Glow */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 transition-all duration-300 shadow-2xl bg-slate-950",
          activeState === "speaking" && "border-violet ring-4 ring-violet/25 shadow-violet/20",
          activeState === "listening" &&
            "border-emerald-500 ring-4 ring-emerald-500/25 shadow-emerald-500/20",
          activeState === "thinking" &&
            "border-amber-400 ring-4 ring-amber-400/25 shadow-amber-400/20",
          activeState === "idle" && "border-slate-700/60 ring-1 ring-white/10 shadow-black/40",
        )}
        style={{ width: sizePx, height: sizePx }}
      >
        {/* Animated Aura Rings on active states */}
        {activeState === "speaking" && (
          <span className="pointer-events-none absolute inset-0 rounded-3xl bg-violet/10 animate-pulse z-10" />
        )}
        {activeState === "listening" && (
          <span className="pointer-events-none absolute inset-0 rounded-3xl bg-emerald-500/10 animate-pulse z-10" />
        )}
        {activeState === "thinking" && (
          <span className="pointer-events-none absolute inset-0 rounded-3xl bg-amber-400/10 animate-pulse z-10" />
        )}

        {/* Real Photographic Portrait Image (Exact Human Face) */}
        <img
          src={photoSrc}
          alt={`${interviewerName} — AI Interviewer`}
          referrerPolicy="no-referrer"
          className={cn(
            "h-full w-full object-cover object-top transition-transform duration-500",
            activeState === "speaking" ? "scale-[1.03]" : "scale-100",
          )}
        />

        {/* Studio Lighting Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Live Audio Visualizer Overlay on bottom edge */}
        <div className="absolute inset-x-0 bottom-0 p-3 pt-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  activeState === "speaking" && "bg-violet animate-pulse",
                  activeState === "listening" && "bg-emerald-400 animate-pulse",
                  activeState === "thinking" && "bg-amber-400 animate-pulse",
                  activeState === "idle" && "bg-emerald-400",
                )}
              />
              <span className="text-xs font-semibold text-slate-100 drop-shadow">
                {interviewerName} ·{" "}
                {activeState === "speaking"
                  ? "Speaking"
                  : activeState === "listening"
                    ? "Listening"
                    : activeState === "thinking"
                      ? "Thinking"
                      : "Ready"}
              </span>
            </div>

            {/* Equalizer Frequency Bars */}
            <div className="flex items-end gap-0.5 h-4">
              {[0.4, 0.9, 0.6, 1.0, 0.7, 0.3, 0.8, 0.5].map((scale, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-1 rounded-full transition-all duration-150",
                    activeState === "speaking"
                      ? "bg-violet animate-wave"
                      : activeState === "listening"
                        ? "bg-emerald-400 animate-wave"
                        : "bg-slate-400/40 h-1",
                  )}
                  style={{
                    height:
                      activeState === "speaking" || activeState === "listening"
                        ? `${scale * 16}px`
                        : "3px",
                    animationDelay: `${(i % 4) * 0.12}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Change Photo Hover Overlay */}
        {allowPhotoUpload && (
          <div className="absolute inset-x-0 top-0 p-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-slate-900/80 p-2 text-white/90 hover:text-white hover:bg-slate-900 border border-white/20 backdrop-blur shadow-sm transition"
              title="Upload exact photo (e.g. image.png)"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomPhotoChange}
            />
          </div>
        )}
      </div>

      {uploadSuccess && (
        <span className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
          <Check className="h-3 w-3" /> Exact face photo applied!
        </span>
      )}

      {/* State Badge Below Avatar Frame */}
      {showStatusBadge && (
        <div className="mt-3 flex items-center gap-2">
          {activeState === "speaking" && (
            <div className="flex items-center gap-1.5 rounded-full bg-violet/15 px-3 py-1 text-xs font-semibold text-violet border border-violet/30">
              <Volume2 className="h-3.5 w-3.5 animate-pulse" />
              <span>{interviewerName} is speaking…</span>
            </div>
          )}
          {activeState === "listening" && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <Mic className="h-3.5 w-3.5 animate-pulse" />
              <span>{interviewerName} is listening to you…</span>
            </div>
          )}
          {activeState === "thinking" && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-400/30">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing answer & formulating next question…</span>
            </div>
          )}
          {activeState === "idle" && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span>Ready for your answer</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
