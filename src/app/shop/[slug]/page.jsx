import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getProductReviewsData } from "@/lib/reviews";
import { getContactPublic } from "@/lib/siteSettings";
import ProductDetail from "./ProductDetail";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.short,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviewsData, contact] = await Promise.all([
    getRelatedProducts(product, 4),
    getProductReviewsData(product.id),
    getContactPublic(),
  ]);

  return (
    <ProductDetail
      product={product}
      related={related}
      reviews={reviewsData.reviews}
      existingReview={reviewsData.existingReview}
      contact={contact}
    />
  );
}
