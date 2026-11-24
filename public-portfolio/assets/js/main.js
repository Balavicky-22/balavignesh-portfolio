/* ═══════════════════════════════════════════════════════════════
   BALAVIGNESH B — AI INTELLIGENCE LAB PORTFOLIO
   Main JavaScript — 3D Neural Core, Bento Grid, Lightbox & Sync
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   VERIFIED TECHNICAL DATA STORE
   ══════════════════════════════════════════ */
const PORTFOLIO_DATA = {
  skills: [
    {
      id: 'programming',
      icon: '🐍',
      name: 'Python Programming',
      badge: 'Core Language',
      desc: 'The computational foundation for all AI engineering — modular scripting, object-oriented design, algorithmic efficiency, and pipeline construction.',
      skills: ['Python', 'OOP', 'Data Structures', 'Algorithmic Logic'],
      workflowPos: 'Foundation Layer',
      workflow: ['Python Scripting', '→', 'Data Ingestion', '→', 'Pipeline Engineering', '→', 'Model Deployment']
    },
    {
      id: 'datascience',
      icon: '📊',
      name: 'Data Science & Analysis',
      badge: 'Data Layer',
      desc: 'Rigorous data manipulation and feature preparation. Extracting signal from noise through structured cleaning, transformation, and statistical inference.',
      skills: ['NumPy', 'Pandas', 'Data Cleaning', 'Exploratory Data Analysis', 'Statistical Analysis'],
      workflowPos: 'Data Layer',
      workflow: ['Raw Ingestion', '→', 'NumPy Arrays', '→', 'Pandas Wrangling', '→', 'EDA', '→', 'Feature Matrix']
    },
    {
      id: 'visualization',
      icon: '📈',
      name: 'Data Visualization',
      badge: 'Insight Layer',
      desc: 'Communicating complex high-dimensional distributions, feature correlations, and evaluation curves through clear, actionable visualizations.',
      skills: ['Matplotlib', 'Seaborn', 'Statistical Plots', 'Confusion Matrices'],
      workflowPos: 'Insight Layer',
      workflow: ['Processed Data', '→', 'Distribution Analysis', '→', 'Matplotlib / Seaborn', '→', 'Feature Insight']
    },
    {
      id: 'ml',
      icon: '🤖',
      name: 'Machine Learning',
      badge: 'Modeling Core',
      desc: 'Supervised and unsupervised learning algorithms engineered for predictive accuracy, generalizability, and structured model evaluation.',
      skills: ['Supervised Learning', 'Unsupervised Learning', 'Linear Regression', 'Logistic Regression', 'Decision Trees', 'KNN', 'K-Means', 'PCA', 'Model Evaluation', 'Train-Test Split', 'Feature Scaling', 'Confusion Matrix'],
      workflowPos: 'Modeling Layer',
      workflow: ['Feature Matrix', '→', 'Model Selection', '→', 'Cross-Validation', '→', 'Tuning', '→', 'Inference']
    },
    {
      id: 'deeplearning',
      icon: '🧠',
      name: 'Deep Learning',
      badge: 'Neural Architectures',
      desc: 'Hierarchical representation learning with multi-layer neural architectures. Artificial Neural Networks and Convolutional Neural Networks.',
      skills: ['Artificial Neural Networks (ANN)', 'Convolutional Neural Networks (CNN)', 'Backpropagation', 'Activation Functions'],
      workflowPos: 'Neural Layer',
      workflow: ['Tensor Inputs', '→', 'Feature Extraction', '→', 'ANN / CNN Layers', '→', 'Loss Minimization', '→', 'Classification']
    },
    {
      id: 'cv',
      icon: '👁️',
      name: 'Computer Vision',
      badge: 'Visual AI',
      desc: 'Real-time image processing, facial landmark recognition, and object detection deployed into production applications like the Smart Attendance system.',
      skills: ['OpenCV', 'Image Processing', 'Face Detection', 'Object Detection', 'Haar Cascade Classifiers', 'LBPH Recognition'],
      workflowPos: 'Vision Layer',
      workflow: ['Camera Feed', '→', 'OpenCV Grayscale & Equalization', '→', 'Haar Cascade Detection', '→', 'LBPH Matching', '→', 'Logging']
    },
    {
      id: 'nlp',
      icon: '💬',
      name: 'Natural Language Processing',
      badge: 'Language AI',
      desc: 'Processing, tokenizing, and extracting semantics from unstructured text corpora to power search, categorization, and conversational systems.',
      skills: ['NLP', 'Tokenization', 'Text Preprocessing', 'Information Retrieval', 'Corpus Management'],
      workflowPos: 'Language Layer',
      workflow: ['Raw Text', '→', 'Tokenization & Cleaning', '→', 'Embeddings', '→', 'Semantic Search', '→', 'Response']
    },
    {
      id: 'genai',
      icon: '✨',
      name: 'Generative AI & LLMs',
      badge: 'Modern Frontier',
      desc: 'Building LLM-powered applications with grounded knowledge bases, prompt engineering, and LangChain orchestration to deliver factual, zero-hallucination answers.',
      skills: ['Large Language Models (LLMs)', 'LLM Fine-Tuning Concepts', 'LangChain', 'Prompt Engineering', 'Grounded AI Assistants'],
      workflowPos: 'Intelligence Layer',
      workflow: ['User Query', '→', 'Grounded Knowledge Base', '→', 'Prompt Synthesis', '→', 'LLM / LangChain', '→', 'Factual Answer']
    },
    {
      id: 'tools',
      icon: '🛠️',
      name: 'Dev Tools & Cloud Deployment',
      badge: 'Infrastructure',
      desc: 'Production deployment workflows, Git version control, interactive research in Jupyter, and cloud hosting on Vercel and Render.',
      skills: ['Git', 'GitHub', 'VS Code', 'Jupyter Notebook', 'Vercel', 'Render', 'REST APIs', 'FastAPI', 'SQLite / PostgreSQL'],
      workflowPos: 'Deployment Layer',
      workflow: ['Development', '→', 'Git / GitHub', '→', 'FastAPI Backend', '→', 'Vercel & Render', '→', 'Continuous Availability']
    }
  ],

  journey: [
    { icon: '🐍', label: 'Python', sub: 'Algorithmic Foundation', desc: 'Core syntax, data structures, functional patterns & automated scripting.' },
    { icon: '📊', label: 'Data Science', sub: 'Data Wrangling', desc: 'NumPy vectorized arrays, Pandas DataFrames, cleaning & exploratory data analysis.' },
    { icon: '📈', label: 'Visualization', sub: 'Insight Discovery', desc: 'Statistical distributions, correlation heatmaps, Matplotlib & Seaborn plots.' },
    { icon: '🤖', label: 'Machine Learning', sub: 'Predictive Models', desc: 'Supervised/unsupervised algorithms, classification, regression & metric validation.' },
    { icon: '🧠', label: 'Deep Learning', sub: 'Neural Systems', desc: 'Hierarchical representation learning, ANN feed-forward networks & CNNs.' },
    { icon: '👁️', label: 'Computer Vision', sub: 'Visual Perception', desc: 'OpenCV image processing, Haar Cascades, facial detection & real-time video inference.' },
    { icon: '💬', label: 'NLP', sub: 'Language Processing', desc: 'Text tokenization, linguistic preprocessing & semantic information extraction.' },
    { icon: '✨', label: 'Generative AI', sub: 'LLMs & LangChain', desc: 'Large language models, grounded knowledge assistants, prompt engineering & LangChain.' }
  ],

  pipeline: [
    {
      icon: '🗂️',
      stage: 'Stage 01',
      title: 'Problem & Data Acquisition',
      desc: 'Formulating clear problem parameters and collecting verified, high-quality data from structured sources, databases, or real-time camera streams.',
      why: 'Model intelligence is fundamentally bounded by the veracity and quality of input data.',
      techs: ['Python', 'Pandas', 'REST APIs', 'SQL / CSV']
    },
    {
      icon: '🔧',
      stage: 'Stage 02',
      title: 'Preprocessing & Normalization',
      desc: 'Handling missing values, outlier treatment, feature scaling, image grayscale conversion, and preparing clean tensors for computation.',
      why: 'Real-world data is noisy; structured preprocessing separates true signal from ambient variance.',
      techs: ['Pandas', 'NumPy', 'OpenCV', 'Feature Scaling']
    },
    {
      icon: '🔍',
      stage: 'Stage 03',
      title: 'Exploratory Analysis (EDA)',
      desc: 'Discovering latent patterns, correlation matrices, class distributions, and feature importance through systematic statistical visualization.',
      why: 'You cannot optimize or evaluate what has not been statistically quantified.',
      techs: ['Matplotlib', 'Seaborn', 'Statistical Plots', 'EDA']
    },
    {
      icon: '🏗️',
      stage: 'Stage 04',
      title: 'Architecture & Model Selection',
      desc: 'Selecting the optimal algorithmic paradigm for the task — classical regression/classification, Haar Cascade vision pipeline, or grounded LLM.',
      why: 'Selecting the appropriate inductive bias prevents overfitting and minimizes compute latency.',
      techs: ['Scikit-Learn', 'OpenCV', 'ANN / CNN', 'FastAPI']
    },
    {
      icon: '⚡',
      stage: 'Stage 05',
      title: 'Training & Hyperparameter Tuning',
      desc: 'Iteratively fitting model parameters, executing cross-validation, adjusting thresholds, and optimizing convergence.',
      why: 'Systematic parameter tuning guarantees robust generalization to out-of-sample data.',
      techs: ['Train-Test Split', 'Cross-Validation', 'Threshold Tuning']
    },
    {
      icon: '📐',
      stage: 'Stage 06',
      title: 'Rigorous Empirical Evaluation',
      desc: 'Benchmarking performance through confusion matrices, precision, recall, F1 scores, and latency audits to verify deployment readiness.',
      why: 'High training metrics without out-of-distribution validation lead to production failure.',
      techs: ['Confusion Matrix', 'Precision / Recall', 'Accuracy Metrics']
    },
    {
      icon: '🚀',
      stage: 'Stage 07',
      title: 'Production Deployment & Monitoring',
      desc: 'Wrapping trained models and logic into fast asynchronous web services, connecting persistence databases, and deploying to cloud infrastructure.',
      why: 'Applied AI delivers actual value only when reliably operational and accessible to end users.',
      techs: ['FastAPI / Flask', 'Render', 'Vercel', 'PostgreSQL / SQLite']
    }
  ]
};

