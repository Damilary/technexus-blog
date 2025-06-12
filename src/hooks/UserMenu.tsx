
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { User, useAuth } from '@/hooks/useAuth'; // Assuming useAuth provides logout
import { ChevronDown } from 'lucide-react'; // Optional: add an icon
import Image from 'next/image';

interface UserMenuProps {
  user: User;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { logout } = useAuth(); // Get logout function from auth hook

  // Close menu on outside click
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  // Close menu on Escape key press
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus(); // Return focus to button on escape
    }
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Focus the first menu item when opened
      const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
      firstItem?.focus();
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleClickOutside, handleEscapeKey]);

  // Handle keyboard navigation within the menu
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    );
    const activeIndex = items.findIndex(item => item === document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(activeIndex + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(activeIndex - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Tab':
        // Close menu on tab out, return focus to button
        setIsOpen(false);
        buttonRef.current?.focus(); 
        break;
      case 'Enter':
      case ' ':
        // Activate the focused menu item
        if (document.activeElement && items.includes(document.activeElement as HTMLElement)) {
          event.preventDefault();
          (document.activeElement as HTMLElement).click();
        }
        break;
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    // Optionally redirect or perform other actions after logout
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full p-1"
        id="user-menu-button"
        aria-expanded={isOpen ? "true" : "false"}
        aria-controls="user-menu"
        aria-haspopup="true"
      >
        <span className="sr-only">Open user menu</span>
        {user.avatar ? (
          <Image
            className="h-8 w-8 rounded-full"
            src={user.avatar}
            alt={`${user.name}'s profile`}
            width={32} // required
            height={32} // required
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="ml-2 hidden md:block">{user.name}</span>
        <ChevronDown className="ml-1 h-4 w-4 hidden md:block text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-darkMode-bg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1} // Allows the div itself to be focused programmatically if needed, but items handle focus
          onKeyDown={handleKeyDown} // Handle keyboard navigation
        >
          <Link href="/profile" passHref legacyBehavior>
            <a
              href="/profile" // href is still needed for legacyBehavior
              className="block px-4 py-2 text-sm text-dark dark:text-white hover:bg-light dark:hover:bg-dark-light focus:outline-none focus:bg-light dark:focus:bg-dark-light rounded-t-md"
              role="menuitem"
              tabIndex={-1} // Make items focusable programmatically
              onClick={() => setIsOpen(false)} // Close menu on item click
            >
              Your Profile
            </a>
          </Link>
          <Link href="/settings" passHref legacyBehavior>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-dark dark:text-white hover:bg-light dark:hover:bg-dark-light focus:outline-none focus:bg-light dark:focus:bg-dark-light"
              role="menuitem"
              tabIndex={-1}
              onClick={() => setIsOpen(false)} // Close menu on item click
            >
              Settings
            </a>
          </Link>
          <button
            type="button"
            className="block w-full text-left px-4 py-2 text-sm text-dark dark:text-white hover:bg-light dark:hover:bg-dark-light focus:outline-none focus:bg-light dark:focus:bg-dark-light rounded-b-md"
            role="menuitem"
            tabIndex={-1}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
