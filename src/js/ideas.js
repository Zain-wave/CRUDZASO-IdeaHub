import { getIdeas, saveIdeas, getSession } from './storage.js';

// Generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getCurrentDate() {
  return new Date().toISOString();
}

// Crear nueva idea
export function createIdea(title, description, category) {
  const session = getSession();
  if (!session) {
    throw new Error('Usuario no autenticado');
  }

  if (!title || !description || !category) {
    throw new Error('Todos los campos son obligatorios');
  }

  const ideas = getIdeas();
  const newIdea = {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    category,
    authorId: session.id,
    createdAt: getCurrentDate()
  };

  ideas.push(newIdea);
  saveIdeas(ideas);
  return newIdea;
}

// Obtener todas las ideas
export function getAllIdeas() {
  return getIdeas();
}

// Obtener idea por ID
export function getIdeaById(id) {
  const ideas = getIdeas();
  return ideas.find(idea => idea.id === id) || null;
}

// Verificar si el usuario actual es autor de la idea
export function isIdeaAuthor(ideaId) {
  const session = getSession();
  if (!session) return false;

  const idea = getIdeaById(ideaId);
  return idea && idea.authorId === session.id;
}

// Editar idea existente
export function updateIdea(id, title, description, category) {
  const session = getSession();
  if (!session) {
    throw new Error('Usuario no autenticado');
  }

  const ideas = getIdeas();
  const ideaIndex = ideas.findIndex(idea => idea.id === id);

  if (ideaIndex === -1) {
    throw new Error('Idea no encontrada');
  }

  const idea = ideas[ideaIndex];
  if (idea.authorId !== session.id) {
    throw new Error('No tienes permiso para editar esta idea');
  }

  if (!title || !description || !category) {
    throw new Error('Todos los campos son obligatorios');
  }

  ideas[ideaIndex] = {
    ...idea,
    title: title.trim(),
    description: description.trim(),
    category
  };

  saveIdeas(ideas);
  return ideas[ideaIndex];
}

// Eliminar idea
export function deleteIdea(id) {
  const session = getSession();
  if (!session) {
    throw new Error('Usuario no autenticado');
  }

  const ideas = getIdeas();
  const ideaIndex = ideas.findIndex(idea => idea.id === id);

  if (ideaIndex === -1) {
    throw new Error('Idea no encontrada');
  }

  const idea = ideas[ideaIndex];
  if (idea.authorId !== session.id) {
    throw new Error('No tienes permiso para eliminar esta idea');
  }

  ideas.splice(ideaIndex, 1);
  saveIdeas(ideas);
  return true;
}

// Obtener ideas del usuario actual
export function getCurrentUserIdeas() {
  const session = getSession();
  if (!session) return [];

  const ideas = getIdeas();
  return ideas.filter(idea => idea.authorId === session.id);
}

// Obtener ideas por autor
export function getIdeasByAuthor(authorId) {
  const ideas = getIdeas();
  return ideas.filter(idea => idea.authorId === authorId);
}

// Obtener ideas por categoría
export function getIdeasByCategory(category) {
  const ideas = getIdeas();
  return ideas.filter(idea => idea.category === category);
}

// Filtrar ideas (combinado por categoría y autor)
export function filterIdeas(category = null, authorId = null) {
  let ideas = getIdeas();

  if (category) {
    ideas = ideas.filter(idea => idea.category === category);
  }

  if (authorId) {
    ideas = ideas.filter(idea => idea.authorId === authorId);
  }

  return ideas;
}

// Obtener categorías disponibles
export function getCategories() {
  return ['product', 'improvement', 'experiment', 'other'];
}

// Validar categoría
export function isValidCategory(category) {
  const categories = getCategories();
  return categories.includes(category);
}