// const apiUrl = process.env.API_URL;

let csrfToken = null;

export async function fetchCsrfToken() {
  try {
    const response = await fetch("http://localhost:4444/csrf-token", {
      credentials: "include",
    });
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers.get("content-type"));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.headers.get("content-type").includes("application/json")) {
      throw new Error("Expected JSON response");
    }

    const data = await response.json();
    console.log("CSRF token received:", data.csrfToken);
    csrfToken = data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
}

export function getCsrfToken() {
  return csrfToken;
}
