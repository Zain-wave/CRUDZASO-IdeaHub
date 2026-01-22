// Claves para localStorage
const USER_DB = 'app_users';
const IDEA_DB = 'app_ideas';
const SESSION_DB = 'app_session';

// Helper para leer datos
function readData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Helper para guardar datos
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Manejo de usuarios
export function getUsers() {
  return readData(USER_DB);
}

export function saveUsers(users) {
  saveData(USER_DB, users);
}

// Manejo de ideas
export function getIdeas() {
  return readData(IDEA_DB);
}

export function saveIdeas(ideas) {
  saveData(IDEA_DB, ideas);
}

// Manejo de sesión
export function getSession() {
  const session = localStorage.getItem(SESSION_DB);
  return session ? JSON.parse(session) : null;
}

export function setSession(user) {
  const sessionData = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  localStorage.setItem(SESSION_DB, JSON.stringify(sessionData));
}

export function clearSession() {
  localStorage.removeItem(SESSION_DB);
}
