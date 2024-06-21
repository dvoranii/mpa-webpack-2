let csrfToken = null;

const backendURL = process.env.BACKEND_URL;

export async function fetchCsrfToken() {
  try {
    const response = await fetch(`${backendURL}/csrf-token`, {
      credentials: "include",
    });
    checkValidResponse(response);
    const data = await response.json();
    csrfToken = data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
}

function checkValidResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.headers.get("content-type").includes("application/json")) {
    throw new Error("Expected JSON response");
  }
}

export function getCsrfToken() {
  return csrfToken;
}

export function appendCsrfToken(form, csrfToken) {
  const csrfTokenField = document.createElement("input");
  csrfTokenField.type = "hidden";
  csrfTokenField.name = "_csrf";
  csrfTokenField.value = csrfToken;
  form.appendChild(csrfTokenField);
}
