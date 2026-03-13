import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import About from "@/components/About";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase, type DbProduct } from "@/lib/supabase";

export default async function Home() {
  let serverProducts: DbProduct[] = [];

  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .order("category");
    serverProducts = data ?? [];
  } catch {
    // Silently fall back to local products in ProductCatalog
  }

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>
        <Hero />
        <ProductCatalog serverProducts={serverProducts} />
        <About />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}