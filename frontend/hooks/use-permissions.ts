import { useAuth } from "@/context/auth-context"

export function usePermissions() {
  const { userRoles } = useAuth()

  console.log("Roles del usuario en usePermissions:", userRoles)

  const hasRole = (role: string): boolean => {
    // Buscar tanto el rol con prefijo como sin prefijo
    return userRoles.some((r) => {
      if (!r || typeof r !== 'string') return false
      const normalizedRole = r.toUpperCase()
      const searchRole = role.toUpperCase()
      return normalizedRole === searchRole || 
             normalizedRole === `ROLE_${searchRole}` ||
             normalizedRole.replace("ROLE_", "") === searchRole
    })
  }

  const hasAnyRole = (...roles: string[]): boolean => {
    return roles.some((role) => hasRole(role))
  }

  const isAdmin = hasRole("ADMIN")
  const isProfesor = hasRole("PROFESOR")

  console.log("Permisos calculados:", { isAdmin, isProfesor, userRoles })

  // Permisos específicos basados en los endpoints del backend
  const can = {
    // Usuarios - solo ADMIN
    viewUsuarios: isAdmin,
    createUsuario: isAdmin,
    updateUsuario: isAdmin,
    deleteUsuario: isAdmin,

    // Aulas - ADMIN para modificar, PROFESOR y ADMIN para ver
    viewAulas: hasAnyRole("PROFESOR", "ADMIN"),
    createAula: isAdmin,
    updateAula: isAdmin,
    deleteAula: isAdmin,

    // Horarios - ADMIN para modificar, PROFESOR y ADMIN para ver
    viewHorarios: hasAnyRole("PROFESOR", "ADMIN"),
    createHorario: isAdmin,
    updateHorario: isAdmin,
    deleteHorario: isAdmin,

    // Reservas - PROFESOR y ADMIN para todo
    viewReservas: hasAnyRole("PROFESOR", "ADMIN"),
    createReserva: hasAnyRole("PROFESOR", "ADMIN"),
    updateReserva: hasAnyRole("PROFESOR", "ADMIN"),
    deleteReserva: hasAnyRole("PROFESOR", "ADMIN"),
  }

  return { can, isAdmin, isProfesor, hasRole, hasAnyRole }
}
