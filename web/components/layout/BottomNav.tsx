"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, ScanLine, ShoppingBag, User } from "lucide-react";
import { cn } from "../../lib/utils";

interface NavItem {
  key: string;
  labelKey: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { key: "home",        labelKey: "common.home",        icon: Home,        href: "" },
  { key: "scan",        labelKey: "common.scan",        icon: ScanLine,    href: "/scan" },
  { key: "marketplace", labelKey: "common.marketplace", icon: ShoppingBag, href: "/marketplace" },
  { key: "profile",     labelKey: "common.profile",     icon: User,        href: "/profile" },
];

interface BottomNavProps {
  locale: string;
}

export default function BottomNav({ locale }: BottomNavProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href}`;
    if (href === "") return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullHref);
  };

  const navigate = (href: string) => {
    router.push(`/${locale}${href}`);
  };

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                 bg-white border-t border-gray-100 shadow-nav z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center h-[72px]">
        {navItems.map(({ key, labelKey, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <button
              key={key}
              id={`nav-${key}`}
              onClick={() => navigate(href)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 h-full",
                "transition-colors duration-150 active:bg-gray-50",
                active ? "text-agri-green" : "text-gray-400"
              )}
            >
              <Icon
                size={26}
                strokeWidth={active ? 2.5 : 1.8}
                className={cn("transition-all duration-150", active && "scale-110")}
              />
              <span className={cn(
                "text-[11px] font-medium leading-none",
                active ? "text-agri-green font-semibold" : "text-gray-400"
              )}>
                {t(labelKey)}
              </span>
              {active && (
                <div className="absolute top-0 w-6 h-[3px] bg-agri-green rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
