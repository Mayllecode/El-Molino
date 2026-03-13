"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Windmill from "@/components/Windmill";

const particles = ["🍞", "🥐", "🎂", "🥖", "🍰", "🧁"];

export default function Hero() {
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { openCart } = useCart();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(headRef.current?.querySelectorAll("span") ?? [], { y: 60, opacity: 0, stagger: 0.12, duration: 0.9 })
        .from(subRef.current, { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [], { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "7rem 0 5rem",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 65% 40%, rgba(217,119,6,0.13) 0%, transparent 70%)", pointerEvents: "none" }} />

      {particles.map((p, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute", fontSize: `${1.2 + (i % 3) * 0.6}rem`,
            left: `${46 + i * 9}%`, top: `${18 + (i % 3) * 22}%`,
            userSelect: "none", pointerEvents: "none", zIndex: 0,
          }}
        >
          {p}
        </motion.span>
      ))}

      {/* ── COLUMNA IZQUIERDA: molino inmenso ── */}
      <div style={{
        width: "clamp(260px, 36%, 500px)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
      }}>
        <Windmill style={{ height: "92vh", width: "auto", display: "block", maxWidth: "100%" }} />
      </div>

      {/* ── COLUMNA DERECHA: texto ── */}
      <div style={{ flex: 1, padding: "0 3rem 0 1.5rem", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: "99px", padding: "6px 16px", marginBottom: "2rem" }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#65a30d", animation: "pulse-ring 1.5s ease-out infinite" }} />
          <span style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: 600 }}>Pan recién horneado todos los días</span>
        </motion.div>

        <h1 ref={headRef} style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem", overflow: "hidden" }}>
          <span style={{ display: "block", color: "#fef9f0" }}>El sabor</span>
          <span style={{ display: "block", background: "linear-gradient(135deg, #d97706, #f59e0b, #fef3c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            artesanal
          </span>
          <span style={{ display: "block", color: "#fef9f0" }}>de siempre</span>
        </h1>

        <p ref={subRef} style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)", color: "#a37a50", lineHeight: 1.7, maxWidth: "460px", marginBottom: "2.5rem" }}>
          Panes, tortas y pasteles elaborados con ingredientes naturales. Recógelo en tienda o pídelo con delivery directo a tu puerta en Callao.
        </p>

        <div ref={ctaRef} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a
            href="#carta"
            style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#120a00", padding: "0.85rem 2.5rem", borderRadius: "12px", fontWeight: 800, fontSize: "1rem", textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 24px rgba(217,119,6,0.35)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
          >
            Ver carta completa 🍞
          </a>
          <button
            onClick={openCart}
            style={{ background: "transparent", border: "2px solid rgba(217,119,6,0.4)", color: "#f59e0b", padding: "0.85rem 2rem", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(217,119,6,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Ver mi pedido
          </button>
        </div>

        <div style={{ display: "flex", gap: "2.5rem", marginTop: "3.5rem", flexWrap: "wrap" }}>
          {[
            { value: "+500", label: "Productos vendidos/día" },
            { value: "100%", label: "Ingredientes naturales" },
            { value: "S/5", label: "Costo de delivery" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, background: "linear-gradient(135deg, #d97706, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#a37a50", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
