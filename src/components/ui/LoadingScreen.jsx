import BalloonVisual from "@/components/product/BalloonVisual";

export default function LoadingScreen({ label = "Loading" }) {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-slate-50/60 px-6 py-24">
      <div className="flex flex-col items-center">
        <div className="relative grid place-items-center">
          <span className="absolute h-24 w-24 animate-pulse-subtle rounded-full bg-brand-200/50 blur-2xl" />
          <BalloonVisual
            visual={{ kind: "round", color: "#7c3aed" }}
            size={84}
            className="relative animate-float drop-shadow-lg"
          />
        </div>

        <div className="mt-7 flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce-subtle rounded-full bg-brand-600 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce-subtle rounded-full bg-brand-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce-subtle rounded-full bg-brand-400" />
        </div>

        <p className="mt-4 font-display text-sm font-bold tracking-wide text-slate-500">{label}…</p>
      </div>
    </div>
  );
}
