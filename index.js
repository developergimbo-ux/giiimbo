const RENDER_URL = 'https://node-gimbo-2.onrender.com';

// Wake up Render
fetch(`${RENDER_URL}/ping`, { method: 'GET', cache: 'no-store' }).catch(() => {});

document.addEventListener('DOMContentLoaded', () => {

  let selectedRole = null;

  const selectionScreen = document.getElementById('selectionScreen');
  const loginScreen     = document.getElementById('loginScreen');
  const backBtn         = document.getElementById('backBtn');
  const loginTypeBadge  = document.getElementById('loginTypeBadge');
  const errorDiv        = document.getElementById('errorMessage');
  const loginBtn        = document.getElementById('loginBtn');

  // ── Show/hide screens ──────────────────────────────────────────
  function showScreen(name) {
    selectionScreen.classList.remove('active');
    loginScreen.classList.remove('active');
    if (name === 'selection') selectionScreen.classList.add('active');
    if (name === 'login')     loginScreen.classList.add('active');
  }

  // ── Role card click ────────────────────────────────────────────
  document.querySelectorAll('.selection-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedRole = card.dataset.role;

      // Update badge text + zumba style
      const label = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
      if (loginTypeBadge) {
        loginTypeBadge.textContent = label;
        loginTypeBadge.classList.toggle('zumba', selectedRole === 'zumba');
      }
      if (loginBtn) loginBtn.classList.toggle('zumba', selectedRole === 'zumba');

      hideError();
      showScreen('login');
      setTimeout(() => document.getElementById('loginId')?.focus(), 300);
    });
  });

  // ── Back button ────────────────────────────────────────────────
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showScreen('selection');
      hideError();
    });
  }

  // ── Login button ───────────────────────────────────────────────
  if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const email    = document.getElementById('loginId').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        showError('Please fill in all fields.');
        return;
      }
      if (!selectedRole) {
        showError('Please select a role first.');
        return;
      }

      loginBtn.disabled = true;
      loginBtn.classList.add('loading');
      hideError();

      try {
        const res  = await fetch(`${RENDER_URL}/api/login`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email, password, role: selectedRole })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          showError(data.error || 'Login failed. Please try again.');
          return;
        }

        window.location.href = RENDER_URL + data.redirectUrl;

      } catch (err) {
        showError('Network error. Please check your connection.');
      } finally {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────
  function showError(msg) {
    if (errorDiv) {
      errorDiv.textContent = msg;
      errorDiv.classList.add('show');
    }
  }
  function hideError() {
    if (errorDiv) errorDiv.classList.remove('show');
  }

});
