import { useAuth } from "@/context/auth-context"

export function usePermissions() {
  const { userRoles } = useAuth()

  console.log(userRoles)

  const hasRole = (role: string): boolean => {
    return userRoles.some((r) => r === role || r === `ROLE_${role}`)
  }

  const hasAnyRole = (...roles: string[]): boolean => {
    return roles.some((role) => hasRole(role))
  }

  const isAdmin = hasRole("ADMIN")
  const isProfesor = hasRole("PROFESOR")

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

