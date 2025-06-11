'use client';

import React from 'react';
import Link from 'next/link';
import { NavigationItem } from '@/components/layout/Header';
import { User } from '@/hooks/useAuth';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navigation: {
    main: NavigationItem[];
  };
  user: User | null;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  setIsOpen, 
  navigation, 
  user 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden absolute top-16 inset-x-0 z-50 bg-white dark:bg-darkMode-bg shadow-lg border-t border-light-dark">
      <div className="px-4 pt-2 pb-6 space-y-4">
        {/* Navigation links */}
        <div className="space-y-1">
          {navigation.main.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
              
              {/* Sub-categories */}
              {item.subCategories && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-light-dark">
                  {item.subCategories.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block py-1 text-sm text-dark-light dark:text-medium-light hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Search */}
        <div className="pt-2">
          <SearchBar className="w-full" />
        </div>
        
        {/* Auth buttons or user info */}
        <div className="pt-2">
          {user ? (
            <div className="flex items-center space-x-3 py-2">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-dark dark:text-white">{user.name}</p>
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
            className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Subscribe to Newsletter
          </Link>
          {user && (
            <>
              <Link
                href="/profile"
                className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block py-2 text-base font-medium text-dark dark:text-white hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                className="block w-full text-left py-2 text-base font-medium text-error hover:text-error"
                onClick={() => {
                  // Logout logic would go here
                  console.log('Logging out');
                  setIsOpen(false);
                }}
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
