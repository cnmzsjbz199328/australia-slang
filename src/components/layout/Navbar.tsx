import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/slang", label: "Slang Dictionary" },
  { href: "/quiz", label: "Quiz" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Australia Slang
        </Link>
        <ul className="flex gap-4">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
