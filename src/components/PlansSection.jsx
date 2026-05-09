import { plansData } from "../data/plansData";
function PlansSection({ t }) {
  return (
    <section id="planes" className="py-12"><div className="mx-auto w-[min(1200px,94%)]"><div className="mb-6"><h2 className="text-2xl sm:text-3xl font-extrabold">{t("pricing_title")}</h2><p className="text-slate-300">{t("pricing_sub")}</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{plansData.map((plan) => <div key={plan.id} className={`rounded-3xl border p-5 bg-[#111925] relative overflow-hidden ${plan.entry ? "border-cyan-300/70 shadow-[0_0_45px_rgba(34,211,238,.16)] scale-[1.02]" : plan.elite ? "border-yellow-300/60 shadow-[0_0_40px_rgba(253,224,71,.12)]" : "border-white/10"}`}>
        {plan.entry && <div className="absolute top-3 right-3 text-xs font-black text-[#071018] bg-cyan-300 rounded-full px-3 py-1">{t("popular_entry")}</div>}
        {plan.elite && <div className="absolute top-3 right-3 text-xs font-black text-[#10141a] bg-yellow-300 rounded-full px-3 py-1">{t("elite_badge")}</div>}
        <h3 className="text-xl font-black pr-24">{plan.name}</h3><p className="text-sm text-slate-400 mt-1 min-h-[42px]">{t(plan.descKey)}</p>
        <div className="mt-5"><div className="text-sm text-slate-400">{t("setup")}</div><div className="text-3xl font-black text-cyan-300">{plan.setup}</div></div>
        <div className="mt-3"><span className="text-3xl font-black">{plan.month}</span><span className="text-slate-400"> / {t("month")}</span></div>
        <ul className="mt-5 space-y-2 text-sm text-slate-300">{plan.featureKeys.map((featureKey) => <li key={featureKey}>✓ {t(featureKey)}</li>)}</ul>
        <a href="#contatti" className={`mt-6 block text-center rounded-xl px-4 py-3 font-extrabold ${plan.entry ? "bg-cyan-300 text-[#071018]" : plan.elite ? "bg-yellow-300 text-[#10141a]" : "bg-cyan-400 text-[#0b0f14]"}`}>{plan.entry ? t("best_start") : t("contact_us")}</a>
      </div>)}</div>
    </div></section>
  );
}
export default PlansSection;
