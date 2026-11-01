"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Categories from "../categories/Categories";

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  src: string;
  alt: string;
  href: string;
  ctaText: string;
  season: "diwali" | "halloween" | "christmas";
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "diwali-deals",
    title: "Diwali Utsav - Festival of Deals!",
    subtitle: "Brighten your celebrations with up to 50% off on top electronics, festive treats, and bestsellers.",
    badge: "Festive Exclusive",
    src: "/home/promotional/diwali.png",
    alt: "Diwali Utsav Festival of Deals banner with glowing diyas, festive fireworks, and up to 50% discount",
    href: "/deals?festival=diwali",
    ctaText: "Shop Diwali Sale",
    season: "diwali",
  },
  {
    id: "halloween-savings",
    title: "Halloween Sale - Spooktacular Savings!",
    subtitle: "Scary good offers! Save up to 50% off across popular categories for a limited time.",
    badge: "Limited Season",
    src: "/home/promotional/halloween.png",
    alt: "Halloween Sale Spooktacular Savings banner with illuminated pumpkins and up to 50% off",
    href: "/deals?festival=halloween",
    ctaText: "Shop Halloween Deals",
    season: "halloween",
  },
  {
    id: "christmas-offers",
    title: "Christmas Sale - Jerry Merry Offers!",
    subtitle: "Unwrap holiday joy with up to 50% off gifts, gadgets, and seasonal favorites.",
    badge: "Holiday Mega Sale",
    src: "/home/promotional/christmas.png",
    alt: "Christmas Sale Jerry Merry Offers banner with a decorated tree, gift boxes, and up to 50% off",
    href: "/deals?festival=christmas",
    ctaText: "Shop Christmas Offers",
    season: "christmas",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide

export default function Promotional() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = PROMO_SLIDES.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgressKey((prev) => prev + 1);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgressKey((prev) => prev + 1);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgressKey((prev) => prev + 1);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, goToNext, currentIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  return (
    <section
      aria-label="Promotional Offers"
      className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
    >
      {/* Main Carousel Card */}
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Seasonal Promotional Offers"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-900 shadow-xl shadow-gray-300/40 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-indigo-600 select-none"
      >
        {/* Slides Slider Track */}
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {PROMO_SLIDES.map((slide, index) => {
            const isCurrent = index === currentIndex;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${totalSlides}: ${slide.title}`}
                aria-hidden={!isCurrent}
                className="relative min-w-full flex-shrink-0"
              >
                <Link
                  href={slide.href}
                  tabIndex={isCurrent ? 0 : -1}
                  className="block relative w-full aspect-[21/9] min-h-[190px] sm:min-h-[280px] md:min-h-[380px] lg:min-h-[460px] xl:min-h-[520px] overflow-hidden group/slide cursor-pointer"
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
                    className="object-cover transition-transform duration-700 group-hover/slide:scale-[1.015]"
                  />

                  {/* Accessible Visually Hidden Text */}
                  <span className="sr-only">
                    {slide.title} - {slide.subtitle}. Click to {slide.ctaText}.
                  </span>

                  {/* Subtle top gradient shadow for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                </Link>
              </div>
            );
          })}
        </div>



        {/* Navigation Arrow: Previous */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous promotional slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 sm:opacity-85 sm:group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Navigation Arrow: Next */}
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next promotional slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 sm:opacity-85 sm:group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Bottom Control Bar (Dots + Play/Pause) */}
        <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-20 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/10 shadow-sm">
            {/* Dots */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Slides">
              {PROMO_SLIDES.map((slide, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isActive
                        ? "w-8 bg-white shadow-sm"
                        : "w-2.5 bg-white/45 hover:bg-white/75"
                    }`}
                  />
                );
              })}
            </div>


          </div>
        </div>

        {/* Auto-slide visual progress bar */}
        {isPlaying && !isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden">
            <div
              key={progressKey}
              className="h-full bg-indigo-500 transition-none"
              style={{
                animation: `promoProgress ${AUTOPLAY_INTERVAL}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      {/* Value Perks Strip */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 sm:text-sm">Free Express Shipping</p>
            <p className="text-[11px] text-gray-500 sm:text-xs">On orders over ₹500</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 sm:text-sm">Festive Flash Deals</p>
            <p className="text-[11px] text-gray-500 sm:text-xs">Up to 50% discount</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 sm:text-sm">100% Genuine</p>
            <p className="text-[11px] text-gray-500 sm:text-xs">Direct from brands</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 sm:text-sm">10-Day Easy Returns</p>
            <p className="text-[11px] text-gray-500 sm:text-xs">Hassle-free guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
}
