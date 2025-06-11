import React from "react";
import { HeroSection } from "@/components/features/home/HeroSection";
import { FeaturedArticlesSection } from "@/components/features/home/FeaturedArticlesSection";
import { CategoryShowcaseSection } from "@/components/features/home/CategoryShowcaseSection";
import { TopPicksSection } from "@/components/features/home/TopPicksSection";
import { NewsletterSection } from "@/components/features/home/NewsletterSection";
import { LatestArticlesSection } from "@/components/features/home/LatestArticlesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* HeroSection now fetches data dynamically */}
      <HeroSection />
      {/* FeaturedArticlesSection now fetches data dynamically */}
      <FeaturedArticlesSection />
      {/* CategoryShowcaseSection now fetches data dynamically */}
      <CategoryShowcaseSection
        title="Latest in Web Development"
        categorySlug="web-development"
      />
      {/* TopPicksSection now fetches data dynamically */}
      <TopPicksSection />
      {/* NewsletterSection remains static for now */}
      <NewsletterSection />
      {/* LatestArticlesSection now fetches data dynamically */}
      <LatestArticlesSection />
    </div>
  );
}
