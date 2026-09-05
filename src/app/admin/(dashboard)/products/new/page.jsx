import { createProduct } from "@/actions/admin/products";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import ProductForm from "../_components/ProductForm";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();
  return <ProductForm action={createProduct} categories={categories} />;
}
