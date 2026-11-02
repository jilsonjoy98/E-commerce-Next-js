"use client";

import { useProductViewers } from "@/lib/socket";
import { Eye, Flame, Radio } from "lucide-react";

interface LiveViewerBadgeProps {
  productId: string;
}

export default function LiveViewerBadge({ productId }: LiveViewerBadgeProps) {
  const { viewerCount, isConnected } = useProductViewers(productId);

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 px-3.5 py-2 text-xs text-orange-950 shadow-2xs transition-all duration-300">
      {/* Pulsing Live Dot */}
      <div className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </div>

      {/* Main Text with proper singular/plural grammar */}
      <div className="flex flex-wrap items-center gap-1.5 font-medium">
        <Eye className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
        <span>
          <strong className="font-extrabold text-orange-900 transition-all">
            {viewerCount}
          </strong>{" "}
          {viewerCount === 1 ? "person is" : "people are"} viewing this right now
        </span>
      </div>

      {/* High Demand Pill when multiple concurrent viewers exist */}
      {viewerCount > 1 && (
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs animate-pulse">
          <Flame className="h-3 w-3 fill-white" />
          High Demand
        </span>
      )}

      {/* Live sync status indicator */}
      <span
        title={
          isConnected
            ? "Connected to Live Socket.IO Server"
            : "Live viewer tracking (Ensure `npm run socket` is running)"
        }
        className="ml-auto flex items-center gap-1 text-[10px] text-gray-400 font-semibold cursor-help"
      >
        <Radio className={`h-3 w-3 ${isConnected ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
        <span className="hidden md:inline">{isConnected ? "Live" : "Standby"}</span>
      </span>
    </div>
  );
}
