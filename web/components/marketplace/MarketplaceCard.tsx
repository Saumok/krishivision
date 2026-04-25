"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { formatINR, formatDate } from "../../lib/utils";

interface MarketplaceCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
  category: string;
  createdAt: string;
  onClick?: () => void;
}

export default function MarketplaceCard({
  id,
  title,
  price,
  location,
  imageUrl,
  category,
  createdAt,
  onClick,
}: MarketplaceCardProps) {
  const t = useTranslations("marketplace");

  return (
    <button
      id={`listing-${id}`}
      onClick={onClick}
      className="kv-card text-left active:shadow-card-hover active:scale-[0.99] transition-all duration-150 w-full"
    >
      {/* Image */}
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🌾</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {/* Category badge */}
        <span className="text-[11px] font-semibold text-agri-green bg-agri-green-muted px-2 py-0.5 rounded-full uppercase tracking-wide">
          {t(category as "equipment")}
        </span>

        {/* Title */}
        <h3 className="text-body font-bold text-gray-900 mt-1 leading-tight line-clamp-2">
          {title}
        </h3>

        {/* Price */}
        <p className="text-heading-sm font-bold text-agri-green mt-1">
          {formatINR(price)}
        </p>

        {/* Location & Date */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin size={12} />
            <span className="text-caption truncate max-w-[100px]">{location}</span>
          </div>
          <span className="text-caption text-gray-400">
            {formatDate(createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
}
