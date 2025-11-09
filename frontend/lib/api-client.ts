import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8080";

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
}

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt_token");
};

// Store token in localStorage
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("jwt_token", token);
};

// Remove token
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("jwt_token");
};

// API call helper with JWT
async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<any> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const { message } = await response.json();
    if (message) {
      return toast.error(`${message}`);
    } else {
      return toast.error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

// Auth endpoints - NO JWT required
export async function login(email: string, password: string): Promise<string> {
  const response = await apiCall(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false
  );
  console.log("[v0] Login response:", response);
  return response.token;
}

export async function register(
  nombre: string,
  email: string,
  password: string
): Promise<any> {
  return apiCall(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ nombre, email, password }),
    },
    false
  );
}

// Auth endpoints - JWT required
export async function getPerfil(): Promise<any> {
  return apiCall("/auth/perfil", { method: "GET" });
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<any> {
  return apiCall("/auth/cambiar-pass", {
    method: "PATCH",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

// Usuarios endpoints - All endpoints now require JWT token (removed requiresAuth = false)
export async function getUsuarios(): Promise<any[]> {
  return apiCall("/usuarios", { method: "GET" });
}

export async function getUsuario(id: number): Promise<any> {
  return apiCall(`/usuarios/${id}`, { method: "GET" });
}

export async function createUsuario(
  nombre: string,
  email: string,
  password: string
): Promise<any> {
  return apiCall("/usuarios", {
    method: "POST",
    body: JSON.stringify({ nombre, email, password }),
  });
}

export async function updateUsuario(id: number, data: any): Promise<any> {
  return apiCall(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUsuario(id: number): Promise<void> {
  return apiCall(`/usuarios/${id}`, { method: "DELETE" });
}

// Aulas endpoints - All endpoints now require JWT token
export async function getAulas(): Promise<any[]> {
  return apiCall("/aulas", { method: "GET" });
}

export async function getAula(id: number): Promise<any> {
  return apiCall(`/aulas/${id}`, { method: "GET" });
}

export async function createAula(
  nombre: string,
  capacidad: number,
  ordenadores: boolean
): Promise<any> {
  return apiCall("/aulas", {
    method: "POST",
    body: JSON.stringify({ nombre, capacidad, ordenadores }),
  });
}

export async function updateAula(id: number, data: any): Promise<any> {
  return apiCall(`/aulas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAula(id: number): Promise<void> {
  return apiCall(`/aulas/${id}`, { method: "DELETE" });
}

// Horarios endpoints - All endpoints now require JWT token
export async function getHorarios(): Promise<any[]> {
  return apiCall("/horarios", { method: "GET" });
}

export async function getHorario(id: number): Promise<any> {
  return apiCall(`/horarios/${id}`, { method: "GET" });
}

export async function createHorario(data: any): Promise<any> {
  return apiCall("/horarios", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateHorario(id: number, data: any): Promise<any> {
  return apiCall(`/horarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteHorario(id: number): Promise<void> {
  return apiCall(`/horarios/${id}`, { method: "DELETE" });
}

// Reservas endpoints - All endpoints now require JWT token
export async function getReservas(): Promise<any[]> {
  return apiCall("/reservas", { method: "GET" });
}

export async function getReserva(id: number): Promise<any> {
  return apiCall(`/reservas/${id}`, { method: "GET" });
}

export async function createReserva(data: any): Promise<any> {
  return apiCall("/reservas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReserva(id: number, data: any): Promise<any> {
  return apiCall(`/reservas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteReserva(id: number): Promise<void> {
  return apiCall(`/reservas/${id}`, { method: "DELETE" });
}
