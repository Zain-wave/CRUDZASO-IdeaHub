import { IdeaManager } from './ideaManager.js';
import { CardRenderer } from './cardRenderer.js';
import { getSession, clearSession } from './storage.js';

export class App {
  constructor() {
    this.ideaManager = new IdeaManager();
    this.cardRenderer = new CardRenderer(this.ideaManager);
    this.modal = null;
    this.form = null;
    
    this.init();
  }

  init() {
    this.currentUser = getSession();
    this.setupModal();
    this.setupEventListeners();
    this.setupUserProfile();
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

  setupUserProfile() {
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileBtn = document.getElementById('profileBtn');
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');

    if (!this.currentUser) {
      window.location.href = 'login.html';
      return;
    }

    // Set user avatar and profile info
    const avatarUrl = this.getUserAvatar();
    userAvatar.style.backgroundImage = `url('${avatarUrl}')`;
    
    if (profileUsername) profileUsername.textContent = this.currentUser.username;
    if (profileEmail) profileEmail.textContent = this.currentUser.email;

    // Toggle dropdown on avatar click
    userAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== userAvatar) {
        profileDropdown.classList.add('hidden');
      }
    });

    // Profile button
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        profileDropdown.classList.add('hidden');
        this.showToast('Profile feature coming soon!', 'info');
      });
    }

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
      profileDropdown.classList.add('hidden');
      this.handleLogout();
    });
  }

  getUserAvatar() {
    if (this.currentUser?.avatar) {
      return this.currentUser.avatar;
    }
    
    // Generate avatar using username
    const avatarSeed = this.currentUser?.username || 'anonymous';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarSeed)}&background=1a1a1a&color=a50d0d&size=128`;
  }

  handleLogout() {
    clearSession();
    this.showToast('Logging out...', 'info');
    
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
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