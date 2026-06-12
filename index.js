// ── Config ────────────────────────────────────────────────────────────
const RENDER_URL = 'https://node-gimbo.onrender.com';

// ── State ─────────────────────────────────────────────────────────────
let selectedRole = null;

// ── Wake up Render on page load ───────────────────────────────────────
fetch(`${RENDER_URL}/ping`, { method: 'GET', cache: 'no-store' }).catch(() => {});

// ── Role selection ────────────────────────────────────────────────────
document.querySelectorAll('.selection-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedRole = card.dataset.role;
  });
});

// ── Login handler ─────────────────────────────────────────────────────
document.getElementById('loginBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const email    = document.getElementById('loginId').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('errorMessage');

  if (!email || !password) {
    errorDiv.textContent = 'Please fill in all fields.';
    errorDiv.classList.add('show');
    return;
  }

  if (!selectedRole) {
    errorDiv.textContent = 'Please select a role first.';
    errorDiv.classList.add('show');
    return;
  }

  const loginBtn = document.getElementById('loginBtn');
  loginBtn.disabled = true;
  loginBtn.classList.add('loading');
  errorDiv.classList.remove('show');

  try {
    const res = await fetch(`${RENDER_URL}/api/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password, role: selectedRole })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      errorDiv.textContent = data.error || 'Login failed. Please try again.';
      errorDiv.classList.add('show');
      return;
    }

    // Redirect to dashboard on Render
    window.location.href = RENDER_URL + data.redirectUrl;

  } catch (e) {
    errorDiv.textContent = 'Network error. Please check your connection.';
    errorDiv.classList.add('show');
  } finally {
    loginBtn.disabled = false;
    loginBtn.classList.remove('loading');
  }
});
