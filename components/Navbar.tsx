"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { GiBread } from "react-icons/gi";
import { HiShoppingCart, HiMenuAlt3, HiX } from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Carta", href: "#carta" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, { x: -30, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(linksRef.current?.children ? Array.from(linksRef.current.children) : [], {
        y: -20, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.3, ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 2rem",
          background: scrolled ? "rgba(18,10,0,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(217,119,6,0.2)" : "none",
          transition: "background 0.4s, border 0.4s",
          height: "72px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <div ref={logoRef} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #d97706, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GiBread style={{ color: "#120a00", fontSize: "1.3rem" }} />
          </div>
          <div>
            <span style={{ fontWeight: 900, fontSize: "1.1rem", background: "linear-gradient(135deg, #d97706, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              El Molino
            </span>
            <span style={{ display: "block", fontSize: "0.6rem", color: "#a37a50", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "-2px" }}>Panadería</span>
          </div>
        </div>

        <ul ref={linksRef} style={{ display: "flex", gap: "2.5rem", listStyle: "none", padding: 0, margin: 0 }} className="hidden-mobile">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href} style={{ color: "#a37a50", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#f59e0b")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#a37a50")}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={openCart}
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#fef9f0", fontSize: "1.4rem", padding: "4px", display: "flex" }}
            aria-label="Ver carrito"
          >
            <HiShoppingCart />
            {totalItems > 0 && <span className="cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>}
          </button>

          <a href="#carta" style={{
            background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#120a00",
            borderRadius: "10px", padding: "0.55rem 1.25rem", fontWeight: 700,
            fontSize: "0.88rem", textDecoration: "none", whiteSpace: "nowrap",
          }}>
            Hacer pedido
          </a>

          <button
            onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "none", color: "#fef9f0", cursor: "pointer", fontSize: "1.5rem", display: "none", alignItems: "center" }}
            className="show-mobile"
            aria-label="Menú"
          >
            <HiMenuAlt3 />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(18,10,0,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#a37a50", fontSize: "1.8rem", cursor: "pointer" }}><HiX /></button>
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ color: "#fef9f0", fontSize: "1.8rem", fontWeight: 700, textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
