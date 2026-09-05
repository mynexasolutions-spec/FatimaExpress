import { notFound } from "next/navigation";
import { getCategoryById, updateCategory } from "@/actions/admin/categories";
import CategoryForm from "../../_components/CategoryForm";

export const metadata = { title: "Edit Category" };

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return <CategoryForm action={updateCategory} category={category} />;
}
