const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

export const apiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const parseApiResponse = async <T>(
  res: Response,
  fallbackMessage: string
): Promise<T> => {
  const text = await res.text();
  const trimmed = text.trim();

  let data: T | null = null;

  if (trimmed) {
    try {
      data = JSON.parse(trimmed) as T;
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (data as { message?: string } | null)?.message ||
      (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")
        ? "Backend returned HTML instead of JSON. Make sure the SYNCTEX backend is running on the configured API URL."
        : fallbackMessage);

    throw new Error(message);
  }

  if (trimmed && data === null) {
    throw new Error("Backend returned an unexpected non-JSON response.");
  }

  return data as T;
};
