import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop | Damacii Studios",
  description: "The Damacii Studios shop is coming soon.",
};

export default function ShopPage() {
  return <main className="shop-page">
    <header className="shop-header"><Link className="shop-wordmark" href="/" aria-label="Damacii Studios home"><img src="/assets/logos/damacii-white-orange.png" width="799" height="157" alt="Damacii Studios" /></Link><Link className="shop-back" href="/">Back to home ↗</Link></header>
    <section className="shop-content" aria-labelledby="shop-title"><p className="shop-eyebrow">DAMACII STUDIOS / SHOP</p><h1 id="shop-title">GOOD THINGS<br /><em>ARE COMING.</em></h1><p>Our shop is in the works. Check back soon.</p><Link className="shop-home-link" href="/">Explore the studio <span>↗</span></Link></section>
    <footer className="shop-footer"><span>© 2026 DAMACII STUDIOS</span><span>WEB DESIGN + INTERIOR 3D + CONTENT</span></footer>
  </main>;
}
