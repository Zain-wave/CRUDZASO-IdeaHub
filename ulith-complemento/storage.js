const USER_DB = 'app_users';
const IDEA_DB = 'app_ideas';
const SESSION_DB = 'app_session';

function readData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getUsers() {
  return readData(USER_DB);
}

export function saveUsers(users) {
  saveData(USER_DB, users);
}

export function getIdeas() {
  return readData(IDEA_DB);
}

export function saveIdeas(ideas) {
  saveData(IDEA_DB, ideas);
}

export function getSession() {
  const session = localStorage.getItem(SESSION_DB);
  return session ? JSON.parse(session) : null;
}

export function setSession(user) {
  const sessionData = {
    id: user.id,
    name: user.username || user.name, // Corregido:acepta username o name
    email: user.email
  };
  localStorage.setItem(SESSION_DB, JSON.stringify(sessionData));
}

export function clearSession() {
  localStorage.removeItem(SESSION_DB);
}

export function generateId() {
  let lastId = localStorage.getItem("lastUserId");
  if (!lastId) {
    lastId = 0;
  }
  const newId = Number(lastId) + 1;
  localStorage.setItem("lastUserId", newId);
  return newId;
}