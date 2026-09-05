// Quantity-based wholesale discount tiers, e.g. [{ minQty: 50, discountPercent: 10 }, { minQty: 100, discountPercent: 20 }].
// A customer buying 1 pc pays the normal price; crossing a tier's minQty applies that tier's discount to every unit.

export function sortedTiers(tiers) {
  return [...(tiers || [])]
    .filter((t) => t.minQty > 0 && t.discountPercent > 0)
    .sort((a, b) => a.minQty - b.minQty);
}

export function getActiveTier(tiers, qty) {
  const sorted = sortedTiers(tiers);
  let active = null;
  for (const tier of sorted) {
    if (qty >= tier.minQty) active = tier;
  }
  return active;
}

export function getUnitPrice(basePrice, tiers, qty) {
  const tier = getActiveTier(tiers, qty);
  if (!tier) return basePrice;
  return Math.round(basePrice * (1 - tier.discountPercent / 100) * 100) / 100;
}
