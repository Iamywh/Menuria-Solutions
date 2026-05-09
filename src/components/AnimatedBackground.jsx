import { useEffect } from "react";

function AnimatedBackground() {
  useEffect(() => {
    const canvas = document.getElementById("bg");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
    }));

    let animationFrame;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.1
      );

      gradient.addColorStop(0, "rgba(18,26,38,0)");
      gradient.addColorStop(1, "rgba(0,0,0,.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < 120) {
            const alpha = 1 - distance / 120;
            ctx.strokeStyle = `rgba(43,179,255,${alpha * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      dots.forEach((dot) => {
        const dotGradient = ctx.createRadialGradient(
          dot.x,
          dot.y,
          0,
          dot.x,
          dot.y,
          dot.r * 4
        );

        dotGradient.addColorStop(0, "rgba(255,210,31,.9)");
        dotGradient.addColorStop(1, "rgba(255,210,31,0)");

        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  

  return (
  <canvas
    id="bg"
    className="fixed inset-0 z-0 h-full w-full"
    aria-hidden="true"
  />
);
}

export default AnimatedBackground;