/* ══════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let cx = 0, cy = 0, rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX; cy = e.clientY;
    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
  });

  function animateRing() {
    rx += (cx - rx) * 0.16;
    ry += (cy - ry) * 0.16;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mousedown', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(1.6)';
    ring.style.transform = 'translate(-50%,-50%) scale(0.7)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .bento-skill-card, .cert-card, .pipeline-stage, .journey-node-inner')) {
      ring.style.width  = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'var(--accent)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .bento-skill-card, .cert-card, .pipeline-stage, .journey-node-inner')) {
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(0, 229, 163, 0.45)';
    }
  });
})();

/* ══════════════════════════════════════════
   SCROLL PROGRESS BAR
   ══════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
})();

/* ══════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════ */
(function initNav() {
  const nav         = document.getElementById('mainNav');
  const toggle      = document.getElementById('navToggle');
  const mobileMenu  = document.getElementById('mobileMenu');
  const navLinks    = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sticky shadow & blur
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    function closeMenu() {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
    mobileLinks.forEach(l => l.addEventListener('click', closeMenu));
  }

  // Active section indicator
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-68px 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ══════════════════════════════════════════
   3D NEURAL CORE (Three.js Advanced Canvas)
   ══════════════════════════════════════════ */
(function initNeuralCore() {
  const canvas = document.getElementById('neuralCore');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const WIDTH  = canvas.offsetWidth  || 560;
  const HEIGHT = canvas.offsetHeight || 560;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 200);
  camera.position.z = 6.2;

  // Ambient & Directional Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dirLight = new THREE.DirectionalLight(0x00e5a3, 1.4);
  dirLight.position.set(4, 5, 5);
  scene.add(dirLight);

  const blueLight = new THREE.DirectionalLight(0x00d4ff, 1.0);
  blueLight.position.set(-4, -3, 3);
  scene.add(blueLight);

  // ── Neural Layers Configuration ───────────────────────────
  const nodes = [];
  const connections = [];
  const nodeGeom = new THREE.SphereGeometry(0.09, 16, 16);

  const emeraldMat = new THREE.MeshPhongMaterial({ color: 0x00e5a3, emissive: 0x004733, shininess: 120 });
  const cyanMat    = new THREE.MeshPhongMaterial({ color: 0x00d4ff, emissive: 0x00334d, shininess: 140 });

  const layers = [2, 4, 7, 5, 2]; // Input -> Feature Map -> Deep Hidden -> Dense -> Output
  const layerSpacingX = 1.5;
  const totalLayers = layers.length;

  layers.forEach((count, li) => {
    const x = (li - (totalLayers - 1) / 2) * layerSpacingX;
    for (let ni = 0; ni < count; ni++) {
      const y = (ni - (count - 1) / 2) * 1.05;
      const z = (Math.random() - 0.5) * 0.7;
      const mat = (li === 0 || li === totalLayers - 1) ? cyanMat : emeraldMat;
      const mesh = new THREE.Mesh(nodeGeom, mat.clone());
      mesh.position.set(x, y, z);
      scene.add(mesh);
      nodes.push({ mesh, layer: li, index: ni, basePos: new THREE.Vector3(x, y, z) });
    }
  });

  // Synaptic Connections Between Layers
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5a3, transparent: true, opacity: 0.16 });
  nodes.forEach(n => {
    const nextLayer = nodes.filter(m => m.layer === n.layer + 1);
    nextLayer.forEach(m => {
      const pts = [n.mesh.position, m.mesh.position];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, lineMat.clone());
      scene.add(line);
      connections.push({ from: n, to: m, line });
    });
  });

  // Pulsing Synaptic Signals (Traveling particles)
  const pulseGeom = new THREE.SphereGeometry(0.04, 8, 8);
  const pulseMat  = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const signalPulses = [];
  const numPulses = 12;
  for (let i = 0; i < numPulses; i++) {
    const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
    scene.add(pulseMesh);
    const conn = connections[Math.floor(Math.random() * connections.length)];
    signalPulses.push({
      mesh: pulseMesh,
      conn: conn,
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.012
    });
  }

  // Floating Ambient Data Dust Field
  const particleCount = window.innerWidth < 768 ? 60 : 140;
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.6 + Math.random() * 2.8;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    pPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x00e5a3, size: 0.035, transparent: true, opacity: 0.45 });
  scene.add(new THREE.Points(pGeo, pMat));

  // Orbital Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(3.6, 0.012, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x00e5a3, transparent: true, opacity: 0.15 })
  );
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.009, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.12 })
  );
  ring2.rotation.x = Math.PI / 2.2;
  ring2.rotation.z = Math.PI / 4;
  scene.add(ring2);

  // Mouse Parallax
  let mouseX = 0, mouseY = 0;
  if (!prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // Animation Loop
  let t = 0;
  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    t += 0.008;

    if (!prefersReducedMotion) {
      camera.position.x += (mouseX * 1.1 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.9 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
    }

    // Node micro-pulse
    nodes.forEach((n, i) => {
      const pulse = Math.sin(t * 1.5 + i * 0.5) * 0.015 + 1;
      n.mesh.scale.setScalar(pulse);
      n.mesh.position.y = n.basePos.y + Math.sin(t + i * 0.7) * 0.05;
      n.mesh.position.z = n.basePos.z + Math.cos(t * 0.8 + i * 0.4) * 0.03;
    });

    // Update Synaptic Signal Pulses
    signalPulses.forEach(sp => {
      sp.progress += sp.speed;
      if (sp.progress >= 1) {
        sp.progress = 0;
        sp.conn = connections[Math.floor(Math.random() * connections.length)];
      }
      if (sp.conn) {
        sp.mesh.position.lerpVectors(sp.conn.from.mesh.position, sp.conn.to.mesh.position, sp.progress);
      }
    });

    ring1.rotation.z += 0.0025;
    ring2.rotation.y += 0.0035;
    ring2.rotation.z += 0.0018;

    scene.rotation.y = scrollY * 0.00025;
    renderer.render(scene, camera);
  }
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth || 560;
    const h = canvas.offsetHeight || 560;
    renderer.setSize(w, h);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  });
})();

