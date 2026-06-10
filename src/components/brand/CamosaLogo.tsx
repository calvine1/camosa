import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type CamosaLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: { h: 24, w: 80 },
  md: { h: 44, w: 148 },
  lg: { h: 56, w: 188 },
};

/** Ecare logo — uses logo.jpeg from /public */
export default function CamosaLogo({ size = "md", className }: CamosaLogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.jpeg"
        alt={BRAND.fullName}
        width={s.w}
        height={s.h}
        className="object-contain"
        priority
      />
    </div>
  );
}
