"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseJsonField(formData, key, fallback = []) {
  try {
    return JSON.parse(formData.get(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function parseProductFields(formData) {
  return {
    name: formData.get("name"),
    sku: formData.get("sku") || null,
    category_id: formData.get("category_id") || null,
    shape: formData.get("shape") || null,
    theme: formData.get("theme") || null,
    price: Number(formData.get("price") || 0),
    compare_at: formData.get("compare_at") ? Number(formData.get("compare_at")) : null,
    short: formData.get("short") || null,
    description: formData.get("description") || null,
    image_url: formData.get("image_url") || null,
    badge: formData.get("badge") || null,
    stock_quantity: Number(formData.get("stock_quantity") || 0),
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
  };
}

export async function getAllProductsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, stock_quantity, is_active, is_featured, image_url, visual, category_id, categories ( name )")
    .order("created_at", { ascending: false });

  return (data || []).map((p) => ({ ...p, categoryName: p.categories?.name }));
}

export async function getProductForEdit(id) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function createProduct(_prevState, formData) {
  const supabase = createAdminClient();
  const fields = parseProductFields(formData);
  if (!fields.name) return { error: "Product name is required." };
  if (!fields.price || fields.price <= 0) return { error: "Base price is required and must be greater than 0 (see the Pricing & Stock tab)." };

  const colors = parseJsonField(formData, "colors");
  const sizes = parseJsonField(formData, "sizes");
  const specs = parseJsonField(formData, "specs");
  const bulkPricing = parseJsonField(formData, "bulk_pricing");
  const visual = parseJsonField(formData, "visual", { kind: "round", color: "#3382f0" });

  const { error } = await supabase.from("products").insert({
    ...fields,
    slug: slugify(fields.name),
    colors,
    sizes,
    specs,
    bulk_pricing: bulkPricing,
    visual,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(_prevState, formData) {
  const supabase = createAdminClient();
  const id = formData.get("id");
  const fields = parseProductFields(formData);
  if (!id || !fields.name) return { error: "Product name is required." };
  if (!fields.price || fields.price <= 0) return { error: "Base price is required and must be greater than 0 (see the Pricing & Stock tab)." };

  const colors = parseJsonField(formData, "colors");
  const sizes = parseJsonField(formData, "sizes");
  const specs = parseJsonField(formData, "specs");
  const bulkPricing = parseJsonField(formData, "bulk_pricing");
  const visual = parseJsonField(formData, "visual", { kind: "round", color: "#3382f0" });

  const { error } = await supabase
    .from("products")
    .update({
      ...fields,
      slug: slugify(fields.name),
      colors,
      sizes,
      specs,
      bulk_pricing: bulkPricing,
      visual,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}
