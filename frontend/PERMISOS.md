# Sistema de Permisos del Frontend

Este documento describe cómo se ha implementado el sistema de permisos en el frontend para ajustarse a los permisos definidos en el backend.

## Resumen de Permisos por Rol

### 👑 ADMIN (Administrador)
- **Usuarios**: Acceso completo (crear, ver, actualizar, eliminar)
- **Aulas**: Acceso completo (crear, ver, actualizar, eliminar)
- **Horarios**: Acceso completo (crear, ver, actualizar, eliminar)
- **Reservas**: Acceso completo (crear, ver, actualizar, eliminar)
- **Dashboard**: Ve todas las estadísticas incluyendo usuarios

### 👨‍🏫 PROFESOR (Profesor)
- **Usuarios**: Sin acceso (pestaña no visible)
- **Aulas**: Solo lectura (ver listado, sin crear/editar/eliminar)
- **Horarios**: Solo lectura (ver listado, sin crear/editar/eliminar)
- **Reservas**: Acceso completo (crear, ver, actualizar, eliminar)
- **Dashboard**: Ve estadísticas de reservas, aulas y horarios (sin usuarios)

## Implementación Técnica

### 1. Hook `usePermissions`
Ubicación: `/frontend/hooks/use-permissions.ts`

Este hook proporciona un objeto `can` con todos los permisos disponibles:

```typescript
const { can, isAdmin, isProfesor } = usePermissions();

// Ejemplos de uso:
can.viewUsuarios    // true solo para ADMIN
can.createAula      // true solo para ADMIN
can.deleteHorario   // true solo para ADMIN
can.createReserva   // true para PROFESOR y ADMIN
```

### 2. Componentes Actualizados

#### DashboardOverview (`components/dashboard/dashboard-overview.tsx`)
- **Carga condicional de datos**: Solo intenta cargar datos de usuarios si el usuario tiene permiso `can.viewUsuarios`
- **Estadísticas filtradas**: La tarjeta de "Usuarios" solo se muestra a los ADMIN
- **Grid adaptativo**: El grid de estadísticas se ajusta automáticamente según las tarjetas visibles (3 o 4)
- **Sin errores de API**: Los PROFESORES no intentan cargar datos de usuarios, evitando errores 403

#### Sidebar (`components/dashboard/sidebar.tsx`)
- Filtra las pestañas de navegación según los permisos del usuario
- Los PROFESORES no ven la pestaña "Usuarios"
- Todos los roles autenticados ven el Panel principal
- **Estadísticas del sidebar**: Solo carga reservas, aulas y horarios (no usuarios)

#### UsuariosTab (`components/dashboard/usuarios-tab.tsx`)
- Botón "Nuevo Usuario": Solo visible para ADMIN
- Botón "Eliminar": Solo visible para ADMIN
- Formulario de creación: Solo visible para ADMIN

#### AulasTab (`components/dashboard/aulas-tab.tsx`)
- Botón "Nueva Aula": Solo visible para ADMIN
- Botón "Eliminar": Solo visible para ADMIN
- Formulario de creación: Solo visible para ADMIN
- PROFESORES pueden ver el listado completo

#### HorariosTab (`components/dashboard/horarios-tab.tsx`)
- Botón "Nuevo Horario": Solo visible para ADMIN
- Botón "Eliminar": Solo visible para ADMIN
- Formulario de creación: Solo visible para ADMIN
- PROFESORES pueden ver el listado completo

#### ReservasTab (`components/dashboard/reservas-tab.tsx`)
- Botón "Nueva Reserva": Visible para PROFESOR y ADMIN
- Botón "Eliminar": Visible para PROFESOR y ADMIN
- Formulario de creación: Visible para PROFESOR y ADMIN

## Sincronización con Backend

Los permisos del frontend están sincronizados con las anotaciones `@PreAuthorize` del backend:

### Endpoints de Backend

| Endpoint | Método | Permiso Requerido | Frontend |
|----------|--------|-------------------|----------|
| `/usuarios/*` | GET, POST, PUT, DELETE | `ADMIN` | Solo ADMIN |
| `/aulas` | GET | `PROFESOR, ADMIN` | PROFESOR y ADMIN (solo lectura para PROFESOR) |
| `/aulas` | POST, PUT, DELETE | `ADMIN` | Solo ADMIN |
| `/horarios` | GET | `PROFESOR, ADMIN` | PROFESOR y ADMIN (solo lectura para PROFESOR) |
| `/horarios` | POST, PUT, DELETE | `ADMIN` | Solo ADMIN |
| `/reservas/*` | GET, POST, PUT, DELETE | `PROFESOR, ADMIN` | PROFESOR y ADMIN |

## Extracción de Roles del Token JWT

El sistema extrae los roles del token JWT automáticamente:

1. El token se almacena en `localStorage` al hacer login
2. El `AuthContext` decodifica el token y extrae los roles del claim `authorities`
3. El hook `usePermissions` usa estos roles para determinar los permisos

## Ejemplo de Uso en Componentes

```typescript
import { usePermissions } from "@/hooks/use-permissions";

export default function MiComponente() {
  const { can } = usePermissions();

  return (
    <div>
      {/* Solo mostrar si tiene permiso */}
      {can.createUsuario && (
        <Button onClick={handleCreate}>Crear Usuario</Button>
      )}
      
      {/* Deshabilitar si no tiene permiso */}
      <Button disabled={!can.deleteAula}>
        Eliminar Aula
      </Button>
    </div>
  );
}
```

## Carga Condicional de Datos

Para evitar errores de API, los componentes solo cargan datos si el usuario tiene los permisos necesarios:

```typescript
// En dashboard-overview.tsx
const promises: Promise<any>[] = [
  getReservas(),
  getAulas(),
  getHorarios(),
]

// Solo cargar usuarios si tiene permiso
if (can.viewUsuarios) {
  promises.push(getUsuarios())
}

const results = await Promise.all(promises)
```

## Seguridad

⚠️ **Importante**: Los permisos del frontend son solo para mejorar la UX. La seguridad real se aplica en el backend con Spring Security y `@PreAuthorize`. Nunca confíes solo en las validaciones del frontend para seguridad.

## Pruebas

Para probar los diferentes niveles de permisos:

### Como PROFESOR:
1. Inicia sesión como usuario con rol `PROFESOR`
2. Verifica que no puedas ver la pestaña "Usuarios"
3. Verifica que puedas ver Aulas y Horarios pero sin botones de crear/editar/eliminar
4. Verifica que puedas crear y eliminar Reservas
5. En el dashboard, verifica que solo veas 3 tarjetas de estadísticas (sin usuarios)

### Como ADMIN:
1. Inicia sesión como usuario con rol `ADMIN`
2. Verifica que tengas acceso completo a todas las pestañas y funciones
3. En el dashboard, verifica que veas las 4 tarjetas de estadísticas (incluyendo usuarios)
4. Verifica que puedas crear, editar y eliminar en todas las secciones
