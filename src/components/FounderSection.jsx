function FounderSection({ t }) {
  return <section className="py-10"><div className="mx-auto w-[min(1200px,94%)] rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-6"><h2 className="text-2xl font-black text-yellow-200">{t("founder_title")}</h2><p className="mt-2 text-slate-200">{t("founder_sub")}</p><p className="mt-2 text-sm text-slate-400">{t("founder_note")}</p><div className="mt-4 rounded-2xl border border-white/10 bg-[#0b0f14]/60 p-4 text-sm text-slate-300">{t("elite_bonus")}</div></div></section>;
}
export default FounderSection;