import { createServerSupabase } from "@/lib/supabase/server";

export async function getProductReviewsData(productId) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const approvedQuery = supabase
    .from("reviews")
    .select("id, rating, review_text, reviewer_name, created_at")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const ownReviewQuery = user
    ? supabase.from("reviews").select("*").eq("product_id", productId).eq("user_id", user.id).maybeSingle()
    : Promise.resolve({ data: null });

  const [{ data: reviews }, { data: existingReview }] = await Promise.all([approvedQuery, ownReviewQuery]);

  return { reviews: reviews || [], existingReview: existingReview || null };
}
