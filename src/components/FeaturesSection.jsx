function FeaturesSection({ t }) {
  const features = [t("feature_1"), t("feature_2"), t("feature_3"), t("feature_4"), t("feature_5"), t("feature_6"), t("feature_7"), t("feature_8")];
  return (
    <section className="py-12"><div className="mx-auto w-[min(1200px,94%)]">
      <h2 className="text-2xl sm:text-3xl font-extrabold">{t("features_title")}</h2>
      <p className="text-slate-300 mb-6">{t("features_sub")}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature, i) => <div key={i} className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm font-semibold"><span className="text-cyan-300 mr-2">✓</span>{feature}</div>)}</div>
    </div></section>
  );
}
export default FeaturesSection;
