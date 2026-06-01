(function () {
  let tmpl = document.createElement("template");
  tmpl.innerHTML = `
<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;
    font-family: '72', Arial, Helvetica, sans-serif;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }

  .maturity-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 16px;
    background: #FFFFFF;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .header-title {
    font-size: 15px;
    font-weight: 700;
    color: #333333;
  }

  .header-filters {
    display: flex;
    gap: 8px;
  }

  .filter-btn {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    background: #FFF3E0;
    border: 1px solid #FF9800;
    color: #E65100;
    cursor: pointer;
  }

  .arrow-label {
    text-align: right;
    font-size: 11px;
    color: #666;
    font-style: italic;
    margin-bottom: 4px;
  }

  .matrix-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .dim-col {
    width: 220px;
    display: flex;
    flex-direction: column;
    padding-right: 12px;
    flex-shrink: 0;
  }

  .dim-col-header {
    height: 36px;
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    color: #666;
    border-bottom: 2px solid #333;
  }

  .dim-label {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0 8px;
    font-size: 11px;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #EEEEEE;
    cursor: pointer;
  }

  .dim-label:hover {
    background: #F5F5F5;
  }

  .grid-col {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .level-headers {
    display: flex;
    height: 36px;
    border-bottom: 2px solid #333;
  }

  .level-hdr {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #333;
  }

  .level-hdr span {
    font-size: 9px;
    font-weight: 400;
    color: #888;
  }

  .grid-rows {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .grid-row {
    flex: 1;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #EEEEEE;
  }

  .grid-cell {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  }

  .grid-cell::after {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background: #EEEEEE;
  }

  .grid-cell:last-child::after {
    display: none;
  }

  .marker-triangle {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 16px solid #1B6AC9;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .marker-triangle:hover {
    transform: scale(1.3);
  }

  .marker-triangle.target {
    border-bottom-color: #CCCCCC;
    opacity: 0.4;
  }

  .marker-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1B6AC9;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .marker-circle:hover {
    transform: scale(1.3);
  }

  .marker-circle.target {
    background: #CCCCCC;
    opacity: 0.4;
  }

  .legend-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding-top: 10px;
    margin-top: 8px;
    border-top: 1px solid #EEE;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    color: #666;
  }

  .legend-tri {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #1B6AC9;
  }

  .legend-tri.target {
    border-bottom-color: #CCC;
    opacity: 0.5;
  }
</style>

<div class="maturity-container">
  <div class="header">
    <div class="header-title" id="title">Process Maturity Overview</div>
    <div class="header-filters">
      <div class="filter-btn">L0 Process</div>
      <div class="filter-btn">L1 Process</div>
      <div class="filter-btn">Period</div>
    </div>
  </div>

  <div class="arrow-label">&rarr; Maturity Levels</div>

  <div class="matrix-body">
    <div class="dim-col">
      <div class="dim-col-header">Dimension</div>
      <div id="dimLabels"></div>
    </div>
    <div class="grid-col">
      <div class="level-headers" id="levelHeaders"></div>
      <div class="grid-rows" id="gridRows"></div>
    </div>
  </div>

  <div class="legend-row">
    <div class="legend-item"><div class="legend-tri"></div>Current Level</div>
    <div class="legend-item"><div class="legend-tri target"></div>Target Level</div>
  </div>
</div>
  `;

  class MaturityMatrix extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

      this._data = [
        { id: "D001", name: "Governance & Ownership", level: 4, target: 5 },
        { id: "D002", name: "System & Data Linkage", level: 3, target: 4 },
        { id: "D003", name: "Performance & Measurement", level: 3, target: 5 },
        { id: "D004", name: "Digital Adoption & Exec. Quality", level: 4, target: 5 },
        { id: "D005", name: "User Experience", level: 3, target: 4 },
        { id: "D006", name: "Innovation & Improvement", level: 2, target: 4 }
      ];

      this._levels = [
        { id: 1, short: "L1", name: "Initial" },
        { id: 2, short: "L2", name: "Managed" },
        { id: 3, short: "L3", name: "Defined" },
        { id: 4, short: "L4", name: "Quant. Mgd" },
        { id: 5, short: "L5", name: "Optimizing" }
      ];
    }

    connectedCallback() {
      this._renderAll();
    }

    // ===== PUBLIC METHODS (callable from SAC script) =====

    setMaturityData(data) {
      this._data = data;
      this._renderAll();
    }

    setTitle(value) {
      this._shadowRoot.getElementById("title").innerText = value;
    }

    // ===== RENDER =====

    _renderAll() {
      this._renderLevelHeaders();
      this._renderDimLabels();
      this._renderGrid();
    }

    _renderLevelHeaders() {
      let container = this._shadowRoot.getElementById("levelHeaders");
      container.innerHTML = "";
      this._levels.forEach(function (lvl) {
        let div = document.createElement("div");
        div.className = "level-hdr";
        div.innerHTML = lvl.short + "<span>" + lvl.name + "</span>";
        container.appendChild(div);
      });
    }

    _renderDimLabels() {
      let container = this._shadowRoot.getElementById("dimLabels");
      container.innerHTML = "";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.flex = "1";

      let self = this;
      this._data.forEach(function (dim) {
        let div = document.createElement("div");
        div.className = "dim-label";
        div.innerText = dim.name;
        div.addEventListener("click", function () {
          self.dispatchEvent(new CustomEvent("onDimensionClick", {
            detail: { dimensionId: dim.id, dimensionName: dim.name, level: dim.level }
          }));
        });
        container.appendChild(div);
      });
    }

    _renderGrid() {
      let container = this._shadowRoot.getElementById("gridRows");
      container.innerHTML = "";

      let self = this;
      this._data.forEach(function (dim, rowIdx) {
        let row = document.createElement("div");
        row.className = "grid-row";

        for (let lvl = 1; lvl <= 5; lvl++) {
          let cell = document.createElement("div");
          cell.className = "grid-cell";

          // Current level marker
          if (lvl === dim.level) {
            let marker = document.createElement("div");
            marker.className = "marker-triangle";
            marker.title = dim.name + ": Level " + dim.level + " (" + self._levels[lvl - 1].name + ")";
            marker.addEventListener("click", function () {
              self.dispatchEvent(new CustomEvent("onMarkerClick", {
                detail: { dimensionId: dim.id, level: dim.level }
              }));
            });
            cell.appendChild(marker);
          }

          // Target level marker (faded)
          if (dim.target && lvl === dim.target && lvl !== dim.level) {
            let tMarker = document.createElement("div");
            tMarker.className = "marker-triangle target";
            tMarker.title = "Target: Level " + dim.target;
            cell.appendChild(tMarker);
          }

          row.appendChild(cell);
        }

        container.appendChild(row);
      });
    }
  }

  customElements.define("com-sap-bpm-maturity-matrix", MaturityMatrix);
})();
