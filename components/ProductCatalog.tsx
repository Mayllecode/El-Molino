"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { HiPlus, HiMinus, HiShoppingCart } from "react-icons/hi";
import { useCart, type Product } from "@/context/CartContext";
import { type DbProduct } from "@/lib/supabase";

const categories = ["Todos", "Panes", "Tortas", "Pasteles", "Bebidas"] as const;
type Category = typeof categories[number];

interface LocalProduct extends Product {
  image?: string;
}

const productImages: Record<string, string> = {
  "pan-frances":        "/pan%20frances.png",
  "pan-yema":           "/pan%20de%20yema.png",
  "pan-integral":       "/pan%20integral.png",
  "pan-molde":          "/Pan%20de%20Molde.jpg",
  "ciabatta":           "/Ciabatta.webp",
  "pan-chapla":         "/Pan%20Chapla.jpg",
  "torta-chocolate":    "/Torta%20de%20Chocolate.jpg",
  "torta-tres-leches":  "/Torta%20Tres%20Leches.jpg",
  "torta-vainilla":     "/Torta%20de%20Vainilla.jpg",
  "torta-frutas":       "/Torta%20de%20Frutas.jpg",
  "croissant":          "/Croissant.jpg",
  "empanada":           "/Empanada%20de%20Carne.jpg",
  "keke":               "/Keke%20Marmolado.png",
  "pionono":            "/Pionono.jpg",
  "alfajor":            "/Alfajor%20de%20Maicena.jpg",
  "galletas":           "/Galletas%20Artesanales.webp",
  "cafe":               "/Caf%C3%A9%20Americano.webp",
  "jugo-naranja":       "/jugo%20de%20naranja.png",
};

const fallbackProducts: LocalProduct[] = [
  { id: "pan-frances",       name: "Pan Franc\u00e9s",           price: 0.30,  category: "Panes",    emoji: "\uD83E\uDD56", unit: "unidad",   image: "/pan%20frances.png" },
  { id: "pan-yema",          name: "Pan de Yema",           price: 0.50,  category: "Panes",    emoji: "\uD83C\uDF5E", unit: "unidad",   image: "/pan%20de%20yema.png" },
  { id: "pan-integral",      name: "Pan Integral",          price: 0.50,  category: "Panes",    emoji: "\uD83C\uDF3E", unit: "unidad",   image: "/pan%20integral.png" },
  { id: "pan-molde",         name: "Pan de Molde",          price: 6.00,  category: "Panes",    emoji: "\uD83C\uDF5E", unit: "bolsa",    image: "/Pan%20de%20Molde.jpg" },
  { id: "ciabatta",          name: "Ciabatta",              price: 2.00,  category: "Panes",    emoji: "\uD83E\uDD56", unit: "unidad",   image: "/Ciabatta.webp" },
  { id: "pan-chapla",        name: "Pan Chapla",            price: 0.50,  category: "Panes",    emoji: "\uD83E\uDED3", unit: "unidad",   image: "/Pan%20Chapla.jpg" },
  { id: "torta-chocolate",   name: "Torta de Chocolate",    price: 38.00, category: "Tortas",   emoji: "\uD83C\uDF6B", unit: "torta",    image: "/Torta%20de%20Chocolate.jpg" },
  { id: "torta-tres-leches", name: "Torta Tres Leches",     price: 42.00, category: "Tortas",   emoji: "\uD83C\uDF82", unit: "torta",    image: "/Torta%20Tres%20Leches.jpg" },
  { id: "torta-vainilla",    name: "Torta de Vainilla",     price: 35.00, category: "Tortas",   emoji: "\uD83C\uDF82", unit: "torta",    image: "/Torta%20de%20Vainilla.jpg" },
  { id: "torta-frutas",      name: "Torta de Frutas",       price: 40.00, category: "Tortas",   emoji: "\uD83C\uDF53", unit: "torta",    image: "/Torta%20de%20Frutas.jpg" },
  { id: "croissant",         name: "Croissant",             price: 3.50,  category: "Pasteles", emoji: "\uD83E\uDD50", unit: "unidad",   image: "/Croissant.jpg" },
  { id: "empanada",          name: "Empanada de Carne",     price: 2.50,  category: "Pasteles", emoji: "\uD83E\uDD5F", unit: "unidad",   image: "/Empanada%20de%20Carne.jpg" },
  { id: "keke",              name: "Keke Marmolado",        price: 16.00, category: "Pasteles", emoji: "\uD83C\uDF70", unit: "pieza",    image: "/Keke%20Marmolado.png" },
  { id: "pionono",           name: "Pionono",               price: 14.00, category: "Pasteles", emoji: "\uD83C\uDF65", unit: "pieza",    image: "/Pionono.jpg" },
  { id: "alfajor",           name: "Alfajor de Maicena",    price: 2.00,  category: "Pasteles", emoji: "\uD83C\uDF6A", unit: "unidad",   image: "/Alfajor%20de%20Maicena.jpg" },
  { id: "galletas",          name: "Galletas Artesanales",  price: 9.00,  category: "Pasteles", emoji: "\uD83C\uDF6A", unit: "bolsa x6", image: "/Galletas%20Artesanales.webp" },
  { id: "cafe",              name: "Caf\u00e9 Americano",        price: 4.00,  category: "Bebidas",  emoji: "\u2615", unit: "vaso",     image: "/Caf%C3%A9%20Americano.webp" },
  { id: "chocolate",         name: "Chocolate Caliente",    price: 5.00,  category: "Bebidas",  emoji: "\uD83C\uDF75", unit: "vaso" },
  { id: "jugo-naranja",      name: "Jugo de Naranja",       price: 4.50,  category: "Bebidas",  emoji: "\uD83C\uDF4A", unit: "vaso",     image: "/jugo%20de%20naranja.png" },
];

