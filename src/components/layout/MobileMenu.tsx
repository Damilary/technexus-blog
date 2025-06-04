'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { NavigationItem } from '@/components/layout/Header';
import type { User } from '@/types/user';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navigation: {
    main: NavigationItem[];
  };
  user: User | null;
  onLogout?: () => Promise<void>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  setIsOpen, 
  navigation, 
  user,
  onLogout 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleLogout = useCallback(async () => {
    if (onLogout) {
      try {
        await onLogout();
        handleClose();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }, [onLogout, handleClose]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
      className="md:hidden fixed inset-0 z-50 bg-white dark:bg-darkMode-bg shadow-lg"
    >
      <div className="px-4 pt-2 pb-6 space-y-4">
        {/* Navigation links */}
        <nav aria-label="Mobile navigation" className="space-y-1">
          {navigation.main.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={handleClose}
              >
                {item.name}
              </Link>
              
              {/* Sub-categories */}
              {item.subCategories && (
                <div 
                  className="pl-4 mt-1 space-y-1 border-l-2 border-light-dark"
                  role="region"
                  aria-label={`${item.name} subcategories`}
                >
                  {item.subCategories.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block py-1 text-sm text-dark-light dark:text-medium-light hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={handleClose}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* Search */}
        <div className="pt-2">
          <SearchBar className="w-full" />
        </div>
        
        {/* Auth buttons or user info */}
        <div className="pt-2">
          {user ? (
            <div className="flex items-center space-x-3 py-2">
              <div 
                className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium"
                role="img"
                aria-label={`${user.firstName || user.username}'s avatar`}
              >
                {user.firstName?.[0]?.toUpperCase() ?? user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  {user.firstName ?? user.username}
                </p>
                <p className="text-sm text-medium">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button variant="secondary" href="/login" className="w-full">
                Log in
              </Button>
              <Button variant="primary" href="/signup" className="w-full">
                Sign up
              </Button>
            </div>
          )}
        </div>
        
        {/* Additional links */}
        <div className="pt-4 border-t border-light-dark">
          <Link
            href="/newsletter"
            className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={handleClose}
          >
            Subscribe to Newsletter
          </Link>
          {user && (
            <>
              <Link
                href="/profile"
                className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={handleClose}
              >
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={handleClose}
              >
                Settings
              </Link>
              <button
                className="block w-full text-left py-2 text-base font-medium text-error hover:text-error focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
