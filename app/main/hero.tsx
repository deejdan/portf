"use client";

import { useEffect, useRef } from "react";
import { coilPaths, RESTING_COIL_PATHS } from "./coil-geometry";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function Sculpture() {
  const sculpture = useRef<HTMLDivElement>(null);
  const wireframe = useRef<SVGGElement>(null);

  useEffect(() => {
    const hero = sculpture.current?.closest(".hero");
    const paths = wireframe.current?.querySelectorAll("path");
    if (!hero || !paths) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let current = 0;
    let target = 0;
    let lastTime = 0;
    const draw = (position: number) => {
      coilPaths(position).forEach((path, index) => paths[index].setAttribute("d", path));
    };
    const animate = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-elapsed / 1000));
      const settled = Math.abs(target - current) < 0.0005;
      if (settled) current = target;
      draw(current);
      frame = settled ? 0 : requestAnimationFrame(animate);
    };
    const steer = (position: number) => {
      target = position;
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(animate);
      }
    };
    const move = (event: Event) => {
      const pointer = event as PointerEvent;
      if (reduced.matches || !finePointer.matches || pointer.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      steer(Math.max(-1, Math.min(1, ((pointer.clientX - bounds.left) / bounds.width) * 2 - 1)));
    };
    const reset = () => steer(0);
    const resetImmediately = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      current = target = lastTime = 0;
      draw(0);
    };
    const visibility = () => { if (document.hidden) resetImmediately(); };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    hero.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", resetImmediately);
    finePointer.addEventListener("change", resetImmediately);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      hero.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", resetImmediately);
      finePointer.removeEventListener("change", resetImmediately);
    };
  }, []);
  return (
    <div ref={sculpture} className="sculpture" aria-hidden="true">
      <div className="sculpture-halo" />
      <svg className="sculpture-svg" viewBox="0 0 600 600" fill="none">
        <defs>
          <linearGradient
            id="blue-wire"
            x1="100"
            y1="130"
            x2="470"
            y2="480"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9cb8ff" />
            <stop offset=".36" stopColor="#4277ef" />
            <stop offset=".72" stopColor="#173974" />
            <stop offset="1" stopColor="#6397ff" />
          </linearGradient>
        </defs>
        <g
          className="construction-lines"
          stroke="currentColor"
          strokeWidth=".6"
        >
          <circle cx="300" cy="300" r="253" strokeDasharray="2 7" />
          <path d="M22 300h556M300 22v556M105 105l390 390" />
          <path d="M43 294v12m514-12v12M294 43h12m-12 514h12" />
        </g>
        <g ref={wireframe} stroke="url(#blue-wire)" strokeWidth=".8">
          {RESTING_COIL_PATHS.map((path, index) => (
            <path
              key={index}
              d={path}
              opacity={0.4 + 0.5 * (index / RESTING_COIL_PATHS.length)}
            />
          ))}
        </g>
        <circle cx="300" cy="47" r="3" fill="#6d99ff" />
        <circle cx="553" cy="300" r="2" fill="#6d99ff" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let scrollFrame = 0;
    let pointerFrame = 0;
    let fadeTimer: ReturnType<typeof setTimeout>;
    const updateScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        element.style.setProperty(
          "--dock",
          String(Math.min(window.scrollY / 300, 1)),
        );
        element.style.setProperty(
          "--scroll",
          reduced.matches
            ? "0"
            : String(Math.min(window.scrollY / window.innerHeight, 1)),
        );
      });
    };
    const move = (event: PointerEvent) => {
      if (
        !finePointer.matches ||
        reduced.matches ||
        event.pointerType === "touch"
      )
        return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        if (!trail.current) return;
        trail.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        trail.current.style.opacity = "1";
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => {
          if (trail.current) trail.current.style.opacity = "0";
        }, 100);
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    element.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      element.removeEventListener("pointermove", move);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(pointerFrame);
      clearTimeout(fadeTimer);
    };
  }, []);

  const openWork = () => dialog.current?.showModal();
  return (
    <main ref={root} className="portfolio" id="top">
      <a className="skip-link" href="#introduction">
        Skip to introduction
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Daniel, home">
          daniel<span>.</span>
        </a>
        <nav className="navigation" aria-label="Main navigation">
          {["About", "Philosophy", "Experience", "Skills"].map((item) => (
            <span
              className="upcoming-nav"
              key={item}
              aria-disabled="true"
              title={`${item} — coming in the next chapters`}
            >
              {item}
            </span>
          ))}
          <button onClick={openWork}>
            Building
            <span className="nav-dot" />
          </button>
        </nav>
        <button className="header-cta" onClick={openWork}>
          Explore my work <Arrow diagonal />
        </button>
      </header>
      <section className="hero" id="introduction" aria-labelledby="hero-title">
        <div className="hero-content">
          <div className="eyebrow entrance">
            <span className="blue-dot" /> FULLSTACK SOFTWARE ENGINEER
          </div>
          <h1 id="hero-title">
            <span className="headline-mask">
              <span>I’m <em>Daniel.</em></span>
            </span>
            <span className="headline-mask">
              <span>I build software</span>
            </span>
            <span className="headline-mask">
              <span>
                that <em>matters.</em>
              </span>
            </span>
          </h1>
          <div className="hero-support entrance">
            <p className="disciplines">
              Fullstack <span>·</span> Backend <span>·</span> Systems{" "}
              <span>·</span> AI
            </p>
            <p className="intro-copy">
              Thoughtful engineering. Understandable systems.
              <br className="desktop-break" /> Software built with purpose, from
              interface to infrastructure.
            </p>
          </div>
          <div className="hero-actions entrance">
            <button className="primary-cta" onClick={openWork}>
              Explore my work <Arrow />
            </button>
            <span className="cta-note">From ideas to things that work.</span>
          </div>
        </div>
        <div className="hero-art entrance">
          <Sculpture />
        </div>
        <div className="hero-footer entrance">
          <span className="footer-location">
            <span className="location-mark" aria-hidden="true">
              ↗
            </span>{" "}
            BASED IN THE PHILIPPINES
          </span>
          <span className="footer-thought">
            A deliberate approach to a complex world.
          </span>
          <span className="chapter-number">
            <span>01</span> / 06
          </span>
        </div>
      </section>
      <div ref={trail} className="cursor-atmosphere" aria-hidden="true" />
      <dialog
        ref={dialog}
        className="work-dialog"
        aria-labelledby="work-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="work-preview">
          <button
            className="dialog-close"
            onClick={() => dialog.current?.close()}
            aria-label="Close project preview"
          >
            ×
          </button>
          <p className="eyebrow">
            <span className="blue-dot" /> CURRENTLY BUILDING
          </p>
          <h2 id="work-title">
            Software for problems
            <br />
            <em>close to home.</em>
          </h2>
          <div className="project-summary">
            <span className="project-status">01 — EARLY EXPLORATION</span>
            <h3>Student Management System</h3>
            <p>
              Exploring an accessible way for schools to manage repetitive
              student workflows, comfortably from the devices teachers already
              own.
            </p>
            <p className="project-focus">
              Student records · Scheduling · Mobile usability
            </p>
          </div>
          <button
            className="text-button"
            onClick={() => dialog.current?.close()}
          >
            Back to the introduction <Arrow />
          </button>
        </div>
      </dialog>
    </main>
  );
}
