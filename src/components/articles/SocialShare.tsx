// src/components/features/articles/SocialShare.tsx
import React from "react";
import { Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/Button"; // Assuming a Button component exists

interface SocialShareProps {
  title: string;
  url: string; // The canonical URL of the article
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, url }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  const openShareWindow = (shareUrl: string) => {
    // Open in a new window/tab
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on Twitter"
        onClick={() => openShareWindow(shareLinks.twitter)}
        className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on Facebook"
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on LinkedIn"
        onClick={() => openShareWindow(shareLinks.linkedin)}
        className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      {/* Add more platforms as needed */}
    </div>
  );
};
