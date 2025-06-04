"use client";

import React, { useEffect, useRef, useState } from "react";
import type { User } from "@/types/user";
import Link from "next/link";

interface UserMenuProps {
  user: User;
  onLogout: () => Promise<void>;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemElementsRef = useRef<Array<HTMLElement | null>>([]);

  // Effect for closing menu on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const displayName = user.firstName ?? user.username;
  const displayInitial =
    (user.firstName?.[0] ?? user.username[0])?.toUpperCase() ?? "?";

  return (
    <nav className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="user-menu"
      >
        <span className="sr-only">Open user menu for {displayName}</span>
        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
          {displayInitial}
        </div>
        <span className="ml-2 hidden md:block">{displayName}</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id="user-menu"
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              ref={(el) => {
                itemElementsRef.current[0] = el;
              }}
              tabIndex={isOpen ? 0 : -1}
            >
              Your Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              ref={(el) => {
                itemElementsRef.current[1] = el;
              }}
              tabIndex={isOpen ? 0 : -1}
            >
              Settings
            </Link>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              ref={(el) => {
                itemElementsRef.current[2] = el;
              }}
              tabIndex={isOpen ? 0 : -1}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
