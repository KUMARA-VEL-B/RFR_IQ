import { useEffect, useRef } from "react";

/**
 * HeroShipCanvas: High-performance lightweight HTML5 Canvas rendering
 * cinematic ocean swell, atmospheric dawn/dusk horizon, water reflections,
 * ocean spray mist, and floating maritime particles.
 */
export function HeroShipCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Floating particles (ocean spray, glowing telemetry specks)
    const PARTICLE_COUNT = 65;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.45 - 0.2, // drifting slowly west/left
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.65 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      color: Math.random() > 0.4 ? "56, 189, 248" : "251, 191, 36", // cyan / gold
    }));

    let time = 0;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.016;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const horizonY = height * 0.58;

      // 1. Atmospheric sky gradient (Clean, light airy ocean-sky gradient)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, "#f8fbfe");
      skyGrad.addColorStop(0.45, "#edf4fa");
      skyGrad.addColorStop(0.78, "#e1effa");
      skyGrad.addColorStop(0.95, "#d4e8f7");
      skyGrad.addColorStop(1, "#c4def4");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Sunrise/Sunset horizon glow orb (Soft amber horizon shimmer)
      const sunX = width * 0.62 + (mouseX - width / 2) * 0.02;
      const sunY = horizonY - 12;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, width * 0.45);
      sunGlow.addColorStop(0, "rgba(251, 191, 36, 0.25)");
      sunGlow.addColorStop(0.25, "rgba(245, 158, 11, 0.12)");
      sunGlow.addColorStop(0.6, "rgba(56, 189, 248, 0.04)");
      sunGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, horizonY + 80);

      // 2. Horizon fog / atmospheric haze band (Subtle light cyan mist)
      const hazeGrad = ctx.createLinearGradient(0, horizonY - 35, 0, horizonY + 25);
      hazeGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      hazeGrad.addColorStop(0.5, "rgba(186, 230, 253, 0.25)");
      hazeGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, horizonY - 35, width, 60);

      // 3. Ocean body gradient (Horizon down to clean maritime blue ocean floor)
      const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      oceanGrad.addColorStop(0, "#b8dcf2");
      oceanGrad.addColorStop(0.25, "#9bc8e8");
      oceanGrad.addColorStop(0.7, "#7eb5dc");
      oceanGrad.addColorStop(1, "#66a3d1");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // 4. Multi-layer ocean wave harmonics & surface reflections
      const waveLayers = [
        { yBase: horizonY + 15, amp: 4, freq: 0.008, speed: 0.8, color: "rgba(56, 189, 248, 0.08)", lw: 1.5 },
        { yBase: horizonY + 45, amp: 7, freq: 0.006, speed: 1.1, color: "rgba(56, 189, 248, 0.12)", lw: 2 },
        { yBase: horizonY + 95, amp: 11, freq: 0.0045, speed: 1.3, color: "rgba(30, 64, 175, 0.18)", lw: 2.2 },
        { yBase: horizonY + 160, amp: 14, freq: 0.0035, speed: 1.5, color: "rgba(56, 189, 248, 0.15)", lw: 2.5 },
        { yBase: horizonY + 240, amp: 18, freq: 0.0028, speed: 1.7, color: "rgba(14, 165, 233, 0.10)", lw: 3 },
      ];

      for (let idx = 0; idx < waveLayers.length; idx++) {
        const layer = waveLayers[idx];
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lw;

        const offsetParallax = (mouseX - width / 2) * (0.008 * (idx + 1));
        const t = time * layer.speed;

        ctx.moveTo(0, layer.yBase);
        for (let x = 0; x <= width; x += 18) {
          const wave1 = Math.sin(x * layer.freq + t + offsetParallax) * layer.amp;
          const wave2 = Math.cos(x * layer.freq * 1.7 - t * 0.8) * (layer.amp * 0.4);
          const y = layer.yBase + wave1 + wave2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Golden horizon reflection on ocean surface (glitter line)
      const reflGrad = ctx.createLinearGradient(sunX - 140, 0, sunX + 140, 0);
      reflGrad.addColorStop(0, "rgba(251, 191, 36, 0)");
      reflGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.18)");
      reflGrad.addColorStop(1, "rgba(251, 191, 36, 0)");

      ctx.fillStyle = reflGrad;
      for (let r = 0; r < 9; r++) {
        const rwY = horizonY + 8 + r * 14;
        const rwWidth = 80 + r * 35;
        const rwOffset = Math.sin(time * 2 + r) * 16;
        ctx.fillRect(sunX - rwWidth / 2 + rwOffset, rwY, rwWidth, 2.5);
      }

      // 5. Floating ocean spray & glowing telemetry particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(time * 3 + i));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentOpacity})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 6. Subtle nautical chart grid over the ocean (faint lat/long coordinate lines)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.035)";
      ctx.lineWidth = 1;
      const gridStep = 75;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
  );
}
