"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, MapPin, Phone, MessageCircle, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatINR, formatDate } from "@/lib/utils";
import BottomNav from "@/components/layout/BottomNav";
import { toast } from "sonner";

export default function ListingDetailPage() {
  const t = useTranslations("marketplace");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const itemId = params.id as string;
  const supabase = createClient();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    setLoading(true);
    const { data: itemData, error } = await supabase
      .from("marketplace_items")
      .select(`
        *,
        marketplace_images ( image_url ),
        users (*)
      `)
      .eq("id", itemId)
      .single();

    if (error || !itemData) {
      toast.error("Listing not found");
      router.push(`/${locale}/marketplace`);
      return;
    }

    setItem(itemData);
    setSeller(itemData.users);
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this ${item.title} on KrishiVision!`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-agri-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="hero-header flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white">
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={handleShare} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Share2 size={20} />
        </button>
      </div>

      <div className="flex flex-col">
        {/* Image Gallery */}
        <div className="flex overflow-x-auto snap-x no-scrollbar bg-gray-100">
          {item.marketplace_images.map((img: any) => (
            <div key={img.image_url} className="w-full flex-shrink-0 snap-center aspect-square">
              <img src={img.image_url} alt={item.title} className="w-full h-full object-cover" />
            </div>
          ))}
          {item.marketplace_images.length === 0 && (
            <div className="w-full aspect-square flex items-center justify-center text-6xl shadow-inner">
              🌾
            </div>
          )}
        </div>

        <div className="page-content flex flex-col gap-6">
          <div>
            <span className="text-caption font-bold text-agri-green bg-agri-green-muted px-2 py-1 rounded-full uppercase">
              {t(item.category as "equipment")}
            </span>
            <h1 className="text-heading font-bold text-gray-900 mt-2">{item.title}</h1>
            <p className="text-heading-lg font-bold text-agri-green mt-1">
              {formatINR(item.price)}
            </p>
          </div>

          <div className="flex items-center gap-4 text-gray-500 py-4 border-y border-gray-100">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="text-body-sm font-medium">{item.location}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-body-sm">
              {t("postedOn", { date: formatDate(item.created_at, locale) })}
            </span>
          </div>

          <div>
            <h2 className="text-body font-bold text-gray-800 mb-2">{t("description")}</h2>
            <p className="text-body text-gray-600 leading-relaxed whitespace-pre-wrap">
              {item.description || "No description provided."}
            </p>
          </div>

          {/* Seller Card */}
          <div className="kv-card border border-gray-100 mt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-agri-green-muted rounded-full flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <p className="text-body font-bold text-gray-900">{seller?.name || "Farmer"}</p>
                <p className="text-caption text-gray-500">Verified Seller</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${seller?.phone}`}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Phone size={18} /> {t("callSeller")}
              </a>
              <a
                href={`https://wa.me/${seller?.phone?.replace(/\+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <BottomNav locale={locale} />
    </div>
  );
}
