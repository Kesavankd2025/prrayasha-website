import Hero from "@/components/Hero";
// import WhyChoosePrrayasha from "@/components/WhyChoosePrrayasha";
import Categories from "@/components/Categories";
import Advertisement from "@/components/Advertisement";
import ProductSection from "@/components/ProductSection";
// import FavouriteCollections from "@/components/FavouriteCollections";
// import CategoryGrid from "@/components/CategoryGrid";
// import BrandStyles from "@/components/BrandStyles";
import Testimonials from "@/components/Testimonials";
import KnowPrrayasha from "@/components/KnowPrrayasha";
import Benefits from "@/components/Benefits";

export default function Home() {
  return (
    <main className="site-main">
      <Hero />
      {/* <WhyChoosePrrayasha /> */}
      <Categories />
      <Advertisement />
      <ProductSection />
      {/* <FavouriteCollections /> */}
      {/* <CategoryGrid /> */}
      {/* <BrandStyles /> */}
      <Testimonials />
      <KnowPrrayasha />
      <Benefits />
    </main>
  );
}
