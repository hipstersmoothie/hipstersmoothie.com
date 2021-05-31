import makeClass from "clsx";
import Link from "next/link";

interface HeaderProps {
  active?: "garden";
}

export const Header = ({ active }: HeaderProps) => {
  return (
    <div className="header h-16 border-b w-full">
      <div className="h-full flex items-center justify-between px-4 md:px-10 max-w-[100ch] mx-auto">
        <Link passHref href="/">
          <a>
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#F39AC0] to-[#F06D99]">
              hipstersmoothie.com
            </div>
          </a>
        </Link>

        <div className="text-lg">
          <Link passHref href="/garden">
            <a className={makeClass(active === "garden" && "font-medium")}>
              Digital Garden
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
