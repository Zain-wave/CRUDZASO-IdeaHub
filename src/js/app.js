import { IdeaManager } from './ideaManager.js';
import { CardRenderer } from './cardRenderer.js';

export class App {
  constructor() {
    this.ideaManager = new IdeaManager();
    this.cardRenderer = new CardRenderer(this.ideaManager);
    this.modal = null;
    this.form = null;
    
    this.init();
  }

  init() {
    this.setupModal();
    this.setupEventListeners();
    this.loadExistingIdeas();
  }

  setupModal() {
    this.modal = document.getElementById('ideaModal');
    this.form = this.modal.querySelector('form');
    
    // Get all buttons with "New Idea" text
    const newIdeaBtns = Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.textContent.includes('New Idea')
    );

    // Add click event to all "New Idea" buttons
    newIdeaBtns.forEach(btn => {
      btn.addEventListener('click', () => this.openModal());
    });
  }

  setupEventListeners() {
    // Close modal events
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    
    closeModalBtn.addEventListener('click', () => this.closeModal());
    cancelBtn.addEventListener('click', () => this.closeModal());
    
    // Close modal on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
    
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
    
    // Submit button click handler
    const submitBtn = this.form.querySelector('button[type="button"]:last-child');
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  openModal() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.form.reset();
  }

  handleFormSubmit() {
    try {
      const title = this.form.querySelector('#idea-title').value;
      const category = this.form.querySelector('#category').value;
      const description = this.form.querySelector('#description').value;
      
      const newIdea = this.ideaManager.createIdea(title, category, description);
      
      // Render the new card
      this.cardRenderer.renderCard(newIdea, 'prepend');
      
      // Show success message
      this.showSuccessMessage('Idea created successfully!');
      
      // Close modal
      this.closeModal();
      
    } catch (error) {
      this.showErrorMessage(error.message);
    }
  }

  loadExistingIdeas() {
    const ideas = this.ideaManager.loadIdeas();
    if (ideas.length > 0) {
      this.cardRenderer.renderAllCards(ideas);
    }
  }

  showSuccessMessage(message) {
    this.showToast(message, 'success');
  }

  showErrorMessage(message) {
    this.showToast(message, 'error');
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[200] px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set colors based on type
    if (type === 'success') {
      toast.className += ' bg-green-600 text-white';
    } else if (type === 'error') {
      toast.className += ' bg-red-600 text-white';
    } else {
      toast.className += ' bg-primary text-white';
    }
    
    toast.textContent = message;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});