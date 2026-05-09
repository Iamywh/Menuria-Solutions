import { languages } from "../data/i18n";

function Header({ lang, setLang, t }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#0f1621]/80 border-b border-white/10 pt-[max(env(safe-area-inset-top),0px)]">
      <div className="mx-auto w-[min(1200px,94%)] flex items-center gap-3 py-3">
        <a href="#top" className="flex items-center gap-3 min-w-0">
          <img src="/assets/img/logo.jpg" alt="Menuria Solutions Logo" className="h-10 w-auto rounded-md shrink-0" />
          <div className="text-xs sm:text-sm uppercase tracking-widest font-black truncate">{t("brand")}</div>
        </a>
        <nav className="hidden md:flex items-center gap-2 ml-auto">
          <a href="#missione" className="px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-400/60">{t("nav_mission")}</a>
          <a href="#ristoranti" className="px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-400/60">{t("nav_restaurants")}</a>
          <a href="#demo" className="px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-400/60">{t("nav_demo")}</a>
          <a href="#planes" className="px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-400/60">{t("nav_plans")}</a>
          <a href="#contatti" className="ml-1 px-3 py-2 rounded-lg font-extrabold text-[#10141a] bg-gradient-to-r from-yellow-300 to-yellow-200">{t("contact_us")}</a>
        </nav>
        <select aria-label={t("lang_label")} value={lang} onChange={(e) => setLang(e.target.value)} className="ml-auto md:ml-2 bg-[#111925] border border-white/10 rounded-lg px-2 py-2 text-sm outline-none focus:border-cyan-400/60">
          {languages.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}
        </select>
      </div>
    </header>
  );
}

export default Header;
