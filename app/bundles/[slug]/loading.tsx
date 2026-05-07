export default function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav placeholder */}
      <div className="h-16 border-b border-foreground/5" />

      {/* Hero skeleton */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto pt-32 pb-20">
        <div className="animate-pulse space-y-6">
          <div className="h-3 w-40 rounded bg-foreground/[0.06]" />
          <div className="h-14 w-[60%] rounded bg-foreground/[0.06]" />
          <div className="h-5 w-[45%] rounded bg-foreground/[0.04]" />
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto pb-20">
        <div className="animate-pulse grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-foreground/[0.06] bg-surface/20 p-6 space-y-4"
            >
              <div className="h-4 w-32 rounded bg-foreground/[0.06]" />
              <div className="h-20 w-full rounded-xl bg-foreground/[0.04]" />
              <div className="h-3 w-[70%] rounded bg-foreground/[0.04]" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
