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
        alignItems: "stretch",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 70% 50%, rgba(217,119,6,0.11) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Partículas flotantes solo en zona del texto */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -28, 0], rotate: [0, 8, -8, 0], opacity: [0.07, 0.15, 0.07] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.9, ease: "easeInOut" }}
          style={{
            position: "absolute",
            fontSize: `${1 + (i % 3) * 0.5}rem`,
            left: `${4 + i * 8}%`,
            top: `${15 + (i % 4) * 18}%`,
            userSelect: "none", pointerEvents: "none", zIndex: 0,
          }}
        >
          {p}
        </motion.span>
      ))}

      {/* ── COLUMNA IZQUIERDA: texto ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem 2.5rem 5rem 4rem",
        position: "relative",
        zIndex: 1,
        minWidth: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: "99px", padding: "6px 16px", marginBottom: "1.6rem", width: "fit-content" }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#65a30d", animation: "pulse-ring 1.5s ease-out infinite", flexShrink: 0 }} />
          <span style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>Pan recién horneado todos los días</span>
        </motion.div>

        <h1
          ref={headRef}
          style={{
            fontSize: "clamp(2.8rem, 5.8vw, 6rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1.6rem",
            overflow: "hidden",
          }}
        >
          <span style={{ display: "inline", color: "#fef9f0" }}>El sabor </span>
          <span style={{ display: "inline", background: "linear-gradient(135deg, #d97706, #f59e0b, #fef3c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>artesanal</span>
          <span style={{ display: "inline", color: "#fef9f0" }}>{" de siempre"}</span>
        </h1>

        <p ref={subRef} style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)", color: "#a37a50", lineHeight: 1.75, maxWidth: "430px", marginBottom: "2.5rem" }}>
          Panes, tortas y pasteles elaborados con ingredientes naturales. Recógelo en tienda o pídelo con delivery en Callao.
        </p>

        <div ref={ctaRef} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
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

        {/* Stats + separadores */}
        <div style={{ display: "flex", gap: "0", flexWrap: "wrap" }}>
          {[
            { value: "+500", label: "Productos vendidos/día" },
            { value: "100%", label: "Ingredientes naturales" },
            { value: "S/ 5", label: "Costo de delivery" },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "stretch" }}>
              {i !== 0 && (
                <div style={{ width: "1px", background: "linear-gradient(to bottom, transparent, rgba(217,119,6,0.3), transparent)", margin: "0 1.8rem" }} />
              )}
              <div>
                <div style={{ fontSize: "2rem", fontWeight: 900, background: "linear-gradient(135deg, #d97706, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: "#7c5a38", marginTop: "4px", fontWeight: 500, letterSpacing: "0.03em" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SEPARADOR VERTICAL CENTRAL ── */}
      <div style={{
        width: "1px",
        alignSelf: "stretch",
        background: "linear-gradient(to bottom, transparent 5%, rgba(217,119,6,0.18) 30%, rgba(217,119,6,0.25) 50%, rgba(217,119,6,0.18) 70%, transparent 95%)",
        flexShrink: 0,
        zIndex: 1,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "36px", height: "36px",
          background: "rgba(217,119,6,0.12)",
          border: "1px solid rgba(217,119,6,0.3)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem",
        }}>
          🌾
        </div>
      </div>

      {/* ── COLUMNA DERECHA: molino ── */}
      <div style={{
        width: "clamp(300px, 44%, 580px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
        paddingBottom: "0",
      }}>
        <Windmill style={{ height: "88vh", width: "auto", display: "block", maxWidth: "100%" }} />
      </div>
    </section>
  );
}
