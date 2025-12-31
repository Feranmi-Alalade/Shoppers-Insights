import Link from "next/link";
import Image from "next/image";

import type { AnchorHTMLAttributes } from "react";

export default function Logo({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-lg font-semibold md:text-base ${className}`}
      {...props}
    >
      <Image src="/logo.svg" alt="ShopperInsights Logo" width={32} height={32} priority />
      <span className="ml-1 select-none font-bold tracking-tight">ShopperInsights</span>
    </Link>
  );
}
