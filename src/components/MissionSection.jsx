function MissionSection({ t }) {
  const problems = [
    { icon: "🌍", text: t("problem_1") }, { icon: "⚠️", text: t("problem_2") }, { icon: "📋", text: t("problem_3") },
    { icon: "📣", text: t("problem_4") }, { icon: "⏱️", text: t("problem_5") }, { icon: "📱", text: t("problem_6") }
  ];
  return (
    <section id="missione" className="py-12"><div className="mx-auto w-[min(1200px,94%)]">
      <h2 className="text-2xl sm:text-3xl font-extrabold">{t("problems_title")}</h2>
      <p className="text-slate-300 mb-6">{t("problems_sub")}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{problems.map((problem, i) => <div key={i} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5"><div className="text-2xl mb-3">{problem.icon}</div><h3 className="font-bold">{problem.text}</h3></div>)}</div>
    </div></section>
  );
}
export default MissionSection;
