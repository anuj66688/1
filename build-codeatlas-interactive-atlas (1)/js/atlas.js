/* ==========================================================================
   CODEATLAS — SPATIAL CONSTELLATION & ATLAS GRAPH ENGINE (js/atlas.js)
   ========================================================================== */

window.CodeAtlasGraph = (function () {
  const CATEGORY_COLORS = {
    "Systems": "#F97316",
    "Web": "#00F0FF",
    "AI & Data": "#10B981",
    "Enterprise": "#8B5CF6",
    "Mobile": "#EC4899",
    "Data": "#3B82F6"
  };

  /* ========================================================================
     1. HERO CONSTELLATION ENGINE (Central CODEATLAS + 8 Orbiting Languages)
     ======================================================================== */
  function initHeroConstellation(canvasId, onSelectLanguage) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouseX = 0, mouseY = 0, targetParallaxX = 0, targetParallaxY = 0;
    let hoveredNode = null;
    let animFrameId = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const heroLangIds = ["python", "javascript", "c", "cpp", "java", "rust", "go", "typescript"];
    const allLangs = window.CodeAtlasStore.getLanguages();
    const orbitNodes = heroLangIds.map((id, index) => {
      const lang = allLangs.find(l => l.id === id) || { id, name: id.toUpperCase(), mark: id.slice(0, 2).toUpperCase(), category: "Web", year: 2000 };
      const angle = (index / heroLangIds.length) * Math.PI * 2 - Math.PI / 4;
      const radiusFactor = index % 2 === 0 ? 0.34 : 0.42;
      return {
        ...lang,
        baseAngle: angle,
        radiusFactor,
        speed: (index % 2 === 0 ? 0.00028 : -0.00022) * (reducedMotion ? 0 : 1),
        x: 0,
        y: 0,
        r: 22
      };
    });

    // Ambient depth stars
    const stars = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 0.8 + 0.2,
      size: Math.random() * 1.6 + 0.5
    }));

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width || 560;
      height = rect.height || 500;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      targetParallaxX = ((mouseX / width) - 0.5) * 24;
      targetParallaxY = ((mouseY / height) - 0.5) * 24;

      hoveredNode = null;
      for (const n of orbitNodes) {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        if (Math.hypot(dx, dy) <= n.r + 6) {
          hoveredNode = n;
          break;
        }
      }
      canvas.style.cursor = hoveredNode ? "pointer" : "default";
    });

    canvas.addEventListener("mouseleave", () => {
      hoveredNode = null;
      targetParallaxX = 0;
      targetParallaxY = 0;
    });

    canvas.addEventListener("click", () => {
      if (hoveredNode && typeof onSelectLanguage === "function") {
        onSelectLanguage(hoveredNode.id);
      }
    });

    let px = 0, py = 0, t = 0;
    function render(now) {
      t = now || 0;
      px += (targetParallaxX - px) * 0.08;
      py += (targetParallaxY - py) * 0.08;

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2 + px * 0.5;
      const cy = height / 2 + py * 0.5;
      const minDim = Math.min(width, height);

      // 1. Subtle stars
      for (const s of stars) {
        const sx = (s.x * width + px * s.z + width) % width;
        const sy = (s.y * height + py * s.z + height) % height;
        ctx.fillStyle = `rgba(148, 163, 184, ${0.18 + s.z * 0.25})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Orbital rings
      [0.22, 0.34, 0.42].forEach((rf, idx) => {
        ctx.strokeStyle = idx === 1 ? "rgba(0, 240, 255, 0.13)" : "rgba(148, 163, 184, 0.08)";
        ctx.lineWidth = 1;
        ctx.setLineDash(idx === 2 ? [4, 6] : []);
        ctx.beginPath();
        ctx.arc(cx, cy, minDim * rf, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Update node positions
      orbitNodes.forEach((n) => {
        const currentAngle = n.baseAngle + t * n.speed;
        const rad = minDim * n.radiusFactor;
        n.x = cx + Math.cos(currentAngle) * rad;
        n.y = cy + Math.sin(currentAngle) * rad;
      });

      // 3. Cross-language lineage lines
      for (let i = 0; i < orbitNodes.length; i++) {
        const a = orbitNodes[i];
        // Line to center hub
        const isHighlighted = hoveredNode && (hoveredNode.id === a.id || (hoveredNode.related && hoveredNode.related.includes(a.id)));
        ctx.strokeStyle = isHighlighted ? "rgba(0, 240, 255, 0.55)" : "rgba(0, 240, 255, 0.14)";
        ctx.lineWidth = isHighlighted ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();

        // Animated data packet along spoke
        if (!reducedMotion) {
          const pulseProgress = ((t * 0.0004 + i * 0.17) % 1);
          const packetX = cx + (a.x - cx) * pulseProgress;
          const packetY = cy + (a.y - cy) * pulseProgress;
          ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
          ctx.beginPath();
          ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Peer relationships
        for (let j = i + 1; j < orbitNodes.length; j++) {
          const b = orbitNodes[j];
          if (a.related && a.related.includes(b.id)) {
            const peerActive = hoveredNode && (hoveredNode.id === a.id || hoveredNode.id === b.id);
            ctx.strokeStyle = peerActive ? "rgba(139, 92, 246, 0.55)" : "rgba(148, 163, 184, 0.08)";
            ctx.lineWidth = peerActive ? 1.4 : 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 4. Central CODEATLAS Core Hub
      const hubGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 46);
      hubGrad.addColorStop(0, "rgba(0, 240, 255, 0.32)");
      hubGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = hubGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 46, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0B1020";
      ctx.strokeStyle = "#00F0FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#00F0FF";
      ctx.font = "600 10px 'DM Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("</>", cx, cy - 6);
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "700 8.5px 'Inter', sans-serif";
      ctx.fillText("CODEATLAS", cx, cy + 7);

      // 5. Orbiting Language Nodes
      orbitNodes.forEach((n) => {
        const isHover = hoveredNode && hoveredNode.id === n.id;
        const isRelated = hoveredNode && hoveredNode.related && hoveredNode.related.includes(n.id);
        const col = CATEGORY_COLORS[n.category] || "#00F0FF";
        const radius = isHover ? n.r + 4 : n.r;

        if (isHover || isRelated) {
          ctx.fillStyle = isHover ? "rgba(0, 240, 255, 0.2)" : "rgba(139, 92, 246, 0.15)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius + 9, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "#0B1020";
        ctx.strokeStyle = isHover ? "#00F0FF" : col;
        ctx.lineWidth = isHover ? 2.2 : 1.4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#F8FAFC";
        ctx.font = "600 10.5px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.mark, n.x, n.y);

        // Label Pill Below Node
        ctx.fillStyle = isHover ? "#00F0FF" : "#94A3B8";
        ctx.font = "500 11px 'Inter', sans-serif";
        ctx.fillText(n.name, n.x, n.y + radius + 14);
      });

      // Hover HUD telemetry readout in corner
      if (hoveredNode) {
        ctx.fillStyle = "rgba(5, 7, 13, 0.92)";
        ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(14, height - 62, 235, 48, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#00F0FF";
        ctx.font = "600 11px 'DM Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${hoveredNode.name.toUpperCase()} // ${hoveredNode.year}`, 26, height - 42);
        ctx.fillStyle = "#94A3B8";
        ctx.font = "400 11px 'Inter', sans-serif";
        ctx.fillText(`Click node to open in Spatial Atlas →`, 26, height - 25);
      }

      animFrameId = requestAnimationFrame(render);
    }

    animFrameId = requestAnimationFrame(render);
    return {
      destroy() {
        if (animFrameId) cancelAnimationFrame(animFrameId);
      }
    };
  }

  /* ========================================================================
     2. FULL ATLAS WORKBENCH ENGINE (/atlas.html & #view-atlas)
     ======================================================================== */
  function initAtlasWorkbench(options) {
    const canvas = document.getElementById(options.canvasId || "atlas-canvas");
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    const tooltipEl = document.getElementById("atlas-tooltip");

    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let camera = { x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1, rotY: 0, targetRotY: 0 };
    let isDragging = false, dragStartX = 0, dragStartY = 0, hasDragged = false;
    let activeCategory = "All";
    let searchQuery = "";
    let selectedId = options.initialLangId || "python";
    let hoveredId = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let nodes = [];
    function syncNodes() {
      const langs = window.CodeAtlasStore.getLanguages();
      nodes = langs.map((l, i) => {
        const angle = (i / langs.length) * Math.PI * 2;
        const defaultX = Math.cos(angle) * 210;
        const defaultY = Math.sin(angle) * 165;
        return {
          ...l,
          wx: l.coords?.x ?? defaultX,
          wy: l.coords?.y ?? defaultY,
          wz: l.coords?.z ?? 0,
          sx: 0,
          sy: 0,
          sr: 24,
          visible: true
        };
      });
      applyFilters();
    }

    function applyFilters() {
      const q = searchQuery.toLowerCase().trim();
      nodes.forEach(n => {
        const catMatch = activeCategory === "All" || n.category.toLowerCase() === activeCategory.toLowerCase();
        const searchMatch = !q ||
          n.name.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          String(n.year).includes(q) ||
          n.paradigm.toLowerCase().includes(q);
        n.visible = catMatch && searchMatch;
      });

      const countEl = document.getElementById("atlas-visible-count");
      if (countEl) {
        const visCount = nodes.filter(n => n.visible).length;
        countEl.textContent = `${visCount} / ${nodes.length} NODES ACTIVE`;
      }
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width || 800;
      height = rect.height || 600;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    syncNodes();
    resize();
    window.addEventListener("resize", resize);

    function projectNode(n) {
      // 3D subtle rotation + camera pan & zoom
      const cosR = Math.cos(camera.rotY);
      const sinR = Math.sin(camera.rotY);
      const rx = n.wx * cosR - n.wz * sinR;
      const rz = n.wx * sinR + n.wz * cosR;
      const depthScale = 1 + (rz / 900);
      const scale = camera.zoom * depthScale;
      n.sx = width / 2 + (rx + camera.x) * camera.zoom;
      n.sy = height / 2 + (n.wy + camera.y) * camera.zoom;
      n.sr = Math.max(16, 24 * scale);
    }

    // Mouse / Touch Interaction
    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      hasDragged = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (Math.hypot(dx, dy) > 4) hasDragged = true;
        camera.targetX += dx / camera.zoom;
        camera.targetY += dy / camera.zoom;
        camera.targetRotY += dx * 0.0008;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        if (tooltipEl) tooltipEl.classList.remove("visible");
        return;
      }

      if (mx < 0 || my < 0 || mx > width || my > height) {
        hoveredId = null;
        if (tooltipEl) tooltipEl.classList.remove("visible");
        return;
      }

      let found = null;
      for (const n of nodes) {
        if (!n.visible) continue;
        if (Math.hypot(mx - n.sx, my - n.sy) <= n.sr + 6) {
          found = n;
          break;
        }
      }

      hoveredId = found ? found.id : null;
      canvas.style.cursor = found ? "pointer" : (isDragging ? "grabbing" : "grab");

      if (found && tooltipEl) {
        tooltipEl.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.2rem;">
            <span class="font-mono" style="color:var(--accent-primary);font-weight:600;font-size:0.8rem;">${found.name}</span>
            <span class="font-mono" style="color:var(--text-muted);font-size:0.72rem;">${found.year}</span>
          </div>
          <div style="font-size:0.74rem;color:var(--text-secondary);">${found.category} • ${found.related.length} connections</div>
        `;
        tooltipEl.style.left = `${e.clientX}px`;
        tooltipEl.style.top = `${e.clientY - 12}px`;
        tooltipEl.classList.add("visible");
      } else if (tooltipEl) {
        tooltipEl.classList.remove("visible");
      }
    });

    window.addEventListener("mouseup", () => {
      if (isDragging && !hasDragged && hoveredId) {
        selectNode(hoveredId, true);
      }
      isDragging = false;
    });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 0.9;
      camera.targetZoom = Math.min(2.2, Math.max(0.48, camera.targetZoom * factor));
    }, { passive: false });

    function selectNode(langId, centerOnNode = false) {
      const target = nodes.find(n => n.id === langId);
      if (!target) return;
      selectedId = target.id;
      if (centerOnNode) {
        camera.targetX = -target.wx * 0.65;
        camera.targetY = -target.wy * 0.65;
        camera.targetZoom = Math.max(camera.targetZoom, 1.08);
      }
      window.CodeAtlasStore.recordLanguageExplored(target.id, target.name);
      if (typeof options.onSelect === "function") {
        options.onSelect(target);
      }
    }

    let t = 0;
    function renderLoop(now) {
      t = now || 0;
      camera.x += (camera.targetX - camera.x) * 0.1;
      camera.y += (camera.targetY - camera.y) * 0.1;
      camera.zoom += (camera.targetZoom - camera.zoom) * 0.1;
      camera.rotY += (camera.targetRotY - camera.rotY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Draw coordinate crosshairs at origin
      const ox = width / 2 + camera.x * camera.zoom;
      const oy = height / 2 + camera.y * camera.zoom;
      ctx.strokeStyle = "rgba(30, 41, 59, 0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, oy);
      ctx.lineTo(width, oy);
      ctx.moveTo(ox, 0);
      ctx.lineTo(ox, height);
      ctx.stroke();

      // Concentric Radar Rings
      [140, 260, 380].forEach(r => {
        ctx.strokeStyle = "rgba(30, 41, 59, 0.45)";
        ctx.beginPath();
        ctx.arc(ox, oy, r * camera.zoom, 0, Math.PI * 2);
        ctx.stroke();
      });

      nodes.forEach(projectNode);

      const activeFocusId = hoveredId || selectedId;
      const activeFocusNode = nodes.find(n => n.id === activeFocusId);

      // 1. Render Relationship Edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!a.visible) continue;
        for (const relId of (a.related || [])) {
          const b = nodes.find(x => x.id === relId);
          if (!b || !b.visible || a.id > b.id) continue;

          const isConnectedToFocus = activeFocusNode &&
            (a.id === activeFocusNode.id || b.id === activeFocusNode.id);

          ctx.strokeStyle = isConnectedToFocus
            ? "rgba(0, 240, 255, 0.68)"
            : "rgba(148, 163, 184, 0.11)";
          ctx.lineWidth = isConnectedToFocus ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();

          if (isConnectedToFocus && !reducedMotion) {
            const prog = ((t * 0.00055 + i * 0.2) % 1);
            const px = a.sx + (b.sx - a.sx) * prog;
            const py = a.sy + (b.sy - a.sy) * prog;
            ctx.fillStyle = "#00F0FF";
            ctx.beginPath();
            ctx.arc(px, py, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. Render Language Nodes
      nodes.forEach((n) => {
        if (!n.visible) return;
        const isSelected = n.id === selectedId;
        const isHovered = n.id === hoveredId;
        const isRelated = activeFocusNode && (
          (activeFocusNode.related && activeFocusNode.related.includes(n.id)) ||
          (n.related && n.related.includes(activeFocusNode.id))
        );
        const isDimmed = activeFocusNode && !isSelected && !isHovered && !isRelated && n.id !== activeFocusNode.id;

        const color = CATEGORY_COLORS[n.category] || "#00F0FF";
        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.32 : 1;

        // Outer Telemetry Pulse Ring for Selected / Hovered
        if (isSelected || isHovered) {
          const ringR = n.sr + 9 + (reducedMotion ? 0 : Math.sin(t * 0.004) * 3);
          ctx.strokeStyle = isSelected ? "#00F0FF" : color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Node Core Circle
        ctx.fillStyle = isSelected ? "#111C35" : "#0B1020";
        ctx.strokeStyle = isSelected ? "#00F0FF" : color;
        ctx.lineWidth = isSelected || isHovered ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, n.sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Mark Code
        ctx.fillStyle = isSelected ? "#00F0FF" : "#F8FAFC";
        ctx.font = `600 ${Math.round(n.sr * 0.48)}px 'DM Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.mark, n.sx, n.sy);

        // Node Name & Year Label
        ctx.fillStyle = isSelected ? "#F8FAFC" : "#CBD5E1";
        ctx.font = `600 11.5px 'Inter', sans-serif`;
        ctx.fillText(n.name, n.sx, n.sy + n.sr + 14);

        ctx.fillStyle = "#64748B";
        ctx.font = `400 9.5px 'DM Mono', monospace`;
        ctx.fillText(n.year, n.sx, n.sy + n.sr + 26);

        ctx.restore();
      });

      requestAnimationFrame(renderLoop);
    }

    // Trigger initial selection
    setTimeout(() => selectNode(selectedId, false), 40);
    requestAnimationFrame(renderLoop);

    return {
      selectNode,
      setCategory(cat) {
        activeCategory = cat;
        applyFilters();
      },
      setSearch(q) {
        searchQuery = q;
        applyFilters();
      },
      zoomIn() {
        camera.targetZoom = Math.min(2.2, camera.targetZoom * 1.22);
      },
      zoomOut() {
        camera.targetZoom = Math.max(0.48, camera.targetZoom * 0.82);
      },
      fitView() {
        camera.targetX = 0;
        camera.targetY = 0;
        camera.targetZoom = 0.88;
        camera.targetRotY = 0;
      },
      resetView() {
        activeCategory = "All";
        searchQuery = "";
        camera.targetX = 0;
        camera.targetY = 0;
        camera.targetZoom = 1;
        camera.targetRotY = 0;
        applyFilters();
        selectNode("python", false);
      },
      refreshData() {
        syncNodes();
      }
    };
  }

  return {
    initHeroConstellation,
    initAtlasWorkbench,
    CATEGORY_COLORS
  };
})();
