import { RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import path from 'path';
import React from 'react'

export default function Categories() {
const categories = [
    {
        name:"Electronics",
        icon: <Sparkles className="h-6 w-6 text-orange-500" />,
        description: "Explore the latest in electronics, from smartphones to smart home devices.",   
        path: "/categories/electronics"
    },
    {
        name:"Fashion",
        icon: <Sparkles className="h-6 w-6 text-orange-500" />,
        description: "Discover the latest trends in fashion, from clothing to accessories.",
        path: "/categories/fashion"
    },
    {
        name:"Home & Kitchen",
        icon: <Sparkles className="h-6 w-6 text-orange-500" />,
        description: "Find everything you need for your home and kitchen, from appliances to decor.",   
        path: "/categories/home-kitchen"
    },
    {
        name:"Beauty & Health",
        icon: <Sparkles className="h-6 w-6 text-orange-500" />,
        description: "Take care of your skin and body with our curated selection of beauty and health products.",
        path: "/categories/beauty-health"
    }
  ];

  return (
    <section
    className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
    >
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Shop by Category</h2> 
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
                <div key={category.name} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md">
                    <div className="mb-2">{category.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                    <a href={category.path} className="mt-2 text-blue-500 hover:text-blue-700">
                        Shop Now
                    </a>
                </div>
            ))}
        </div>
        
    </section>
  )
}
