// Defaults — used until the DB-driven settings load (see lib/settings.js) and
// as the fallback if that fetch fails.
export const FREE_DELIVERY_THRESHOLD = 1000;
export const DUBAI_DELIVERY_FEE = 25;
export const COURIER_FEE = 40;

export function getDeliveryQuote(subtotal, emirate, settings = {}) {
  const freeThreshold = settings.free_threshold ?? FREE_DELIVERY_THRESHOLD;
  const dubaiFee = settings.dubai_fee ?? DUBAI_DELIVERY_FEE;
  const courierFee = settings.courier_fee ?? COURIER_FEE;

  if (!emirate) {
    return { fee: null, label: "Calculated at checkout", note: "Select your emirate to see delivery charges." };
  }

  if (emirate === "Dubai") {
    if (subtotal >= freeThreshold) {
      return {
        fee: 0,
        label: "Free local delivery",
        note: `Free direct delivery inside Dubai on orders of AED ${freeThreshold} and above.`,
      };
    }
    const remaining = freeThreshold - subtotal;
    return {
      fee: dubaiFee,
      label: "Dubai courier delivery",
      note: `Add ${remaining.toFixed(2)} AED more to unlock free delivery inside Dubai.`,
    };
  }

  return {
    fee: courierFee,
    label: `Courier delivery to ${emirate}`,
    note: "Orders outside Dubai are shipped by courier with charges applied at checkout.",
  };
}