function ProductCard({ product }: { product: LocalProduct }) {
  const { items, addItem, updateQty } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    if (qty === 0) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "#231608",
        border: `1px solid ${qty > 0 ? "rgba(217,119,6,0.45)" : "rgba(217,119,6,0.1)"}`,
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, transform 0.25s, box-shadow 0.25s",
        boxShadow: qty > 0 ? "0 0 0 1px rgba(217,119,6,0.2)" : "none",
      }}
      whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#1a0e04", flexShrink: 0 }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
            {product.emoji}
          </div>
        )}
        {qty > 0 && (
          <div style={{ position: "absolute", top: "10px", right: "10px", background: "#d97706", color: "#120a00", borderRadius: "99px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 800 }}>
            {qty} en carrito
          </div>
        )}
      </div>

      <div style={{ padding: "1.1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
        <div>
          <h3 style={{ fontWeight: 800, color: "#fef9f0", fontSize: "1.05rem", lineHeight: 1.3, marginBottom: "3px", letterSpacing: "-0.01em" }}>
            {product.name}
          </h3>
          <span style={{ fontSize: "0.76rem", color: "#7c5a38", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            por {product.unit}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem" }}>
          <span style={{ fontWeight: 900, fontSize: "1.35rem", color: "#f59e0b", letterSpacing: "-0.02em" }}>
            {"S/ "}{product.price.toFixed(2)}
          </span>

          {qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              style={{
                background: added ? "#65a30d" : "linear-gradient(135deg, #d97706, #f59e0b)",
                color: "#120a00", border: "none", borderRadius: "10px",
                padding: "0.5rem 1.1rem", fontWeight: 800, fontSize: "0.85rem",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                transition: "background 0.2s", whiteSpace: "nowrap",
              }}
            >
              {added ? "\u2713 Listo" : <><HiPlus style={{ flexShrink: 0 }} /> {"\u00C1ñadir"}</>}
            </motion.button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(217,119,6,0.15)", borderRadius: "10px", padding: "5px 8px" }}>
              <button onClick={() => updateQty(product.id, qty - 1)} style={{ background: "rgba(217,119,6,0.2)", border: "none", color: "#f59e0b", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><HiMinus /></button>
              <span style={{ color: "#fef9f0", fontWeight: 800, minWidth: "24px", textAlign: "center", fontSize: "1rem" }}>{qty}</span>
              <button onClick={handleAdd} style={{ background: "rgba(217,119,6,0.2)", border: "none", color: "#f59e0b", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><HiPlus /></button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductCatalog({ serverProducts = [] }: { serverProducts?: DbProduct[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { openCart, totalItems, subtotal } = useCart();

  const products: LocalProduct[] = serverProducts.length
    ? serverProducts.map((p) => ({ ...p, image: productImages[p.id] }))
    : fallbackProducts;

  const filtered = activeCategory === "Todos" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <section id="carta" ref={ref} style={{ backgroundColor: "#120a00", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            style={{ color: "#d97706", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", display: "block", marginBottom: "1rem" }}
          >
            Nuestra carta
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.75rem", lineHeight: 1.1 }}
          >
            {"Elige lo que "}
            <span className="gradient-text">{"m\u00e1s te gusta"}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ color: "#7c5a38", fontSize: "1rem", letterSpacing: "0.01em" }}
          >
            {"Pedido m\u00ednimo "}<strong style={{ color: "#a37a50" }}>S/ 10.00</strong>{" \u00b7 Delivery "}<strong style={{ color: "#a37a50" }}>S/ 5.00</strong>
          </motion.p>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.55rem 1.4rem", borderRadius: "99px", fontWeight: 700, fontSize: "0.88rem",
                cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.02em",
                background: activeCategory === cat ? "linear-gradient(135deg, #d97706, #f59e0b)" : "rgba(217,119,6,0.07)",
                color: activeCategory === cat ? "#120a00" : "#7c5a38",
                border: activeCategory === cat ? "none" : "1px solid rgba(217,119,6,0.18)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              style={{ position: "sticky", bottom: "1.5rem", marginTop: "3rem", display: "flex", justifyContent: "center" }}
            >
              <button
                onClick={openCart}
                style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#120a00", border: "none", borderRadius: "99px", padding: "1rem 2.5rem", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 8px 36px rgba(217,119,6,0.5)", letterSpacing: "-0.01em" }}
              >
                <HiShoppingCart style={{ fontSize: "1.25rem" }} />
                {"Ver pedido ("}{totalItems}{totalItems === 1 ? " item" : " items"}{") \u2014 S/ "}{subtotal.toFixed(2)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
