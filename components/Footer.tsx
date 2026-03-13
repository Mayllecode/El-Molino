"use client";

import { GiBread } from "react-icons/gi";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiClock } from "react-icons/hi";

const schedule = [
  { day: "Lunes – Viernes", hours: "6:00 AM – 9:00 PM" },
  { day: "Sábado", hours: "6:00 AM – 10:00 PM" },
  { day: "Domingo", hours: "6:00 AM – 8:00 PM" },
];

export default function Footer() {
  return (
    <footer id="contacto" style={{ backgroundColor: "#0a0500", borderTop: "1px solid rgba(217,119,6,0.12)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #d97706, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GiBread style={{ color: "#120a00", fontSize: "1.2rem" }} />
              </div>
              <span style={{ fontWeight: 900, fontSize: "1.1rem", background: "linear-gradient(135deg, #d97706, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                El Molino
              </span>
            </div>
            <p style={{ color: "#7c5a38", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Pan artesanal horneado con amor cada mañana en el Callao. Sin conservantes, sin prisa.
            </p>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {[
                { icon: <FaWhatsapp />, href: "https://wa.me/51947792097", color: "#25d366" },
                { icon: <FaInstagram />, href: "#", color: "#e1306c" },
                { icon: <FaFacebook />, href: "#", color: "#1877f2" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(217,119,6,0.12)", color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = s.color; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(217,119,6,0.12)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fef9f0", fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Horarios</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {schedule.map((s) => (
                <div key={s.day} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <HiClock style={{ color: "#d97706", flexShrink: 0 }} />
                    <span style={{ color: "#7c5a38", fontSize: "0.85rem" }}>{s.day}</span>
                  </div>
                  <span style={{ color: "#a37a50", fontSize: "0.85rem", fontWeight: 600 }}>{s.hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fef9f0", fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contacto</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {[
                { icon: <HiLocationMarker />, text: "Av. El Olivar 547, Callao 07041" },
                { icon: <HiPhone />, text: "947 792 097" },
                { icon: <FaWhatsapp />, text: "WhatsApp: 947 792 097" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#d97706", marginTop: "2px", flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: "#7c5a38", fontSize: "0.85rem", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fef9f0", fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Dónde estamos</h4>
            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(217,119,6,0.15)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.234!2d-77.0949897!3d-12.0167293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ce99ee696fe3%3A0x5a8ef86b4eacb5cf!2sParadise+El+Moulin!5e0!3m2!1ses!2spe!4v1620000000000"
                width="100%"
                height="180"
                style={{ border: 0, display: "block", filter: "invert(92%) hue-rotate(180deg) saturate(0.6)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Panadería El Molino"
              />
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(217,119,6,0.08)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "#4a2e0e", fontSize: "0.78rem" }}>© {new Date().getFullYear()} Panadería El Molino. Callao, Perú.</p>
          <p style={{ color: "#4a2e0e", fontSize: "0.78rem" }}>Pedido mínimo S/ 10.00 · Delivery S/ 5.00</p>
        </div>
      </div>
    </footer>
  );
}
