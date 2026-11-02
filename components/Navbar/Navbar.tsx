"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, Sparkles } from "lucide-react";
import { useCartCount } from "@/store/useCartStore";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const cartItemCount = useCartCount();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push("/products");
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-orange-500/20 bg-orange-400/95 backdrop-blur shadow-xs">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                {/* 1. Brand Logo & Nav Links */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex flex-shrink-0 items-center">
                        <p className="text-2xl font-black tracking-tight text-white">
                            <span className="text-orange-950">e</span>Shop
                        </p>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-4 text-sm font-semibold text-white/90">
                        <Link
                            href="/"
                            className="transition-colors hover:text-white px-2 py-1 rounded-md hover:bg-white/10"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="transition-colors hover:text-white px-2 py-1 rounded-md hover:bg-white/10"
                        >
                            All Products
                        </Link>
                    </nav>
                </div>

                {/* 2. Desktop Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden flex-1 max-w-md md:flex items-center"
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search products, categories, tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-orange-300/40 bg-white/90 py-2 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-white shadow-xs"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:text-orange-600 focus:outline-none transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </div>
                </form>

                {/* 3. Action Icons (Cart, Account, Mobile Menu Toggle) */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Products link for medium screens */}
                    <Link
                        href="/products"
                        className="hidden md:flex lg:hidden items-center text-sm font-semibold text-white hover:text-orange-100"
                    >
                        Products
                    </Link>

                    {/* Account Icon */}
                    <Link
                        href="/account"
                        className="hidden items-center gap-1.5 text-sm font-medium text-white hover:text-orange-100 sm:flex"
                    >
                        <User className="h-5 w-5" />
                        <span>Account</span>
                    </Link>

                    {/* Cart Icon with Live Zustand Badge */}
                    <Link
                        href="/cart"
                        className="relative flex items-center p-1.5 text-white transition-colors hover:text-orange-100"
                        aria-label={`View Shopping Cart (${cartItemCount} items)`}
                    >
                        <ShoppingCart className="h-6 w-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[11px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
                                {cartItemCount > 99 ? "99+" : cartItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-lg p-2 text-white hover:bg-white/15 md:hidden transition"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* 4. Mobile Search Bar */}
            <div className="border-t border-white/20 px-4 py-2.5 md:hidden">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search products, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-transparent bg-white py-2 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 shadow-xs"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:text-orange-600 transition"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                </form>
            </div>

            {/* 5. Mobile Slide-out Menu */}
            {isMobileMenuOpen && (
                <div className="border-t border-orange-500/30 bg-white px-5 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2">
                    <nav className="flex flex-col space-y-3">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-semibold text-gray-800 hover:text-orange-600"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-semibold text-gray-800 hover:text-orange-600"
                        >
                            All Products
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-semibold text-gray-800 hover:text-orange-600 flex items-center justify-between"
                        >
                            <span className="flex items-center gap-1.5">
                                <ShoppingCart className="h-4 w-4 text-orange-500" />
                                <span>Cart</span>
                            </span>
                            {cartItemCount > 0 && (
                                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            href="/products?featured=true"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-semibold text-gray-800 hover:text-orange-600 flex items-center gap-1.5"
                        >
                            <Sparkles className="h-4 w-4 text-orange-500" />
                            <span>Featured Deals</span>
                        </Link>
                        <Link
                            href="/account"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 pt-2 border-t border-gray-100 text-sm font-medium text-gray-700 hover:text-orange-600"
                        >
                            <User className="h-4 w-4" />
                            <span>My Account</span>
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
