(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
        height: 100%;
        font-family: '72', Arial, sans-serif;
      }

      .maturity-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
        background: #FFFFFF;
        border-radius: 8px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      }

      /* ===== HEADER ===== */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-shrink: 0;
      }

      .header-title {
        font-size: 16px;
        font-weight: 700;
        color: #333333;
      }

      .header-filters {
        display: flex;
        gap: 8px;
      }

      .filter-badge {
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .filter-badge.l0 {
        background: #FFF3E0;
        border: 1px solid #FF9800;
        color: #E65100;
      }

      .filter-badge.l1 {
        background: #FFF3E0;
        border: 1px solid #FF9800;
        color: #E65100;
      }

      .filter-badge.period {
        background: #FFF3E0;
        border: 1px solid #FF9800;
        color: #E65100;
      }

      /* ===== MATRIX GRID ===== */
      .matrix-wrapper {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      /* Left column: Dimension labels */
      .dimension-labels {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 240px;
        flex-shrink: 0;
        padding-right: 16px;
      }

      .dimension-label {
        display: flex;
        align-items: center;
        height: calc(100% / 6);
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 600;
        color: #333;
        background: #F5F5F5;
        border: 1px solid #E0E0E0;
        border-radius: 6px;
        margin: 4px 0;
        cursor: pointer;
        transition: all 0.2s;
      }

      .dimension-label:hover {
        background: #E3F2FD;
        border-color: #1B6AC9;
      }

      .dimension-label.selected {
        background: #E3F2FD;
        border-color: #1B6AC9;
        color: #1B6AC9;
      }

      /* Right area: Grid */
      .grid-area {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      /* Column headers (L1-L5) */
      .level-headers {
        display: flex;
        justify-content: space-around;
        padding: 8px 0;
        border-bottom: 2px solid #333;
        flex-shrink: 0;
      }

      .level-header {
        flex: 1;
        text-align: center;
        font-size: 13px;
        font-weight: 700;
        color: #333;
      }

      .level-header span {
        display: block;
        font-size: 10px;
        font-weight: 400;
        color: #666;
        margin-top: 2px;
      }

      /* Arrow indicator */
      .maturity-arrow {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 4px 0;
        font-size: 11px;
        color: #666;
        flex-shrink: 0;
      }

      .maturity-arrow::after {
        content: '→ Maturity Levels';
        margin-left: 8px;
        font-style: italic;
      }

      /* Grid rows */
      .grid-rows {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }

      .grid-row {
        display: flex;
        flex: 1;
        align-items: center;
        border-bottom: 1px dashed #E0E0E0;
        position: relative;
      }

      .grid-row:last-child {
        border-bottom: none;
      }

      .grid-cell {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: relative;
      }

      /* Vertical grid lines */
      .grid-cell::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #E0E0E0;
        opacity: 0.5;
      }

      .grid-cell:first-child::before {
        display: none;
      }

      /* ===== MARKERS ===== */
      .marker {
        width: 0;
        height: 0;
        cursor: pointer;
        transition: all 0.3s ease;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
      }

      .marker.triangle {
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 20px solid var(--marker-color, #1B6AC9);
      }

      .marker.circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--marker-color, #1B6AC9);
      }

      .marker.diamond {
        width: 16px;
        height: 16px;
        background: var(--marker-color, #1B6AC9);
        transform: rotate(45deg);
      }

      .marker:hover {
        transform: scale(1.3);
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
      }

      .marker.animate {
        animation: markerAppear 0.5s ease-out forwards;
        opacity: 0;
      }

      @keyframes markerAppear {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.5);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* ===== TOOLTIP ===== */
      .tooltip {
        position: absolute;
        background: #333;
        color: #FFF;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 100;
        white-space: nowrap;
      }

      .tooltip.visible {
        opacity: 1;
      }

      /* ===== LEGEND ===== */
      .legend {
        display: flex;
        justify-content: center;
        gap: 16px;
        padding-top: 12px;
        border-top: 1px solid #E0E0E0;
        margin-top: 12px;
        flex-shrink: 0;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: #666;
      }

      .legend-marker {
        width: 8px;
        height: 8px;
      }

      .legend-marker.current {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 10px solid #1B6AC9;
      }

      .legend-marker.target {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 10px solid #E0E0E0;
        opacity: 0.6;
      }

      /* ===== RESPONSIVE ===== */
      @media (max-width: 600px) {
        .dimension-labels {
          width: 160px;
        }
        .dimension-label {
          font-size: 10px;
        }
      }
    </style>

    <div class="maturity-container">
      <!-- Header -->
      <div class="header">
        <div class="header-title" id="widgetTitle">Process Maturity Overview</div>
        <div class="header-filters">
          <span class="filter-badge l0" id="filterL0">L0 Process</span>
          <span class="filter-badge l1" id="filterL1">L1 Process</span>
          <span class="filter-badge period" id="filterPeriod">Period</span>
        </div>
      </div>

      <!-- Matrix -->
      <div class="matrix-wrapper">
        <!-- Dimension Labels (Y-axis) -->
        <div class="dimension-labels" id="dimensionLabels"></div>

        <!-- Grid Area -->
        <div class="grid-area">
          <!-- Maturity Direction Arrow -->
          <div class="maturity-arrow"></div>

          <!-- Level Headers (X-axis) -->
          <div class="level-headers" id="levelHeaders"></div>

          <!-- Grid Rows with Markers -->
          <div class="grid-rows" id="gridRows"></div>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <div class="legend-marker current"></div>
          <span>Current Maturity Level</span>
        </div>
        <div class="legend-item">
          <div class="legend-marker target"></div>
          <span>Target Level</span>
        </div>
      </div>

      <!-- Tooltip -->
      <div class="tooltip" id="tooltip"></div>
    </div>
  `;

  class MaturityMatrixWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      // Default properties
      this._props = {
        title: "Process Maturity Overview",
        markerShape: "triangle",
        markerColor: "#1B6AC9",
        showGridLines: true,
        showLabels: false,
        animateMarkers: true
      };

      // Default maturity data
      this._data = [
        { dimensionId: "D001", dimensionName: "Governance & Ownership", level: 4, targetLevel: 5, scorePct: 0.72 },
        { dimensionId: "D002", dimensionName: "System & Data Linkage", level: 3, targetLevel: 4, scorePct: 0.55 },
        { dimensionId: "D003", dimensionName: "Performance & Measurement", level: 3, targetLevel: 4, scorePct: 0.48 },
        { dimensionId: "D004", dimensionName: "Digital Adoption & Exec. Quality", level: 4, targetLevel: 5, scorePct: 0.67 },
        { dimensionId: "D005", dimensionName: "User Experience", level: 3, targetLevel: 4, scorePct: 0.52 },
        { dimensionId: "D006", dimensionName: "Innovation & Improvement", level: 3, targetLevel: 5, scorePct: 0.44 }
      ];

      // Maturity level definitions
      this._levels = [
        { id: 1, name: "L1", fullName: "Initial", color: "#FF0000" },
        { id: 2, name: "L2", fullName: "Managed", color: "#FF8C00" },
        { id: 3, name: "L3", fullName: "Defined", color: "#FFD700" },
        { id: 4, name: "L4", fullName: "Quant. Managed", color: "#90EE90" },
        { id: 5, name: "L5", fullName: "Optimizing", color: "#008000" }
      ];

      this._selectedDimension = null;

      // Bind methods
      this._render = this._render.bind(this);
      this._onMarkerClick = this._onMarkerClick.bind(this);
      this._onDimensionClick = this._onDimensionClick.bind(this);
    }

    // ===== LIFECYCLE =====

    connectedCallback() {
      this._render();
    }

    // ===== PROPERTIES (SAC Interface) =====

    set title(value) {
      this._props.title = value;
      this._shadowRoot.getElementById("widgetTitle").textContent = value;
    }

    get title() {
      return this._props.title;
    }

    set markerShape(value) {
      this._props.markerShape = value;
      this._render();
    }

    get markerShape() {
      return this._props.markerShape;
    }

    set markerColor(value) {
      this._props.markerColor = value;
      this._render();
    }

    get markerColor() {
      return this._props.markerColor;
    }

    set showGridLines(value) {
      this._props.showGridLines = value;
      this._render();
    }

    set showLabels(value) {
      this._props.showLabels = value;
      this._render();
    }

    set animateMarkers(value) {
      this._props.animateMarkers = value;
    }

    // ===== METHODS (SAC Interface) =====

    setMaturityData(data) {
      if (Array.isArray(data)) {
        this._data = data;
        this._render();
      }
    }

    getSelectedDimension() {
      return this._selectedDimension;
    }

    setHighlightLevel(level) {
      const cells = this._shadowRoot.querySelectorAll('.grid-cell');
      cells.forEach(cell => {
        cell.style.background = '';
      });
      if (level >= 1 && level <= 5) {
        const targetCells = this._shadowRoot.querySelectorAll(`.grid-cell[data-level="${level}"]`);
        targetCells.forEach(cell => {
          cell.style.background = 'rgba(27, 106, 201, 0.05)';
        });
      }
    }

    // ===== RENDERING =====

    _render() {
      this._renderTitle();
      this._renderLevelHeaders();
      this._renderDimensionLabels();
      this._renderGridRows();
    }

    _renderTitle() {
      this._shadowRoot.getElementById("widgetTitle").textContent = this._props.title;
    }

    _renderLevelHeaders() {
      const container = this._shadowRoot.getElementById("levelHeaders");
      container.innerHTML = "";

      this._levels.forEach(level => {
        const header = document.createElement("div");
        header.className = "level-header";
        header.innerHTML = `${level.name}<span>${level.fullName}</span>`;
        container.appendChild(header);
      });
    }

    _renderDimensionLabels() {
      const container = this._shadowRoot.getElementById("dimensionLabels");
      container.innerHTML = "";

      this._data.forEach((dim, index) => {
        const label = document.createElement("div");
        label.className = "dimension-label";
        label.textContent = dim.dimensionName;
        label.dataset.dimensionId = dim.dimensionId;
        label.dataset.index = index;
        label.addEventListener("click", (e) => this._onDimensionClick(e, dim));
        container.appendChild(label);
      });
    }

    _renderGridRows() {
      const container = this._shadowRoot.getElementById("gridRows");
      container.innerHTML = "";

      this._data.forEach((dim, rowIndex) => {
        const row = document.createElement("div");
        row.className = "grid-row";
        row.dataset.dimensionId = dim.dimensionId;

        // Create 5 cells (one per level)
        for (let level = 1; level <= 5; level++) {
          const cell = document.createElement("div");
          cell.className = "grid-cell";
          cell.dataset.level = level;
          cell.dataset.dimensionId = dim.dimensionId;

          // Place marker if this is the current maturity level
          if (level === dim.level) {
            const marker = this._createMarker(dim, "current");
            if (this._props.animateMarkers) {
              marker.classList.add("animate");
              marker.style.animationDelay = `${rowIndex * 0.1}s`;
            }
            cell.appendChild(marker);
          }

          // Place target marker (faded)
          if (dim.targetLevel && level === dim.targetLevel && level !== dim.level) {
            const targetMarker = this._createMarker(dim, "target");
            targetMarker.style.opacity = "0.25";
            if (this._props.animateMarkers) {
              targetMarker.classList.add("animate");
              targetMarker.style.animationDelay = `${rowIndex * 0.1 + 0.3}s`;
            }
            cell.appendChild(targetMarker);
          }

          row.appendChild(cell);
        }

        container.appendChild(row);
      });
    }

    _createMarker(dimensionData, type) {
      const marker = document.createElement("div");
      marker.className = `marker ${this._props.markerShape}`;
      marker.style.setProperty("--marker-color", 
        type === "target" ? "#CCCCCC" : this._props.markerColor
      );
      marker.dataset.dimensionId = dimensionData.dimensionId;
      marker.dataset.level = dimensionData.level;
      marker.dataset.type = type;

      // Tooltip events
      marker.addEventListener("mouseenter", (e) => this._showTooltip(e, dimensionData, type));
      marker.addEventListener("mouseleave", () => this._hideTooltip());
      marker.addEventListener("click", (e) => this._onMarkerClick(e, dimensionData));

      return marker;
    }

    // ===== TOOLTIP =====

    _showTooltip(event, data, type) {
      const tooltip = this._shadowRoot.getElementById("tooltip");
      const levelName = this._levels.find(l => l.id === data.level)?.fullName || "";
      
      if (type === "current") {
        tooltip.textContent = `${data.dimensionName}: Level ${data.level} (${levelName}) — ${Math.round(data.scorePct * 100)}% signals met`;
      } else {
        tooltip.textContent = `Target: Level ${data.targetLevel}`;
      }

      const rect = event.target.getBoundingClientRect();
      const containerRect = this._shadowRoot.querySelector(".maturity-container").getBoundingClientRect();
      
      tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - containerRect.top - 30}px`;
      tooltip.classList.add("visible");
    }

    _hideTooltip() {
      const tooltip = this._shadowRoot.getElementById("tooltip");
      tooltip.classList.remove("visible");
    }

    // ===== EVENTS =====

    _onDimensionClick(event, dimensionData) {
      // Toggle selection
      const labels = this._shadowRoot.querySelectorAll(".dimension-label");
      labels.forEach(l => l.classList.remove("selected"));
      event.target.classList.add("selected");

      this._selectedDimension = dimensionData.dimensionId;

      // Dispatch SAC event
      this.dispatchEvent(new CustomEvent("onDimensionClick", {
        detail: {
          dimensionId: dimensionData.dimensionId,
          dimensionName: dimensionData.dimensionName,
          level: dimensionData.level,
          scorePct: dimensionData.scorePct
        }
      }));
    }

    _onMarkerClick(event, dimensionData) {
      this.dispatchEvent(new CustomEvent("onMarkerClick", {
        detail: {
          dimensionId: dimensionData.dimensionId,
          dimensionName: dimensionData.dimensionName,
          level: dimensionData.level,
          scorePct: dimensionData.scorePct
        }
      }));
    }
  }

  customElements.define("com-sap-bpm-maturity-matrix", MaturityMatrixWidget);
})();
