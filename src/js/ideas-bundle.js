const SESSION_DB = 'app_session';

function getSession() {
  const session = localStorage.getItem(SESSION_DB);
  return session ? JSON.parse(session) : null;
}

function clearSession() {
  localStorage.removeItem(SESSION_DB);
}

const currentSession = getSession();

if (!currentSession) {
    window.location.href = './logu.html';
} else {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPage);
    } else {
        initPage();
    }
}

function initPage() {
    console.log('Initializing page...');
    
    const userInitial = document.getElementById('user-initial');
    if (userInitial && currentSession.name) {
        userInitial.textContent = currentSession.name.charAt(0).toUpperCase();
    }
    
    if (currentSession) {
        const initial = currentSession.name ? currentSession.name.charAt(0).toUpperCase() : 'U';
        
        const modalInitial = document.getElementById('modal-user-initial');
        const modalUsername = document.getElementById('modal-username');
        const modalEmail = document.getElementById('modal-email');
        const modalUserId = document.getElementById('modal-userid');
        
        if (modalInitial) modalInitial.textContent = initial;
        if (modalUsername) modalUsername.textContent = currentSession.name || 'Username';
        if (modalEmail) modalEmail.textContent = currentSession.email || 'email@example.com';
        if (modalUserId) modalUserId.textContent = `#${currentSession.id || '000'}`;
        
        console.log('Modal data filled');
    }
    
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeModal = document.getElementById('close-modal');
    const logoutBtn = document.getElementById('logout-btn');
    
    console.log('Elements found:', {
        profileBtn: !!profileBtn,
        profileModal: !!profileModal,
        closeModal: !!closeModal,
        logoutBtn: !!logoutBtn
    });
    
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Profile button clicked!');
            if (profileModal) {
                profileModal.classList.add('show');
                console.log('Modal opened');
            }
        });
        console.log('Profile button listener attached');
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Close button clicked');
            if (profileModal) {
                profileModal.classList.remove('show');
            }
        });
    }
    
    if (profileModal) {
        profileModal.addEventListener('click', function(e) {
            if (e.target === profileModal) {
                console.log('Clicked outside modal');
                profileModal.classList.remove('show');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Logout clicked');
            clearSession();
            window.location.href = '../ulith-complemento/login.html';
        });
    }
}