import { createPublicClient, publicCatalogEnabled } from "@/lib/supabase/publicClient";
import { categories as staticCategories, products as staticProducts } from "@/data/products";

function mapCategoryRow(row) {
  return { slug: row.slug, name: row.name, blurb: row.blurb, image: row.image_url || null };
}

function mapProductRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    category: row.categories?.slug ?? null,
    shape: row.shape,
    theme: row.theme,
    price: Number(row.price),
    compareAt: row.compare_at ? Number(row.compare_at) : undefined,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    specs: row.specs ?? [],
    bulkPricing: row.bulk_pricing ?? [],
    short: row.short,
    description: row.description,
    visual: row.visual ?? { kind: "round", color: "#3382f0" },
    image: row.image_url || null,
    badge: row.badge || undefined,
    featured: row.is_featured,
    stockQuantity: row.stock_quantity,
    rating: row.rating ? Number(row.rating) : undefined,
    reviews: row.reviews_count,
  };
}

// Deliberately uncached — each call hits Supabase fresh so admin edits show
// up immediately. The dataset is small (tens of rows), so this is cheap.
export async function getAllCategories() {
  if (publicCatalogEnabled) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
      if (!error && data?.length) return data.map(mapCategoryRow);
    } catch {
      // fall through to static catalog
    }
  }

  return staticCategories;
}

export async function getAllProducts() {
  if (publicCatalogEnabled) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, categories ( slug )")
        .order("created_at", { ascending: false });
      if (!error && data?.length) return data.map(mapProductRow);
    } catch {
      // fall through to static catalog
    }
  }

  return staticProducts;
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getRelatedProducts(product, limit = 4) {
  const products = await getAllProducts();
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, limit);
}
