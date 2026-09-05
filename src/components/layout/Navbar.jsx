"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { categories } from "@/data/products";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count, openCart, hydrated } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setShopOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href.split("?")[0]);

  return (
    <header className="sticky top-0 z-50 font-sans">
      {/* ── Main Bar ───────────────────────────────── */}
      <div
        className={`relative transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-200/60 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl"
            : "border-b border-transparent bg-white/80 backdrop-blur-md"
        }`}
      >
        {/* Shimmer hairline along the bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[68px]">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative rounded-lg px-4 py-2 font-display text-sm font-bold transition-colors ${
                    active
                      ? "text-purple-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-purple-600" />
                  )}
                </Link>
              );
            })}

            {/* Shop dropdown */}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
                onClick={() => setShopOpen((o) => !o)}
                className={`flex items-center gap-1 rounded-lg px-4 py-2 font-display text-sm font-bold transition-colors ${
                  pathname?.includes("/shop?category")
                    ? "text-purple-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Categories
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                />
              </button>

              {shopOpen && (
                <div
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                  className="absolute left-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-2 shadow-xl shadow-slate-900/10"
                >
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop?category=${c.slug}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-purple-50 hover:text-purple-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Search — desktop only */}
            <button
              type="button"
              onClick={() => { setSearchOpen((o) => !o); setMenuOpen(false); }}
              className={`hidden lg:grid h-10 w-10 place-items-center rounded-full border transition-all duration-200 ${
                searchOpen
                  ? "border-purple-300 bg-purple-100 text-purple-700"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              }`}
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Account */}
            <Link
              href={user ? "/account" : "/login"}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              aria-label={user ? "My account" : "Sign in"}
            >
              <User size={17} />
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              aria-label="Open cart"
            >
              <ShoppingBag size={17} />
              {hydrated && count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 px-1 text-[11px] font-extrabold text-white shadow-sm">
                  {count}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="mx-1 hidden h-5 w-px bg-slate-200 lg:block" />

            {/* CTA */}
            <Link
              href="/shop"
              className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-5 py-2.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-200 hover:from-[#5B21B6] hover:to-[#7E22CE] hover:-translate-y-0.5 lg:inline-flex"
            >
              Shop Now
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => { setMenuOpen((o) => !o); setSearchOpen(false); }}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Search Bar (slide-in) ───────────────── */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white">
            <form
              onSubmit={submitSearch}
              className="container-page flex items-center gap-3 py-3"
            >
              <Search size={17} className="shrink-0 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search balloons, pumps, ribbons…"
                className="h-9 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-purple-700 px-5 py-2 text-sm font-bold text-white hover:bg-purple-800 transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={15} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Mobile Sidebar ──────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-[70] flex h-dvh w-full max-w-[320px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Site menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Logo className="scale-90 origin-left" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar inside Mobile Sidebar */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3">
          <form onSubmit={submitSearch} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search balloons, accessories…"
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-400"
            />
            <Search size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
          </form>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-2">
          <div className="divide-y divide-slate-100">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between py-3.5 text-base font-semibold transition ${
                    active ? "text-purple-700" : "text-slate-700 hover:text-purple-700"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Category links in mobile */}
          <div className="py-4">
            <p className="pb-2 text-xs font-extrabold text-slate-400">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop?category=${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile CTA */}
        <div className="border-t border-slate-100 p-5">
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:from-[#5B21B6] hover:to-[#7E22CE]"
          >
            Shop All Products
          </Link>
        </div>
      </aside>
    </header>
  );
}
