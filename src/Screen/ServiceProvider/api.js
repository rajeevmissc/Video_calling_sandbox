const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";

export const getAuthToken = () => localStorage.getItem("token");

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
    throw new Error("Session expired");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const API_ENDPOINTS = {
  transactions: {
    list: `${API_BASE_URL}/transactions/get-provider-transactions`,
  },
};
