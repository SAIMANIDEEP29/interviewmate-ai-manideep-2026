import { Check, ChevronRight, Code2 } from "lucide-react";
import { type StageKey } from "@/lib/interview-controller";
import { type InterviewType } from "@/lib/questions";
import { cn } from "@/lib/utils";

export interface StageProgressIndicatorProps {
  currentStage?: StageKey;
  interviewType: InterviewType | "mixed";
  currentIndex: number;
  totalQuestions: number;
  isCodingChallenge?: boolean;
  className?: string;
}

interface StageStep {
  id: string;
  label: string;
  stageKeys: StageKey[];
}

export function StageProgressIndicator({
  currentStage,
  interviewType,
  currentIndex,
  totalQuestions,
  isCodingChallenge = false,
  className,
}: StageProgressIndicatorProps) {
  // Define standard campus screening stages matching user requirements
  const steps: StageStep[] =
    interviewType === "technical"
      ? [
          { id: "intro", label: "Intro", stageKeys: ["stage_1_greeting"] },
          { id: "resume", label: "Resume", stageKeys: ["stage_2_resume"] },
          {
            id: "technical",
            label: "Technical",
            stageKeys: ["stage_3_technical", "stage_4_coding_sql", "stage_5_scenario"],
          },
          { id: "closing", label: "Closing", stageKeys: ["stage_7_closing"] },
        ]
      : [
          { id: "intro", label: "Intro", stageKeys: ["stage_1_greeting"] },
          { id: "resume", label: "Resume", stageKeys: ["stage_2_resume"] },
          {
            id: "technical",
            label: "Technical",
            stageKeys: ["stage_3_technical", "stage_4_coding_sql", "stage_5_scenario"],
          },
          { id: "hr", label: "HR", stageKeys: ["stage_6_behavioral"] },
          { id: "closing", label: "Closing", stageKeys: ["stage_7_closing"] },
        ];

  // Determine current active step index
  let activeStepIndex = steps.findIndex((s) => currentStage && s.stageKeys.includes(currentStage));

  // Fallback if stage key is missing or custom: estimate based on question progress
  if (activeStepIndex === -1) {
    if (currentIndex === 0) activeStepIndex = 0;
    else if (currentIndex >= totalQuestions - 1) activeStepIndex = steps.length - 1;
    else {
      const ratio = currentIndex / Math.max(1, totalQuestions);
      activeStepIndex = Math.min(steps.length - 1, Math.floor(ratio * steps.length));
    }
  }

  const currentStep = steps[activeStepIndex];
  const progressPercent = Math.round(((currentIndex + 1) / Math.max(1, totalQuestions)) * 100);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/85 backdrop-blur-md p-3 sm:px-4 sm:py-2.5 shadow-2xs transition-all",
        className,
      )}
      role="progressbar"
      aria-label="Interview Stage Progress"
      aria-valuenow={progressPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Horizontal Stage Stepper Breadcrumbs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isActive = idx === activeStepIndex;
            const isUpcoming = idx > activeStepIndex;

            return (
              <div key={step.id} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs transition-all duration-200 select-none",
                    isActive && "bg-hero text-white font-semibold shadow-xs ring-1 ring-violet/50",
                    isCompleted &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-500/15",
                    isUpcoming && "bg-muted/40 text-muted-foreground/60",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
                  ) : isActive ? (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  ) : (
                    <span className="flex h-3.5 w-3.5 rounded-full bg-muted/80 text-[10px] items-center justify-center font-mono text-muted-foreground/80 shrink-0">
                      {idx + 1}
                    </span>
                  )}

                  <span>{step.label}</span>

                  {isActive && isCodingChallenge && (
                    <span className="ml-0.5 inline-flex items-center gap-0.5 rounded bg-violet/30 px-1.5 py-0.2 text-[10px] font-mono text-white/95">
                      <Code2 className="h-2.5 w-2.5" />
                      <span>Code</span>
                    </span>
                  )}
                </div>

                {idx < steps.length - 1 && (
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 shrink-0 transition-colors",
                      isCompleted ? "text-emerald-500/60" : "text-muted-foreground/30",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Status: Current Stage & Progress Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Current:</span>
            <span className="font-semibold text-foreground text-xs">
              {currentStep?.label || "Screening"}
            </span>
          </div>

          <div className="h-3 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              Q <strong className="text-foreground">{currentIndex + 1}</strong> of {totalQuestions}
            </span>
            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden hidden sm:block">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
