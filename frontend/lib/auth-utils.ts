export interface DecodedToken {
  sub: string
  userId?: number
  id?: number
  authorities?: any[]
  roles?: string[]
  exp?: number
  iat?: number
}

export function decodeJWT(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1]
    const decoded = JSON.parse(atob(payload))
    console.log("Token JWT decodificado:", decoded)
    return decoded
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return null
  }
}

export function extractRoles(authorities: any[]): string[] {
  try {
    if (!Array.isArray(authorities)) return []
    return authorities.map((auth) => {
      if (typeof auth === "string") return auth
      if (auth.authority) return auth.authority
      return String(auth)
    })
  } catch {
    return []
  }
}

export function getUserIdFromToken(token: string): number | null {
  const decoded = decodeJWT(token)
  if (!decoded) return null
  // El backend puede enviar el ID como 'userId', 'id', o en otra propiedad
  return decoded.userId || decoded.id || null
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return true
  // exp está en segundos, Date.now() está en milisegundos
  return decoded.exp * 1000 < Date.now()
}

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateString
  }
}

export const convertToApiDate = (dateString: string): string => {
  try {
    const [day, month, year] = dateString.split("/")
    return `${year}-${month}-${day}`
  } catch {
    return dateString
  }
}
