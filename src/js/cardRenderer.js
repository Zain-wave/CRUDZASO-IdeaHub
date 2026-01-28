import { IdeaManager } from './ideaManager.js';

export class CardRenderer {
  constructor(ideaManager) {
    this.ideaManager = ideaManager;
    this.gridContainer = document.querySelector('.grid');
  }

  getCategoryColor(category) {
    const colors = {
      'Product': 'bg-primary/90 text-white shadow-sm backdrop-blur-sm',
      'Improvement': 'bg-blue-900/40 text-blue-200 border border-blue-800/50',
      'Experiment': 'bg-purple-900/40 text-purple-200 border border-purple-800/50',
      'Other': 'bg-yellow-900/40 text-yellow-200 border border-yellow-800/50 backdrop-blur-sm'
    };
    return colors[category] || colors['Other'];
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  createCardHTML(idea) {
    const hasImage = idea.image;
    const categoryColor = this.getCategoryColor(idea.category);
    const timeAgo = this.formatDate(idea.createdAt);

    return `
      <div class="group flex flex-col bg-surface-dark rounded-xl border border-[#392828] hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] relative" data-idea-id="${idea.id}">
        ${hasImage ? `
          <div class="h-48 w-full bg-cover bg-center relative" data-alt="${idea.title}" style="background-image: url('${idea.image}');">
            <div class="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent"></div>
            <div class="absolute top-4 left-4">
              <span class="inline-flex items-center rounded-full ${categoryColor} px-2.5 py-0.5 text-xs font-semibold">
                ${idea.category}
              </span>
            </div>
          </div>
        ` : ''}
        <div class="${hasImage ? 'p-5 flex flex-col flex-1 relative -mt-12' : 'p-6 flex flex-col flex-1 h-full'}">
          ${!hasImage ? `
            <div class="flex justify-between items-start mb-4">
              <span class="inline-flex items-center rounded-full ${categoryColor} px-2.5 py-0.5 text-xs font-semibold">
                ${idea.category}
              </span>
              <span class="text-xs text-gray-500">${timeAgo}</span>
            </div>
          ` : ''}
          <h3 class="text-white text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
            ${idea.title}
          </h3>
          <p class="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
            ${idea.description}
          </p>
          <div class="mt-auto pt-4 border-t border-[#333] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="size-6 rounded-full bg-cover bg-center" data-alt="Portrait of ${idea.author}" style="background-image: url('${idea.authorAvatar}');"></div>
              <span class="text-xs text-gray-300 font-medium">${idea.author}</span>
            </div>
            <div class="flex items-center gap-4 text-gray-400">
              <div class="flex items-center gap-1 group/vote hover:text-primary cursor-pointer transition-colors" data-action="vote">
                <span class="material-symbols-outlined text-[18px]">thumb_up</span>
                <span class="text-xs font-bold">${idea.votes}</span>
              </div>
              <div class="flex items-center gap-1 hover:text-white transition-colors" data-action="comment">
                <span class="material-symbols-outlined text-[18px]">chat_bubble</span>
                <span class="text-xs font-bold">${idea.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCard(idea, position = 'prepend') {
    const cardHTML = this.createCardHTML(idea);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML.trim();
    const card = tempDiv.firstElementChild;

    // Add event listeners
    this.addCardEventListeners(card, idea);

    if (position === 'prepend') {
      this.gridContainer.prepend(card);
    } else {
      this.gridContainer.appendChild(card);
    }

    // Add animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  renderAllCards(ideas) {
    this.gridContainer.innerHTML = '';
    ideas.forEach(idea => {
      this.renderCard(idea, 'append');
    });
  }

  addCardEventListeners(card, idea) {
    // Vote button
    const voteBtn = card.querySelector('[data-action="vote"]');
    if (voteBtn) {
      voteBtn.addEventListener('click', () => {
        const newVotes = this.ideaManager.voteIdea(idea.id);
        if (newVotes !== null) {
          const voteCount = voteBtn.querySelector('.text-xs.font-bold');
          voteCount.textContent = newVotes;
          
          // Add animation
          voteBtn.classList.add('text-primary', 'scale-110');
          setTimeout(() => {
            voteBtn.classList.remove('scale-110');
          }, 200);
        }
      });
    }

    // Comment button
    const commentBtn = card.querySelector('[data-action="comment"]');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        const newComments = this.ideaManager.addComment(idea.id);
        if (newComments !== null) {
          const commentCount = commentBtn.querySelector('.text-xs.font-bold');
          commentCount.textContent = newComments;
        }
      });
    }
  }

  updateCardCounts(ideaId, votes, comments) {
    const card = document.querySelector(`[data-idea-id="${ideaId}"]`);
    if (!card) return;

    const voteCount = card.querySelector('[data-action="vote"] .text-xs.font-bold');
    const commentCount = card.querySelector('[data-action="comment"] .text-xs.font-bold');

    if (voteCount) voteCount.textContent = votes;
    if (commentCount) commentCount.textContent = comments;
  }
}