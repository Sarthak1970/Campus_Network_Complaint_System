const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_BASE_URL = BACKEND_URL;

export const API_ENDPOINTS = {
  DASHBOARD: `${BACKEND_URL}/api/dashboard`,
  COMPLAINTS: `${BACKEND_URL}/api/complaints`,
  ADMIN_COMPLAINTS: `${BACKEND_URL}/api/admin/complaints`,
} as const;

export default API_BASE_URL;