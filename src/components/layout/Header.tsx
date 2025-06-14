"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// // import Image from 'next/image';
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/hooks/UserMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

export interface NavigationItem {
  name: string;
  href: string;
  subCategories?: {
    name: string;
    href: string;
  }[];
}

export interface HeaderProps {
  navigation: {
    main: NavigationItem[];
  };
}

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on window resize (if screen becomes larger than mobile breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-darkMode-bg border-b border-light-dark transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              {/* Placeholder for logo - replace with actual logo */}
              <div className="h-8 w-32 bg-light-dark dark:bg-medium flex items-center justify-center text-dark dark:text-white rounded">
                TechNexus Logo
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.main.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary text-sm font-medium text-dark dark:text-white hover:text-primary transition-colors"
                >
                  {item.name}
                  {item.subCategories && (
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {/* Dropdown for subcategories */}
                {item.subCategories && (
                  <div className="absolute z-10 hidden group-hover:block pt-2 w-48">
                    <div className="rounded-md shadow-lg bg-white dark:bg-darkMode-bg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="py-1">
                        {item.subCategories.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-dark dark:text-white hover:bg-light dark:hover:bg-dark-light hover:text-primary transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <SearchBar className="hidden md:block w-48 lg:w-64" />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {/* Subscribe button */}
            <Button
              variant="tertiary"
              className="hidden md:block"
              onClick={() => setShowNewsletterModal(true)}
              title="Subscribe to our newsletter"
            >
              Subscribe
            </Button>

            {/* Auth buttons or user menu */}
            {isAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="secondary" href="/login">
                  Log in
                </Button>
                <Button variant="primary" href="/signup">
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-medium hover:text-dark dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen ? "true" : "false"}
              title="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                // X icon when menu is open
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon when menu is closed
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        navigation={navigation}
        user={user}
      />

      {/* Newsletter modal would be implemented here */}
      {showNewsletterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-darkMode-bg p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Subscribe to our Newsletter
              </h2>
              <button
                onClick={() => setShowNewsletterModal(false)}
                className="text-medium hover:text-dark dark:hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-dark-light dark:text-medium-light mb-4">
              Stay updated with the latest tech news, tutorials, and insights.
            </p>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-dark dark:text-white mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <Button variant="primary" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
