import { useEffect, useRef } from "react";

/**
 * Jal-Rakshak — Landing Page
 * Self-contained React component (scroll-driven hero + feature grid).
 *
 * All styles live inside this file's own <style> tag, scoped under the
 * `.jr-landing` root class, and every internal class name is prefixed
 * with `jr-` so nothing here can be overridden by (or bleed into)
 * App.css / index.css / global stylesheets.
 *
 * Usage:
 *   import LandingPage from "./LandingPage";
 *   <LandingPage />
 */

const FEATURES = [
  { label: "Dashboard", badge: null, headline: "City-wide flood posture at a glance", stat: "ORANGE", statLabel: "Threat level", accent: "jr-accent-orange" },
  { label: "Flood Map", badge: "LIVE", headline: "Real-time inundation over street-level tiles", stat: "34.7 km²", statLabel: "Submerged area", accent: "jr-accent-cyan" },
  { label: "Simulation", badge: "AI", headline: 'Run "what-if" storms before they happen', stat: "99%", statLabel: "Flood probability", accent: "jr-accent-cyan" },
  { label: "Predictions", badge: "0–6H", headline: "Short-horizon nowcasts from live telemetry", stat: "Immediate", statLabel: "Time to flooding", accent: "jr-accent-cyan" },
  { label: "Safe Routes", badge: "GPS", headline: "Reroute residents around submerged roads", stat: "1.09 m", statLabel: "Max surface depth", accent: "jr-accent-cyan" },
  { label: "Multi-City", badge: "10 METROS", headline: "One console across every monitored metro", stat: "10", statLabel: "Cities live", accent: "jr-accent-cyan" },
  { label: "Alerts", badge: "3 NEW", headline: "Broadcast advisories the moment risk spikes", stat: "3.42 m", statLabel: "Mithi River level", accent: "jr-accent-red" },
  { label: "Infrastructure", badge: "38/42", headline: "Track pumps, drains and sensor uptime", stat: "142/148", statLabel: "SCADA sensors online", accent: "jr-accent-cyan" },
];

const WAVE_PATH =
  "M0,64 C120,110 240,10 360,48 C480,86 600,130 720,96 C840,62 960,10 1080,32 C1200,54 1320,110 1440,80 L1440,220 L0,220 Z";

