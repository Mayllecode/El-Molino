"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          style={{ position: "fixed", bottom: "2rem", left: "2rem", zIndex: 50 }}
        >
          <div style={{ position: "relative" }}>
            <motion.span
              animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#25d366", pointerEvents: "none" }}
            />
            <motion.a
              href="https://wa.me/51947792097?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20Panadera%C3%ADa%20El%20Dominio%20%F0%9F%8D%9E"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#25d366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", position: "relative" }}
              aria-label="Contactar por WhatsApp"
            >
              <FaWhatsapp />
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
