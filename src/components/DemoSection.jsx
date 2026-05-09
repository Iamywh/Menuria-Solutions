function DemoSection({ t, lang }) {
  const demoSrc = lang === "es" ? "/assets/video/DemoMenuriaES.mp4" : lang === "it" ? "/assets/video/DemoMenuriaIT.mp4" : "/assets/video/DemoMenuriaEN.mp4";
  return (
    <section id="demo" className="py-12"><div className="mx-auto w-[min(1200px,94%)]"><div className="mb-4"><h2 className="text-2xl sm:text-3xl font-extrabold">{t("video_title")}</h2><p className="text-slate-300">{t("video_kicker")}</p></div>
      <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0f1621] shadow-2xl"><video key={lang} className="w-full aspect-video" controls playsInline preload="metadata" controlsList="nodownload noplaybackrate"><source src={demoSrc} type="video/mp4" />{t("video_title")} – {t("brand")}</video></div>
    </div></section>
  );
}
export default DemoSection;
