"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const cartItemCount = 1; // Replace with dynamic state or context/Redux value

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results, e.g., router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
            console.log("Searching for:", searchQuery);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                {/* 1. Brand Logo */}
                <Link href="/" className="flex flex-shrink-0 items-center">
                    <Image
                        src="/navbar/logo_E-com.png"
                        alt="eShop Logo"
                        width={140}
                        height={140}
                        priority
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                {/* 2. Desktop Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden flex-1 max-w-lg md:flex items-center"
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search products, brands, and categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-900 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:text-indigo-600 focus:outline-none"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </div>
                </form>

                {/* 3. Action Icons (Cart, Account, Mobile Menu Toggle) */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {/* Account Icon */}
                    <Link
                        href="/account"
                        className="hidden items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 sm:flex"
                    >
                        <User className="h-5 w-5" />
                        <span>Account</span>
                    </Link>

                    {/* Cart Icon with Badge */}
                    <Link
                        href="/cart"
                        className="relative flex items-center p-1.5 text-gray-700 transition-colors hover:text-indigo-600"
                        aria-label="View Shopping Cart"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 md:hidden"
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

            {/* 4. Mobile Search Bar (Visible directly under logo on small screens) */}
            <div className="border-t border-gray-100 px-4 py-2.5 md:hidden">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-gray-300 bg-gray-50 py-1.5 pl-4 pr-10 text-sm text-gray-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:text-indigo-600"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                </form>
            </div>

            {/* 5. Mobile Slide-out / Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
                    <nav className="flex flex-col space-y-3">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                        >
                            Home
                        </Link>
                        <Link
                            href="/categories"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                        >
                            All Categories
                        </Link>
                        <Link
                            href="/deals"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                        >
                            Deals & Offers
                        </Link>
                        <Link
                            href="/account"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 pt-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
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