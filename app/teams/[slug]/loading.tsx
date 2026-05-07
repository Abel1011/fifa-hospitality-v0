export default function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav placeholder */}
      <div className="h-16 border-b border-foreground/5" />

      {/* Hero skeleton */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto pt-32 pb-20">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-foreground/[0.06]" />
            <div className="space-y-2">
              <div className="h-10 w-48 rounded bg-foreground/[0.06]" />
              <div className="h-4 w-32 rounded bg-foreground/[0.04]" />
            </div>
          </div>
        </div>
      </section>

      {/* Matches skeleton */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto pb-20">
        <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-foreground/[0.06] bg-surface/20 p-5 space-y-3"
            >
              <div className="h-4 w-28 rounded bg-foreground/[0.06]" />
              <div className="h-12 w-full rounded bg-foreground/[0.04]" />
              <div className="h-3 w-[50%] rounded bg-foreground/[0.04]" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