/* ══════════════════════════════════════════
   HERO AMBIENT DATA STREAMS
   ══════════════════════════════════════════ */
(function initDataStreams() {
  const container = document.getElementById('dataStreams');
  if (!container) return;
  const count = window.innerWidth < 768 ? 6 : 14;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'data-stream';
    el.style.left = Math.random() * 100 + '%';
    el.style.height = (60 + Math.random() * 120) + 'px';
    el.style.animationDuration = (3 + Math.random() * 5) + 's';
    el.style.animationDelay = (-Math.random() * 8) + 's';
    el.style.opacity = (0.08 + Math.random() * 0.22).toString();
    container.appendChild(el);
  }
})();

/* ══════════════════════════════════════════
   SKILLS & TECHNOLOGIES — BENTO GRID RENDERER
   ══════════════════════════════════════════ */
(function initSkillsBento() {
  const grid         = document.getElementById('skillsBentoGrid');
  const detailTitle  = document.getElementById('capDetailTitle');
  const detailIcon   = document.getElementById('capDetailIcon');
  const detailDesc   = document.getElementById('capDetailDesc');
  const detailSkills = document.getElementById('capDetailSkills');
  const capWorkflow  = document.getElementById('capWorkflow');
  if (!grid) return;

  function renderDetail(cat) {
    if (detailIcon)   detailIcon.textContent  = cat.icon;
    if (detailTitle)  detailTitle.textContent = cat.name;
    if (detailDesc)   detailDesc.textContent  = cat.desc;

    if (detailSkills) {
      detailSkills.innerHTML = cat.skills.map(s =>
        `<span class="skill-pill">${s}</span>`
      ).join('');
    }

    if (capWorkflow) {
      capWorkflow.innerHTML = `
        <div class="cap-workflow-label">PIPELINE INTEGRATION &nbsp;·&nbsp; ${cat.workflowPos}</div>
        <div class="cap-workflow-steps">
          ${cat.workflow.map(step =>
            step === '→' ? `<span class="wf-arrow">→</span>` :
            `<span class="wf-step">${step}</span>`
          ).join('')}
        </div>`;
    }
  }

  // Populate Bento Grid
  grid.innerHTML = PORTFOLIO_DATA.skills.map((cat, idx) => `
    <div class="bento-skill-card ${idx === 0 ? 'active' : ''}" data-cat-id="${cat.id}" role="button" tabindex="0">
      <div class="bsc-top">
        <span class="bsc-icon">${cat.icon}</span>
        <span class="bsc-badge">${cat.badge}</span>
      </div>
      <h3 class="bsc-title">${cat.name}</h3>
      <p class="bsc-desc">${cat.desc}</p>
      <div class="bsc-pills">
        ${cat.skills.slice(0, 4).map(s => `<span class="bsc-pill">${s}</span>`).join('')}
        ${cat.skills.length > 4 ? `<span class="bsc-pill more">+${cat.skills.length - 4} more</span>` : ''}
      </div>
      <div class="bsc-cta">
        <span>Inspect Pipeline</span>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
    </div>
  `).join('');

  // Click & Keyboard Navigation
  const cards = grid.querySelectorAll('.bento-skill-card');
  cards.forEach((card, idx) => {
    function activate() {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      renderDetail(PORTFOLIO_DATA.skills[idx]);
      // Smooth scroll into detail panel if on mobile
      if (window.innerWidth < 768) {
        document.getElementById('capDetailPanel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
  });

  // Default initial render
  renderDetail(PORTFOLIO_DATA.skills[0]);
})();

/* ══════════════════════════════════════════
   AI LEARNING JOURNEY TIMELINE
   ══════════════════════════════════════════ */
(function initJourney() {
  const container = document.getElementById('journeyPipeline');
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.journey.map((node, idx) => {
    const isLast = idx === PORTFOLIO_DATA.journey.length - 1;
    return `
      <div class="journey-node">
        <div class="journey-node-inner ${idx === 0 ? 'active' : ''}" role="button" tabindex="0">
          <div class="journey-node-icon">
            <span>${node.icon}</span>
            <span class="journey-step-num">${idx + 1}</span>
          </div>
          <div class="journey-node-label">${node.label}</div>
          <div class="journey-node-sub">${node.sub}</div>
          <div class="journey-node-desc">${node.desc}</div>
        </div>
      </div>
      ${!isLast ? `<div class="journey-connector"><div class="jc-line"></div></div>` : ''}
    `;
  }).join('');

  const inners = container.querySelectorAll('.journey-node-inner');
  inners.forEach(inner => {
    inner.addEventListener('click', () => {
      inners.forEach(i => i.classList.remove('active'));
      inner.classList.add('active');
    });
  });
})();

/* ══════════════════════════════════════════
   HOW I BUILD AI SOLUTIONS (Methodology)
   ══════════════════════════════════════════ */
(function initPipeline() {
  const container = document.getElementById('aiPipeline');
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.pipeline.map((stage, idx) => `
    <div class="pipeline-stage ${idx === 0 ? 'active' : ''}" role="button" tabindex="0">
      <div class="ps-connector">
        <div class="ps-dot">${stage.icon}</div>
      </div>
      <div class="ps-body">
        <div class="ps-stage-name">${stage.stage}</div>
        <div class="ps-title">${stage.title}</div>
        <div class="ps-detail">
          <p class="ps-desc">${stage.desc}</p>
          <p class="ps-why">💡 ${stage.why}</p>
          <div class="ps-techs">${stage.techs.map(t => `<span class="ps-tech-tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    </div>
  `).join('');

  const stages = container.querySelectorAll('.pipeline-stage');
  stages.forEach(s => {
    s.addEventListener('click', () => {
      stages.forEach(st => st.classList.remove('active'));
      s.classList.add('active');
    });
  });
})();

/* ══════════════════════════════════════════
   CERTIFICATE LIGHTBOX (Full Uncropped Modal)
   ══════════════════════════════════════════ */
(function initCertLightbox() {
  const modal      = document.getElementById('certModal');
  const orgEl      = document.getElementById('modalCertOrg');
  const titleEl    = document.getElementById('modalCertTitle');
  const issuerEl   = document.getElementById('modalCertIssuer');
  const dateEl     = document.getElementById('modalCertDate');
  const descEl     = document.getElementById('modalCertDesc');
  const imgEl      = document.getElementById('modalCertImg');
  const openOrig   = document.getElementById('modalViewOriginalBtn');
  const closeBtn   = document.getElementById('modalCloseBtn');
  const xCloseBtn  = document.getElementById('modalCertClose');
  if (!modal) return;

  function openLightbox(data) {
    if (orgEl)    orgEl.textContent    = data.org || 'VERIFIED CREDENTIAL';
    if (titleEl)  titleEl.textContent  = data.title || '';
    if (issuerEl) issuerEl.textContent = `Issued by: ${data.org || 'Official Authority'}`;
    if (dateEl)   dateEl.textContent   = data.date ? `Year / Date: ${data.date}` : 'Verified Credential';
    if (descEl)   descEl.textContent   = data.desc || '';

    if (data.image_url) {
      const resolved = window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(data.image_url) : data.image_url;
      imgEl.src = resolved;
      imgEl.style.display = 'block';
      if (openOrig) openOrig.href = resolved;
    } else {
      imgEl.style.display = 'none';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn)  closeBtn.addEventListener('click', closeLightbox);
  if (xCloseBtn) xCloseBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeLightbox();
  });

  // Attach to cert cards
  function bindCertCards() {
    document.querySelectorAll('.cert-card').forEach(card => {
      card.onclick = () => {
        const title = card.querySelector('.cert-title')?.textContent || '';
        const org   = card.querySelector('.cert-org-badge')?.textContent || card.querySelector('.cert-org')?.textContent || '';
        const desc  = card.querySelector('.cert-desc')?.textContent || '';
        const img   = card.querySelector('img')?.getAttribute('src') || '';
        openLightbox({ title, org, desc, date: '2024–2026', image_url: img });
      };
    });
  }
  bindCertCards();
  window.bindCertCards = bindCertCards;
  window.openCertModal = openLightbox;
})();

/* ══════════════════════════════════════════
   RESUME PREVIEW TOGGLE
   ══════════════════════════════════════════ */
(function initResumePreview() {
  const toggleBtn = document.getElementById('toggleResumePreviewBtn');
  const previewCard = document.getElementById('resumePreviewCard');
  if (!toggleBtn || !previewCard) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = previewCard.style.display === 'none';
    previewCard.style.display = isHidden ? 'flex' : 'none';
    toggleBtn.innerHTML = isHidden 
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg><span>Hide Preview</span>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg><span>Toggle Preview</span>`;
    if (isHidden) {
      previewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
})();

/* ══════════════════════════════════════════
   CONTACT FORM HANDLER (Connected to Backend)
   ══════════════════════════════════════════ */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const notice = document.getElementById('formNotice');
  const btn    = document.getElementById('contactSubmitBtn');
  if (!form) return;

  const API_BASE = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.API_BASE) || 'http://localhost:8000';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = form.querySelector('#contactName').value.trim();
    const email   = form.querySelector('#contactEmail').value.trim();
    const subject = form.querySelector('#contactSubject').value.trim();
    const message = form.querySelector('#contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      notice.textContent = 'Please complete all required fields.';
      notice.className   = 'form-notice error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notice.textContent = 'Please enter a valid email address.';
      notice.className   = 'form-notice error';
      return;
    }

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Transmitting message...`;
    notice.textContent = '';
    notice.className = 'form-notice';

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (res.ok) {
        notice.textContent = '✅ Message transmitted successfully! Stored in database and visible to admin.';
        notice.className   = 'form-notice success';
        form.reset();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to submit message to server.');
      }
    } catch (err) {
      notice.textContent = `⚠️ Submission notice: ${err.message}. If backend is warming up, please retry shortly or email directly to balavicky3011@gmail.com.`;
      notice.className = 'form-notice error';
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
})();

/* ══════════════════════════════════════════
   SCROLL REVEAL OBSERVER & ANIMATION ENGINE
   ══════════════════════════════════════════ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  function revealElement(el) {
    el.classList.add('revealed');
  }

  // 1. Immediately reveal all hero elements and anything already within viewport
  elements.forEach(el => {
    if (el.closest('#home')) {
      revealElement(el);
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight || document.documentElement.clientHeight) + 80) {
      revealElement(el);
    }
  });

  // 2. Setup IntersectionObserver for smooth scroll-triggered reveals
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    elements.forEach(revealElement);
  }

  // 3. Absolute fail-safe: reveal all elements after a short timeout so content is never hidden
  setTimeout(() => {
    elements.forEach(revealElement);
  }, 750);
})();

/* ══════════════════════════════════════════
   DYNAMIC BACKEND HYDRATION (Sync with API)
   ══════════════════════════════════════════ */
(async function syncWithBackend() {
  const API_BASE = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.API_BASE) || 'http://localhost:8000';

  try {
    const health = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!health.ok) return;

    // 1. Sync Profile & Contact Details
    try {
      const pRes = await fetch(`${API_BASE}/api/profile`);
      if (pRes.ok) {
        const p = await pRes.json();
        
        // Full Name synchronization
        if (p.full_name) {
          const parts = p.full_name.trim().split(' ');
          const first = parts.slice(0, -1).join(' ') || parts[0];
          const last = parts.length > 1 ? parts[parts.length - 1] : '';
          
          const nameFirst = document.querySelector('.name-first');
          const nameLast  = document.querySelector('.name-last');
          if (nameFirst) nameFirst.textContent = first;
          if (nameLast)  nameLast.textContent  = last;

          document.querySelectorAll('.hero-identity-name, .footer-name, .resume-name').forEach(el => {
            el.textContent = p.full_name;
          });
          document.title = `${p.full_name} | Aspiring AI & Machine Learning Engineer | Portfolio`;
        }

        // Headline & Title
        if (p.headline) {
          const heroTitle = document.querySelector('.hero-title');
          if (heroTitle) heroTitle.textContent = p.headline;
          const heroIdTag = document.querySelector('.hero-identity-tag');
          if (heroIdTag) heroIdTag.textContent = p.headline.split('|')[0].trim();
        }

        // About Bio
        if (p.about_text) {
          const aboutBody = document.querySelector('.about-body');
          if (aboutBody) {
            aboutBody.innerHTML = `<p>${p.about_text}</p><p>My engineering focus is on developing practical, reliable, and intelligent solutions that solve tangible problems across computer vision, machine learning, and generative AI.</p>`;
          }
        }

        // Profile Photo
        if (p.profile_image_url) {
          const formatted = window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(p.profile_image_url) : p.profile_image_url;
          document.querySelectorAll('#profilePhoto, #heroProfilePhoto').forEach(img => {
            img.src = formatted;
          });
        }

        // Email Links & Text
        if (p.email) {
          document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.href = `mailto:${p.email}`;
            const span = link.querySelector('span');
            if (span && span.textContent.includes('@')) span.textContent = p.email;
          });
        }

        // Phone Links & Text
        if (p.phone) {
          const cleanPhone = p.phone.replace(/\s+/g, '');
          document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.href = `tel:${cleanPhone}`;
            const span = link.querySelector('span');
            if (span && span.textContent.includes('+')) span.textContent = p.phone;
          });
        }

        // Location Tags
        if (p.location) {
          document.querySelectorAll('.photo-tag span:last-child, .contact-chip.no-hover span, .ci-value').forEach(el => {
            if (el.textContent.includes('Madurai') || el.closest('.contact-info-card')) {
              el.textContent = p.location;
            }
          });
        }
      }
    } catch (_) {}

    // 2. Sync Resume Link & Viewer
    try {
      const rRes = await fetch(`${API_BASE}/api/resume`);
      if (rRes.ok) {
        const r = await rRes.json();
        if (r.url) {
          const formatted = window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(r.url) : r.url;
          const resumeLinks = document.querySelectorAll('a[href*="Resume"], a[href*="resume"]');
          resumeLinks.forEach(link => { link.href = formatted; });
          const pdfFrame = document.querySelector('.resume-pdf-frame');
          if (pdfFrame) pdfFrame.src = `${formatted}#toolbar=0&navpanes=0`;
        }
      }
    } catch (_) {}

    // 3. Sync Dynamic Certifications
    try {
      const cRes = await fetch(`${API_BASE}/api/certifications`);
      if (cRes.ok) {
        const certs = await cRes.json();
        if (certs && certs.length > 0) {
          const gallery = document.getElementById('certGallery');
          if (gallery) {
            gallery.innerHTML = certs.map((c, idx) => {
              const imgSrc = c.image_url ? (window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.formatMediaUrl(c.image_url) : c.image_url) : '';
              const dateStr = c.date_obtained || '2024–2026';
              return `
              <div class="cert-card" data-cert="${idx}">
                <div class="cert-card-inner">
                  <div class="cert-org-badge">${c.organization || ''}</div>
                  <div class="cert-thumb-wrapper">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${c.title || 'Certificate'}" class="cert-thumb-img" loading="lazy" />` : `
                    <div class="cert-thumb-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    </div>`}
                    <div class="cert-hover-hint">🔍 Click to Preview</div>
                  </div>
                  <div class="cert-info">
                    <h4 class="cert-title">${c.title || ''}</h4>
                    <span class="cert-org">${c.organization || ''} &nbsp;·&nbsp; ${dateStr}</span>
                    <p class="cert-desc">${c.description || ''}</p>
                  </div>
                </div>
              </div>`;
            }).join('');
            if (window.bindCertCards) window.bindCertCards();
          }
        }
      }
    } catch (_) {}

    // 4. Sync Dynamic Projects
    try {
      const projRes = await fetch(`${API_BASE}/api/projects`);
      if (projRes.ok) {
        const projs = await projRes.json();
        if (projs && projs.length > 0) {
          const showcase = document.getElementById('projectsShowcase');
          if (showcase) {
            showcase.innerHTML = projs.map((p, idx) => {
              const isReverse = idx % 2 === 1 ? ' reverse' : '';
              const num = String(idx + 1).padStart(2, '0');
              const techs = Array.isArray(p.technologies) ? p.technologies : [];
              const techBadges = techs.map(t => `<span class="tech-tag">${t}</span>`).join('\n                ');
              const liveBtn = p.live_url ? `
                <a href="${p.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  <span>Launch Live Demo</span>
                </a>` : '';
              const gitBtn = p.github_url ? `
                <a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.025 2.75-1.025.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0022 12c0-5.525-4.475-10-10-10z"/></svg>
                  <span>GitHub Repository</span>
                </a>` : '';

              return `
              <article class="project-case" id="project${p.id}">
                <div class="project-case-inner${isReverse}">
                  <div class="project-meta-col">
                    <div class="project-top-row">
                      <span class="project-number">${num}</span>
                      <span class="project-category-tag">${p.category || 'AI / Machine Learning'}</span>
                      <span class="project-live-indicator">● Deployed on Render</span>
                    </div>

                    <h3 class="project-title">${p.title || p.name || 'Untitled Project'}</h3>

                    <p class="project-brief">${p.description || p.brief || ''}</p>

                    <div class="project-tech-stack">
                      ${techBadges}
                    </div>

                    <div class="project-actions">
                      ${liveBtn}
                      ${gitBtn}
                    </div>
                  </div>

                  <div class="project-visual-col">
                    <div class="project-pipeline-vis">
                      <div class="pipeline-label">Architecture &amp; Pipeline Execution</div>
                      <div class="pp-steps">
                        <div class="pp-step active-step">
                          <div class="pp-step-icon">🎯</div>
                          <div class="pp-step-text">
                            <strong>Problem Statement</strong>
                            <span>${p.problem || 'Complex problem requiring targeted AI automation and scalable data engineering.'}</span>
                          </div>
                        </div>
                        <div class="pp-arrow">↓</div>
                        <div class="pp-step">
                          <div class="pp-step-icon">⚡</div>
                          <div class="pp-step-text">
                            <strong>System Architecture</strong>
                            <span>Engineered with ${techs.slice(0, 3).join(', ') || 'modern AI and backend frameworks'}.</span>
                          </div>
                        </div>
                        <div class="pp-arrow">↓</div>
                        <div class="pp-step result-step">
                          <div class="pp-step-icon">✅</div>
                          <div class="pp-step-text">
                            <strong>Production Outcome</strong>
                            <span>${p.result || 'Deployed and verified with high reliability, performance, and responsive UI.'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>`;
            }).join('\n');
          }
        }
      }
    } catch (_) {}

  } catch (_) {
    // Offline resilient fallback - static HTML preserved intact
  }
})();
