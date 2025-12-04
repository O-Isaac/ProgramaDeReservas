import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8080";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message;
    if (message) {
      toast.error(message);
    } else if (error.response) {
      toast.error(`Error ${error.response.status}: ${error.response.statusText}`);
    } else {
      toast.error("Error de conexión");
    }
    return Promise.reject(error);
  }
);

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

// Auth endpoints - NO JWT required (usando axios sin interceptor)
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add error handling to auth client too
authClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message;
    if (message) {
      toast.error(message);
    } else if (error.response) {
      toast.error(`Error ${error.response.status}: ${error.response.statusText}`);
    } else {
      toast.error("Error de conexión");
    }
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string): Promise<string> {
  const { data } = await authClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  console.log("[v0] Login response:", data);
  return data.token;
}

export async function register(
  nombre: string,
  email: string,
  password: string
): Promise<any> {
  const { data } = await authClient.post("/auth/register", {
    nombre,
    email,
    password,
  });
  return data;
}

// Auth endpoints - JWT required
export async function getPerfil(): Promise<any> {
  const { data } = await apiClient.get("/auth/perfil");
  return data;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<any> {
  const { data } = await apiClient.patch("/auth/cambiar-pass", {
    oldPassword,
    newPassword,
  });
  return data;
}

// Usuarios endpoints
export async function getUsuarios(): Promise<any[]> {
  const { data } = await apiClient.get("/usuarios");
  return data;
}

export async function getUsuario(id: number): Promise<any> {
  const { data } = await apiClient.get(`/usuarios/${id}`);
  return data;
}

export async function createUsuario(
  nombre: string,
  email: string,
  password: string
): Promise<any> {
  const { data } = await apiClient.post("/usuarios", {
    nombre,
    email,
    password,
  });
  return data;
}

export async function updateUsuario(id: number, userData: any): Promise<any> {
  const { data } = await apiClient.put(`/usuarios/${id}`, userData);
  return data;
}

export async function deleteUsuario(id: number): Promise<void> {
  await apiClient.delete(`/usuarios/${id}`);
}

// Aulas endpoints
export async function getAulas(): Promise<any[]> {
  const { data } = await apiClient.get("/aulas");
  return data;
}

export async function getAula(id: number): Promise<any> {
  const { data } = await apiClient.get(`/aulas/${id}`);
  return data;
}

export async function createAula(
  nombre: string,
  capacidad: number,
  ordenadores: boolean
): Promise<any> {
  const { data } = await apiClient.post("/aulas", {
    nombre,
    capacidad,
    ordenadores,
  });
  return data;
}

export async function updateAula(id: number, aulaData: any): Promise<any> {
  const { data } = await apiClient.put(`/aulas/${id}`, aulaData);
  return data;
}

export async function deleteAula(id: number): Promise<void> {
  await apiClient.delete(`/aulas/${id}`);
}

// Horarios endpoints
export async function getHorarios(): Promise<any[]> {
  const { data } = await apiClient.get("/horarios");
  return data;
}

export async function getHorario(id: number): Promise<any> {
  const { data } = await apiClient.get(`/horarios/${id}`);
  return data;
}

export async function createHorario(horarioData: any): Promise<any> {
  const { data } = await apiClient.post("/horarios", horarioData);
  return data;
}

export async function updateHorario(id: number, horarioData: any): Promise<any> {
  const { data } = await apiClient.put(`/horarios/${id}`, horarioData);
  return data;
}

export async function deleteHorario(id: number): Promise<void> {
  await apiClient.delete(`/horarios/${id}`);
}

// Reservas endpoints
export async function getReservas(): Promise<any[]> {
  const { data } = await apiClient.get("/reservas");
  return data;
}

export async function getReserva(id: number): Promise<any> {
  const { data } = await apiClient.get(`/reservas/${id}`);
  return data;
}

export async function createReserva(reservaData: any): Promise<any> {
  const { data } = await apiClient.post("/reservas", reservaData);
  return data;
}

export async function updateReserva(id: number, reservaData: any): Promise<any> {
  const { data } = await apiClient.put(`/reservas/${id}`, reservaData);
  return data;
}

export async function deleteReserva(id: number): Promise<void> {
  await apiClient.delete(`/reservas/${id}`);
}