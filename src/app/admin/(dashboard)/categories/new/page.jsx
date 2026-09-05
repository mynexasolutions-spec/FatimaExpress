import { createCategory } from "@/actions/admin/categories";
import CategoryForm from "../_components/CategoryForm";

export const metadata = { title: "New Category" };

export default function NewCategoryPage() {
  return <CategoryForm action={createCategory} />;
}
