/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL — Main JavaScript Engine
   Handles: API calls, auth, CRUD, toasts, dashboard, all pages
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const API_BASE = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.API_BASE) || window.API_BASE || 'http://localhost:8000';

/* ══════════════════════════════════════════
   API CLIENT
   ══════════════════════════════════════════ */
const API = {
  async request(method, path, body = null) {
    const token = localStorage.getItem('admin_token');
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${path}`, opts);

    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = 'index.html';
      return;
    }

    let data;
    try { data = await res.json(); } catch { data = {}; }

    if (!res.ok) throw new Error(data.detail || 'Request failed');
    return data;
  },

  get:    (path)           => API.request('GET', path),
  post:   (path, body)     => API.request('POST', path, body),
  put:    (path, body)     => API.request('PUT', path, body),
  delete: (path)           => API.request('DELETE', path),
  patch:  (path, body)     => API.request('PATCH', path, body),

  async upload(path, formData) {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    let data;
    try { data = await res.json(); } catch { data = {}; }
    if (!res.ok) throw new Error(data.detail || 'Upload failed');
    return data;
  }
};


/* ══════════════════════════════════════════
   TOAST NOTIFICATIONS
   ══════════════════════════════════════════ */
const Toast = {
  show(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  success: (msg) => Toast.show(msg, 'success'),
  error:   (msg) => Toast.show(msg, 'error'),
  info:    (msg) => Toast.show(msg, 'info'),
  warning: (msg) => Toast.show(msg, 'warning')
};


/* ══════════════════════════════════════════
   MODAL HELPER
   ══════════════════════════════════════════ */
const Modal = {
  create(title, content, footerButtons = []) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">${content}</div>
        <div class="modal-footer">
          ${footerButtons.map(b =>
            `<button class="admin-btn admin-btn-${b.type}" id="modalBtn-${b.id}">${b.label}</button>`
          ).join('')}
        </div>
      </div>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    overlay.querySelector('.modal-close').addEventListener('click', () => Modal.close(overlay));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) Modal.close(overlay); });

    footerButtons.forEach(b => {
      const btn = document.getElementById(`modalBtn-${b.id}`);
      if (btn && b.action) btn.addEventListener('click', () => b.action(overlay));
    });

    return overlay;
  },

  close(overlay) {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 250);
  },

  confirm(message, onConfirm) {
    const overlay = Modal.create('Confirm Action', `<p style="color:var(--text2);line-height:1.6">${message}</p>`, [
      { id: 'cancel',  type: 'secondary', label: 'Cancel',  action: (o) => Modal.close(o) },
      { id: 'confirm', type: 'danger',    label: 'Confirm', action: (o) => { onConfirm(); Modal.close(o); } }
    ]);
    return overlay;
  }
};


/* ══════════════════════════════════════════
   SIDEBAR TOGGLE
   ══════════════════════════════════════════ */
(function initSidebar() {
  const toggle  = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('collapsed');
      const main = document.querySelector('.main-wrapper');
      if (main) main.style.marginLeft = sidebar.classList.contains('collapsed') ? '0' : 'var(--sidebar-w)';
    }
  });
})();


/* ══════════════════════════════════════════
   MAIN APP API
   ══════════════════════════════════════════ */
const AdminApp = {

  /* ─── Dashboard ──────────────────────────────────── */
  async loadDashboard() {
    // Check API health
    try {
      await fetch(`${API_BASE}/health`);
      const dot = document.getElementById('apiDot');
      const txt = document.getElementById('apiStatusText');
      if (dot) dot.classList.add('green');
      if (txt) txt.textContent = 'Connected';
    } catch {
      const dot = document.getElementById('apiDot');
      const txt = document.getElementById('apiStatusText');
      if (dot) dot.classList.add('red');
      if (txt) txt.textContent = 'Offline';
    }

    // Load stats
    try {
      const stats = await API.get('/api/admin/stats');
      this.setEl('statProjects', stats.projects ?? '—');
      this.setEl('statSkills',   stats.skills   ?? '—');
      this.setEl('statCerts',    stats.certs    ?? '—');
      this.setEl('statMessages', stats.messages ?? '—');

      const badge = document.getElementById('unreadBadge');
      if (badge && stats.unread_messages > 0) {
        badge.textContent = stats.unread_messages;
        badge.style.display = 'inline';
        const notifDot = document.getElementById('notifDot');
        if (notifDot) notifDot.style.display = 'block';
      }
    } catch {
      ['statProjects','statSkills','statCerts','statMessages'].forEach(id => this.setEl(id, '—'));
    }

    // Load recent messages
    try {
      const messages = await API.get('/api/admin/messages?limit=5');
      this.renderRecentMessages(messages);
    } catch {
      const el = document.getElementById('recentMessages');
      if (el) el.innerHTML = '<div class="loading-state">Could not load messages. Start backend to see data.</div>';
    }
  },

  renderRecentMessages(messages) {
    const el = document.getElementById('recentMessages');
    if (!el) return;
    if (!messages || messages.length === 0) {
      el.innerHTML = '<div class="loading-state" style="color:var(--muted)">No messages yet.</div>';
      return;
    }
    el.innerHTML = messages.map(m => `
      <div class="msg-item ${m.read ? '' : 'msg-unread'}">
        <div class="msg-avatar">${(m.name || 'A')[0].toUpperCase()}</div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="msg-name">${escHtml(m.name)}</span>
            <span class="msg-time">${formatDate(m.created_at)}</span>
          </div>
          <div class="msg-subject">${escHtml(m.subject)}</div>
          <div class="msg-preview">${escHtml(m.message)}</div>
        </div>
      </div>`).join('');
  },

  setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },


  /* ─── Projects CRUD ──────────────────────────────── */
  async loadProjects() {
    const tbody = document.getElementById('projectsTbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="loading-state">Loading...</td></tr>';

    try {
      const projects = await API.get('/api/projects');
      if (!projects.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading-state">No projects yet. Add your first project!</td></tr>';
        return;
      }
      tbody.innerHTML = projects.map(p => `
        <tr>
          <td class="td-primary">${escHtml(p.name || p.title || 'Untitled Project')}</td>
          <td>${escHtml(p.category || '—')}</td>
          <td>${parseTechList(p.technologies).slice(0,3).map(t => `<span class="badge-status active">${escHtml(t)}</span>`).join(' ')}</td>
          <td><span class="badge-status ${p.is_featured || p.featured ? 'active' : 'unread'}">${p.is_featured || p.featured ? 'Featured' : 'Normal'}</span></td>
          <td>
            <div class="table-actions">
              <button class="action-btn" onclick="AdminApp.editProject(${p.id})" title="Edit">✏️</button>
              <button class="action-btn delete" onclick="AdminApp.deleteProject(${p.id})" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>`).join('');
    } catch {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-state">Could not load projects. Is the backend running?</td></tr>';
    }
  },

  showAddProject() {
    const content = `
      <form class="admin-form" id="projectForm">
        <div class="admin-form-row">
          <div class="admin-form-group">
            <label>Project Name *</label>
            <input type="text" name="name" placeholder="Project title" required />
          </div>
          <div class="admin-form-group">
            <label>Category</label>
            <input type="text" name="category" placeholder="e.g., Computer Vision" />
          </div>
        </div>
        <div class="admin-form-group">
          <label>Description *</label>
          <textarea name="description" rows="3" placeholder="Project description..." required></textarea>
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group">
            <label>Live Demo URL</label>
            <input type="url" name="live_url" placeholder="https://..." />
          </div>
          <div class="admin-form-group">
            <label>GitHub URL</label>
            <input type="url" name="github_url" placeholder="https://github.com/..." />
          </div>
        </div>
        <div class="admin-form-group">
          <label>Technologies (comma-separated)</label>
          <input type="text" name="technologies" placeholder="Python, OpenCV, SQLite" />
        </div>
        <div class="admin-form-group">
          <label>Problem Statement</label>
          <textarea name="problem" rows="2" placeholder="What problem does this solve?"></textarea>
        </div>
        <div class="admin-form-group">
          <label>Result / Outcome</label>
          <textarea name="result" rows="2" placeholder="What was the outcome?"></textarea>
        </div>
        <div class="admin-form-group">
          <label style="display:flex;gap:8px;align-items:center;cursor:pointer">
            <input type="checkbox" name="featured" style="width:auto;" />
            Featured Project
          </label>
        </div>
      </form>`;

    Modal.create('Add New Project', content, [
      { id: 'cancel', type: 'secondary', label: 'Cancel',      action: (o) => Modal.close(o) },
      { id: 'save',   type: 'primary',   label: 'Save Project', action: async (o) => {
        const form = document.getElementById('projectForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data = Object.fromEntries(new FormData(form));
        data.technologies = data.technologies ? data.technologies.split(',').map(s => s.trim()).filter(Boolean) : [];
        data.featured = !!form.querySelector('[name=featured]').checked;
        try {
          await API.post('/api/admin/projects', data);
          Modal.close(o);
          Toast.success('Project added successfully!');
          AdminApp.loadProjects();
        } catch(e) { Toast.error(e.message); }
      }}
    ]);
  },

  async editProject(id) {
    let proj;
    try { proj = await API.get(`/api/admin/projects/${id}`); }
    catch { Toast.error('Could not load project.'); return; }

    const content = `
      <form class="admin-form" id="editProjectForm">
        <div class="admin-form-row">
          <div class="admin-form-group">
            <label>Project Name *</label>
            <input type="text" name="name" value="${escHtml(proj.name || proj.title || '')}" required />
          </div>
          <div class="admin-form-group">
            <label>Category</label>
            <input type="text" name="category" value="${escHtml(proj.category || '')}" />
          </div>
        </div>
        <div class="admin-form-group">
          <label>Description</label>
          <textarea name="description" rows="3">${escHtml(proj.description || '')}</textarea>
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group">
            <label>Live Demo URL</label>
            <input type="url" name="live_url" value="${escHtml(proj.live_url || '')}" />
          </div>
          <div class="admin-form-group">
            <label>GitHub URL</label>
            <input type="url" name="github_url" value="${escHtml(proj.github_url || '')}" />
          </div>
        </div>
        <div class="admin-form-group">
          <label>Technologies (comma-separated)</label>
          <input type="text" name="technologies" value="${escHtml(parseTechList(proj.technologies).join(', '))}" />
        </div>
        <div class="admin-form-group">
          <label style="display:flex;gap:8px;align-items:center;cursor:pointer">
            <input type="checkbox" name="featured" style="width:auto;" ${proj.is_featured || proj.featured ? 'checked' : ''} />
            Featured Project
          </label>
        </div>
      </form>`;

    Modal.create('Edit Project', content, [
      { id: 'cancel', type: 'secondary', label: 'Cancel',         action: (o) => Modal.close(o) },
      { id: 'save',   type: 'primary',   label: 'Update Project', action: async (o) => {
        const form = document.getElementById('editProjectForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data = Object.fromEntries(new FormData(form));
        data.technologies = data.technologies ? data.technologies.split(',').map(s => s.trim()).filter(Boolean) : [];
        data.featured = !!form.querySelector('[name=featured]').checked;
        try {
          await API.put(`/api/admin/projects/${id}`, data);
          Modal.close(o);
          Toast.success('Project updated!');
          AdminApp.loadProjects();
        } catch(e) { Toast.error(e.message); }
      }}
    ]);
  },

  deleteProject(id) {
    Modal.confirm('Are you sure you want to delete this project? This cannot be undone.', async () => {
      try {
        await API.delete(`/api/admin/projects/${id}`);
        Toast.success('Project deleted.');
        AdminApp.loadProjects();
      } catch(e) { Toast.error(e.message); }
    });
  },


  /* ─── Skills CRUD ────────────────────────────────── */
  async loadSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading-state">Loading...</div>';

    try {
      const skills = await API.get('/api/skills');
      if (!skills.length) {
        container.innerHTML = '<div class="loading-state">No skills yet.</div>';
        return;
      }

      // Group by category
      const groups = {};
      skills.forEach(s => {
        if (!groups[s.category]) groups[s.category] = [];
        groups[s.category].push(s);
      });

      container.innerHTML = Object.entries(groups).map(([cat, items]) => `
        <div class="admin-section" style="margin-bottom:16px">
          <div class="admin-section-header">
            <span class="admin-section-title">${escHtml(cat)}</span>
            <button class="admin-btn admin-btn-secondary" onclick="AdminApp.addSkill('${escHtml(cat)}')">+ Add Skill</button>
          </div>
          <div class="admin-section-body" style="display:flex;flex-wrap:wrap;gap:8px;">
            ${items.map(s => `
              <div style="display:flex;align-items:center;gap:6px;background:var(--bg);border:1px solid var(--border);border-radius:99px;padding:5px 12px">
                <span style="font-size:0.82rem;color:var(--text2)">${escHtml(s.name)}</span>
                <button onclick="AdminApp.deleteSkill(${s.id})" style="color:var(--muted);font-size:0.85rem;cursor:pointer;background:none;border:none;transition:color 0.2s" title="Remove"
                  onmouseover="this.style.color='var(--error)'" onmouseout="this.style.color='var(--muted)'">✕</button>
              </div>`).join('')}
          </div>
        </div>`).join('');
    } catch {
      container.innerHTML = '<div class="loading-state">Could not load skills.</div>';
    }
  },

  addSkill(category = '') {
    const cats = ['Programming','Data Science','Visualization','Machine Learning','Deep Learning','Computer Vision','NLP','Generative AI','Dev Tools','Deployment'];
    const content = `
      <form class="admin-form" id="skillForm">
        <div class="admin-form-group">
          <label>Skill Name *</label>
          <input type="text" name="name" placeholder="e.g., NumPy" required />
        </div>
        <div class="admin-form-group">
          <label>Category *</label>
          <select name="category" required>
            ${cats.map(c => `<option value="${c}" ${c===category?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
      </form>`;

    Modal.create('Add Skill', content, [
      { id: 'cancel', type: 'secondary', label: 'Cancel',    action: (o) => Modal.close(o) },
      { id: 'save',   type: 'primary',   label: 'Add Skill', action: async (o) => {
        const form = document.getElementById('skillForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data = Object.fromEntries(new FormData(form));
        try {
          await API.post('/api/admin/skills', data);
          Modal.close(o);
          Toast.success(`"${data.name}" added!`);
          AdminApp.loadSkills();
        } catch(e) { Toast.error(e.message); }
      }}
    ]);
  },

  deleteSkill(id) {
    Modal.confirm('Remove this skill?', async () => {
      try {
        await API.delete(`/api/admin/skills/${id}`);
        Toast.success('Skill removed.');
        AdminApp.loadSkills();
      } catch(e) { Toast.error(e.message); }
    });
  },


  /* ─── Education CRUD ──────────────────────────────── */
  async loadEducation() {
    const tbody = document.getElementById('educationTbody');
    if (!tbody) return;
    try {
      const edu = await API.get('/api/education');
      tbody.innerHTML = edu.map(e => `
        <tr>
          <td class="td-primary">${escHtml(e.degree)}</td>
          <td>${escHtml(e.institution)}</td>
          <td>${e.start_year} – ${e.end_year || 'Present'}</td>
          <td>${escHtml(e.score || e.grade || '—')}</td>
          <td>
            <div class="table-actions">
              <button class="action-btn" onclick="AdminApp.editEducation(${e.id})" title="Edit">✏️</button>
              <button class="action-btn delete" onclick="AdminApp.deleteEducation(${e.id})" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>`).join('') || '<tr><td colspan="5" class="loading-state">No education records yet.</td></tr>';
    } catch {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-state">Could not load education.</td></tr>';
    }
  },

  showAddEducation() {
    const content = `
      <form class="admin-form" id="eduForm">
        <div class="admin-form-group"><label>Degree *</label><input type="text" name="degree" placeholder="B.Sc. Computer Science" required /></div>
        <div class="admin-form-group"><label>Institution *</label><input type="text" name="institution" placeholder="College name" required /></div>
        <div class="admin-form-row">
          <div class="admin-form-group"><label>Start Year</label><input type="number" name="start_year" placeholder="2023" required /></div>
          <div class="admin-form-group"><label>End Year (or blank for present)</label><input type="number" name="end_year" placeholder="2026" /></div>
        </div>
        <div class="admin-form-group"><label>CGPA / Percentage</label><input type="text" name="score" placeholder="6.6 / 10" /></div>
        <div class="admin-form-group"><label>Description</label><textarea name="description" rows="2" placeholder="Additional details..."></textarea></div>
      </form>`;

    Modal.create('Add Education', content, [
      { id: 'cancel', type: 'secondary', label: 'Cancel', action: (o) => Modal.close(o) },
      { id: 'save', type: 'primary', label: 'Save', action: async (o) => {
        const form = document.getElementById('eduForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data = Object.fromEntries(new FormData(form));
        if (data.start_year) data.start_year = parseInt(data.start_year);
        if (data.end_year) data.end_year = parseInt(data.end_year);
        try {
          await API.post('/api/admin/education', data);
          Modal.close(o);
          Toast.success('Education record added!');
          AdminApp.loadEducation();
        } catch(e) { Toast.error(e.message); }
      }}
    ]);
  },

  async editEducation(id) {
    try {
      const list = await API.get('/api/education');
      const item = list.find(e => e.id === id);
      if (!item) { Toast.error('Record not found.'); return; }

      const content = `
        <form class="admin-form" id="editEduForm">
          <div class="admin-form-group"><label>Degree *</label><input type="text" name="degree" value="${escHtml(item.degree)}" required /></div>
          <div class="admin-form-group"><label>Institution *</label><input type="text" name="institution" value="${escHtml(item.institution)}" required /></div>
          <div class="admin-form-row">
            <div class="admin-form-group"><label>Start Year</label><input type="number" name="start_year" value="${item.start_year || ''}" required /></div>
            <div class="admin-form-group"><label>End Year</label><input type="number" name="end_year" value="${item.end_year || ''}" /></div>
          </div>
          <div class="admin-form-group"><label>CGPA / Percentage</label><input type="text" name="score" value="${escHtml(item.score || item.grade || '')}" /></div>
          <div class="admin-form-group"><label>Description</label><textarea name="description" rows="2">${escHtml(item.description || '')}</textarea></div>
        </form>`;

      Modal.create('Edit Education', content, [
        { id: 'cancel', type: 'secondary', label: 'Cancel', action: (o) => Modal.close(o) },
        { id: 'save', type: 'primary', label: 'Update', action: async (o) => {
          const form = document.getElementById('editEduForm');
          if (!form.checkValidity()) { form.reportValidity(); return; }
          const data = Object.fromEntries(new FormData(form));
          if (data.start_year) data.start_year = parseInt(data.start_year);
          if (data.end_year) data.end_year = parseInt(data.end_year);
          try {
            await API.put(`/api/admin/education/${id}`, data);
            Modal.close(o);
            Toast.success('Education record updated!');
            AdminApp.loadEducation();
          } catch(e) { Toast.error(e.message); }
        }}
      ]);
    } catch(e) { Toast.error(e.message); }
  },

  deleteEducation(id) {
    Modal.confirm('Delete this education record?', async () => {
      try {
        await API.delete(`/api/admin/education/${id}`);
        Toast.success('Record deleted.');
        AdminApp.loadEducation();
      } catch(e) { Toast.error(e.message); }
    });
  },


  /* ─── Certifications CRUD ────────────────────────── */
  async loadCertifications() {
    const container = document.getElementById('certsContainer');
    if (!container) return;
    try {
      const certs = await API.get('/api/certifications');
      container.innerHTML = certs.map(c => `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;display:flex;gap:16px;align-items:flex-start">
          <div style="width:70px;height:70px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">
            ${c.image_url ? `<img src="${window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(c.image_url) : c.image_url}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='🏅'" />` : '<span style="font-size:1.6rem">🏅</span>'}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;color:var(--text);margin-bottom:3px">${escHtml(c.title)}</div>
            <div style="font-size:0.8rem;color:var(--accent);margin-bottom:4px">${escHtml(c.organization)} ${c.date ? `• ${escHtml(c.date)}` : ''}</div>
            <div style="font-size:0.78rem;color:var(--muted)">${escHtml(c.description || '')}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button class="action-btn" onclick="AdminApp.editCert(${c.id})" title="Edit">✏️</button>
            <button class="action-btn delete" onclick="AdminApp.deleteCert(${c.id})" title="Delete">🗑️</button>
          </div>
        </div>`).join('') || '<div class="loading-state">No certifications yet.</div>';
    } catch {
      container.innerHTML = '<div class="loading-state">Could not load certifications.</div>';
    }
  },

  showAddCert() {
    const content = `
      <form class="admin-form" id="certForm">
        <div class="admin-form-group"><label>Certificate Title *</label><input type="text" name="title" required /></div>
        <div class="admin-form-group"><label>Organization *</label><input type="text" name="organization" required /></div>
        <div class="admin-form-group"><label>Date</label><input type="text" name="date" placeholder="2024" /></div>
        <div class="admin-form-group"><label>Description</label><textarea name="description" rows="2"></textarea></div>
      </form>`;

    Modal.create('Add Certification', content, [
      { id: 'cancel', type: 'secondary', label: 'Cancel', action: (o) => Modal.close(o) },
      { id: 'save', type: 'primary', label: 'Save', action: async (o) => {
        const form = document.getElementById('certForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data = Object.fromEntries(new FormData(form));
        try {
          await API.post('/api/admin/certifications', data);
          Modal.close(o);
          Toast.success('Certificate added!');
          AdminApp.loadCertifications();
        } catch(e) { Toast.error(e.message); }
      }}
    ]);
  },

  async editCert(id) {
    try {
      const cert = await API.get(`/api/admin/certifications/${id}`);
      const content = `
        <form class="admin-form" id="editCertForm">
          <div class="admin-form-group"><label>Certificate Title *</label><input type="text" name="title" value="${escHtml(cert.title)}" required /></div>
          <div class="admin-form-group"><label>Organization *</label><input type="text" name="organization" value="${escHtml(cert.organization)}" required /></div>
          <div class="admin-form-group"><label>Date</label><input type="text" name="date" value="${escHtml(cert.date || cert.date_obtained || '')}" /></div>
          <div class="admin-form-group"><label>Description</label><textarea name="description" rows="2">${escHtml(cert.description || '')}</textarea></div>
          <div class="admin-form-group">
            <label>Upload Certificate Image</label>
            <input type="file" id="certImageFileInput" accept="image/*" />
          </div>
        </form>`;

      Modal.create('Edit Certificate', content, [
        { id: 'cancel', type: 'secondary', label: 'Cancel', action: (o) => Modal.close(o) },
        { id: 'save', type: 'primary', label: 'Update', action: async (o) => {
          const form = document.getElementById('editCertForm');
          if (!form.checkValidity()) { form.reportValidity(); return; }
          const data = Object.fromEntries(new FormData(form));
          try {
            await API.put(`/api/admin/certifications/${id}`, data);
            const fileInput = document.getElementById('certImageFileInput');
            if (fileInput && fileInput.files[0]) {
              const fd = new FormData();
              fd.append('file', fileInput.files[0]);
              await API.upload(`/api/admin/certifications/${id}/image`, fd);
            }
            Modal.close(o);
            Toast.success('Certificate updated!');
            AdminApp.loadCertifications();
          } catch(e) { Toast.error(e.message); }
        }}
      ]);
    } catch(e) { Toast.error(e.message); }
  },

  deleteCert(id) {
    Modal.confirm('Delete this certificate?', async () => {
      try {
        await API.delete(`/api/admin/certifications/${id}`);
        Toast.success('Certificate deleted.');
        AdminApp.loadCertifications();
      } catch(e) { Toast.error(e.message); }
    });
  },


  /* ─── Messages ────────────────────────────────────── */
  async loadMessages() {
    const tbody = document.getElementById('messagesTbody');
    if (!tbody) return;
    try {
      const msgs = await API.get('/api/admin/messages');
      tbody.innerHTML = msgs.map(m => `
        <tr class="${m.read ? '' : 'msg-unread'}">
          <td class="td-primary">${escHtml(m.name)}</td>
          <td>${escHtml(m.email)}</td>
          <td>${escHtml(m.subject)}</td>
          <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(m.message)}</td>
          <td>${formatDate(m.created_at)}</td>
          <td><span class="badge-status ${m.read ? 'read' : 'unread'}">${m.read ? 'Read' : 'Unread'}</span></td>
          <td>
            <div class="table-actions">
              <button class="action-btn" onclick="AdminApp.viewMessage(${m.id})" title="View">👁️</button>
              <button class="action-btn" onclick="AdminApp.toggleRead(${m.id}, ${m.read})" title="${m.read ? 'Mark unread' : 'Mark read'}">${m.read ? '📭' : '📬'}</button>
              <button class="action-btn delete" onclick="AdminApp.deleteMessage(${m.id})" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>`).join('') || '<tr><td colspan="7" class="loading-state">No messages yet.</td></tr>';
    } catch {
      tbody.innerHTML = '<tr><td colspan="7" class="loading-state">Could not load messages.</td></tr>';
    }
  },

  async viewMessage(id) {
    try {
      const m = await API.get(`/api/admin/messages/${id}`);
      Modal.create(`Message from ${escHtml(m.name)}`, `
        <div style="display:flex;flex-direction:column;gap:12px">
          <div><span style="color:var(--muted);font-size:0.78rem">FROM</span><div style="color:var(--text);font-weight:600;margin-top:2px">${escHtml(m.name)} &lt;${escHtml(m.email)}&gt;</div></div>
          <div><span style="color:var(--muted);font-size:0.78rem">SUBJECT</span><div style="color:var(--text);margin-top:2px">${escHtml(m.subject)}</div></div>
          <div><span style="color:var(--muted);font-size:0.78rem">MESSAGE</span><div style="color:var(--text2);margin-top:6px;line-height:1.6;white-space:pre-wrap">${escHtml(m.message)}</div></div>
          <div><span style="color:var(--muted);font-size:0.78rem">DATE</span><div style="color:var(--text2);margin-top:2px">${formatDate(m.created_at, true)}</div></div>
        </div>`, [
        { id: 'reply',  type: 'primary',   label: 'Reply via Email', action: () => window.open(`mailto:${m.email}?subject=Re: ${m.subject}`) },
        { id: 'close',  type: 'secondary', label: 'Close',           action: (o) => Modal.close(o) }
      ]);
      // Mark as read
      if (!m.read) { await API.patch(`/api/admin/messages/${id}`, { read: true }); AdminApp.loadMessages(); }
    } catch { Toast.error('Could not load message.'); }
  },

  async toggleRead(id, currentRead) {
    try {
      await API.patch(`/api/admin/messages/${id}`, { read: !currentRead });
      Toast.info(currentRead ? 'Marked as unread.' : 'Marked as read.');
      AdminApp.loadMessages();
    } catch(e) { Toast.error(e.message); }
  },

  deleteMessage(id) {
    Modal.confirm('Delete this message? This cannot be undone.', async () => {
      try {
        await API.delete(`/api/admin/messages/${id}`);
        Toast.success('Message deleted.');
        AdminApp.loadMessages();
      } catch(e) { Toast.error(e.message); }
    });
  },


  /* ─── Profile ─────────────────────────────────────── */
  async loadProfile() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    try {
      const profile = await API.get('/api/profile');
      if (profile) {
        Object.keys(profile).forEach(key => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field) field.value = profile[key] || '';
        });
        const preview = document.getElementById('profileImagePreview');
        if (preview && profile.profile_image_url) {
          preview.src = window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(profile.profile_image_url) : profile.profile_image_url;
        }
      }
    } catch { Toast.info('Could not load profile data from server.'); }
  },

  async saveProfile() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    const data = Object.fromEntries(new FormData(form));
    const btn = document.getElementById('saveProfileBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
    try {
      await API.put('/api/admin/profile', data);
      Toast.success('Profile saved successfully!');
    } catch(e) { Toast.error(e.message || 'Could not save.'); }
    finally { if (btn) { btn.disabled = false; btn.textContent = 'Save Changes'; } }
  },

  async uploadProfileImage(input) {
    if (!input || !input.files[0]) return;
    const file = input.files[0];
    const fd = new FormData();
    fd.append('file', file);
    try {
      Toast.info('Uploading photo...');
      const res = await API.upload('/api/admin/profile/image', fd);
      Toast.success('Profile photo updated!');
      const preview = document.getElementById('profileImagePreview');
      if (preview && res.profile_image_url) {
        preview.src = window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(res.profile_image_url) : res.profile_image_url;
      }
    } catch(e) { Toast.error(e.message); }
  },


  /* ─── Resume Management ───────────────────────────── */
  async loadResume() {
    const activeEl = document.getElementById('activeResumeInfo');
    const listEl = document.getElementById('resumeListTbody');
    try {
      const active = await API.get('/api/resume');
      if (activeEl) {
        activeEl.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px">
            <div style="display:flex;align-items:center;gap:14px">
              <span style="font-size:2rem">📄</span>
              <div>
                <div style="font-weight:600;color:var(--text)">${escHtml(active.filename)}</div>
                <div style="font-size:0.8rem;color:var(--accent)">Active Resume (Publicly Viewable & Downloadable)</div>
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <a href="${active.url.startsWith('http') || active.url.startsWith('/') ? active.url : '../public-portfolio/' + active.url}" target="_blank" class="admin-btn admin-btn-secondary">View PDF</a>
              <a href="${active.url.startsWith('http') || active.url.startsWith('/') ? active.url : '../public-portfolio/' + active.url}" download class="admin-btn admin-btn-primary">Download</a>
            </div>
          </div>`;
      }

      const resumes = await API.get('/api/admin/resumes');
      if (listEl) {
        listEl.innerHTML = resumes.map(r => `
          <tr>
            <td class="td-primary">${escHtml(r.filename)}</td>
            <td>${formatDate(r.uploaded_at, true)}</td>
            <td><span class="badge-status ${r.is_active ? 'active' : 'read'}">${r.is_active ? 'Active' : 'Archived'}</span></td>
            <td>
              <div class="table-actions">
                ${!r.is_active ? `<button class="action-btn" onclick="AdminApp.setActiveResume(${r.id})" title="Set as Active">⭐</button>` : ''}
                <a href="${r.url}" target="_blank" class="action-btn" title="View">👁️</a>
                <button class="action-btn delete" onclick="AdminApp.deleteResume(${r.id})" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>`).join('') || '<tr><td colspan="4" class="loading-state">No uploaded resumes yet.</td></tr>';
      }
    } catch {
      if (activeEl) activeEl.innerHTML = '<div class="loading-state">Could not load resume data.</div>';
    }
  },

  async uploadResume(input) {
    if (!input || !input.files[0]) return;
    const file = input.files[0];
    const fd = new FormData();
    fd.append('file', file);
    try {
      Toast.info('Uploading resume...');
      await API.upload('/api/admin/resume/upload', fd);
      Toast.success('Resume uploaded and set as active!');
      AdminApp.loadResume();
    } catch(e) { Toast.error(e.message); }
  },

  async setActiveResume(id) {
    try {
      await API.put(`/api/admin/resume/${id}/set-active`);
      Toast.success('Active resume updated!');
      AdminApp.loadResume();
    } catch(e) { Toast.error(e.message); }
  },

  deleteResume(id) {
    Modal.confirm('Delete this resume file?', async () => {
      try {
        await API.delete(`/api/admin/resume/${id}`);
        Toast.success('Resume deleted.');
        AdminApp.loadResume();
      } catch(e) { Toast.error(e.message); }
    });
  },


  /* ─── Social Links ────────────────────────────────── */
  async loadSocial() {
    const tbody = document.getElementById('socialTbody');
    if (!tbody) return;
    try {
      const links = await API.get('/api/social-links');
      tbody.innerHTML = links.map(l => `
        <tr>
          <td class="td-primary">${escHtml(l.platform)}</td>
          <td><a href="${escHtml(l.url)}" target="_blank" style="color:var(--accent);text-decoration:none">${escHtml(l.url)}</a></td>
          <td>${escHtml(l.icon || '—')}</td>
          <td>${l.display_order}</td>
          <td>
            <div class="table-actions">
              <button class="action-btn delete" onclick="AdminApp.deleteSocial(${l.id})" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>`).join('') || '<tr><td colspan="5" class="loading-state">No social links yet.</td></tr>';
    } catch {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-state">Could not load social links.</td></tr>';
    }
  },

  showAddSocial() {
    const content = `
      <form class="admin-form" id="socialForm">
        <div class="admin-form-group"><label>Platform *</label><input type="text" name="platform" placeholder="e.g. GitHub" required /></div>
        <div class="admin-form-group"><label>URL *</label><input type="url" name="url" placeholder="https://..." required /></div>
        <div class="admin-form-group"><label>Icon (Optional)</label><input type="text" name="icon" placeholder="github, linkedin, mail" /></div>
        <div class="admin-form-group"><label>Display Order</label><input type="number" name="display_order" value="1" /></div>
      </form>`;

    Modal.create('Add Social Link', content, [
      { id: 'cancel', type: 'secondary', label: 'Cancel', action: (o) => Modal.close(o) },
      { id: 'save', type: 'primary', label: 'Save', action: async (o) => {
        const form = document.getElementById('socialForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data = Object.fromEntries(new FormData(form));
        if (data.display_order) data.display_order = parseInt(data.display_order);
        try {
          await API.post('/api/admin/social-links', data);
          Modal.close(o);
          Toast.success('Social link added!');
          AdminApp.loadSocial();
        } catch(e) { Toast.error(e.message); }
      }}
    ]);
  },

  deleteSocial(id) {
    Modal.confirm('Delete this social link?', async () => {
      try {
        await API.delete(`/api/admin/social-links/${id}`);
        Toast.success('Link deleted.');
        AdminApp.loadSocial();
      } catch(e) { Toast.error(e.message); }
    });
  },


  /* ─── Media Manager ───────────────────────────────── */
  async loadMedia() {
    const container = document.getElementById('mediaGallery');
    if (!container) return;
    try {
      const mediaList = await API.get('/api/admin/media');
      container.innerHTML = mediaList.map(m => `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;display:flex;flex-direction:column">
          <div style="height:140px;background:var(--bg);display:flex;align-items:center;justify-content:center;overflow:hidden">
            ${m.media_type && m.media_type.startsWith('image') ? `<img src="${window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(m.url) : m.url}" style="width:100%;height:100%;object-fit:cover" />` : '<span style="font-size:3rem">📄</span>'}
          </div>
          <div style="padding:14px;flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:8px">
            <div>
              <div style="font-size:0.85rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(m.filename)}">${escHtml(m.filename)}</div>
              <div style="font-size:0.75rem;color:var(--muted);margin-top:2px">${formatDate(m.uploaded_at)}</div>
            </div>
            <div style="display:flex;gap:6px;margin-top:6px">
              <button class="admin-btn admin-btn-secondary" style="flex:1;padding:6px;font-size:0.75rem" onclick="AdminApp.copyUrl('${m.url}')">Copy URL</button>
              <button class="action-btn delete" onclick="AdminApp.deleteMedia(${m.id})" title="Delete">🗑️</button>
            </div>
          </div>
        </div>`).join('') || '<div class="loading-state">No media uploaded yet. Use the upload button above.</div>';
    } catch {
      container.innerHTML = '<div class="loading-state">Could not load media.</div>';
    }
  },

  async uploadMedia(input, subfolder = 'general') {
    if (!input || !input.files[0]) return;
    const file = input.files[0];
    const fd = new FormData();
    fd.append('file', file);
    fd.append('subfolder', subfolder);
    try {
      Toast.info('Uploading file...');
      await API.upload('/api/admin/media/upload', fd);
      Toast.success('Media uploaded successfully!');
      AdminApp.loadMedia();
    } catch(e) { Toast.error(e.message); }
  },

  deleteMedia(id) {
    Modal.confirm('Delete this file permanently?', async () => {
      try {
        await API.delete(`/api/admin/media/${id}`);
        Toast.success('File deleted.');
        AdminApp.loadMedia();
      } catch(e) { Toast.error(e.message); }
    });
  },

  copyUrl(url) {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => Toast.success('URL copied to clipboard!'));
  },


  /* ─── Settings & Password ─────────────────────────── */
  async changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    if (!current || !newPass) { Toast.error('Please enter all required password fields.'); return; }
    if (newPass !== confirmPass) { Toast.error('New passwords do not match.'); return; }
    if (newPass.length < 6) { Toast.error('New password must be at least 6 characters.'); return; }

    try {
      await API.put('/api/admin/password', { current_password: current, new_password: newPass });
      Toast.success('Password changed successfully!');
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } catch(e) { Toast.error(e.message); }
  }
};


/* ══════════════════════════════════════════
   UTILITY FUNCTIONS
   ══════════════════════════════════════════ */
function parseTechList(techs) {
  if (!techs) return [];
  if (Array.isArray(techs)) return techs;
  if (typeof techs === 'string') {
    try {
      const parsed = JSON.parse(techs);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return techs.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

function formatDate(dateStr, full = false) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  if (full) return d.toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleDateString('en-IN', { month:'short', day:'numeric' });
}

// Global export
window.AdminApp = AdminApp;
window.Modal    = Modal;
window.Toast    = Toast;
