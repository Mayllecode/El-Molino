"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GiBread, GiWheat } from "react-icons/gi";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const facts = [
  { icon: <GiBread />, label: "Horneamos desde las 6am", color: "#d97706" },
  { icon: <GiWheat />, label: "Insumos 100% naturales", color: "#65a30d" },
  { icon: <FaClock />, label: "Abierto de Lun a Dom", color: "#f59e0b" },
  { icon: <FaMapMarkerAlt />, label: "Av. El Olivar 547, Callao", color: "#d97706" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="nosotros" ref={ref} style={{ backgroundColor: "#1c1005", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            style={{ color: "#d97706", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: "1rem" }}
          >
            Sobre nosotros
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}
          >
            Más de una década{" "}
            <span className="gradient-text">llenando</span>{" "}
            tu mesa
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{ color: "#a37a50", lineHeight: 1.8, marginBottom: "1.2rem" }}
          >
            Somos una panadería familiar ubicada en el corazón del Callao. Desde que abrimos nuestras puertas, nos dedicamos a elaborar pan con amor y con las mismas recetas de siempre: sin conservantes, sin atajos.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            style={{ color: "#a37a50", lineHeight: 1.8 }}
          >
            Nuestro horno nunca descansa. Cada mañana horneamos pan francés, ciabattas, kekes y tortas para que lleguen frescos a tu mesa — o a tu puerta con delivery.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        >
          {facts.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{ background: "#231608", border: "1px solid rgba(217,119,6,0.12)", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <span style={{ color: f.color, fontSize: "1.8rem" }}>{f.icon}</span>
              <span style={{ color: "#fef3c7", fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.4 }}>{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
