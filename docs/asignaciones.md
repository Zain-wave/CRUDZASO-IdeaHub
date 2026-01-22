# Asignación de Tareas

## Equipo 👋

Organización del trabajo y responsabilidades para evitar choques de código.

---

## 📌 Reglas generales

- Trabajamos en un solo repositorio
- Usamos Git Flow:
  - `main`: versión final
  - `develop`: integración
  - `feature/*`: trabajo individual
- Nadie hace commits directos a `main`
- Cada uno trabaja solo en su rama
- Commits con Conventional Commits (`feat:`, `fix:`, etc.)
- Prohibido usar localStorage directamente, solo mediante `storage.js`

---

## 👤 Sebastian (Líder)

**Rama:** `feature/ideas-crud`
**Rol:** Arquitectura + CRUD de Ideas

**Responsabilidades:**

- Definir la estructura de datos
- Crear `storage.js` (manejo central de localStorage)
- Implementar `ideas.js` con toda la lógica:
  - Crear, editar y eliminar ideas
  - Validar que solo el autor pueda modificar
  - Reglas de negocio (IDs, fechas, permisos)

_Este es el núcleo del sistema, de aquí dependen los demás archivos._

---

## 👩‍💻 Ulith

**Rama:** `feature/auth`
**Rol:** Registro y Login

**Responsabilidades:**

- `auth.js`
- **Registro de usuarios:**
  - Validaciones
  - Email único
  - Guardar usuarios
- **Login:**
  - Validar credenciales
  - Crear sesión
  - Manejar errores
  - Redirecciones (login → ideas)

---

## 👩‍🎨 Andreina

**Rama:** `feature/ui-filters`
**Rol:** UI, render del feed y filtros

**Responsabilidades:**

- `ui.js`
- Renderizar ideas en pantalla con `innerHTML`
- Mostrar tarjetas con:
  - Título, descripción, categoría y autor
  - Botones Edit/Delete solo si es el autor
- **Filtros por:**
  - Categoría
  - Autor

---

## 👨‍💻 Juan José

**Rama:** `feature/profile-session`
**Rol:** Perfil y manejo de sesión

**Responsabilidades:**

- `profile.js`
- Mostrar perfil del usuario:
  - Nombre
  - Email
  - Total de ideas
  - Lista de sus ideas
- **Proteger páginas:**
  - Si no hay sesión → volver al login
- **Logout:**
  - Cerrar sesión y redirigir

---

## 🧩 Flujo de trabajo

1. Sebastián sube la base del proyecto y `storage.js`
2. Cada uno trabaja solo en su rama
3. Hacen PR contra `develop`
4. Sebastián revisa y hace los merges
5. Al final se hace `develop` → `main` y deploy

---

**Importante:** La idea es trabajar como en un proyecto real, con orden y sin conflictos. Cualquier duda, pregunten antes de tocar algo que no les corresponda
