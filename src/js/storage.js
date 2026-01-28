const USER_DB = 'app_users';
const IDEA_DB = 'app_ideas';
const SESSION_DB = 'app_session';

// Generador de IDs únicos
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función auxiliar para leer datos
function readData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Función auxiliar para guardar datos
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Funciones para manejo de usuarios
export function getUsers() {
  return readData(USER_DB);
}

export function saveUsers(users) {
  saveData(USER_DB, users);
}

// Funciones para manejo de ideas
export function getIdeas() {
  return readData(IDEA_DB);
}

export function saveIdeas(ideas) {
  saveData(IDEA_DB, ideas);
}

export function addIdea(idea) {
  const ideas = getIdeas();
  ideas.unshift(idea);
  saveData(IDEA_DB, ideas);
  return idea;
}

export function updateIdea(ideaId, updates) {
  const ideas = getIdeas();
  const index = ideas.findIndex(idea => idea.id === ideaId);
  
  if (index !== -1) {
    ideas[index] = { ...ideas[index], ...updates };
    saveData(IDEA_DB, ideas);
    return ideas[index];
  }
  return null;
}

export function deleteIdeaById(ideaId) {
  const ideas = getIdeas();
  const index = ideas.findIndex(idea => idea.id === ideaId);
  
  if (index !== -1) {
    const deletedIdea = ideas.splice(index, 1)[0];
    saveData(IDEA_DB, ideas);
    return deletedIdea;
  }
  return null;
}

// Funciones para manejo de sesión
export function getSession() {
  const session = localStorage.getItem(SESSION_DB);
  return session ? JSON.parse(session) : null;
}

export function setSession(user) {
  const sessionData = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  localStorage.setItem(SESSION_DB, JSON.stringify(sessionData));
}

export function clearSession() {
  localStorage.removeItem(SESSION_DB);
}
