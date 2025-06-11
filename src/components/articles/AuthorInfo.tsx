// src/components/features/articles/AuthorInfo.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link"; // Optional: If linking to author profiles

// Define Author type based on GraphQL fragment
interface Author {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
}

interface AuthorInfoProps {
  author: Author;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ author }) => {
  return (
    <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-darkMode-bg-secondary rounded-lg shadow-sm">
      {author.avatar && (
        <div className="flex-shrink-0">
          {/* Optional: Link avatar to author profile page */}
          {/* <Link href={`/authors/${author.id}`}> */}
            <Image
              src={author.avatar}
              alt={`Avatar of ${author.name}`}
              width={64} // Adjust size as needed
              height={64}
              className="rounded-full object-cover"
            />
          {/* </Link> */}
        </div>
      )}
      <div className="flex-1">
        {/* Optional: Link name to author profile page */}
        {/* <Link href={`/authors/${author.id}`}> */}
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
            {author.name}
          </h3>
        {/* </Link> */}
        {author.role && (
          <p className="text-sm text-primary dark:text-primary-hover mb-2">
            {author.role}
          </p>
        )}
        {author.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );
};
