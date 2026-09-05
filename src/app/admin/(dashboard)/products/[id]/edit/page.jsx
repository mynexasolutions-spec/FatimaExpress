import { notFound } from "next/navigation";
import { getProductForEdit, updateProduct } from "@/actions/admin/products";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import ProductForm from "../../_components/ProductForm";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductForEdit(id), getAllCategoriesAdmin()]);
  if (!product) notFound();

  return <ProductForm action={updateProduct} product={product} categories={categories} />;
}
