/* ==========================================================================
   CODEATLAS — APPLICATION CONTROLLER & INTERACTION ENGINE (js/main.js)
   ========================================================================== */

window.CodeAtlasApp = (function () {
  let atlasInstance = null;
  let heroInstance = null;
  let currentView = "home";
  let activeLibCategory = "All";
  let activeLibSearch = "";
  let activeExplorePathId = "ai-ml";
  let quizState = { index: 0, score: 0, answered: false };

  function showToast(message) {
    let toast = document.getElementById("ca-global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "ca-global-toast";
      toast.className = "ca-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="status-dot"></span><span>${message}</span>`;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ========================================================================
     NAVIGATION & AUTHENTICATION BAR RENDERER
     ======================================================================== */
  function updateAuthUI() {
    const session = window.CodeAtlasStore.getSession();
    const isAdmin = window.CodeAtlasStore.isAdmin();
    const authContainers = document.querySelectorAll("[data-auth-slot]");
    authContainers.forEach(slot => {
      if (session) {
        slot.innerHTML = `
          ${isAdmin ? `
            <a href="admin.html" data-route="admin" class="btn btn-ghost btn-sm font-mono" style="color:var(--accent-primary);border:1px solid rgba(0,240,255,0.35);">
              <span>[ADMIN CONSOLE]</span>
            </a>
          ` : ""}
          <a href="profile.html" data-route="user-profile" class="btn btn-secondary btn-sm" title="Developer Telemetry Profile">
            <span style="width:8px;height:8px;border-radius:50%;background:${isAdmin ? "var(--accent-primary)" : "var(--status-success)"};"></span>
            <span>${escapeHtml(session.fullName || session.email.split("@")[0])}</span>
            <span class="font-mono" style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;">${isAdmin ? "ADMIN" : "DEV"}</span>
          </a>
          <button type="button" data-action="logout" class="btn btn-ghost btn-sm">Sign Out</button>
        `;
      } else {
        slot.innerHTML = `
          <a href="login.html" data-route="login" class="btn btn-secondary btn-sm">Sign In</a>
          <a href="atlas.html" data-route="atlas" class="btn btn-primary btn-sm">Explore Atlas</a>
        `;
      }
    });
  }

  /* ========================================================================
     HYBRID ROUTER (Supports SPA View Switching & Multi-Page URLs)
     ======================================================================== */
  function navigateTo(viewName, params = {}, pushHistory = true) {
    const targetEl = document.getElementById(`view-${viewName}`);
    if (!targetEl) {
      // If on a standalone page without embedded views, redirect cleanly
      const map = {
        "home": "index.html",
        "atlas": "atlas.html",
        "languages": "languages.html",
        "lang-profile": `profile.html?lang=${params.lang || "python"}`,
        "timeline": "timeline.html",
        "compare": "compare.html",
        "explore": "explore.html",
        "quiz": "quiz.html",
        "login": "login.html",
        "user-profile": "profile.html",
        "admin": "admin.html"
      };
      window.location.href = map[viewName] || "index.html";
      return;
    }

    currentView = viewName;
    document.querySelectorAll(".ca-view").forEach(v => v.classList.remove("active"));
    targetEl.classList.add("active");

    // Highlight active nav item
    document.querySelectorAll(".ca-nav-link").forEach(link => {
      const linkRoute = link.getAttribute("data-route");
      link.classList.toggle("active", linkRoute === viewName || (viewName === "lang-profile" && linkRoute === "languages"));
    });

    // Close mobile drawer if open
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.remove("open");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "instant" });

    // Trigger view-specific hydration
    if (viewName === "atlas") {
      setTimeout(() => {
        if (!atlasInstance) {
          atlasInstance = window.CodeAtlasGraph.initAtlasWorkbench({
            canvasId: "atlas-canvas",
            initialLangId: params.lang || "python",
            onSelect: renderAtlasInspector
          });
        } else {
          atlasInstance.refreshData();
          if (params.lang) atlasInstance.selectNode(params.lang, true);
        }
        renderAccessibleAtlasMatrix();
      }, 30);
    } else if (viewName === "languages") {
      renderLanguagesGrid();
    } else if (viewName === "lang-profile") {
      renderLanguageProfile(params.lang || "python");
    } else if (viewName === "timeline") {
      renderTimeline();
    } else if (viewName === "compare") {
      initCompareSelectors(params.langA, params.langB);
    } else if (viewName === "explore") {
      renderExplorePaths(params.pathId || activeExplorePathId);
    } else if (viewName === "quiz") {
      renderQuizStep();
    } else if (viewName === "user-profile") {
      renderUserProfileDashboard();
    } else if (viewName === "admin") {
      renderAdminConsole();
    }

    // GSAP subtle entrance animation
    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(targetEl, { opacity: 0.2, y: 8 }, { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" });
    }

    // Update document title for SEO & clarity
    const titles = {
      "home": "CodeAtlas — Explore the Programming Language Universe",
      "atlas": "Interactive Spatial Atlas — CodeAtlas",
      "languages": "Language Library & Catalogue — CodeAtlas",
      "lang-profile": `Language Dossier (${(params.lang || "Python").toUpperCase()}) — CodeAtlas`,
      "timeline": "Programming Evolution Timeline (1957–2026) — CodeAtlas",
      "compare": "Side-by-Side Language Comparison — CodeAtlas",
      "explore": "Curated Domain Learning Paths — CodeAtlas",
      "quiz": "Interactive Architecture Quiz — CodeAtlas",
      "login": "Developer Sign In — CodeAtlas",
      "user-profile": "Explorer Telemetry Profile — CodeAtlas",
      "admin": "Admin Console & Content Control — CodeAtlas"
    };
    document.title = titles[viewName] || titles.home;
  }

  /* ========================================================================
     HOME PAGE FEATURED LANGUAGES & MINI PATH
     ======================================================================== */
  function renderHomeFeatured() {
    const grid = document.getElementById("home-featured-grid");
    if (!grid) return;
    const featuredIds = ["python", "javascript", "c", "cpp"];
    const langs = window.CodeAtlasStore.getLanguages().filter(l => featuredIds.includes(l.id));

    grid.innerHTML = langs.map(l => `
      <article class="ca-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:1.15rem;">
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
            <div class="lang-mark">${l.mark}</div>
            <div style="display:flex;align-items:center;gap:0.45rem;">
              <span class="ca-badge" data-cat="${l.category}"><span class="ca-badge-dot"></span>${l.category}</span>
              <span class="font-mono" style="font-size:0.75rem;color:var(--text-muted);">${l.year}</span>
            </div>
          </div>
          <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.45rem;">${l.name}</h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.55;">${l.description}</p>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:0.9rem;border-top:1px solid rgba(30,41,59,0.6);">
          <button type="button" class="btn btn-secondary btn-sm" data-open-lang="${l.id}">Explore Dossier →</button>
          <button type="button" class="btn btn-ghost btn-sm font-mono" data-open-atlas="${l.id}">Locate in Atlas</button>
        </div>
      </article>
    `).join("");
  }

  /* ========================================================================
     ATLAS RIGHT-HAND DOSSIER INSPECTOR & ACCESSIBLE MATRIX
     ======================================================================== */
  function renderAtlasInspector(lang) {
    const container = document.getElementById("atlas-inspector-content");
    if (!container || !lang) return;

    const allLangs = window.CodeAtlasStore.getLanguages();
    const relatedBadges = (lang.related || []).map(relId => {
      const r = allLangs.find(x => x.id === relId);
      if (!r) return "";
      return `<button type="button" class="filter-pill" data-atlas-select="${r.id}" title="Select ${r.name} in Atlas">${r.mark} • ${r.name}</button>`;
    }).join("");

    container.innerHTML = `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;">
        <div style="display:flex;align-items:center;gap:0.85rem;">
          <div class="lang-mark lang-mark-lg">${lang.mark}</div>
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">
              <span class="ca-badge" data-cat="${lang.category}"><span class="ca-badge-dot"></span>${lang.category}</span>
              <span class="font-mono" style="font-size:0.75rem;color:var(--accent-primary);">EST. ${lang.year}</span>
            </div>
            <h2 style="font-size:1.5rem;font-weight:700;">${lang.name}</h2>
          </div>
        </div>
      </div>

      <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.6;">${lang.description}</p>

      <div class="inspector-stat-grid">
        <div class="inspector-stat-box">
          <div class="inspector-stat-label">Creator / Origin</div>
          <div class="inspector-stat-val">${lang.creator}</div>
        </div>
        <div class="inspector-stat-box">
          <div class="inspector-stat-label">Creation Year</div>
          <div class="inspector-stat-val font-mono">${lang.year}</div>
        </div>
        <div class="inspector-stat-box">
          <div class="inspector-stat-label">Paradigm</div>
          <div class="inspector-stat-val">${lang.paradigm}</div>
        </div>
        <div class="inspector-stat-box">
          <div class="inspector-stat-label">Typing Discipline</div>
          <div class="inspector-stat-val">${lang.typing}</div>
        </div>
      </div>

      <div class="inspector-stat-box">
        <div class="inspector-stat-label">Execution Model</div>
        <div class="inspector-stat-val">${lang.execution}</div>
      </div>

      <div>
        <div class="inspector-stat-label" style="margin-bottom:0.45rem;">Primary Use Cases</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          ${(lang.uses || []).map(u => `<span class="ca-badge">${u}</span>`).join("")}
        </div>
      </div>

      <div>
        <div class="inspector-stat-label" style="margin-bottom:0.45rem;">Syntax Telemetry Sample</div>
        <pre class="ca-code-block"><code>${escapeHtml(lang.syntax)}</code></pre>
      </div>

      <div>
        <div class="inspector-stat-label" style="margin-bottom:0.45rem;">Connected Lineage Nodes (Click to Focus)</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          ${relatedBadges || '<span class="text-muted">Independent node</span>'}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;padding-top:0.5rem;">
        <button type="button" class="btn btn-primary btn-sm" data-open-lang="${lang.id}">Full Language Profile</button>
        <button type="button" class="btn btn-secondary btn-sm" data-compare-lang="${lang.id}">Compare Language</button>
      </div>
    `;
  }

  function renderAccessibleAtlasMatrix() {
    const matrixBox = document.getElementById("atlas-accessible-matrix-body");
    if (!matrixBox) return;
    const langs = window.CodeAtlasStore.getLanguages();
    matrixBox.innerHTML = langs.map(l => `
      <div class="ca-card" style="padding:1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div class="lang-mark">${l.mark}</div>
          <div>
            <div style="font-weight:600;color:var(--text-primary);">${l.name} <span class="font-mono" style="font-size:0.75rem;color:var(--text-muted);">(${l.year})</span></div>
            <div style="font-size:0.78rem;color:var(--text-secondary);">${l.category} • Related: ${(l.related || []).join(", ").toUpperCase()}</div>
          </div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" data-atlas-select="${l.id}">Inspect Node</button>
      </div>
    `).join("");
  }

  /* ========================================================================
     LANGUAGES LIBRARY PAGE (/languages.html & #view-languages)
     ======================================================================== */
  function renderLanguagesGrid() {
    const grid = document.getElementById("languages-library-grid");
    const emptyState = document.getElementById("languages-empty-state");
    const countLabel = document.getElementById("languages-count-label");
    if (!grid) return;

    const q = activeLibSearch.toLowerCase().trim();
    const langs = window.CodeAtlasStore.getLanguages().filter(l => {
      const catMatch = activeLibCategory === "All" || l.category.toLowerCase() === activeLibCategory.toLowerCase();
      const qMatch = !q ||
        l.name.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        String(l.year).includes(q) ||
        (l.uses || []).some(u => u.toLowerCase().includes(q));
      return catMatch && qMatch;
    });

    if (countLabel) {
      countLabel.textContent = `Showing ${langs.length} of ${window.CodeAtlasStore.getLanguages().length} languages`;
    }

    if (langs.length === 0) {
      grid.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    grid.style.display = "grid";

    grid.innerHTML = langs.map(l => `
      <article class="ca-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:1.25rem;">
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
            <div class="lang-mark">${l.mark}</div>
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <span class="ca-badge" data-cat="${l.category}"><span class="ca-badge-dot"></span>${l.category}</span>
              <span class="font-mono" style="font-size:0.76rem;color:var(--text-muted);">${l.year}</span>
            </div>
          </div>
          <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:0.4rem;">${l.name}</h3>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;">${l.description}</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
            ${(l.uses || []).slice(0, 3).map(u => `<span class="ca-badge" style="font-size:0.68rem;">${u}</span>`).join("")}
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:0.9rem;border-top:1px solid rgba(30,41,59,0.6);">
          <button type="button" class="btn btn-primary btn-sm" data-open-lang="${l.id}">Explore Profile</button>
          <div style="display:flex;gap:0.35rem;">
            <button type="button" class="btn btn-secondary btn-sm" data-open-atlas="${l.id}" title="View in Spatial Atlas">Atlas</button>
            <button type="button" class="btn btn-ghost btn-sm" data-compare-lang="${l.id}" title="Compare Language">Compare</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  /* ========================================================================
     LANGUAGE PROFILE DOSSIER (profile.html?lang=python & #view-lang-profile)
     ======================================================================== */
  function renderLanguageProfile(langId) {
    const container = document.getElementById("lang-profile-container");
    if (!container) return;

    const lang = window.CodeAtlasStore.getLanguageById(langId);
    if (!lang) {
      container.innerHTML = `
        <div class="ca-card" style="text-align:center;padding:4rem 2rem;max-width:560px;margin:3rem auto;">
          <div class="eyebrow" style="margin-bottom:1rem;">TELEMETRY 404</div>
          <h2 style="font-size:2rem;margin-bottom:0.75rem;">Language not found</h2>
          <p style="color:var(--text-secondary);margin-bottom:1.75rem;">The requested language coordinate ("${escapeHtml(String(langId))}") does not exist in the active CodeAtlas dataset.</p>
          <button type="button" class="btn btn-primary" data-route="atlas">← Back to Atlas</button>
        </div>
      `;
      return;
    }

    window.CodeAtlasStore.recordLanguageExplored(lang.id, lang.name);
    const allLangs = window.CodeAtlasStore.getLanguages();
    const relatedCards = (lang.related || []).map(rid => {
      const r = allLangs.find(x => x.id === rid);
      if (!r) return "";
      return `
        <div class="ca-card" style="padding:1.1rem;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <div class="lang-mark">${r.mark}</div>
            <div>
              <div style="font-weight:600;">${r.name}</div>
              <div class="font-mono" style="font-size:0.72rem;color:var(--text-muted);">${r.category} • ${r.year}</div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-open-lang="${r.id}">Inspect →</button>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div style="margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <button type="button" class="btn btn-secondary btn-sm" data-route="languages">← Back to Language Library</button>
        <div style="display:flex;gap:0.6rem;">
          <button type="button" class="btn btn-secondary btn-sm" data-open-atlas="${lang.id}">Locate in 3D Atlas</button>
          <button type="button" class="btn btn-primary btn-sm" data-compare-lang="${lang.id}">Compare ${lang.name} vs Another</button>
        </div>
      </div>

      <div class="ca-card" style="padding:2.25rem;margin-bottom:1.75rem;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;margin-bottom:1.75rem;">
          <div style="display:flex;align-items:center;gap:1.25rem;">
            <div class="lang-mark lang-mark-lg" style="width:72px;height:72px;font-size:1.5rem;">${lang.mark}</div>
            <div>
              <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.4rem;">
                <span class="ca-badge" data-cat="${lang.category}"><span class="ca-badge-dot"></span>${lang.category}</span>
                <span class="font-mono" style="font-size:0.8rem;color:var(--accent-primary);">CREATION YEAR: ${lang.year}</span>
              </div>
              <h1 style="font-size:2.5rem;font-weight:800;">${lang.name}</h1>
              <div style="color:var(--text-secondary);font-size:0.95rem;margin-top:0.25rem;">Created by <strong style="color:var(--text-primary);">${lang.creator}</strong></div>
            </div>
          </div>
        </div>

        <p style="font-size:1.08rem;color:var(--text-primary);line-height:1.7;max-width:880px;margin-bottom:2rem;">${lang.description}</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
          <div class="inspector-stat-box">
            <div class="inspector-stat-label">Paradigm Architecture</div>
            <div class="inspector-stat-val">${lang.paradigm}</div>
          </div>
          <div class="inspector-stat-box">
            <div class="inspector-stat-label">Typing Discipline</div>
            <div class="inspector-stat-val">${lang.typing}</div>
          </div>
          <div class="inspector-stat-box">
            <div class="inspector-stat-label">Execution Model</div>
            <div class="inspector-stat-val">${lang.execution}</div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;margin-bottom:1.75rem;">
        <div class="ca-card">
          <div class="eyebrow" style="margin-bottom:0.75rem;">WHERE IT IS USED</div>
          <h3 style="font-size:1.25rem;margin-bottom:1rem;">Production Domains & Ecosystems</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;">
            ${(lang.uses || []).map(u => `<span class="ca-badge" style="padding:0.35rem 0.75rem;font-size:0.8rem;">${u}</span>`).join("")}
          </div>
          <div class="inspector-stat-label" style="margin-bottom:0.5rem;">Core Ecosystem Frameworks & Tooling</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
            ${(lang.ecosystem || ["Standard Library", "CLI Compiler", "Package Manager"]).map(e => `<span class="ca-badge" style="border-color:var(--accent-secondary);color:#C4B5FD;">${e}</span>`).join("")}
          </div>
        </div>

        <div class="ca-card">
          <div class="eyebrow" style="margin-bottom:0.75rem;">SYNTAX TELEMETRY</div>
          <h3 style="font-size:1.25rem;margin-bottom:1rem;">Canonical Code Structure</h3>
          <pre class="ca-code-block"><code>${escapeHtml(lang.syntax)}</code></pre>
          <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:0.9rem;"><strong>Learning Context:</strong> ${lang.learningConsiderations || ""}</p>
        </div>
      </div>

      <div class="ca-card">
        <div class="eyebrow" style="margin-bottom:0.6rem;">GENEALOGY & LINEAGE</div>
        <h3 style="font-size:1.25rem;margin-bottom:1rem;">Related & Connected Languages</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;">
          ${relatedCards}
        </div>
      </div>
    `;
  }

  /* ========================================================================
     TIMELINE MODULE (/timeline.html & #view-timeline)
     ======================================================================== */
  function renderTimeline(decadeFilter = "all") {
    const container = document.getElementById("timeline-stream");
    if (!container) return;

    const events = window.CODEATLAS_TIMELINE.filter(ev => {
      if (decadeFilter === "all") return true;
      if (decadeFilter === "early") return ev.year < 1980;
      if (decadeFilter === "80s90s") return ev.year >= 1980 && ev.year < 2000;
      if (decadeFilter === "modern") return ev.year >= 2000;
      return true;
    });

    container.innerHTML = events.map((ev, idx) => `
      <div class="ca-card" style="display:grid;grid-template-columns:110px 1fr auto;align-items:center;gap:1.5rem;padding:1.4rem 1.75rem;">
        <div>
          <div class="font-mono" style="font-size:1.65rem;font-weight:700;color:var(--accent-primary);line-height:1;">${ev.year}</div>
          <div class="font-mono" style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">MILESTONE ${String(idx + 1).padStart(2, "0")}</div>
        </div>
        <div>
          <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.3rem;">${ev.language}</h3>
          <p style="font-size:0.88rem;color:var(--text-secondary);">${ev.context}</p>
        </div>
        <div>
          <button type="button" class="btn btn-secondary btn-sm" data-open-lang="${ev.langId}">Explore →</button>
        </div>
      </div>
    `).join("");
  }

  /* ========================================================================
     COMPARE LANGUAGES ENGINE (/compare.html & #view-compare)
     ======================================================================== */
  function initCompareSelectors(langAId = "python", langBId = "rust") {
    const selA = document.getElementById("compare-select-a");
    const selB = document.getElementById("compare-select-b");
    if (!selA || !selB) return;

    const langs = window.CodeAtlasStore.getLanguages();
    const optsHtml = langs.map(l => `<option value="${l.id}">${l.name} (${l.year} • ${l.category})</option>`).join("");
    selA.innerHTML = optsHtml;
    selB.innerHTML = optsHtml;

    selA.value = langs.some(l => l.id === langAId) ? langAId : "python";
    selB.value = langs.some(l => l.id === langBId) ? langBId : (selA.value === "rust" ? "typescript" : "rust");

    renderCompareMatrix(selA.value, selB.value);
  }

  function renderCompareMatrix(idA, idB) {
    const output = document.getElementById("compare-matrix-output");
    if (!output) return;

    const a = window.CodeAtlasStore.getLanguageById(idA) || window.CodeAtlasStore.getLanguages()[0];
    const b = window.CodeAtlasStore.getLanguageById(idB) || window.CodeAtlasStore.getLanguages()[1];

    const rows = [
      { label: "Creation Year", valA: `${a.year}`, valB: `${b.year}`, mono: true },
      { label: "Creator / Origin", valA: a.creator, valB: b.creator },
      { label: "Primary Domain Category", valA: `<span class="ca-badge" data-cat="${a.category}">${a.category}</span>`, valB: `<span class="ca-badge" data-cat="${b.category}">${b.category}</span>` },
      { label: "Programming Paradigm", valA: a.paradigm, valB: b.paradigm },
      { label: "Typing Discipline", valA: a.typing, valB: b.typing },
      { label: "Execution Architecture", valA: a.execution, valB: b.execution },
      { label: "Typical Production Domains", valA: (a.uses || []).join(" • "), valB: (b.uses || []).join(" • ") },
      { label: "Core Ecosystem & Tooling", valA: (a.ecosystem || []).join(", "), valB: (b.ecosystem || []).join(", ") },
      { label: "Learning Considerations", valA: a.learningConsiderations, valB: b.learningConsiderations }
    ];

    output.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-bottom:1.5rem;">
        <div class="ca-card" style="border-color:rgba(0,240,255,0.35);">
          <div style="display:flex;align-items:center;gap:0.9rem;margin-bottom:0.75rem;">
            <div class="lang-mark lang-mark-lg">${a.mark}</div>
            <div>
              <div class="font-mono" style="font-size:0.72rem;color:var(--accent-primary);">LANGUAGE A</div>
              <h3 style="font-size:1.5rem;font-weight:700;">${a.name}</h3>
            </div>
          </div>
          <p style="font-size:0.86rem;color:var(--text-secondary);">${a.description}</p>
        </div>

        <div class="ca-card" style="border-color:rgba(139,92,246,0.4);">
          <div style="display:flex;align-items:center;gap:0.9rem;margin-bottom:0.75rem;">
            <div class="lang-mark lang-mark-lg" style="color:#C4B5FD;">${b.mark}</div>
            <div>
              <div class="font-mono" style="font-size:0.72rem;color:#C4B5FD;">LANGUAGE B</div>
              <h3 style="font-size:1.5rem;font-weight:700;">${b.name}</h3>
            </div>
          </div>
          <p style="font-size:0.86rem;color:var(--text-secondary);">${b.description}</p>
        </div>
      </div>

      <div class="ca-table-wrap" style="margin-bottom:1.5rem;">
        <table class="ca-table">
          <thead>
            <tr>
              <th style="width:24%;">Architectural Dimension</th>
              <th style="width:38%;color:var(--accent-primary);">${a.name}</th>
              <th style="width:38%;color:#C4B5FD;">${b.name}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td class="font-mono" style="font-size:0.76rem;color:var(--text-muted);">${r.label}</td>
                <td class="${r.mono ? "font-mono" : ""}" style="color:var(--text-primary);">${r.valA}</td>
                <td class="${r.mono ? "font-mono" : ""}" style="color:var(--text-primary);">${r.valB}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;">
        <div class="ca-card">
          <div class="ca-code-header"><span>${a.name} Syntax Style</span><span>${a.year}</span></div>
          <pre class="ca-code-block"><code>${escapeHtml(a.syntax)}</code></pre>
        </div>
        <div class="ca-card">
          <div class="ca-code-header"><span>${b.name} Syntax Style</span><span>${b.year}</span></div>
          <pre class="ca-code-block"><code>${escapeHtml(b.syntax)}</code></pre>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     EXPLORE LEARNING PATHS (/explore.html & #view-explore)
     ======================================================================== */
  function renderExplorePaths(selectedPathId) {
    activeExplorePathId = selectedPathId || "ai-ml";
    const selectorGrid = document.getElementById("explore-domain-cards");
    const routeViewport = document.getElementById("explore-route-viewport");
    if (!selectorGrid || !routeViewport) return;

    const paths = window.CODEATLAS_PATHS;
    selectorGrid.innerHTML = paths.map(p => {
      const isAct = p.id === activeExplorePathId;
      return `
        <button type="button" class="ca-card" data-select-path="${p.id}" style="text-align:left;cursor:pointer;border-color:${isAct ? "var(--accent-primary)" : "var(--border-subtle)"};background:${isAct ? "rgba(0,240,255,0.06)" : "var(--bg-surface)"};">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.65rem;">
            <span class="ca-badge" data-cat="${p.badge}">${p.badge}</span>
            <span class="font-mono" style="font-size:0.72rem;color:${isAct ? "var(--accent-primary)" : "var(--text-muted)"};">${isAct ? "ACTIVE ROUTE" : "SELECT ROUTE"}</span>
          </div>
          <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.25rem;">${p.title}</h3>
          <div style="font-size:0.8rem;color:var(--text-secondary);">${p.subtitle}</div>
        </button>
      `;
    }).join("");

    const activePath = paths.find(p => p.id === activeExplorePathId) || paths[0];
    window.CodeAtlasStore.recordLearningPath(activePath.title);

    routeViewport.innerHTML = `
      <div class="ca-card" style="padding:2rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border-subtle);">
          <div>
            <div class="eyebrow" style="margin-bottom:0.4rem;">ARCHITECTURAL CURRICULUM</div>
            <h2 style="font-size:1.75rem;font-weight:800;">${activePath.title}: ${activePath.subtitle}</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.3rem;">${activePath.summary}</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-open-lang="${activePath.primaryLang}">Inspect Anchor Language →</button>
        </div>

        <div style="max-width:680px;margin:0 auto;">
          ${activePath.steps.map((s, idx) => `
            <div class="ca-card" style="background:var(--bg-elevated);padding:1.2rem 1.5rem;display:flex;align-items:flex-start;gap:1.15rem;">
              <div class="lang-mark" style="color:var(--accent-primary);border-color:rgba(0,240,255,0.35);">${s.step}</div>
              <div>
                <h4 style="font-size:1.08rem;font-weight:700;margin-bottom:0.25rem;">${s.tech}</h4>
                <p style="font-size:0.86rem;color:var(--text-secondary);">${s.purpose}</p>
              </div>
            </div>
            ${idx < activePath.steps.length - 1 ? `<div class="path-step-connector"></div>` : ""}
          `).join("")}
        </div>
      </div>
    `;
  }

  /* ========================================================================
     INTERACTIVE QUIZ ENGINE (/quiz.html & #view-quiz)
     ======================================================================== */
  function renderQuizStep() {
    const container = document.getElementById("quiz-stage-container");
    if (!container) return;

    const questions = window.CodeAtlasStore.getQuizQuestions();
    if (quizState.index >= questions.length) {
      window.CodeAtlasStore.recordQuizAttempt(quizState.score, questions.length);
      container.innerHTML = `
        <div class="ca-card" style="padding:2.75rem;text-align:center;max-width:620px;margin:0 auto;">
          <div class="eyebrow" style="margin-bottom:0.75rem;">ASSESSMENT VERIFIED</div>
          <h2 style="font-size:2.25rem;font-weight:800;margin-bottom:0.5rem;">Atlas Complete</h2>
          <p style="color:var(--text-secondary);margin-bottom:1.75rem;">Your architectural telemetry score has been recorded in your local explorer profile.</p>
          <div style="background:var(--bg-elevated);border:1px solid var(--accent-primary);border-radius:var(--radius-md);padding:1.5rem;margin-bottom:2rem;">
            <div class="font-mono" style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;">Final Score</div>
            <div class="font-mono" style="font-size:3rem;font-weight:700;color:var(--accent-primary);">${quizState.score} / ${questions.length}</div>
            <div style="font-size:0.88rem;color:var(--text-secondary);">${Math.round((quizState.score / questions.length) * 100)}% Accuracy Verified</div>
          </div>
          <div style="display:flex;justify-content:center;gap:0.85rem;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" id="btn-quiz-restart">Try Again</button>
            <button type="button" class="btn btn-secondary" data-route="languages">Explore Languages</button>
          </div>
        </div>
      `;
      return;
    }

    const q = questions[quizState.index];
    const progressPct = Math.round(((quizState.index + 1) / questions.length) * 100);

    container.innerHTML = `
      <div class="ca-card" style="padding:2.25rem;max-width:680px;margin:0 auto;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
          <span class="font-mono" style="font-size:0.78rem;color:var(--accent-primary);">QUESTION ${String(quizState.index + 1).padStart(2, "0")} OF ${String(questions.length).padStart(2, "0")}</span>
          <span class="font-mono" style="font-size:0.78rem;color:var(--text-muted);">SCORE: ${quizState.score}</span>
        </div>
        <div style="width:100%;height:6px;background:var(--bg-elevated);border-radius:999px;overflow:hidden;margin-bottom:1.75rem;">
          <div style="width:${progressPct}%;height:100%;background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));transition:width 0.3s ease;"></div>
        </div>
        <h3 style="font-size:1.35rem;font-weight:700;line-height:1.4;margin-bottom:1.5rem;">${q.question}</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;" id="quiz-options-list">
          ${q.options.map((opt, idx) => `
            <button type="button" class="ca-card quiz-option-btn" data-quiz-opt="${idx}" style="padding:1rem 1.25rem;text-align:left;cursor:pointer;display:flex;align-items:center;gap:0.85rem;">
              <span class="lang-mark" style="width:30px;height:30px;font-size:0.75rem;">${String.fromCharCode(65 + idx)}</span>
              <span style="font-size:0.95rem;color:var(--text-primary);">${opt}</span>
            </button>
          `).join("")}
        </div>
        <div id="quiz-feedback-box" style="display:none;margin-top:1.5rem;padding:1.15rem;border-radius:var(--radius-sm);background:var(--bg-elevated);border:1px solid var(--border-subtle);"></div>
      </div>
    `;
  }

  /* ========================================================================
     USER PROFILE TELEMETRY DASHBOARD (/profile.html & #view-user-profile)
     ======================================================================== */
  function renderUserProfileDashboard() {
    const container = document.getElementById("user-profile-dashboard");
    if (!container) return;

    const session = window.CodeAtlasStore.getSession() || {
      email: "student@example.com (Guest Demo Mode)",
      joined: "April 2026",
      role: "Public Explorer"
    };
    const profile = window.CodeAtlasStore.getProfileData();
    const allLangs = window.CodeAtlasStore.getLanguages();
    const exploredObjects = (profile.exploredIds || []).map(id => allLangs.find(l => l.id === id)).filter(Boolean);

    container.innerHTML = `
      <div class="ca-card" style="padding:2rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div style="display:flex;align-items:center;gap:1.15rem;">
          <div class="lang-mark lang-mark-lg" style="background:rgba(0,240,255,0.12);border-color:var(--accent-primary);">ID</div>
          <div>
            <div class="eyebrow" style="margin-bottom:0.25rem;">DEVELOPER TELEMETRY PROFILE</div>
            <h2 style="font-size:1.6rem;font-weight:700;">${session.email}</h2>
            <div class="font-mono" style="font-size:0.78rem;color:var(--text-muted);">Member Since: ${session.joined} • Persistence: Client-Side localStorage</div>
          </div>
        </div>
        <div style="display:flex;gap:0.6rem;">
          <button type="button" class="btn btn-secondary btn-sm" data-route="atlas">Open Atlas</button>
          ${window.CodeAtlasStore.getSession() ? `<button type="button" class="btn btn-ghost btn-sm" data-action="logout">Sign Out</button>` : `<button type="button" class="btn btn-primary btn-sm" data-route="login">Sign In</button>`}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem;">
        <div class="ca-card">
          <div class="inspector-stat-label">Languages Explored</div>
          <div class="font-mono" style="font-size:2rem;font-weight:700;color:var(--accent-primary);">${exploredObjects.length} / ${allLangs.length}</div>
        </div>
        <div class="ca-card">
          <div class="inspector-stat-label">Quiz Attempts</div>
          <div class="font-mono" style="font-size:2rem;font-weight:700;color:var(--accent-secondary);">${profile.quizAttempts}</div>
        </div>
        <div class="ca-card">
          <div class="inspector-stat-label">Best Quiz Telemetry</div>
          <div class="font-mono" style="font-size:1.35rem;font-weight:700;color:var(--status-success);margin-top:0.35rem;">${profile.bestScore}</div>
        </div>
        <div class="ca-card">
          <div class="inspector-stat-label">Active Learning Path</div>
          <div style="font-size:1rem;font-weight:600;color:var(--text-primary);margin-top:0.4rem;">${profile.selectedPath}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;">
        <div class="ca-card">
          <h3 style="font-size:1.15rem;margin-bottom:1rem;">Explored Language Nodes</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
            ${exploredObjects.map(l => `
              <button type="button" class="filter-pill" data-open-lang="${l.id}">${l.mark} • ${l.name}</button>
            `).join("")}
          </div>
        </div>
        <div class="ca-card">
          <h3 style="font-size:1.15rem;margin-bottom:0.75rem;">Recent Local Session Activity</h3>
          <div class="font-mono" style="font-size:0.84rem;color:var(--accent-primary);margin-bottom:0.5rem;">Last Action: ${profile.lastActivity}</div>
          <p style="font-size:0.82rem;color:var(--text-secondary);">Note: User session & telemetry are stored in browser localStorage for this static interactive architecture.</p>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     ADMIN CONSOLE MODULE (/admin.html & #view-admin)
     ======================================================================== */
  let currentAdminUsers = [];
  let currentAdminLangs = [];

  async function renderAdminConsole() {
    const accessDenied = document.getElementById("admin-access-denied");
    const authorizedShell = document.getElementById("admin-authorized-shell");
    const isAdmin = window.CodeAtlasStore.isAdmin();

    if (!isAdmin) {
      if (accessDenied) accessDenied.style.display = "block";
      if (authorizedShell) authorizedShell.style.display = "none";
      return;
    }

    if (accessDenied) accessDenied.style.display = "none";
    if (authorizedShell) authorizedShell.style.display = "grid";

    // 1. Fetch live metrics and stats
    try {
      const statsData = await window.CodeAtlasStore.fetchAdminStats();
      const s = statsData.stats;
      const statLangs = document.getElementById("admin-stat-langs");
      const statTimeline = document.getElementById("admin-stat-timeline");
      const statQuiz = document.getElementById("admin-stat-quiz");
      const statUsers = document.getElementById("admin-stat-users");
      const dbDesc = document.getElementById("admin-db-status-desc");
      const dbBadge = document.getElementById("admin-db-badge");

      if (statLangs) statLangs.textContent = s.languages;
      if (statTimeline) statTimeline.textContent = s.timelineEvents;
      if (statQuiz) statQuiz.textContent = s.quizQuestions;
      if (statUsers) statUsers.textContent = s.registeredUsers;

      if (dbDesc && statsData.dbConfig) {
        dbDesc.textContent = `Database Engine: ${statsData.dbConfig.type.toUpperCase()} • PostgreSQL ${statsData.dbConfig.postgresVersion} • Row Level Security: ${statsData.dbConfig.rlsActive ? "Enforced" : "Configured"}`;
      }
      if (dbBadge && statsData.dbConfig) {
        dbBadge.textContent = statsData.dbConfig.connected ? "SUPABASE POSTGRES ONLINE" : "SYSTEM HEALTHY";
      }
    } catch (e) {
      console.warn("Telemetry stats loaded with fallback:", e.message);
    }

    // 2. Fetch and render languages table
    try {
      currentAdminLangs = await window.CodeAtlasStore.fetchLanguages();
      renderAdminLanguagesTable(currentAdminLangs);
    } catch (e) {
      currentAdminLangs = window.CodeAtlasStore.getLanguages();
      renderAdminLanguagesTable(currentAdminLangs);
    }

    // 3. Fetch and render quiz content
    try {
      const quizList = await window.CodeAtlasStore.fetchQuizQuestions();
      renderAdminQuizList(quizList);
    } catch (e) {
      renderAdminQuizList(window.CodeAtlasStore.getQuizQuestions());
    }

    // 4. Fetch and render users table
    try {
      currentAdminUsers = await window.CodeAtlasStore.fetchAdminUsers();
      renderAdminUsersTable(currentAdminUsers);
    } catch (e) {
      console.warn("User directory fetch:", e.message);
    }

    // 5. Fetch and render activity telemetry
    try {
      const activities = await window.CodeAtlasStore.fetchActivities();
      renderAdminActivityTable(activities);
    } catch (e) {
      renderAdminActivityTable(window.CodeAtlasStore.getActivities());
    }

    // 6. Populate system settings
    const titleInp = document.getElementById("admin-setting-title");
    if (titleInp) {
      const settings = window.CodeAtlasStore.getSettings();
      if (settings && settings.siteTitle) titleInp.value = settings.siteTitle;
    }
  }

  function renderAdminLanguagesTable(langs) {
    const langTbody = document.getElementById("admin-languages-tbody");
    if (!langTbody) return;

    const filterVal = (document.getElementById("admin-lang-search")?.value || "").toLowerCase().trim();
    const filtered = filterVal
      ? langs.filter(l => l.name.toLowerCase().includes(filterVal) || l.category.toLowerCase().includes(filterVal) || (l.creator || "").toLowerCase().includes(filterVal))
      : langs;

    if (filtered.length === 0) {
      langTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">No language records matched your query.</td></tr>`;
      return;
    }

    langTbody.innerHTML = filtered.map(l => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:0.65rem;">
            <span class="lang-mark" style="width:32px;height:32px;font-size:0.75rem;">${escapeHtml(l.mark || l.name.slice(0, 2))}</span>
            <strong style="color:var(--text-primary);">${escapeHtml(l.name)}</strong>
          </div>
        </td>
        <td class="font-mono">${escapeHtml(String(l.year))}</td>
        <td><span class="ca-badge" data-cat="${escapeHtml(l.category)}">${escapeHtml(l.category)}</span></td>
        <td>${escapeHtml(l.creator || (l.uses || []).slice(0, 2).join(", "))}</td>
        <td>
          <div style="display:flex;gap:0.4rem;">
            <button type="button" class="btn btn-secondary btn-sm" data-open-lang="${escapeHtml(l.id)}">View</button>
            <button type="button" class="btn btn-secondary btn-sm" data-admin-edit-lang="${escapeHtml(l.id)}">Edit</button>
            <button type="button" class="btn btn-ghost btn-sm" style="color:var(--status-danger);" data-admin-del-lang="${escapeHtml(l.id)}">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  function renderAdminUsersTable(users) {
    const tbody = document.getElementById("admin-users-tbody");
    if (!tbody) return;

    const filterVal = (document.getElementById("admin-user-search")?.value || "").toLowerCase().trim();
    const filtered = filterVal
      ? users.filter(u => u.email.toLowerCase().includes(filterVal) || (u.full_name || "").toLowerCase().includes(filterVal))
      : users;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No registered users found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(u => {
      const isUserAdmin = u.role === "admin";
      return `
        <tr>
          <td>
            <div style="display:flex;flex-direction:column;">
              <strong style="color:var(--text-primary);">${escapeHtml(u.email)}</strong>
              <span style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(u.full_name || "Anonymous Developer")}</span>
            </div>
          </td>
          <td>
            <span class="ca-badge" style="${isUserAdmin ? "border-color:var(--accent-primary);color:var(--accent-primary);" : ""}">
              ${isUserAdmin ? "ADMIN" : "USER"}
            </span>
          </td>
          <td>${escapeHtml(u.selected_path || "—")}</td>
          <td class="font-mono">${escapeHtml(u.best_score || "—")}</td>
          <td class="font-mono" style="font-size:0.75rem;">${escapeHtml(u.last_activity || "Recent")}</td>
          <td>
            <div style="display:flex;gap:0.4rem;">
              <button type="button" class="btn btn-secondary btn-sm" data-admin-toggle-role="${escapeHtml(u.id)}" data-current-role="${escapeHtml(u.role)}">
                ${isUserAdmin ? "Demote" : "Promote"}
              </button>
              <button type="button" class="btn btn-ghost btn-sm" style="color:var(--status-danger);" data-admin-del-user="${escapeHtml(u.id)}">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderAdminQuizList(quizList) {
    const quizContainer = document.getElementById("admin-quiz-list");
    if (!quizContainer) return;

    quizContainer.innerHTML = quizList.map((q, idx) => `
      <div class="ca-card" style="margin-bottom:1rem;padding:1.25rem;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;">
          <div>
            <div class="font-mono" style="font-size:0.72rem;color:var(--accent-primary);margin-bottom:0.25rem;">QUESTION 0${idx + 1}</div>
            <h4 style="font-size:1.05rem;font-weight:600;margin-bottom:0.6rem;">${escapeHtml(q.question)}</h4>
            <div style="display:flex;flex-wrap:wrap;gap:0.45rem;margin-bottom:0.5rem;">
              ${(q.options || []).map((opt, oIdx) => `
                <span class="ca-badge" style="${oIdx === q.correctIndex ? "border-color:var(--status-success);color:var(--status-success);" : ""}">
                  ${escapeHtml(opt)}
                </span>
              `).join("")}
            </div>
            <div style="font-size:0.8rem;color:var(--text-secondary);">Explanation: ${escapeHtml(q.explanation)}</div>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" style="color:var(--status-danger);" data-admin-del-quiz="${escapeHtml(q.id)}">Delete</button>
        </div>
      </div>
    `).join("");
  }

  function renderAdminActivityTable(activities) {
    const actTbody = document.getElementById("admin-activity-tbody");
    if (!actTbody) return;

    actTbody.innerHTML = activities.map(a => `
      <tr>
        <td class="font-mono" style="color:var(--text-primary);">${escapeHtml(a.user)}</td>
        <td>${escapeHtml(a.action)}</td>
        <td class="font-mono">${escapeHtml(a.timestamp)}</td>
        <td><span class="ca-badge">${escapeHtml(a.type)}</span></td>
      </tr>
    `).join("");
  }

  /* Admin Modal Open/Close */
  function openAdminLangModal(lang = null) {
    const modal = document.getElementById("admin-lang-modal");
    if (!modal) return;

    const isEdit = !!lang;
    document.getElementById("modal-lang-is-edit").value = isEdit ? "true" : "false";
    document.getElementById("admin-modal-title").textContent = isEdit ? `Edit Language: ${lang.name}` : "Add New Language";

    const idInput = document.getElementById("modal-lang-id");
    idInput.value = isEdit ? lang.id : "";
    idInput.disabled = isEdit; // Preserve ID on edit

    document.getElementById("modal-lang-name").value = isEdit ? lang.name : "";
    document.getElementById("modal-lang-mark").value = isEdit ? (lang.mark || "") : "";
    document.getElementById("modal-lang-year").value = isEdit ? lang.year : 2026;
    document.getElementById("modal-lang-category").value = isEdit ? lang.category : "Systems";
    document.getElementById("modal-lang-creator").value = isEdit ? (lang.creator || "") : "";
    document.getElementById("modal-lang-desc").value = isEdit ? (lang.description || "") : "";
    document.getElementById("modal-lang-paradigm").value = isEdit ? (lang.paradigm || "") : "";
    document.getElementById("modal-lang-execution").value = isEdit ? (lang.execution || "") : "";
    document.getElementById("modal-lang-uses").value = isEdit ? (Array.isArray(lang.uses) ? lang.uses.join(", ") : lang.uses || "") : "";
    document.getElementById("modal-lang-syntax").value = isEdit ? (lang.syntaxSample || "") : "";

    modal.classList.add("open");
  }

  function closeAdminLangModal() {
    const modal = document.getElementById("admin-lang-modal");
    if (modal) {
      modal.classList.remove("open");
      document.getElementById("admin-lang-form")?.reset();
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ========================================================================
     EVENT DELEGATION & INITIALIZATION
     ======================================================================== */
  function init() {
    updateAuthUI();
    renderHomeFeatured();

    // Check if on Admin page
    if (document.body.getAttribute("data-initial-view") === "admin" || document.getElementById("view-admin")) {
      renderAdminConsole();
    }

    // Initialize Hero Constellation if on Home
    if (document.getElementById("hero-constellation-canvas")) {
      heroInstance = window.CodeAtlasGraph.initHeroConstellation("hero-constellation-canvas", (langId) => {
        navigateTo("atlas", { lang: langId });
      });
    }

    // Ambient Cursor Glow
    const glow = document.getElementById("cursor-glow");
    if (glow) {
      window.addEventListener("mousemove", (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }

    // Global Click Delegation
    document.addEventListener("click", async (e) => {
      // Route links
      const routeBtn = e.target.closest("[data-route]");
      if (routeBtn) {
        e.preventDefault();
        const r = routeBtn.getAttribute("data-route");
        navigateTo(r);
        return;
      }

      // Open specific language profile
      const openLangBtn = e.target.closest("[data-open-lang]");
      if (openLangBtn) {
        e.preventDefault();
        const lid = openLangBtn.getAttribute("data-open-lang");
        navigateTo("lang-profile", { lang: lid });
        return;
      }

      // Open language in 3D Atlas
      const openAtlasBtn = e.target.closest("[data-open-atlas]");
      if (openAtlasBtn) {
        e.preventDefault();
        const lid = openAtlasBtn.getAttribute("data-open-atlas");
        navigateTo("atlas", { lang: lid });
        return;
      }

      // Open language in Compare
      const compBtn = e.target.closest("[data-compare-lang]");
      if (compBtn) {
        e.preventDefault();
        const lid = compBtn.getAttribute("data-compare-lang");
        navigateTo("compare", { langA: lid, langB: lid === "rust" ? "python" : "rust" });
        return;
      }

      // Select node inside Atlas
      const atlasSelectBtn = e.target.closest("[data-atlas-select]");
      if (atlasSelectBtn && atlasInstance) {
        const lid = atlasSelectBtn.getAttribute("data-atlas-select");
        atlasInstance.selectNode(lid, true);
        return;
      }

      // Atlas Category Filter
      const atlasCatBtn = e.target.closest("[data-atlas-cat]");
      if (atlasCatBtn && atlasInstance) {
        document.querySelectorAll("[data-atlas-cat]").forEach(b => b.classList.remove("active"));
        atlasCatBtn.classList.add("active");
        atlasInstance.setCategory(atlasCatBtn.getAttribute("data-atlas-cat"));
        return;
      }

      // Languages Library Category Filter
      const libCatBtn = e.target.closest("[data-lib-cat]");
      if (libCatBtn) {
        document.querySelectorAll("[data-lib-cat]").forEach(b => b.classList.remove("active"));
        libCatBtn.classList.add("active");
        activeLibCategory = libCatBtn.getAttribute("data-lib-cat");
        renderLanguagesGrid();
        return;
      }

      // Timeline Filter
      const timeBtn = e.target.closest("[data-timeline-era]");
      if (timeBtn) {
        document.querySelectorAll("[data-timeline-era]").forEach(b => b.classList.remove("active"));
        timeBtn.classList.add("active");
        renderTimeline(timeBtn.getAttribute("data-timeline-era"));
        return;
      }

      // Explore Domain Path Card
      const pathCard = e.target.closest("[data-select-path]");
      if (pathCard) {
        renderExplorePaths(pathCard.getAttribute("data-select-path"));
        return;
      }

      // Quiz Option Answer
      const quizOpt = e.target.closest("[data-quiz-opt]");
      if (quizOpt && !quizState.answered) {
        quizState.answered = true;
        const chosenIdx = parseInt(quizOpt.getAttribute("data-quiz-opt"), 10);
        const questions = window.CodeAtlasStore.getQuizQuestions();
        const q = questions[quizState.index];
        const isCorrect = chosenIdx === q.correctIndex;
        if (isCorrect) quizState.score++;

        document.querySelectorAll("[data-quiz-opt]").forEach((btn, idx) => {
          if (idx === q.correctIndex) {
            btn.style.borderColor = "var(--status-success)";
            btn.style.background = "rgba(16, 185, 129, 0.12)";
          } else if (idx === chosenIdx && !isCorrect) {
            btn.style.borderColor = "var(--status-danger)";
            btn.style.background = "rgba(239, 68, 68, 0.12)";
          }
        });

        const fb = document.getElementById("quiz-feedback-box");
        if (fb) {
          fb.style.display = "block";
          fb.innerHTML = `
            <div class="font-mono" style="font-weight:700;color:${isCorrect ? "var(--status-success)" : "var(--status-danger)"};margin-bottom:0.35rem;">
              ${isCorrect ? "✓ TELEMETRY VERIFIED (CORRECT)" : "✕ SIGNAL MISMATCH (INCORRECT)"}
            </div>
            <p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:1rem;">${escapeHtml(q.explanation)}</p>
            <button type="button" class="btn btn-primary btn-sm" id="btn-quiz-next">Continue →</button>
          `;
        }
        return;
      }

      if (e.target.id === "btn-quiz-next") {
        quizState.index++;
        quizState.answered = false;
        renderQuizStep();
        return;
      }

      if (e.target.id === "btn-quiz-restart") {
        quizState = { index: 0, score: 0, answered: false };
        renderQuizStep();
        return;
      }

      // Logout
      if (e.target.closest("[data-action='logout']")) {
        await window.CodeAtlasStore.logout();
        updateAuthUI();
        showToast("Signed out successfully");
        if (window.location.pathname.includes("admin.html")) {
          window.location.href = "login.html";
        } else {
          navigateTo("home");
        }
        return;
      }

      // Admin Sub-Navigation Tabs
      const adminTabBtn = e.target.closest("[data-admin-tab]");
      if (adminTabBtn) {
        const tabId = adminTabBtn.getAttribute("data-admin-tab");
        document.querySelectorAll("[data-admin-tab]").forEach(b => b.classList.remove("active"));
        adminTabBtn.classList.add("active");
        document.querySelectorAll(".admin-tab-panel").forEach(p => p.classList.remove("active"));
        const panel = document.getElementById(`admin-panel-${tabId}`);
        if (panel) panel.classList.add("active");
        return;
      }

      // Admin Delete Language
      const delLangBtn = e.target.closest("[data-admin-del-lang]");
      if (delLangBtn) {
        const lid = delLangBtn.getAttribute("data-admin-del-lang");
        if (window.confirm(`Are you sure you want to delete language entity "${lid}"? This will be removed from PostgreSQL.`)) {
          try {
            await window.CodeAtlasStore.deleteLanguage(lid);
            showToast(`Deleted language "${lid}" from database`);
            await renderAdminConsole();
          } catch (err) {
            showToast(`Error: ${err.message}`);
          }
        }
        return;
      }

      // Admin Edit Language (Open Modal)
      const editLangBtn = e.target.closest("[data-admin-edit-lang]");
      if (editLangBtn) {
        const lid = editLangBtn.getAttribute("data-admin-edit-lang");
        const lang = await window.CodeAtlasStore.getLanguageById(lid);
        if (lang) {
          openAdminLangModal(lang);
        }
        return;
      }

      // Admin Delete Quiz Question
      const delQuizBtn = e.target.closest("[data-admin-del-quiz]");
      if (delQuizBtn) {
        const qid = delQuizBtn.getAttribute("data-admin-del-quiz");
        try {
          await window.CodeAtlasStore.deleteQuizQuestion(qid);
          showToast("Quiz question deleted from database");
          await renderAdminConsole();
        } catch (err) {
          showToast(`Error: ${err.message}`);
        }
        return;
      }

      // Admin Toggle User Role
      const toggleRoleBtn = e.target.closest("[data-admin-toggle-role]");
      if (toggleRoleBtn) {
        const userId = toggleRoleBtn.getAttribute("data-admin-toggle-role");
        const curRole = toggleRoleBtn.getAttribute("data-current-role");
        const nextRole = curRole === "admin" ? "user" : "admin";
        try {
          await window.CodeAtlasStore.updateUserRole(userId, nextRole);
          showToast(`Role updated to ${nextRole.toUpperCase()}`);
          await renderAdminConsole();
        } catch (err) {
          showToast(`Error: ${err.message}`);
        }
        return;
      }

      // Admin Delete User
      const delUserBtn = e.target.closest("[data-admin-del-user]");
      if (delUserBtn) {
        const userId = delUserBtn.getAttribute("data-admin-del-user");
        if (window.confirm("Are you sure you want to remove this user profile from the database?")) {
          try {
            await window.CodeAtlasStore.deleteUser(userId);
            showToast("User profile removed from database");
            await renderAdminConsole();
          } catch (err) {
            showToast(`Error: ${err.message}`);
          }
        }
        return;
      }
    });

    // Mobile Menu Toggle
    const menuBtn = document.getElementById("mobile-menu-btn");
    const drawer = document.getElementById("mobile-drawer");
    if (menuBtn && drawer) {
      menuBtn.addEventListener("click", () => drawer.classList.toggle("open"));
    }

    // Atlas Search & Controls
    const atlasSearch = document.getElementById("atlas-search-input");
    if (atlasSearch) {
      atlasSearch.addEventListener("input", (e) => {
        if (atlasInstance) atlasInstance.setSearch(e.target.value);
      });
    }

    document.getElementById("atlas-btn-zoom-in")?.addEventListener("click", () => atlasInstance?.zoomIn());
    document.getElementById("atlas-btn-zoom-out")?.addEventListener("click", () => atlasInstance?.zoomOut());
    document.getElementById("atlas-btn-fit")?.addEventListener("click", () => atlasInstance?.fitView());
    document.getElementById("atlas-btn-reset")?.addEventListener("click", () => {
      if (atlasSearch) atlasSearch.value = "";
      document.querySelectorAll("[data-atlas-cat]").forEach(b => b.classList.toggle("active", b.getAttribute("data-atlas-cat") === "All"));
      atlasInstance?.resetView();
    });

    const toggleMatrixBtn = document.getElementById("atlas-toggle-matrix");
    if (toggleMatrixBtn) {
      toggleMatrixBtn.addEventListener("click", () => {
        const mat = document.getElementById("atlas-accessible-matrix");
        if (mat) {
          mat.classList.toggle("active");
          toggleMatrixBtn.textContent = mat.classList.contains("active") ? "Switch to 3D Graph" : "Accessible Matrix View";
        }
      });
    }

    // Languages Library Instant Search & Reset
    const libSearch = document.getElementById("languages-search-input");
    if (libSearch) {
      libSearch.addEventListener("input", (e) => {
        activeLibSearch = e.target.value;
        renderLanguagesGrid();
      });
    }

    document.getElementById("btn-reset-languages-filter")?.addEventListener("click", () => {
      activeLibSearch = "";
      activeLibCategory = "All";
      if (libSearch) libSearch.value = "";
      document.querySelectorAll("[data-lib-cat]").forEach(b => b.classList.toggle("active", b.getAttribute("data-lib-cat") === "All"));
      renderLanguagesGrid();
    });

    // Compare Selectors
    const compSelA = document.getElementById("compare-select-a");
    const compSelB = document.getElementById("compare-select-b");
    const compSwap = document.getElementById("btn-compare-swap");
    if (compSelA && compSelB) {
      compSelA.addEventListener("change", () => renderCompareMatrix(compSelA.value, compSelB.value));
      compSelB.addEventListener("change", () => renderCompareMatrix(compSelA.value, compSelB.value));
      compSwap?.addEventListener("click", () => {
        const tmp = compSelA.value;
        compSelA.value = compSelB.value;
        compSelB.value = tmp;
        renderCompareMatrix(compSelA.value, compSelB.value);
      });
    }

    // Admin Language Search
    document.getElementById("admin-lang-search")?.addEventListener("input", () => {
      renderAdminLanguagesTable(currentAdminLangs);
    });

    // Admin User Search
    document.getElementById("admin-user-search")?.addEventListener("input", () => {
      renderAdminUsersTable(currentAdminUsers);
    });

    // Admin Add Language Button -> Open Modal
    document.getElementById("btn-admin-add-lang")?.addEventListener("click", () => {
      openAdminLangModal();
    });

    // Admin Close Modal Buttons
    document.getElementById("btn-admin-close-modal")?.addEventListener("click", closeAdminLangModal);
    document.getElementById("btn-admin-cancel-modal")?.addEventListener("click", closeAdminLangModal);

    // Admin Language Form Submit (Create or Update)
    document.getElementById("admin-lang-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isEdit = document.getElementById("modal-lang-is-edit")?.value === "true";
      const id = document.getElementById("modal-lang-id")?.value.trim().toLowerCase();
      const name = document.getElementById("modal-lang-name")?.value.trim();
      const mark = document.getElementById("modal-lang-mark")?.value.trim() || name.slice(0, 2);
      const year = parseInt(document.getElementById("modal-lang-year")?.value, 10) || 2026;
      const category = document.getElementById("modal-lang-category")?.value;
      const creator = document.getElementById("modal-lang-creator")?.value.trim();
      const desc = document.getElementById("modal-lang-desc")?.value.trim();
      const paradigm = document.getElementById("modal-lang-paradigm")?.value.trim();
      const execution = document.getElementById("modal-lang-execution")?.value.trim();
      const usesRaw = document.getElementById("modal-lang-uses")?.value.trim();
      const uses = usesRaw ? usesRaw.split(",").map(u => u.trim()).filter(Boolean) : [];
      const syntax = document.getElementById("modal-lang-syntax")?.value.trim();

      const payload = {
        id,
        name,
        mark,
        year,
        category,
        creator,
        description: desc,
        paradigm,
        execution,
        uses,
        syntaxSample: syntax
      };

      try {
        if (isEdit) {
          await window.CodeAtlasStore.updateLanguage(id, payload);
          showToast(`Updated "${name}" in PostgreSQL database`);
        } else {
          await window.CodeAtlasStore.createLanguage(payload);
          showToast(`Created new language "${name}" in PostgreSQL`);
        }
        closeAdminLangModal();
        await renderAdminConsole();
      } catch (err) {
        showToast(`Save failed: ${err.message}`);
      }
    });

    // Admin Add Quiz Form Submit
    const addQuizForm = document.getElementById("admin-add-quiz-form");
    if (addQuizForm) {
      addQuizForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const qText = document.getElementById("admin-quiz-q")?.value;
        const opt0 = document.getElementById("admin-quiz-o0")?.value;
        const opt1 = document.getElementById("admin-quiz-o1")?.value;
        const opt2 = document.getElementById("admin-quiz-o2")?.value;
        const opt3 = document.getElementById("admin-quiz-o3")?.value;
        const exp = document.getElementById("admin-quiz-exp")?.value;
        if (!qText || !opt0 || !opt1) return;

        try {
          await window.CodeAtlasStore.createQuizQuestion({
            question: qText,
            options: [opt0, opt1, opt2 || "Assembly", opt3 || "Fortran"],
            correctIndex: 0,
            explanation: exp || "Verified in CodeAtlas Architecture Assessment."
          });
          addQuizForm.reset();
          showToast("Added new quiz question to database");
          await renderAdminConsole();
        } catch (err) {
          showToast(`Quiz save failed: ${err.message}`);
        }
      });
    }

    // Admin Settings Save
    document.getElementById("btn-admin-save-settings")?.addEventListener("click", async () => {
      const titleVal = document.getElementById("admin-setting-title")?.value || "CodeAtlas";
      try {
        await window.CodeAtlasStore.saveSettings({
          siteTitle: titleVal,
          themePreference: "Obsidian Telemetry Dark (#05070D)",
          animationPreference: "Full Spatial Motion",
          datasetVersion: "v2026.4-stable"
        });
        showToast("System settings persisted to database");
      } catch (err) {
        showToast(`Error saving settings: ${err.message}`);
      }
    });

    // Admin Restore Dataset
    document.getElementById("btn-admin-reset-demo")?.addEventListener("click", async () => {
      if (window.confirm("Restore default verified language and quiz datasets to PostgreSQL?")) {
        try {
          await window.CodeAtlasStore.resetDefaultDataset();
          showToast("Restored baseline dataset in database");
          await renderAdminConsole();
        } catch (err) {
          showToast(`Reset failed: ${err.message}`);
        }
      }
    });

    /* ========================================================================
       AUTHENTICATION FORMS & TABS (login.html)
       ======================================================================== */
    const tabSignIn = document.getElementById("tab-btn-signin");
    const tabSignUp = document.getElementById("tab-btn-signup");
    const tabReset = document.getElementById("tab-btn-reset");
    const panelSignIn = document.getElementById("panel-signin");
    const panelSignUp = document.getElementById("panel-signup");
    const panelReset = document.getElementById("panel-reset");
    const authAlert = document.getElementById("auth-alert");

    function setAuthAlert(msg, type = "error") {
      if (!authAlert) return;
      authAlert.style.display = "block";
      authAlert.textContent = msg;
      if (type === "error") {
        authAlert.style.background = "rgba(239, 68, 68, 0.15)";
        authAlert.style.border = "1px solid var(--status-danger)";
        authAlert.style.color = "#fca5a5";
      } else {
        authAlert.style.background = "rgba(16, 185, 129, 0.15)";
        authAlert.style.border = "1px solid var(--status-success)";
        authAlert.style.color = "#6ee7b7";
      }
    }

    if (tabSignIn && tabSignUp && tabReset) {
      const switchAuthTab = (tab) => {
        if (authAlert) authAlert.style.display = "none";
        tabSignIn.classList.toggle("active", tab === "signin");
        tabSignUp.classList.toggle("active", tab === "signup");
        tabReset.classList.toggle("active", tab === "reset");
        if (panelSignIn) panelSignIn.style.display = tab === "signin" ? "block" : "none";
        if (panelSignUp) panelSignUp.style.display = tab === "signup" ? "block" : "none";
        if (panelReset) panelReset.style.display = tab === "reset" ? "block" : "none";
      };

      tabSignIn.addEventListener("click", () => switchAuthTab("signin"));
      tabSignUp.addEventListener("click", () => switchAuthTab("signup"));
      tabReset.addEventListener("click", () => switchAuthTab("reset"));
      document.getElementById("link-forgot-pass")?.addEventListener("click", () => switchAuthTab("reset"));
      document.getElementById("btn-back-to-signin")?.addEventListener("click", () => switchAuthTab("signin"));

      // Quick Preset Buttons
      document.getElementById("btn-preset-admin")?.addEventListener("click", () => {
        document.getElementById("login-email").value = "admin@codeatlas.dev";
        document.getElementById("login-password").value = "codeatlas2026";
      });

      document.getElementById("btn-preset-user")?.addEventListener("click", () => {
        document.getElementById("login-email").value = "student@example.com";
        document.getElementById("login-password").value = "codeatlas2026";
      });
    }

    // Sign In Form Submit
    const loginForm = document.getElementById("ca-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email")?.value.trim();
        const password = document.getElementById("login-password")?.value;
        const submitBtn = document.getElementById("btn-login-submit");

        if (!email || !password) return;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Authenticating with Supabase...";
        }

        try {
          const session = await window.CodeAtlasStore.login(email, password);
          updateAuthUI();
          showToast(`Authenticated as ${session.fullName || session.email}`);

          if (session.rawRole === "admin" || session.role === "Administrator") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "profile.html";
          }
        } catch (err) {
          setAuthAlert(err.message || "Failed to authenticate.", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign in";
          }
        }
      });
    }

    // Register Form Submit
    const regForm = document.getElementById("ca-register-form");
    if (regForm) {
      regForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fullName = document.getElementById("reg-name")?.value.trim();
        const email = document.getElementById("reg-email")?.value.trim();
        const phone = document.getElementById("reg-phone")?.value.trim();
        const password = document.getElementById("reg-password")?.value;
        const confirmPass = document.getElementById("reg-password-confirm")?.value;
        const submitBtn = document.getElementById("btn-register-submit");

        if (password !== confirmPass) {
          setAuthAlert("Passkeys do not match. Please verify confirmation.", "error");
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Provisioning account in Supabase...";
        }

        try {
          const session = await window.CodeAtlasStore.register({ fullName, email, phone, password });
          updateAuthUI();
          showToast(`Account created for ${session.email}`);
          window.location.href = "profile.html";
        } catch (err) {
          setAuthAlert(err.message || "Registration failed.", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Account";
          }
        }
      });
    }

    // Password Reset Form Submit
    const resetForm = document.getElementById("ca-reset-form");
    if (resetForm) {
      resetForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("reset-email")?.value.trim();
        const submitBtn = document.getElementById("btn-reset-submit");

        if (!email) return;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Dispatching recovery instructions...";
        }

        try {
          const res = await window.CodeAtlasStore.resetPassword(email);
          setAuthAlert(res.message || "Recovery email dispatched.", "success");
        } catch (err) {
          setAuthAlert(err.message || "Failed to dispatch recovery.", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Reset Instructions";
          }
        }
      });
    }

    // Check URL query or initial view attribute on body
    const initialViewAttr = document.body.getAttribute("data-initial-view");
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    const urlView = params.get("view");

    if (urlLang && (!initialViewAttr || initialViewAttr === "user-profile" || initialViewAttr === "lang-profile")) {
      navigateTo("lang-profile", { lang: urlLang }, false);
    } else if (urlView) {
      navigateTo(urlView, { lang: urlLang }, false);
    } else if (initialViewAttr && initialViewAttr !== "home") {
      navigateTo(initialViewAttr, { lang: urlLang }, false);
    }
  }

  return {
    init,
    navigateTo
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.CodeAtlasApp.init();
});
