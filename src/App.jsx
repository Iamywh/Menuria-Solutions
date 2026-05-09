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

function App() {
  const [lang, setLang] = useState(getInitialLang());
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const t = (key) => translate(lang, key);

  useEffect(() => { localStorage.setItem("menuria_lang", lang); }, [lang]);

  useEffect(() => {
    const canvas = document.getElementById("bg");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const dots = Array.from({ length: 60 }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.8 + 0.6 }));
    let animationFrame;
    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.1);
      gradient.addColorStop(0, "rgba(18,26,38,0)"); gradient.addColorStop(1, "rgba(0,0,0,.5)"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
      dots.forEach((dot) => { dot.x += dot.vx; dot.y += dot.vy; if (dot.x < 0 || dot.x > width) dot.vx *= -1; if (dot.y < 0 || dot.y > height) dot.vy *= -1; });
      for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) { const a = dots[i], b = dots[j]; const distance = Math.hypot(a.x - b.x, a.y - b.y); if (distance < 120) { const alpha = 1 - distance / 120; ctx.strokeStyle = `rgba(43,179,255,${alpha * 0.25})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
      dots.forEach((dot) => { const dotGradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.r * 4); dotGradient.addColorStop(0, "rgba(255,210,31,.9)"); dotGradient.addColorStop(1, "rgba(255,210,31,0)"); ctx.fillStyle = dotGradient; ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2); ctx.fill(); });
      animationFrame = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener("resize", onResize); };
  }, []);

  const catLabel = (id) => ({ all: t("cat_all"), med: t("cat_med"), piz: t("cat_piz"), bar: t("cat_bar"), cafe: t("cat_cafe") }[id] || id);

  return <div className="relative min-h-screen"><Header lang={lang} setLang={setLang} t={t} /><Hero t={t} /><MissionSection t={t} /><FeaturesSection t={t} /><RestaurantsSection t={t} restaurants={restaurantsData} query={query} setQuery={setQuery} cat={cat} setCat={setCat} catLabel={catLabel} /><DemoSection t={t} lang={lang} /><PlansSection t={t} /><FounderSection t={t} /><ContactCta t={t} /><Footer t={t} /></div>;
}
export default App;
