import { RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Categories() {
    const categories = [
        {
            name: "Electronics",
            icon: "/home/categories/electronics.png",
            description: "Explore the latest in electronics, from smartphones to smart home devices.",
            path: "/products?category=Electronics",
            backgroundColor: "bg-blue-500"
        },
        {
            name: "Fashion",
            icon: "/home/categories/fashion.png",
            description: "Discover the latest trends in fashion, from clothing to accessories.",
            path: "/products?category=Fashion",
            backgroundColor: "bg-green-500"
        },
        {
            name: "Toys",
            icon: "/home/categories/toys.png",
            description: "Find a wide range of toys for kids of all ages, from educational toys to fun games.",
            path: "/products?category=Toys",
            backgroundColor: "bg-yellow-500"
        },
        {
            name: "Cosmetics",
            icon: "/home/categories/cosmetics.png",
            description: "Take care of your skin and body with our curated selection of beauty and health products.",
            path: "/products?category=Beauty",
            backgroundColor: "bg-pink-500"
        }
    ];

    return (
        <section
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
        >
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Shop by Category</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.path}
                        className={`group flex flex-col items-center justify-center p-4 
            border border-gray-200 rounded-xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 hover:scale-105
            hover:shadow-xl hover:border-blue-300
            cursor-pointer overflow-hidden
            ${category.backgroundColor}`}
                    >
                        <div className="mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                            <img
                                src={category.icon}
                                alt={category.name}
                                className="h-12 w-12 object-contain"
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 ">
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>

        </section>
    );
}