function Wave({ fill, stroke, strokeWidth }) {
  return (
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
      <path d={WAVE_PATH} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

export function LandingPage() {
  const rootRef = useRef(null);
  const heroWrapRef = useRef(null);
  const waveFieldRef = useRef(null);
  const globeRef = useRef(null);
  const heroContentRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const parentScroller = root.parentElement;
    const scrollContainer = parentScroller && parentScroller.scrollHeight > parentScroller.clientHeight
      ? parentScroller
      : window;
    let raf = 0;

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const heroWrap = heroWrapRef.current;
        const waveField = waveFieldRef.current;
        const globe = globeRef.current;
        const heroContent = heroContentRef.current;
        if (!heroWrap || !waveField || !globe || !heroContent) return;

        const viewportHeight = scrollContainer === window
          ? window.innerHeight
          : scrollContainer.clientHeight;
        const scrollTop = scrollContainer === window
          ? window.scrollY
          : scrollContainer.scrollTop;
        const scrollable = heroWrap.offsetHeight - viewportHeight;
        const progress = scrollable > 0
          ? Math.min(Math.max(scrollTop / scrollable, 0), 1)
          : 0;

        waveField.style.transform = `translateY(${progress * 60}vh)`;
        waveField.style.opacity = String(1 - progress * 0.9);

        const rise = Math.min(progress / 0.70, 1);
        const translateY = 34 - rise * 34;
        const scale = 0.72 + rise * 0.28;
        globe.style.transform = `translate(-50%, ${translateY}vh) scale(${scale})`;
        globe.style.opacity = String(0.25 + rise * 0.75);

        const contentFade = Math.min(progress / 0.55, 1);
        heroContent.style.opacity = String(1 - contentFade);
        heroContent.style.transform = `translateY(${contentFade * -24}px)`;
      });
    }

    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const popEls = root.querySelectorAll(".jr-pop");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("jr-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    popEls.forEach((el) => observer.observe(el));

    let tickId = 0;
    let onMouseMove;
    let onClick;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    if (!isCoarse) {
      const pos = { x: -9999, y: -9999 };
      const target = { x: -9999, y: -9999 };

      onMouseMove = (e) => {
        target.x = e.clientX;
        target.y = e.clientY;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      onClick = (e) => {
        const ripple = document.createElement("div");
        ripple.className = "jr-ripple";
        const size = 140;
        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.left = e.clientX - size / 2 + "px";
        ripple.style.top = e.clientY - size / 2 + "px";
        root.appendChild(ripple);
        setTimeout(() => ripple.remove(), 900);
      };
      window.addEventListener("click", onClick);

      const tick = () => {
        pos.x += (target.x - pos.x) * 0.15;
        pos.y += (target.y - pos.y) * 0.15;
        const glow = glowRef.current;
        if (glow) glow.style.transform = `translate(${pos.x - 160}px, ${pos.y - 160}px)`;
        tickId = requestAnimationFrame(tick);
      };
      tickId = requestAnimationFrame(tick);
    }

    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      observer.disconnect();
      if (onMouseMove) window.removeEventListener("mousemove", onMouseMove);
      if (onClick) window.removeEventListener("click", onClick);
      if (tickId) cancelAnimationFrame(tickId);
    };
  }, []);

  return (
    <div className="jr-landing" ref={rootRef}>
      <style>{STYLES}</style>

      <div className="jr-cursor-glow" ref={glowRef} />

      <div className="jr-hero-wrap" ref={heroWrapRef}>
        <div className="jr-hero-sticky">
          <div className="jr-hero-bg" />

          <div className="jr-wave-field" ref={waveFieldRef}>
            <div className="jr-wave-layer jr-back">
              <Wave fill="rgba(34,211,238,0.10)" />
              <Wave fill="rgba(34,211,238,0.10)" />
            </div>
            <div className="jr-wave-layer jr-mid">
              <Wave fill="rgba(6,182,212,0.20)" />
              <Wave fill="rgba(6,182,212,0.20)" />
            </div>
            <div className="jr-wave-layer jr-front">
              <Wave fill="#0A2A3D" stroke="rgba(103,232,249,0.35)" strokeWidth="2" />
              <Wave fill="#0A2A3D" stroke="rgba(103,232,249,0.35)" strokeWidth="2" />
            </div>
          </div>

          <div className="jr-globe" ref={globeRef}>
            <svg width="360" height="360" viewBox="0 0 360 360">
              <defs>
                <radialGradient id="jr-globe-fill" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#123A4E" />
                  <stop offset="55%" stopColor="#0A2333" />
                  <stop offset="100%" stopColor="#050D14" />
                </radialGradient>
              </defs>
              <circle cx="180" cy="180" r="150" fill="url(#jr-globe-fill)" stroke="rgba(103,232,249,0.5)" strokeWidth="1.5" />
              <g stroke="rgba(103,232,249,0.28)" strokeWidth="1" fill="none">
                <ellipse cx="180" cy="180" rx="150" ry="46" />
                <ellipse cx="180" cy="180" rx="150" ry="98" />
                <ellipse cx="180" cy="180" rx="98" ry="150" />
                <ellipse cx="180" cy="180" rx="46" ry="150" />
              </g>
              <circle
                cx="180"
                cy="180"
                r="150"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="1.5"
                strokeDasharray="8 14"
                style={{ animation: "jr-globe-spin 18s linear infinite" }}
              />
              <circle cx="180" cy="40" r="4" fill="#22D3EE" className="jr-sensor-dot" style={{ animationDelay: "0s" }} />
              <circle cx="300" cy="120" r="4" fill="#22D3EE" className="jr-sensor-dot" style={{ animationDelay: ".35s" }} />
              <circle cx="300" cy="240" r="4" fill="#22D3EE" className="jr-sensor-dot" style={{ animationDelay: ".7s" }} />
              <circle cx="180" cy="320" r="4" fill="#22D3EE" className="jr-sensor-dot" style={{ animationDelay: "1.05s" }} />
              <circle cx="60" cy="240" r="4" fill="#22D3EE" className="jr-sensor-dot" style={{ animationDelay: "1.4s" }} />
              <circle cx="60" cy="120" r="4" fill="#22D3EE" className="jr-sensor-dot" style={{ animationDelay: "1.75s" }} />
            </svg>
          </div>

          <div className="jr-hero-content" ref={heroContentRef}>
            <div className="jr-eyebrow jr-hero-item" style={{ animationDelay: "80ms" }}>
              SIH26085 · Urban Flood Nowcasting
            </div>
            <h1 className="jr-h1 jr-hero-item" style={{ animationDelay: "200ms" }}>
              The water rises.
              <br />
              <span className="jr-accent">Jal-Rakshak</span> sees it first.
            </h1>
            <p className="jr-subhead jr-hero-item" style={{ animationDelay: "380ms" }}>
              Scroll to watch a city&apos;s worth of sensors, simulations and safe routes surface from the water.
            </p>
            <div className="jr-scroll-hint jr-hero-item" style={{ animationDelay: "520ms" }}>
              Scroll ↓
            </div>
          </div>
        </div>
      </div>

      <section className="jr-surface">
        <div className="jr-pop jr-surface-intro">
          <div className="jr-surface-eyebrow">What surfaces</div>
          <h2 className="jr-h2">One command center for the whole flood lifecycle.</h2>
        </div>

        <div className="jr-grid">
          {FEATURES.map((f, i) => (
            <div className="jr-pop" style={{ animationDelay: `${i * 70}ms` }} key={f.label}>
              <div className="jr-card">
                <div className="jr-card-top">
                  <span className="jr-card-label">{f.label}</span>
                  {f.badge && <span className={`jr-card-badge ${f.accent}`}>{f.badge}</span>}
                </div>
                <p className="jr-card-headline">{f.headline}</p>
                <div className={`jr-card-stat ${f.accent}`}>{f.stat}</div>
                <div className="jr-card-stat-label">{f.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="jr-pop jr-cta-wrap">
          <a className="jr-cta" href="/dashboard">
            Enter Command Center →
          </a>
        </div>
      </section>
    </div>
  );
}

const STYLES = `
.jr-landing {
  --jr-bg: #05070D;
  --jr-cyan: #22D3EE;
  --jr-cyan-light: #67E8F9;
  --jr-card-bg: rgba(13,17,25,0.55);
  --jr-card-border: rgba(255,255,255,0.07);
  --jr-white-90: rgba(255,255,255,0.9);
  --jr-white-60: rgba(255,255,255,0.6);
  --jr-white-40: rgba(255,255,255,0.4);
  --jr-orange: #FB923C;
  --jr-red: #F87171;

  position: relative;
  background: var(--jr-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  overflow-x: hidden;
  isolation: isolate;
}
.jr-landing, .jr-landing *, .jr-landing *::before, .jr-landing *::after {
  box-sizing: border-box;
}
.jr-landing h1, .jr-landing h2, .jr-landing p { margin: 0; padding: 0; }
.jr-landing a { margin: 0; text-decoration: none; }

@keyframes jr-wave-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes jr-globe-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes jr-globe-spin { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -240; } }
@keyframes jr-sensor-pulse { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
@keyframes jr-pop-in {
  0%   { opacity: 0; transform: translateY(28px) scale(0.94); }
  70%  { opacity: 1; transform: translateY(-4px) scale(1.015); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes jr-ripple-expand { from { transform: scale(0); opacity: 0.55; } to { transform: scale(1); opacity: 0; } }

.jr-wave-layer { position: absolute; bottom: 0; left: 0; width: 200%; height: 40vh; animation: jr-wave-drift 22s linear infinite; }
.jr-wave-layer.jr-mid { height: 32vh; animation-duration: 14s; animation-direction: reverse; }
.jr-wave-layer.jr-front { height: 22vh; animation-duration: 9s; }
.jr-wave-layer svg { width: 50%; height: 100%; display: inline-block; }

.jr-hero-wrap { position: relative; height: 180vh; }
.jr-hero-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.jr-hero-bg { position: absolute; inset: 0; background: var(--jr-bg); }
.jr-wave-field { position: absolute; inset: 0; overflow: hidden; pointer-events: none; will-change: transform, opacity; }

.jr-globe { position: absolute; left: 50%; bottom: 6vh; animation: jr-globe-bob 6s ease-in-out infinite; will-change: transform, opacity; }
.jr-globe svg { filter: drop-shadow(0 0 60px rgba(34,211,238,0.35)); }
.jr-sensor-dot { animation: jr-sensor-pulse 2.4s ease-in-out infinite; }

.jr-hero-content {
  position: relative; z-index: 10; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 0 24px; will-change: transform, opacity;
}
.jr-eyebrow { color: var(--jr-cyan-light); opacity: 0.8; font-size: 12px; font-family: 'Courier New', monospace; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 20px; }
.jr-h1 { color: #fff; font-size: 40px; font-weight: 600; line-height: 0.98; letter-spacing: -0.01em; max-width: 900px; }
.jr-h1 .jr-accent { color: var(--jr-cyan); }
@media (min-width: 640px)  { .jr-h1 { font-size: 60px; } }
@media (min-width: 1024px) { .jr-h1 { font-size: 76px; } }
.jr-subhead { color: var(--jr-white-60); font-size: 15px; max-width: 560px; margin-top: 24px; line-height: 1.6; }
@media (min-width: 640px) { .jr-subhead { font-size: 18px; } }
.jr-scroll-hint { margin-top: 40px; color: var(--jr-white-40); font-size: 12px; font-family: 'Courier New', monospace; letter-spacing: 0.15em; text-transform: uppercase; }

.jr-hero-item { opacity: 0; animation: jr-pop-in 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }

.jr-surface { position: relative; z-index: 10; padding: 24px 20px 96px; max-width: 1500px; margin: 0 auto; }
@media (min-width: 640px)  { .jr-surface { padding: 32px 32px 112px; } }
@media (min-width: 1024px) { .jr-surface { padding: 40px 64px 128px; } }
.jr-surface-eyebrow { color: var(--jr-cyan-light); opacity: 0.8; font-size: 12px; font-family: 'Courier New', monospace; letter-spacing: 0.25em; text-transform: uppercase; }
.jr-h2 { color: #fff; font-size: 32px; font-weight: 600; margin-top: 12px; line-height: 1.2; }
@media (min-width: 640px) { .jr-h2 { font-size: 44px; } }
.jr-surface-intro { max-width: 640px; margin-bottom: 56px; }

.jr-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 640px)  { .jr-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .jr-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }

.jr-card {
  border-radius: 18px; border: 1px solid var(--jr-card-border); background: var(--jr-card-bg);
  padding: 20px; transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}
.jr-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px -12px rgba(34,211,238,0.35); border-color: rgba(34,211,238,0.3); }
.jr-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.jr-card-label { color: var(--jr-white-90); font-size: 13px; font-weight: 500; letter-spacing: 0.02em; }
.jr-card-badge { font-size: 10px; font-family: 'Courier New', monospace; padding: 3px 8px; border-radius: 99px; border: 1px solid var(--jr-card-border); background: rgba(255,255,255,0.04); }
.jr-card-headline { color: var(--jr-white-60); font-size: 13px; line-height: 1.4; margin-bottom: 24px; min-height: 36px; }
.jr-card-stat { font-size: 26px; font-weight: 600; }
.jr-card-stat-label { color: var(--jr-white-40); font-size: 11px; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
.jr-accent-cyan { color: var(--jr-cyan-light); }
.jr-accent-orange { color: var(--jr-orange); }
.jr-accent-red { color: var(--jr-red); }

.jr-cta-wrap { margin-top: 64px; display: flex; justify-content: center; }
.jr-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-height: 58px; padding: 16px 48px;
  border-radius: 14px; background: var(--jr-cyan-light); color: var(--jr-bg); font-size: 15px; font-weight: 600;
  transition: background 0.3s, box-shadow 0.3s;
}
.jr-cta:hover { background: #a5f3fc; box-shadow: 0 0 50px -8px rgba(34,211,238,0.6); }

.jr-pop { opacity: 0; }
.jr-pop.jr-visible { animation: jr-pop-in 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }

.jr-cursor-glow {
  position: fixed; top: 0; left: 0; width: 320px; height: 320px; border-radius: 50%;
  pointer-events: none; z-index: 60; mix-blend-mode: screen;
  background: radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(34,211,238,0) 70%);
  transform: translate(-9999px, -9999px);
}
.jr-ripple {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 9999;
  border: 1.5px solid rgba(103,232,249,0.65);
  animation: jr-ripple-expand 900ms cubic-bezier(0.16,1,0.3,1) forwards;
}

@media (pointer: coarse) { .jr-landing .jr-cursor-glow { display: none; } }
`;
