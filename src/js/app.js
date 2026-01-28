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

  // Método de inicialización de la aplicación
  init() {
    this.currentUser = getSession();
    this.setupModal();
    this.setupEventListeners();
    this.setupUserProfile();
    this.loadExistingIdeas();
  }

  // Configuración del modal para crear nuevas ideas
  setupModal() {
    this.modal = document.getElementById('ideaModal');
    this.form = this.modal.querySelector('form');
    
    // Obtener todos los botones con el texto "New Idea"
    const newIdeaBtns = Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.textContent.includes('New Idea')
    );

    // Agregar evento click a todos los botones "New Idea"
    newIdeaBtns.forEach(btn => {
      btn.addEventListener('click', () => this.openModal());
    });
  }

  setupEventListeners() {
    // Eventos para cerrar el modal
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    
    closeModalBtn.addEventListener('click', () => this.closeModal());
    cancelBtn.addEventListener('click', () => this.closeModal());
    
    // Cerrar modal al hacer clic en el overlay
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
    
    // Envío del formulario
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
    
    // Manejador del botón de envío
    const submitBtn = this.form.querySelector('button[type="button"]:last-child');
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  // Abrir el modal
  openModal() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Cerrar el modal
  closeModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.form.reset();
  }

  // Manejar el envío del formulario
  handleFormSubmit() {
    try {
      const title = this.form.querySelector('#idea-title').value;
      const category = this.form.querySelector('#category').value;
      const description = this.form.querySelector('#description').value;
      const imageUrl = this.form.querySelector('#image').value;
      
      const newIdea = this.ideaManager.createIdea(title, category, description, imageUrl);
      
      // Renderizar la nueva tarjeta
      this.cardRenderer.renderCard(newIdea, 'prepend');
      
      // Mostrar mensaje de éxito
      this.showSuccessMessage('Idea created successfully!');
      
      // Cerrar modal
      this.closeModal();
      
    } catch (error) {
      this.showErrorMessage(error.message);
    }
  }

  // Configuración del perfil de usuario
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

    // Configurar avatar e información del perfil
    const avatarUrl = this.getUserAvatar();
    userAvatar.style.backgroundImage = `url('${avatarUrl}')`;
    
    if (profileUsername) profileUsername.textContent = this.currentUser.username;
    if (profileEmail) profileEmail.textContent = this.currentUser.email;

    // Alternar dropdown al hacer clic en el avatar
    userAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== userAvatar) {
        profileDropdown.classList.add('hidden');
      }
    });

    // Botón de perfil
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        profileDropdown.classList.add('hidden');
        this.showToast('Profile feature coming soon!', 'info');
      });
    }

    // Funcionalidad de logout
    logoutBtn.addEventListener('click', () => {
      profileDropdown.classList.add('hidden');
      this.handleLogout();
    });
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

  // Manejar el cierre de sesión
  handleLogout() {
    clearSession();
    this.showToast('Logging out...', 'info');
    
    // Redirigir al login después de un corto retraso
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }

  // Cargar ideas existentes
  loadExistingIdeas() {
    const ideas = this.ideaManager.loadIdeas();
    if (ideas.length > 0) {
      this.cardRenderer.renderAllCards(ideas);
    }
  }

  // Mostrar mensaje de éxito
  showSuccessMessage(message) {
    this.showToast(message, 'success');
  }

  // Mostrar mensaje de error
  showErrorMessage(message) {
    this.showToast(message, 'error');
  }

  // Mostrar notificación toast
  showToast(message, type = 'info') {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[200] px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Configurar colores según el tipo
    if (type === 'success') {
      toast.className += ' bg-green-600 text-white';
    } else if (type === 'error') {
      toast.className += ' bg-red-600 text-white';
    } else {
      toast.className += ' bg-primary text-white';
    }
    
    toast.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(toast);
    
    // Animación de entrada
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full');
    });
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});