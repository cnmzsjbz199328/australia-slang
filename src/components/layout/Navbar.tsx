import Link from "next/link";
import Image from "next/image";
import { Book, Trophy, User } from "lucide-react";

const navLinks = [
  { href: "/slang", label: "Slang Dictionary", icon: Book, shortLabel: "Dictionary" },
  { href: "/quiz", label: "Quiz", icon: Trophy, shortLabel: "Quiz" },
  { href: "/admin", label: "Admin", icon: User, shortLabel: "Admin" },
];

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100" aria-label="Australia Slang">
          <Image src="/icon.svg" alt="Australia Slang" width={32} height={32} className="h-8 w-8" />
          <span className="hidden md:inline">Australia Slang</span>
        </Link>
        <ul className="flex gap-2 sm:gap-4">
          {navLinks.map(({ href, label, icon: Icon, shortLabel }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:px-3 sm:py-2"
                aria-label={label}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
