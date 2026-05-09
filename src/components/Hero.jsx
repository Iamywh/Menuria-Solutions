function Hero({ t }) {
  const checks = [t("hero_check_1"), t("hero_check_2"), t("hero_check_3"), t("hero_check_4")];
  return (
    <section id="top" className="mx-auto w-[min(1200px,94%)] grid grid-cols-1 lg:grid-cols-2 items-center gap-10 py-12 md:py-18">
      <div>
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-100 border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 rounded-full"><span>{t("hero_badge")}</span></div>
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black leading-tight">{t("hero_title_1")}<span className="text-cyan-400 drop-shadow-[0_0_22px_rgba(43,179,255,.45)]">{t("hero_title_2")}</span>{t("hero_title_3")}</h1>
        <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-prose">{t("hero_sub")}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="#planes" className="text-center px-5 py-3 rounded-xl font-extrabold text-[#0b0f14] bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_10px_40px_rgba(43,179,255,.3)]">{t("cta_pricing")}</a>
          <a href="#demo" className="text-center px-5 py-3 rounded-xl font-extrabold border border-white/10 hover:border-yellow-300/60">{t("cta_demo")}</a>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="text-xl font-black text-cyan-300">7</div><div className="text-xs text-slate-400">Languages</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="text-xl font-black text-yellow-200">QR</div><div className="text-xs text-slate-400">Mobile first</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="text-xl font-black text-cyan-300">AI</div><div className="text-xs text-slate-400">Ready</div></div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 p-4 bg-[#0f1621]/90 shadow-2xl">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-yellow-300/10 p-5">
          <img src="/assets/img/logo.jpg" alt="Menuria Logo" className="max-h-32 mx-auto mb-5 rounded-xl" />
          <div className="grid gap-3">{checks.map((item, i) => <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0b0f14]/70 px-4 py-3"><span className="text-sm font-semibold">{item}</span><span className="text-cyan-300">✓</span></div>)}</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
