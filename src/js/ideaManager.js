import { getIdeas, saveIdeas, getSession } from './storage.js';

// Clase para gestionar las ideas
export class IdeaManager {
  constructor() {
    this.ideas = this.loadIdeas();
    this.currentUser = getSession();
    
    if (!this.currentUser) {
      window.location.href = 'login.html';
    }
  }

  // Cargar ideas desde el almacenamiento
  loadIdeas() {
    return getIdeas();
  }

  // Crear una nueva idea
  createIdea(title, category, description) {
    if (!title.trim() || !description.trim()) {
      throw new Error('Title and description are required');
    }

    const newIdea = {
      id: Date.now().toString(),
      title: title.trim(),
      category: category,
      description: description.trim(),
      author: this.currentUser?.username || 'Anonymous',
      authorAvatar: this.getUserAvatar(),
      votes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      status: 'new',
      image: this.getRandomCategoryImage(category)
    };

    this.ideas.unshift(newIdea);
    this.saveIdeas();
    
    return newIdea;
  }

  // Obtener avatar del usuario
  getUserAvatar() {
    if (this.currentUser?.avatar) {
      return this.currentUser.avatar;
    }
    
    // Generar avatar usando el nombre de usuario
    const avatarSeed = this.currentUser?.username || 'anonymous';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarSeed)}&background=1a1a1a&color=a50d0d&size=128`;
  }

  // Obtener imagen aleatoria según la categoría
  getRandomCategoryImage(category) {
    const categoryImages = {
      'Product': 'https://picsum.photos/seed/product/400/300.jpg',
      'Improvement': null, // Algunas tarjetas no tienen imágenes
      'Experiment': 'https://picsum.photos/seed/experiment/400/300.jpg',
      'Other': 'https://picsum.photos/seed/other/400/300.jpg'
    };
    
    return categoryImages[category] || null;
  }

  // Guardar ideas en el almacenamiento
  saveIdeas() {
    saveIdeas(this.ideas);
  }

  // Filtrar ideas por categoría
  getIdeasByCategory(categories = []) {
    if (categories.length === 0) return this.ideas;
    
    return this.ideas.filter(idea => categories.includes(idea.category));
  }

  // Filtrar ideas por estado
  getIdeasByStatus(status) {
    return this.ideas.filter(idea => idea.status === status);
  }

  // Votar por una idea
  voteIdea(ideaId) {
    const idea = this.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.votes++;
      this.saveIdeas();
      return idea.votes;
    }
    return null;
  }

  // Agregar comentario a una idea
  addComment(ideaId) {
    const idea = this.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.comments++;
      this.saveIdeas();
      return idea.comments;
    }
    return null;
  }

  // Eliminar una idea
  deleteIdea(ideaId) {
    const index = this.ideas.findIndex(i => i.id === ideaId);
    if (index !== -1) {
      const deletedIdea = this.ideas.splice(index, 1)[0];
      this.saveIdeas();
      return deletedIdea;
    }
    return null;
  }
}