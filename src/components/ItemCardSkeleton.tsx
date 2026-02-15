export default function ItemCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-square w-full animate-shimmer rounded-t-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="flex flex-1 flex-col p-4">
        <div className="h-5 w-3/4 animate-shimmer rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-4 w-1/4 animate-shimmer rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-4 w-full animate-shimmer rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-1 h-4 w-2/3 animate-shimmer rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-10 w-full animate-shimmer rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
