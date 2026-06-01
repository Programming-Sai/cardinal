import { Link } from "react-router";
import logoDark from "../../../assets/logo-dark.png";
import logoLight from "../../../assets/logo-light.png";
import BrandMark from "./BrandMark";

type BrandLogoProps = {
  to?: string;
  className?: string;
  showWordmark?: boolean;
  compact?: boolean;
  size?: "sm" | "md" | "lg";
  mode?: "dark" | "light";
};

const sizeMap = {
  sm: "h-10",
  md: "h-12 sm:h-14",
  lg: "h-14 sm:h-16",
};

export default function BrandLogo({
  to = "/",
  className = "",
  showWordmark = false,
  compact = false,
  size = "md",
  mode = "dark",
}: BrandLogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      {compact ? (
        <>
          <BrandMark size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"} />
          {showWordmark && (
            <span className="font-extrabold tracking-[-0.03em] text-brand-navy text-lg sm:text-xl">
              Cardinal Immersions
            </span>
          )}
        </>
      ) : (
        <img
          src={mode == "dark" ? logoDark : logoLight}
          alt="Cardinal Immersions"
          className={`${sizeMap[size]} w-auto object-contain`}
        />
      )}
    </span>
  );

  return (
    <Link to={to} aria-label="Cardinal Immersions home">
      {content}
    </Link>
  );
}
