import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Panadería El Dominio | Pan artesanal en Callao",
  description: "La mejor panadería artesanal del Callao. Pan fresco, tortas, pasteles y más. Delivery a domicilio. Pedidos por WhatsApp.",
  keywords: "panadería, pan artesanal, tortas, Callao, delivery, El Dominio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
