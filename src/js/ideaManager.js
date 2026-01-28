import { getIdeas, saveIdeas, getSession } from './storage.js';

export class IdeaManager {
  constructor() {
    this.ideas = this.loadIdeas();
    this.currentUser = getSession();
    
    if (!this.currentUser) {
      window.location.href = 'login.html';
    }
  }

  loadIdeas() {
    return getIdeas();
  }

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

  getUserAvatar() {
    if (this.currentUser?.avatar) {
      return this.currentUser.avatar;
    }
    
    // Generate avatar using username
    const avatarSeed = this.currentUser?.username || 'anonymous';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarSeed)}&background=1a1a1a&color=a50d0d&size=128`;
  }

  getRandomCategoryImage(category) {
    const categoryImages = {
      'Product': 'https://picsum.photos/seed/product/400/300.jpg',
      'Improvement': null, // Some cards don't have images
      'Experiment': 'https://picsum.photos/seed/experiment/400/300.jpg',
      'Other': 'https://picsum.photos/seed/other/400/300.jpg'
    };
    
    return categoryImages[category] || null;
  }

  saveIdeas() {
    saveIdeas(this.ideas);
  }

  getIdeasByCategory(categories = []) {
    if (categories.length === 0) return this.ideas;
    
    return this.ideas.filter(idea => categories.includes(idea.category));
  }

  getIdeasByStatus(status) {
    return this.ideas.filter(idea => idea.status === status);
  }

  voteIdea(ideaId) {
    const idea = this.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.votes++;
      this.saveIdeas();
      return idea.votes;
    }
    return null;
  }

  addComment(ideaId) {
    const idea = this.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.comments++;
      this.saveIdeas();
      return idea.comments;
    }
    return null;
  }

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