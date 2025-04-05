/**
 * Environment variable validation using Zod
 *
 * This module validates that all required environment variables are set
 * and provides typed access to them.
 *
 * IMPORTANT: This file is used in both client and server contexts.
 * - Public variables (NEXT_PUBLIC_*) are available in both contexts
 * - Private variables are only available in server contexts
 */

import { z } from "zod";

// Schema for public environment variables (available on client and server)
const publicEnvSchema = z.object({
  NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT: z.string(),
  NEXT_PUBLIC_USDC_ADDRESS: z.string(),
});

// Schema for server-only environment variables (not exposed to the client)
const serverEnvSchema = z.object({});

// Create types from the schemas
export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

// Combined type for all environment variables
export type ValidatedEnv = PublicEnv & ServerEnv;

/**
 * Validates public environment variables that are safe to use on the client
 * @returns The validated public environment variables
 */
export function validatePublicEnv(): PublicEnv {
  const env = {
    NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT:
      process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT,
    NEXT_PUBLIC_USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS,
  };

  try {
    return publicEnvSchema.parse(env);
  } catch (error) {
    handleValidationError(error);
    // This will never be reached due to the throw in handleValidationError
    return env as PublicEnv;
  }
}

/**
 * Validates all environment variables (both public and server-only)
 * This should ONLY be used in server contexts
 * @returns The validated environment variables
 */
export function validateEnv(): ValidatedEnv {
  // First validate public env vars
  const publicEnv = validatePublicEnv();

  // Then validate server-only env vars
  const serverEnv = {};

  try {
    const validatedServerEnv = serverEnvSchema.parse(serverEnv);
    return { ...publicEnv, ...validatedServerEnv };
  } catch (error) {
    handleValidationError(error);
    // This will never be reached due to the throw in handleValidationError
    return publicEnv as ValidatedEnv;
  }
}

/**
 * Helper function to handle validation errors
 */
function handleValidationError(error: unknown): never {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors
      .map((err) => {
        const path = err.path.join(".");
        return `  - ${path}: ${err.message}`;
      })
      .join("\n");

    throw new Error(
      `Environment variable validation failed:\n${missingVars}\n\nPlease check your .env.local file and make sure all required variables are set correctly.`
    );
  }

  // Re-throw other errors
  throw error;
}
