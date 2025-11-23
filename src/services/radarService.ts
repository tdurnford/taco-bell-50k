// Radar API service for address autocomplete functionality
// API Documentation: https://radar.com/documentation/api#search-autocomplete

// Type definition for Radar API autocomplete response
// This matches the structure returned by the Radar API
export interface RadarAddress {
  // Address components - these are the fields we'll use to populate the form
  street: string; // Street name (e.g., "Clinton St")
  number?: string; // Street number (e.g., "1")
  city: string; // City name (e.g., "Brooklyn")
  state: string; // Full state name (e.g., "New York")
  stateCode: string; // Two-letter state code (e.g., "NY")
  postalCode: string; // ZIP code (e.g., "11201")
  country: string; // Country name (e.g., "United States")
  countryCode: string; // Two-letter country code (e.g., "US")

  // Additional metadata from Radar API
  formattedAddress: string; // Complete formatted address string
  latitude: number; // Geographic latitude
  longitude: number; // Geographic longitude
  placeLabel?: string; // Business or place name if applicable
  layer: string; // Radar layer type ("address", "place", etc.)
}

// Type for the complete API response from Radar
interface RadarAutocompleteResponse {
  meta: {
    code: number; // HTTP status code
  };
  addresses: RadarAddress[]; // Array of address suggestions
}

// Parsed address structure that matches our form fields
// This simplifies the Radar response to only what we need
export interface ParsedAddress {
  streetAddress: string; // Combined street number + street name
  city: string; // City name
  stateCode: string; // Two-letter state abbreviation for dropdown
  zipCode: string; // ZIP/postal code
  fullRadarData: RadarAddress; // Store complete Radar data for reference
}

// Get the Radar API key from environment variables
// This will be embedded at build time by Create React App
const API_KEY = process.env.REACT_APP_RADAR_API_KEY;

// Validate that the API key is configured
if (!API_KEY || API_KEY === "your_radar_publishable_key_here") {
  console.warn(
    "⚠️ Radar API key not configured. Address autocomplete will not work. " +
      "Please set REACT_APP_RADAR_API_KEY in your .env file."
  );
}

/**
 * Search for addresses using Radar API autocomplete
 *
 * @param query - The partial address string to search for (e.g., "123 Main")
 * @param countryCode - Optional country code to filter results (default: "US")
 * @param limit - Maximum number of results to return (default: 5)
 * @returns Promise resolving to array of parsed addresses
 *
 * @example
 * const results = await searchAddresses("123 Main St");
 * // Returns addresses matching "123 Main St" in the US
 */
export async function searchAddresses(
  query: string,
  countryCode: string = "US",
  limit: number = 5
): Promise<ParsedAddress[]> {
  // Don't make API calls if the query is too short or API key is missing
  if (!query || query.trim().length < 2) {
    return [];
  }

  if (!API_KEY || API_KEY === "your_radar_publishable_key_here") {
    console.error("Radar API key not configured");
    return [];
  }

  try {
    // Build query parameters for the API request
    // encodeURIComponent ensures special characters are properly encoded
    const params = new URLSearchParams({
      query: query.trim(),
      limit: limit.toString(),
      countryCode: countryCode,
    });

    // Make the API request to Radar's autocomplete endpoint
    const response = await fetch(
      `https://api.radar.io/v1/search/autocomplete?${params}`,
      {
        headers: {
          // Radar uses the Authorization header for the API key
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(
        `Radar API error: ${response.status} ${response.statusText}`
      );
    }

    // Parse the JSON response
    const data: RadarAutocompleteResponse = await response.json();

    // Transform Radar's response format into our simplified format
    // This makes it easier to work with in the UI components
    return data.addresses.map((addr) => parseRadarAddress(addr));
  } catch (error) {
    // Log errors for debugging but don't crash the app
    console.error("Address autocomplete search failed:", error);
    return [];
  }
}

/**
 * Parse a Radar address object into our simplified form structure
 *
 * @param radarAddress - Raw address object from Radar API
 * @returns Parsed address with only the fields needed for our form
 *
 * This function combines the street number and street name into a single
 * field, extracts the state code (not full state name), and preserves
 * the complete Radar data for reference.
 */
export function parseRadarAddress(radarAddress: RadarAddress): ParsedAddress {
  return {
    // Combine street number and street name into a single address line
    // Example: number="123" + street="Main St" = "123 Main St"
    // If no number is provided, just use the street name
    streetAddress: radarAddress.number
      ? `${radarAddress.number} ${radarAddress.street}`
      : radarAddress.street,

    city: radarAddress.city || "",
    // Use stateCode (e.g., "NY") instead of state (e.g., "New York")
    // This matches our state dropdown which uses two-letter codes
    stateCode: radarAddress.stateCode || "",
    zipCode: radarAddress.postalCode || "",

    // Store the complete Radar response in case we need it later
    // For example, for displaying formatted addresses or coordinates
    fullRadarData: radarAddress,
  };
}
