// Input validation utilities
export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  return input.trim().substring(0, maxLength);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const isValidLatitude = (lat: number): boolean => {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
};

export const isValidLongitude = (lon: number): boolean => {
  return !isNaN(lon) && lon >= -180 && lon <= 180;
};

export const isValidCategory = (category: string): boolean => {
  const validCategories = ['POTHOLES', 'WASTE', 'WATER', 'ELECTRICITY', 'DRAINAGE', 'OTHER'];
  return validCategories.includes(category.toUpperCase());
};

export const isValidPriority = (priority: string): boolean => {
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
  return validPriorities.includes(priority.toUpperCase());
};

export const isValidStatus = (status: string): boolean => {
  const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
  return validStatuses.includes(status.toUpperCase());
};

export const validatePagination = (page: string | undefined, limit: string | undefined) => {
  const pageNum = Math.max(1, parseInt(page || '1') || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '10') || 10));
  return { pageNum, limitNum, skip: (pageNum - 1) * limitNum };
};
