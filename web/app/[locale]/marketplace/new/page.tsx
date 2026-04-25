"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Camera, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MARKETPLACE_CATEGORIES } from "@/lib/utils";
import { uploadMarketplaceImage } from "@/lib/image-utils";
import { toast } from "sonner";

export default function NewListingPage() {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "equipment",
    location: "",
    description: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.warning("Maximum 5 photos allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Create listing
      const { data: item, error: itemError } = await supabase
        .from("marketplace_items")
        .insert({
          user_id: user.id,
          title: formData.title,
          price: parseInt(formData.price),
          category: formData.category,
          location: formData.location,
          description: formData.description,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // 2. Upload images
      for (let i = 0; i < images.length; i++) {
        const url = await uploadMarketplaceImage(supabase, images[i], user.id, i);
        await supabase.from("marketplace_images").insert({
          item_id: item.id,
          image_url: url,
          sort_order: i,
        });
      }

      toast.success(t("publishSuccess"));
      router.push(`/${locale}/marketplace`);
    } catch (err: any) {
      toast.error(err.message || "Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="hero-header">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-heading-lg font-bold text-white">{t("addListing")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="page-content flex flex-col gap-6">
        {/* Photo Grid */}
        <div>
          <label className="text-body-sm font-semibold text-gray-600 mb-2 block">{t("photos")}</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            {previews.map((url, i) => (
              <div key={url} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img src={url} alt="Listing" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="w-24 h-24 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 bg-white cursor-pointer active:bg-gray-50">
                <Camera size={24} />
                <span className="text-[10px] mt-1">Add Photo</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="text-body-sm font-semibold text-gray-600 mb-1 block">{t("titleLabel")}</label>
          <input
            required
            className="kv-input"
            placeholder={t("titlePlaceholder")}
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-body-sm font-semibold text-gray-600 mb-1 block">{t("price")}</label>
            <input
              required
              type="number"
              className="kv-input"
              placeholder={t("pricePlaceholder")}
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <label className="text-body-sm font-semibold text-gray-600 mb-1 block">{t("category")}</label>
            <select
              className="kv-input"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              {MARKETPLACE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{t(cat as "equipment")}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-body-sm font-semibold text-gray-600 mb-1 block">{t("location")}</label>
          <input
            required
            className="kv-input"
            placeholder={t("locationPlaceholder")}
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="text-body-sm font-semibold text-gray-600 mb-1 block">{t("description")}</label>
          <textarea
            className="kv-input h-32 py-3 resize-none"
            placeholder={t("descriptionPlaceholder")}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-4">
          {loading ? "Publishing..." : t("publish")}
        </button>
      </form>
    </div>
  );
}
