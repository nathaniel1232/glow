export function Footer() {
  return (
    <footer className="border-t border-border-subtle py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-dim">
            glow -- brand identity, instantly
          </div>
          <div className="flex items-center gap-6 text-sm text-text-dim">
            <a href="#" className="hover:text-text-muted transition-colors">Terms</a>
            <a href="#" className="hover:text-text-muted transition-colors">Privacy</a>
            <a href="mailto:hello@useglow.studio" className="hover:text-text-muted transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
