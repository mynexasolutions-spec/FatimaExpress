"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "fatima-express-cart";

const lineKey = (item) => `${item.slug}__${item.size ?? "default"}__${item.color ?? "default"}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // localStorage isn't available during SSR, so `items`/`hydrated` must start
  // at the same value on server and client and only pick up the real cart
  // here, after mount — reading it via a lazy useState initializer instead
  // would desync the client's first render from the server-rendered HTML.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore unreadable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (private mode)
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, { size, color, qty = 1 } = {}) => {
    const item = {
      slug: product.slug,
      name: product.name,
      price: size?.price ?? product.price,
      size: size?.label ?? product.sizes?.[0]?.label ?? null,
      color: color ?? product.colors?.[0]?.name ?? null,
      visual: product.visual ?? null,
      image: product.image ?? null,
      qty,
    };
    item.key = lineKey(item);

    setItems((current) => {
      const existing = current.find((line) => line.key === item.key);
      if (existing) {
        return current.map((line) => (line.key === item.key ? { ...line, qty: line.qty + qty } : line));
      }
      return [...current, item];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((current) =>
      qty <= 0
        ? current.filter((line) => line.key !== key)
        : current.map((line) => (line.key === key ? { ...line, qty } : line)),
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((line) => line.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { subtotal, count } = useMemo(
    () =>
      items.reduce(
        (acc, line) => ({
          subtotal: acc.subtotal + line.price * line.qty,
          count: acc.count + line.qty,
        }),
        { subtotal: 0, count: 0 },
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      subtotal,
      count,
      hydrated,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }),
    [items, subtotal, count, hydrated, isOpen, addItem, updateQty, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
