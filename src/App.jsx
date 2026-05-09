import { useEffect, useState } from "react";
import { getInitialLang, translate } from "./data/i18n";
import { restaurantsData } from "./data/restaurantsData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MissionSection from "./components/MissionSection";
import FeaturesSection from "./components/FeaturesSection";
import RestaurantsSection from "./components/RestaurantsSection";
import DemoSection from "./components/DemoSection";
import PlansSection from "./components/PlansSection";
import FounderSection from "./components/FounderSection";
import ContactCta from "./components/ContactCta";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";

function App() {
  const [lang, setLang] = useState(getInitialLang());
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const t = (key) => translate(lang, key);

  useEffect(() => { localStorage.setItem("menuria_lang", lang); }, [lang]);

  

  const catLabel = (id) => ({ all: t("cat_all"), med: t("cat_med"), piz: t("cat_piz"), bar: t("cat_bar"), cafe: t("cat_cafe") }[id] || id);

  return <div className="relative min-h-screen"><Header lang={lang} setLang={setLang} t={t} /><Hero t={t} /><MissionSection t={t} /><FeaturesSection t={t} /><RestaurantsSection t={t} restaurants={restaurantsData} query={query} setQuery={setQuery} cat={cat} setCat={setCat} catLabel={catLabel} /><DemoSection t={t} lang={lang} /><PlansSection t={t} /><FounderSection t={t} /><ContactCta t={t} /><Footer t={t} /></div>;
  return (
  <div className="relative min-h-screen">
    <AnimatedBackground />

    <Header lang={lang} setLang={setLang} t={t} />
    <Hero t={t} />
    <MissionSection t={t} />
    <FeaturesSection t={t} />
    <RestaurantsSection
      t={t}
      restaurants={restaurantsData}
      query={query}
      setQuery={setQuery}
      cat={cat}
      setCat={setCat}
      catLabel={catLabel}
    />
    <DemoSection t={t} lang={lang} />
    <PlansSection t={t} />
    <FounderSection t={t} />
    <ContactCta t={t} />
    <Footer t={t} />
  </div>
);
}
export default App;
