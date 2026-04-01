import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-heading font-semibold tracking-tight">
          glow
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/#pricing"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="h-9 px-4 text-sm font-medium bg-purple text-bg rounded-lg inline-flex items-center hover:bg-purple/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
