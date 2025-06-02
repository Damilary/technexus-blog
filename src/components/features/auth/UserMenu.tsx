"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { User } from "@/hooks/useAuth"; // Assuming User type has name and optional avatar
import Link from "next/link";
import Image from "next/image";

interface UserMenuProps {
  user: User;
  onLogout: () => Promise<void>;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Stores references to all DOM elements that are potential menu items
  const itemElementsRef = useRef<(HTMLElement | null)[]>([]);
  const [typeAheadBuffer, setTypeAheadBuffer] = useState("");
  const typeAheadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to get currently focusable items
  const getFocusableItems = useCallback(() => {
    return itemElementsRef.current.filter(
      (item) =>
        item &&
        item.getAttribute("aria-disabled") !== "true" &&
        !item.hasAttribute("disabled")
    ) as HTMLElement[];
  }, []);

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

  // Effect to focus the first item when the menu opens
  useEffect(() => {
    if (isOpen) {
      const focusableItems = getFocusableItems();
      focusableItems[0]?.focus();
    }
  }, [isOpen, getFocusableItems]);

  // Effect to handle keyboard navigation within the menu
  useEffect(() => {
    if (!isOpen) return;

    const handleMenuKeyDown = (event: KeyboardEvent) => {
      const focusableItems = getFocusableItems();
      if (focusableItems.length === 0) return;

      const activeElement = document.activeElement as HTMLElement;
      let currentIndex = focusableItems.findIndex(
        (item) => item === activeElement
      );

      // If no item is focused, or focused item is not in our list (e.g. menu itself),
      // default to -1 so ArrowDown starts at 0, ArrowUp at last.
      if (currentIndex === -1 && activeElement !== menuRef.current) {
         // Allow typeahead even if no item is focused yet
      } else if (currentIndex === -1 && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        // If menu itself is focused, ArrowDown focuses first, ArrowUp focuses last
         currentIndex = event.key === "ArrowDown" ? -1 : 0;
      }


      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % focusableItems.length;
          focusableItems[nextIndex]?.focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          const prevIndex =
            (currentIndex - 1 + focusableItems.length) %
            focusableItems.length;
          focusableItems[prevIndex]?.focus();
          break;
        case "Home":
          event.preventDefault();
          focusableItems[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          focusableItems[focusableItems.length - 1]?.focus();
          break;
        default:
          // Type-ahead logic
          if (/^[a-zA-Z0-9]$/.test(event.key)) {
            event.preventDefault();
            if (typeAheadTimeoutRef.current) {
              clearTimeout(typeAheadTimeoutRef.current);
            }
            const newBuffer = (typeAheadBuffer + event.key).toLowerCase();
            setTypeAheadBuffer(newBuffer);

            let matchedItem = focusableItems.find((item) =>
              item.textContent?.trim().toLowerCase().startsWith(newBuffer)
            );

            // If multiple typed chars don't match, try with the single current char
            if (!matchedItem && newBuffer.length > 1) {
              matchedItem = focusableItems.find((item) =>
                item.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase())
              );
            }
            
            matchedItem?.focus();

            typeAheadTimeoutRef.current = setTimeout(
              () => setTypeAheadBuffer(""),
              1000 // Adjust timeout as needed
            );
          }
          break;
      }
    };

    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener("keydown", handleMenuKeyDown);
    }

    return () => {
      if (menuElement) {
        menuElement.removeEventListener("keydown", handleMenuKeyDown);
      }
      if (typeAheadTimeoutRef.current) {
        clearTimeout(typeAheadTimeoutRef.current);
      }
    };
  }, [isOpen, getFocusableItems, typeAheadBuffer]);

  const handleLogout = async () => {
    try {
      await onLogout();
      setIsOpen(false);
      buttonRef.current?.focus();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Example of how you might mark an item as disabled
  const isSettingsDisabled = false; // Set this based on some condition

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full"
        id="user-menu-button"
        aria-expanded={isOpen}
        aria-controls="user-menu"
        aria-haspopup="true"
      >
        {user.avatar ? (
          <Image
            className="h-8 w-8 rounded-full object-cover"
            src={user.avatar}
            alt={`${user.name}'s profile`}
            width={32}
            height={32}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
            {user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="ml-2 hidden md:block">{user.name}</span>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-darkMode-bg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1} // Menu container itself is not directly focusable by Tab
          id="user-menu"
        >
          <Link href="/profile" passHref legacyBehavior>
            <a
              ref={(el) => (itemElementsRef.current[0] = el)}
              className="block px-4 py-2 text-sm text-dark dark:text-white hover:bg-light dark:hover:bg-dark-light"
              role="menuitem"
              tabIndex={0} // Make focusable when menu is open
              onClick={handleItemClick}
            >
              Your Profile
            </a>
          </Link>
          <Link href="/settings" passHref legacyBehavior>
            <a
              ref={(el) => (itemElementsRef.current[1] = el)}
              className={`block px-4 py-2 text-sm  hover:bg-light dark:hover:bg-dark-light ${
                isSettingsDisabled
                  ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "text-dark dark:text-white"
              }`}
              role="menuitem"
              tabIndex={isSettingsDisabled ? -1 : 0}
              aria-disabled={isSettingsDisabled}
              onClick={(e) => {
                if (isSettingsDisabled) {
                  e.preventDefault();
                  return;
                }
                handleItemClick();
              }}
            >
              Settings
            </a>
          </Link>
          <button
            ref={(el) => (itemElementsRef.current[2] = el)}
            type="button"
            className="block w-full text-left px-4 py-2 text-sm text-dark dark:text-white hover:bg-light dark:hover:bg-dark-light"
            role="menuitem"
            tabIndex={0}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
