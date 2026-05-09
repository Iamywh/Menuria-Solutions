function RestaurantsSection({ t, restaurants, query, setQuery, cat, setCat, catLabel }) {
  const categories = ["all", ...new Set(restaurants.map((restaurant) => restaurant.category))];
  const filtered = restaurants.filter((restaurant) => `${restaurant.name} ${restaurant.city}`.toLowerCase().includes(query.toLowerCase()) && (cat === "all" || restaurant.category === cat));
  return (
    <section id="ristoranti" className="py-12"><div className="mx-auto w-[min(1200px,94%)]">
      <div className="flex items-end justify-between gap-4 flex-wrap"><div><h2 className="text-2xl sm:text-3xl font-extrabold">{t("rest_title")}</h2><p className="text-slate-300">{t("rest_kicker")}</p></div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search_placeholder")} className="w-full sm:w-auto bg-[#111925] border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-cyan-400/60" /></div>
      <div className="mt-3 flex flex-wrap gap-2">{categories.map((id) => <button key={id} onClick={() => setCat(id)} className={`px-3 py-1 rounded-full text-sm border transition ${cat === id ? "border-cyan-400/70 bg-cyan-400/10" : "border-white/10 hover:border-white/20"}`}>{catLabel(id)}</button>)}</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((restaurant, idx) => <a key={idx} href={restaurant.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 hover:border-cyan-400/60 transition overflow-hidden bg-[#111925]"><div className="h-40 grid place-items-center bg-gradient-to-r from-cyan-400/15 to-yellow-300/15"><span className="opacity-90 font-black tracking-wide text-center px-4">{restaurant.name}</span></div><div className="p-4"><div className="font-semibold">{restaurant.name}</div><div className="text-sm text-slate-400">{restaurant.city} • {catLabel(restaurant.category)}</div><div className="mt-3 text-sm text-cyan-300 font-bold">{t("visit_website")} →</div></div></a>)}</div>
    </div></section>
  );
}
export default RestaurantsSection;
