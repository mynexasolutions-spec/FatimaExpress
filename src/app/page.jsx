import Hero from "@/components/home/Hero";
import FoilCollection from "@/components/home/FoilCollection";
import BubbleSection from "@/components/home/BubbleSection";
import AccessoriesRow from "@/components/home/AccessoriesRow";
import FeatureStrip from "@/components/home/FeatureStrip";
import InspirationGallery from "@/components/home/InspirationGallery";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import Newsletter from "@/components/home/Newsletter";
import Reveal from "@/components/ui/Reveal";
import { getAllProducts } from "@/lib/catalog";
import { getHomeContentPublic } from "@/lib/homeContent";

export const revalidate = 0;

export default async function HomePage() {
  const [products, homeContent] = await Promise.all([getAllProducts(), getHomeContentPublic()]);
  const featuredProducts = products.filter((p) => p.featured);
  const accessories = products
    .filter((p) => p.category === "accessories")
    .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))
    .slice(0, 5);
  const foilFeatured =
    featuredProducts.find((p) => p.category === "foil-balloons") || products.find((p) => p.category === "foil-balloons");

  return (
    <>
      <Hero slides={homeContent.heroSlides} />
      <Reveal>
        <FoilCollection featured={foilFeatured} content={homeContent.foil} />
      </Reveal>
      <Reveal>
        <BubbleSection content={homeContent.bubble} />
      </Reveal>
      <Reveal>
        <AccessoriesRow accessories={accessories} content={homeContent.accessories} />
      </Reveal>
      <Reveal>
        <FeatureStrip features={homeContent.featureStrip} />
      </Reveal>
      <Reveal>
        <InspirationGallery setups={homeContent.gallery} heading={homeContent.galleryHeading} />
      </Reveal>
      <Reveal>
        <Testimonials testimonials={homeContent.testimonials} heading={homeContent.testimonialsHeading} />
      </Reveal>
      <Reveal>
        <FaqSection faqs={homeContent.faqs} heading={homeContent.faqsHeading} />
      </Reveal>
      <Reveal>
        <Newsletter content={homeContent.newsletter} />
      </Reveal>
    </>
  );
}
