"use client";

import { useEffect, useState } from "react";
import { validateEnv } from "@/lib/env";

export default function TestEnvPage() {
  const [envStatus, setEnvStatus] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "Checking environment..." });

  useEffect(() => {
    try {
      validateEnv(["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_APP_URL"]);
      setEnvStatus({
        isValid: true,
        message: "Environment variables are valid!",
      });
    } catch (error) {
      setEnvStatus({
        isValid: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Environment Test Page</h1>

      <div
        className={`p-4 rounded-lg ${
          envStatus.isValid
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        <p className="font-medium">Status: {envStatus.message}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Current Environment Variables:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(
              {
                NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
                NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
                NODE_ENV: process.env.NODE_ENV,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
