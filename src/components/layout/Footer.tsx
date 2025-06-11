import React from 'react';
import Link from 'next/link';
import { NewsletterSection } from '@/components/features/home/NewsletterSection'; // Import the NewsletterSection

export interface FooterProps {
  navigation: {
    section: string;
    links: {
      name: string;
      href: string;
    }[];
  }[];
  socialLinks: {
    platform: string;
    href: string;
    icon: React.ComponentType<any>;
  }[];
}

export const Footer: React.FC<FooterProps> = ({ navigation, socialLinks }) => {
  // Separate navigation into two groups for layout purposes
  const navGroup1 = navigation.slice(0, 2); // First two navigation sections
  const navGroup2 = navigation.slice(2); // Remaining navigation sections (if any)

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Adjust grid layout to accommodate newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center">
              {/* Placeholder for logo - replace with actual logo */}
              <div className="h-8 w-32 bg-medium flex items-center justify-center text-white rounded">
                TechNexus Logo
              </div>
            </Link>
            <p className="mt-4 text-medium-light text-sm">
              TechNexus is your go-to resource for the latest in technology, 
              providing in-depth articles, tutorials, and insights across various domains.
            </p>
            
            {/* Social links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a 
                    key={item.platform} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-medium-light hover:text-white transition-colors"
                    aria-label={`Follow us on ${item.platform}`}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Navigation sections (Group 1) */}
          {navGroup1.map((section) => (
            <div key={section.section}>
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                {section.section}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-medium-light hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section (Compact Variant) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <NewsletterSection variant="compact" />
          </div>

          {/* Navigation sections (Group 2 - if any) - might need layout adjustment */}
          {/* Consider if Group 2 needs a different placement or if the grid needs more columns */}
          {/* For now, placing remaining nav items here if they exist */}
          {navGroup2.map((section) => (
            <div key={section.section} className="lg:col-start-2">
              {/* This placement might need refinement based on actual nav items */}
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                {section.section}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-medium-light hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom section with copyright and links */}
        <div className="pt-8 border-t border-dark-light flex flex-col md:flex-row justify-between items-center">
          <p className="text-medium-light text-sm">
            &copy; {new Date().getFullYear()} TechNexus. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-medium-light hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-medium-light hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-medium-light hover:text-white text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

