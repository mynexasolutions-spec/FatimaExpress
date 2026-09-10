import { createPublicClient, publicCatalogEnabled } from "@/lib/supabase/publicClient";
import { categories as staticCategories, products as staticProducts } from "@/data/products";

function mapCategoryRow(row) {
  return { slug: row.slug, name: row.name, blurb: row.blurb, image: row.image_url || null };
}

function mapProductRow(row, reviewStats) {
  const stats = reviewStats?.get(row.id);
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
    variantStock: row.variant_stock ?? [],
    // Real average from approved reviews — no reviews yet means no badge, not a fake default.
    rating: stats ? Number((stats.total / stats.count).toFixed(1)) : undefined,
    reviews: stats?.count ?? 0,
  };
}

// Maps product_id -> { total, count } from every approved review, so the
// average can be computed per product without an extra round trip per item.
async function getReviewStats(supabase) {
  const { data, error } = await supabase.from("reviews").select("product_id, rating").eq("is_approved", true);
  if (error || !data) return new Map();

  const stats = new Map();
  for (const { product_id, rating } of data) {
    const entry = stats.get(product_id) ?? { total: 0, count: 0 };
    entry.total += Number(rating) || 0;
    entry.count += 1;
    stats.set(product_id, entry);
  }
  return stats;
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
      const [{ data, error }, reviewStats] = await Promise.all([
        supabase.from("products").select("*, categories ( slug )").order("created_at", { ascending: false }),
        getReviewStats(supabase),
      ]);
      if (!error && data?.length) return data.map((row) => mapProductRow(row, reviewStats));
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
