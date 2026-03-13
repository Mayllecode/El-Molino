"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiPlus, HiMinus, HiTrash, HiChevronRight, HiChevronLeft, HiCheckCircle } from "react-icons/hi";
import { FaWhatsapp, FaMotorcycle, FaStore } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

type DeliveryType = "pickup" | "delivery";
type Step = "cart" | "type" | "customer" | "confirm";

const DELIVERY_COST = 5;
const MIN_ORDER = 10;
const WA_NUMBER = "51947792097";

function buildWhatsAppMessage(
  items: ReturnType<typeof useCart>["items"],
  subtotal: number,
  deliveryType: DeliveryType,
  name: string,
  address: string
) {
  const lines: string[] = [];
  lines.push("🍞 *Pedido — Panadería El Molino*");
  lines.push("");
  lines.push("📋 *Detalle del pedido:*");
  items.forEach((i) => {
    lines.push(`• ${i.quantity}x ${i.product.name} — S/ ${(i.product.price * i.quantity).toFixed(2)}`);
  });
  lines.push("");
  lines.push(`💰 *Subtotal:* S/ ${subtotal.toFixed(2)}`);

  if (deliveryType === "delivery") {
    lines.push(`🚚 *Delivery:* S/ ${DELIVERY_COST.toFixed(2)}`);
    lines.push(`💵 *TOTAL: S/ ${(subtotal + DELIVERY_COST).toFixed(2)}*`);
    lines.push("");
    lines.push(`📦 *Tipo:* Delivery`);
    lines.push(`👤 *Nombre:* ${name}`);
    lines.push(`📍 *Dirección:* ${address}`);
  } else {
    lines.push(`💵 *TOTAL: S/ ${subtotal.toFixed(2)}*`);
    lines.push("");
    lines.push(`📦 *Tipo:* Para recoger en tienda`);
    lines.push(`👤 *Nombre:* ${name}`);
  }

  lines.push("");
  lines.push("💳 *Pago:* Al recibir (efectivo, Yape o Plin)");
  return lines.join("\n");
}

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sent, setSent] = useState(false);

  const total = deliveryType === "delivery" ? subtotal + DELIVERY_COST : subtotal;
  const belowMin = subtotal < MIN_ORDER;

  const reset = () => {
    setStep("cart");
    setDeliveryType("pickup");
    setName("");
    setAddress("");
    setSent(false);
  };

  const handleClose = () => {
    closeCart();
    setTimeout(() => { if (!sent) reset(); }, 400);
  };

  const sendToWhatsApp = async () => {
    const msg = buildWhatsAppMessage(items, subtotal, deliveryType, name, address);
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    setStep("confirm");

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_name: name,
          delivery_type: deliveryType,
          delivery_address: deliveryType === "delivery" ? address : null,
          subtotal: subtotal,
          delivery_cost: deliveryType === "delivery" ? DELIVERY_COST : 0,
          total: total,
        })
        .select()
        .single();

      if (!error && order) {
        await supabase.from("order_items").insert(
          items.map((i) => ({
            order_id: order.id,
            product_id: i.product.id,
            product_name: i.product.name,
            unit_price: i.product.price,
            quantity: i.quantity,
          }))
        );
      }
    } catch {
      // WhatsApp ya fue abierto; fallo silencioso para no interrumpir al usuario
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#120a00", border: "1px solid rgba(217,119,6,0.25)",
    borderRadius: "10px", padding: "0.75rem 1rem", color: "#fef9f0",
    fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 150 }}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 200,
              width: "min(420px, 100vw)",
              background: "#1c1005",
              borderLeft: "1px solid rgba(217,119,6,0.15)",
              display: "flex", flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", borderBottom: "1px solid rgba(217,119,6,0.12)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {step !== "cart" && !sent && (
                  <button onClick={() => setStep(step === "type" ? "cart" : step === "customer" ? "type" : "type")} style={{ background: "none", border: "none", color: "#a37a50", cursor: "pointer", fontSize: "1.2rem", display: "flex" }}>
                    <HiChevronLeft />
                  </button>
                )}
                <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fef9f0" }}>
                  {step === "cart" && "Mi pedido"}
                  {step === "type" && "¿Cómo lo quieres?"}
                  {step === "customer" && "Tus datos"}
                  {step === "confirm" && "¡Listo!"}
                </h2>
              </div>
              <button onClick={handleClose} style={{ background: "none", border: "none", color: "#a37a50", cursor: "pointer", fontSize: "1.3rem", display: "flex" }}><HiX /></button>
            </div>

            <div style={{ padding: "1.5rem", flex: 1 }}>
              <AnimatePresence mode="wait">

                {step === "cart" && (
                  <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {items.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "4rem 0", color: "#a37a50" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
                        <p style={{ fontWeight: 600 }}>Tu carrito está vacío</p>
                        <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Agrega productos de nuestra carta</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {items.map((item) => (
                          <div key={item.product.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center", background: "#231608", borderRadius: "12px", padding: "0.9rem 1rem" }}>
                            <span style={{ fontSize: "1.8rem" }}>{item.product.emoji}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#fef9f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product.name}</p>
                              <p style={{ fontSize: "0.78rem", color: "#a37a50" }}>S/ {item.product.price.toFixed(2)} c/u</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <button onClick={() => updateQty(item.product.id, item.quantity - 1)} style={{ background: "rgba(217,119,6,0.15)", border: "none", color: "#f59e0b", borderRadius: "6px", width: "26px", height: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><HiMinus /></button>
                              <span style={{ color: "#fef9f0", fontWeight: 700, fontSize: "0.9rem", minWidth: "22px", textAlign: "center" }}>{item.quantity}</span>
                              <button onClick={() => updateQty(item.product.id, item.quantity + 1)} style={{ background: "rgba(217,119,6,0.15)", border: "none", color: "#f59e0b", borderRadius: "6px", width: "26px", height: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><HiPlus /></button>
                            </div>
                            <div style={{ textAlign: "right", minWidth: "56px" }}>
                              <p style={{ fontWeight: 700, color: "#f59e0b", fontSize: "0.9rem" }}>S/ {(item.product.price * item.quantity).toFixed(2)}</p>
                              <button onClick={() => removeItem(item.product.id)} style={{ background: "none", border: "none", color: "#7c2d12", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", marginLeft: "auto", marginTop: "2px" }}><HiTrash /></button>
                            </div>
                          </div>
                        ))}

                        <div style={{ borderTop: "1px solid rgba(217,119,6,0.15)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#a37a50", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                            <span>Subtotal</span>
                            <span>S/ {subtotal.toFixed(2)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#a37a50", fontSize: "0.85rem" }}>
                            <span>Delivery</span>
                            <span>A confirmar</span>
                          </div>
                        </div>

                        {belowMin && (
                          <div style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "10px", padding: "0.75rem", fontSize: "0.82rem", color: "#f59e0b", textAlign: "center" }}>
                            Pedido mínimo S/ {MIN_ORDER.toFixed(2)} — te faltan S/ {(MIN_ORDER - subtotal).toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === "type" && (
                  <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ color: "#a37a50", fontSize: "0.9rem", marginBottom: "0.5rem" }}>¿Cómo prefieres recibir tu pedido?</p>
                    {([
                      { value: "pickup", icon: <FaStore />, label: "Recoger en tienda", sub: "Sin costo adicional · Av. El Olivar 547, Callao" },
                      { value: "delivery", icon: <FaMotorcycle />, label: "Delivery a domicilio", sub: `Costo fijo S/ ${DELIVERY_COST}.00 · Solo en Callao` },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDeliveryType(opt.value)}
                        style={{
                          background: deliveryType === opt.value ? "rgba(217,119,6,0.15)" : "#231608",
                          border: `2px solid ${deliveryType === opt.value ? "#d97706" : "rgba(217,119,6,0.1)"}`,
                          borderRadius: "14px", padding: "1.25rem 1.5rem",
                          display: "flex", gap: "1rem", alignItems: "flex-start",
                          cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s",
                        }}
                      >
                        <span style={{ color: "#f59e0b", fontSize: "1.4rem", marginTop: "1px" }}>{opt.icon}</span>
                        <div>
                          <p style={{ color: "#fef9f0", fontWeight: 700, marginBottom: "3px" }}>{opt.label}</p>
                          <p style={{ color: "#a37a50", fontSize: "0.8rem" }}>{opt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === "customer" && (
                  <motion.div key="customer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <p style={{ color: "#a37a50", fontSize: "0.9rem" }}>
                      {deliveryType === "delivery" ? "Para enviarte el pedido, necesitamos:" : "¿Con qué nombre preparamos tu pedido?"}
                    </p>
                    <div>
                      <label style={{ display: "block", color: "#a37a50", fontSize: "0.78rem", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Nombre</label>
                      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(217,119,6,0.25)")} />
                    </div>
                    {deliveryType === "delivery" && (
                      <div>
                        <label style={{ display: "block", color: "#a37a50", fontSize: "0.78rem", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Dirección de entrega</label>
                        <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jr./Av. nombre, número, referencia..." style={{ ...inputStyle, resize: "none" }}
                          onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(217,119,6,0.25)")} />
                        <p style={{ fontSize: "0.75rem", color: "#7c5a38", marginTop: "4px" }}>Solo realizamos delivery dentro de Callao</p>
                      </div>
                    )}

                    <div style={{ background: "#231608", borderRadius: "14px", padding: "1rem 1.25rem", marginTop: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.88rem", color: "#a37a50" }}>
                        <span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span>
                      </div>
                      {deliveryType === "delivery" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.88rem", color: "#a37a50" }}>
                          <span>Delivery</span><span>S/ {DELIVERY_COST.toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.05rem", color: "#f59e0b", borderTop: "1px solid rgba(217,119,6,0.12)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                        <span>Total</span><span>S/ {total.toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#7c5a38", marginTop: "0.5rem" }}>💳 Pago al recibir: efectivo, Yape o Plin</p>
                    </div>
                  </motion.div>
                )}

                {step === "confirm" && (
                  <motion.div key="confirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "2rem 0" }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}>
                      <HiCheckCircle style={{ fontSize: "5rem", color: "#65a30d", margin: "0 auto 1rem" }} />
                    </motion.div>
                    <h3 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#fef9f0", marginBottom: "0.75rem" }}>¡Pedido enviado por WhatsApp!</h3>
                    <p style={{ color: "#a37a50", lineHeight: 1.7, fontSize: "0.92rem" }}>
                      Nos pondremos en contacto contigo a la brevedad para confirmar tu pedido. ¡Gracias por elegirnos, {name}! 🍞
                    </p>
                    <button
                      onClick={() => { clearCart(); handleClose(); reset(); }}
                      style={{ marginTop: "2rem", background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#120a00", border: "none", borderRadius: "12px", padding: "0.85rem 2rem", fontWeight: 800, cursor: "pointer" }}
                    >
                      Hacer otro pedido
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {step !== "confirm" && items.length > 0 && (
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid rgba(217,119,6,0.12)", flexShrink: 0 }}>
                {step === "cart" && (
                  <button
                    disabled={belowMin}
                    onClick={() => setStep("type")}
                    style={{ width: "100%", background: belowMin ? "#2e1e0a" : "linear-gradient(135deg, #d97706, #f59e0b)", color: belowMin ? "#7c5a38" : "#120a00", border: "none", borderRadius: "12px", padding: "1rem", fontWeight: 800, fontSize: "1rem", cursor: belowMin ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.2s" }}
                  >
                    Continuar <HiChevronRight />
                  </button>
                )}
                {step === "type" && (
                  <button onClick={() => setStep("customer")} style={{ width: "100%", background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#120a00", border: "none", borderRadius: "12px", padding: "1rem", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    Continuar <HiChevronRight />
                  </button>
                )}
                {step === "customer" && (
                  <button
                    onClick={sendToWhatsApp}
                    disabled={!name.trim() || (deliveryType === "delivery" && !address.trim())}
                    style={{
                      width: "100%",
                      background: (!name.trim() || (deliveryType === "delivery" && !address.trim())) ? "#2e1e0a" : "linear-gradient(135deg, #25d366, #128C7E)",
                      color: (!name.trim() || (deliveryType === "delivery" && !address.trim())) ? "#7c5a38" : "#fff",
                      border: "none", borderRadius: "12px", padding: "1rem", fontWeight: 800, fontSize: "1rem",
                      cursor: (!name.trim() || (deliveryType === "delivery" && !address.trim())) ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "all 0.2s",
                    }}
                  >
                    <FaWhatsapp style={{ fontSize: "1.2rem" }} />
                    Enviar pedido por WhatsApp
                  </button>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
