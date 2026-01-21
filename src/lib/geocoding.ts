// Free geocoding using Nominatim (OpenStreetMap)
// No API key required - Completely FREE!

interface GeocodingResult {
  success: boolean;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  error?: string;
}

/**
 * Convert coordinates to human-readable address (Reverse Geocoding)
 * FREE - No API key needed
 */
export async function getAddressFromCoordinates(
  latitude: number,
  longitude: number
): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'Sampark-Grievance-App', // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        error: 'Location not found',
      };
    }

    // Extract meaningful address
    const address = data.display_name || data.address?.road || 'Unknown location';

    return {
      success: true,
      address,
      coordinates: { lat: latitude, lng: longitude },
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      success: false,
      error: 'Failed to get address',
    };
  }
}

/**
 * Convert address to coordinates (Forward Geocoding)
 * FREE - No API key needed
 */
export async function getCoordinatesFromAddress(
  address: string
): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'Sampark-Grievance-App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search location');
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Location not found',
      };
    }

    return {
      success: true,
      address: data[0].display_name,
      coordinates: {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      },
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      success: false,
      error: 'Failed to search location',
    };
  }
}

/**
 * Get current location using browser's Geolocation API
 * 100% FREE - Built into browsers
 */
export async function getCurrentLocation(): Promise<GeocodingResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: 'Geolocation not supported',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Try to get address from coordinates
        const addressResult = await getAddressFromCoordinates(lat, lng);

        resolve({
          success: true,
          address: addressResult.address,
          coordinates: { lat, lng },
        });
      },
      (error) => {
        resolve({
          success: false,
          error: error.message || 'Unable to get location',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Search for locations as user types (for autocomplete)
 * FREE - No API key needed
 * Note: Nominatim has 1 request/second limit - use debouncing
 */
export async function searchLocations(query: string): Promise<{
  success: boolean;
  results?: Array<{
    displayName: string;
    lat: number;
    lng: number;
  }>;
  error?: string;
}> {
  if (!query || query.length < 3) {
    return { success: false, error: 'Query too short' };
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=5`,
      {
        headers: {
          'User-Agent': 'Sampark-Grievance-App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();

    return {
      success: true,
      results: data.map((item: any) => ({
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      })),
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      error: 'Failed to search',
    };
  }
}
