import { cn } from "@/shared/utils/cn";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
};

export function Avatar({ src, alt = "", initials, size = "md", className, ...props }: AvatarProps) {
  return (
    <span {...props} className={cn("ui-avatar", className)} data-size={size}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Avatar accepts arbitrary DS image URLs that may not be known to next/image remotePatterns. */}
      {src ? <img src={src} alt={alt} /> : initials}
    </span>
  );
}
