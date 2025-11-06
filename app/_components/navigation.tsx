"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  { title: "Log In", path: "/login" },
  { title: "Profil", path: "/profil" },
  { title: "Dodaj Ture", path: "/dodaj_ture" },
  { title: "Istraži Ture", path: "/istrazi_ture" },
  { title: "Blog", path: "/blog" },
  { title: "Pomoć", path: "/pomoc" },
];

function processPage(page: Page, index: number, currentPath?: string) {
  const isActive =
    page.path === "/"
      ? currentPath === page.path
      : currentPath?.startsWith(page.path);

  return (
    <li key={index}>
      <Link
        href={page.path}
        className={`px-3 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? "bg-orangePantone text-white font-extrabold"
            : "text-white hover:bg-pineGreen hover:text-orangePantone"
        }`}
      >
        {page.title}
      </Link>
    </li>
  );
}

export function Navigation() {
  const currentPath = usePathname();
  return (
    <nav className="bg-green-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-center space-x-4 py-4 text-lg">
          {pages.map((page, index) => processPage(page, index, currentPath))}
        </ul>
      </div>
    </nav>
  );
}
