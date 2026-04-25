"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/layout/BottomNav";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";
import { createClient } from "@/lib/supabase/client";
import { MARKETPLACE_CATEGORIES } from "@/lib/utils";

export default function MarketplacePage() {
  const t = useTranslations("marketplace");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchListings(true);
  }, [activeCategory, search]);

  const fetchListings = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 0 : page;
    if (reset) setPage(0);

    let query = supabase
      .from("marketplace_items")
      .select(`
        id, title, price, location, category, created_at,
        marketplace_images ( image_url )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE - 1);

    if (activeCategory !== "all") query = query.eq("category", activeCategory);
    if (search) query = query.ilike("title", `%${search}%`);

    const { data } = await query;
    if (data) {
      reset ? setListings(data) : setListings((prev) => [...prev, ...data]);
    }
    setLoading(false);
  };

  const categories = ["all", ...MARKETPLACE_CATEGORIES];

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="hero-header">
        <h1 className="text-heading-lg font-bold text-white">{t("title")}</h1>
        <p className="text-white/70 text-body-sm mt-1">{t("subtitle")}</p>

        {/* Search */}
        <div className="mt-4 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="marketplace-search"
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-touch bg-white rounded-input pl-11 pr-4 text-body
                       focus:outline-none focus:ring-2 focus:ring-agri-green border-0"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto flex gap-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`cat-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`category-pill flex-shrink-0 ${activeCategory === cat ? "active" : ""}`}
          >
            {cat === "all" ? t("allCategories") : t(cat as "equipment")}
          </button>
        ))}
      </div>

      {/* Listings grid */}
      <div className="page-content">
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="kv-card">
                <div className="skeleton aspect-square rounded-xl mb-3" />
                <div className="skeleton h-4 mb-2 w-3/4" />
                <div className="skeleton h-5 mb-2 w-1/2" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="kv-card text-center py-12">
            <div className="text-5xl mb-3">🏪</div>
            <p className="text-body text-gray-400 whitespace-pre-line">{t("noListings")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((item) => (
              <MarketplaceCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                location={item.location}
                imageUrl={item.marketplace_images?.[0]?.image_url}
                category={item.category}
                createdAt={item.created_at}
                onClick={() => router.push(`/${locale}/marketplace/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB — Add Listing */}
      <motion.button
        id="add-listing-fab"
        onClick={() => router.push(`/${locale}/marketplace/new`)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-agri-green text-white rounded-full
                   shadow-button flex items-center justify-center z-40"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <Plus size={26} />
      </motion.button>

      <BottomNav locale={locale} />
    </div>
  );
}
