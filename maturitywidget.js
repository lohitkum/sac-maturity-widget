(function() {

  var styles = ""
    + "<style>"
    + ":host { display:block; width:100%; height:100%; font-family:Arial,sans-serif; }"
    + ".mc { display:flex; flex-direction:column; width:100%; height:100%; padding:16px; box-sizing:border-box; background:#fff; }"
    + ".hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }"
    + ".hdr-title { font-size:15px; font-weight:700; color:#333; }"
    + ".hdr-filters { display:flex; gap:8px; }"
    + ".fbtn { padding:4px 12px; border-radius:4px; font-size:11px; font-weight:600; background:#FFF3E0; border:1px solid #FF9800; color:#E65100; cursor:pointer; }"
    + ".arrow { text-align:right; font-size:11px; color:#888; font-style:italic; margin-bottom:4px; }"
    + ".mbody { display:flex; flex:1; overflow:hidden; }"
    + ".dcol { width:220px; display:flex; flex-direction:column; flex-shrink:0; padding-right:10px; }"
    + ".dcol-hdr { height:36px; display:flex; align-items:center; font-size:11px; font-weight:700; color:#666; border-bottom:2px solid #333; }"
    + ".dlabels { display:flex; flex-direction:column; flex:1; }"
    + ".dlbl { display:flex; align-items:center; flex:1; padding:0 8px; font-size:11px; font-weight:600; color:#333; border-bottom:1px solid #eee; cursor:pointer; }"
    + ".dlbl:hover { background:#f0f7ff; }"
    + ".gcol { flex:1; display:flex; flex-direction:column; }"
    + ".lhdrs { display:flex; height:36px; border-bottom:2px solid #333; }"
    + ".lh { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#333; }"
    + ".lh span { font-size:9px; font-weight:400; color:#888; }"
    + ".grows { flex:1; display:flex; flex-direction:column; }"
    + ".grow { flex:1; display:flex; align-items:center; border-bottom:1px solid #eee; }"
    + ".gcell { flex:1; display:flex; align-items:center; justify-content:center; height:100%; }"
    + ".tri { width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; border-bottom:18px solid #1B6AC9; cursor:pointer; }"
    + ".tri:hover { transform:scale(1.3); }"
    + ".tri.target { border-bottom-color:#ccc; opacity:0.35; }"
    + ".legend { display:flex; justify-content:center; gap:20px; padding-top:10px; margin-top:8px; border-top:1px solid #eee; }"
    + ".leg-item { display:flex; align-items:center; gap:6px; font-size:10px; color:#666; }"
    + ".leg-tri { width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-bottom:9px solid #1B6AC9; }"
    + ".leg-tri.tgt { border-bottom-color:#ccc; opacity:0.5; }"
    + "</style>";

  var body = ""
    + "<div class='mc'>"
    + "  <div class='hdr'>"
    + "    <div class='hdr-title' id='title'>Process Maturity Overview</div>"
    + "    <div class='hdr-filters'>"
    + "      <div class='fbtn'>L0 Process</div>"
    + "      <div class='fbtn'>L1 Process</div>"
    + "      <div class='fbtn'>Period</div>"
    + "    </div>"
    + "  </div>"
    + "  <div class='arrow'>&#8594; Maturity Levels</div>"
    + "  <div class='mbody'>"
    + "    <div class='dcol'>"
    + "      <div class='dcol-hdr'>Dimension</div>"
    + "      <div class='dlabels' id='dimLabels'></div>"
    + "    </div>"
    + "    <div class='gcol'>"
    + "      <div class='lhdrs' id='lvlHeaders'></div>"
    + "      <div class='grows' id='gridRows'></div>"
    + "    </div>"
    + "  </div>"
    + "  <div class='legend'>"
    + "    <div class='leg-item'><div class='leg-tri'></div>Current Level</div>"
    + "    <div class='leg-item'><div class='leg-tri tgt'></div>Target Level</div>"
    + "  </div>"
    + "</div>";

  var tmpl = document.createElement("template");
  tmpl.innerHTML = styles + body;

  function MaturityMatrix() {
    return Reflect.construct(HTMLElement, [], MaturityMatrix);
  }

  MaturityMatrix.prototype = Object.create(HTMLElement.prototype);
  MaturityMatrix.prototype.constructor = MaturityMatrix;

  MaturityMatrix.prototype.connectedCallback = function() {
    this._shadow = this.attachShadow({ mode: "open" });
    this._shadow.appendChild(tmpl.content.cloneNode(true));

    this._data = [
      { id: "D001", name: "Governance and Ownership", level: 4, target: 5 },
      { id: "D002", name: "System and Data Linkage", level: 3, target: 5 },
      { id: "D003", name: "Performance and Measurement", level: 3, target: 4 },
      { id: "D004", name: "Digital Adoption and Execution Quality", level: 4, target: 5 },
      { id: "D005", name: "User Experience", level: 3, target: 4 },
      { id: "D006", name: "Innovation and Improvement", level: 2, target: 4 }
    ];

    this._levels = [
      { id: 1, short: "L1", name: "Initial" },
      { id: 2, short: "L2", name: "Managed" },
      { id: 3, short: "L3", name: "Defined" },
      { id: 4, short: "L4", name: "Quant Mgd" },
      { id: 5, short: "L5", name: "Optimizing" }
    ];

    this.render();
  };

  MaturityMatrix.prototype.render = function() {
    var headerHtml = "";
    var i;
    for (i = 0; i < this._levels.length; i++) {
      headerHtml += "<div class='lh'>" + this._levels[i].short + "<span>" + this._levels[i].name + "</span></div>";
    }
    this._shadow.getElementById("lvlHeaders").innerHTML = headerHtml;

    var dimHtml = "";
    for (i = 0; i < this._data.length; i++) {
      dimHtml += "<div class='dlbl'>" + this._data[i].name + "</div>";
    }
    this._shadow.getElementById("dimLabels").innerHTML = dimHtml;

    var gridHtml = "";
    for (i = 0; i < this._data.length; i++) {
      var dim = this._data[i];
      gridHtml += "<div class='grow'>";
      for (var c = 1; c <= 5; c++) {
        gridHtml += "<div class='gcell'>";
        if (c === dim.level) {
          gridHtml += "<div class='tri' title='" + dim.name + ": Level " + dim.level + "'></div>";
        }
        if (c === dim.target && c !== dim.level) {
          gridHtml += "<div class='tri target' title='Target: Level " + dim.target + "'></div>";
        }
        gridHtml += "</div>";
      }
      gridHtml += "</div>";
    }
    this._shadow.getElementById("gridRows").innerHTML = gridHtml;
  };

  MaturityMatrix.prototype.setMaturityData = function(data) {
    this._data = data;
    this.render();
  };

  MaturityMatrix.prototype.setTitle = function(value) {
    this._shadow.getElementById("title").innerText = value;
  };

  customElements.define("com-sap-bpm-maturity-matrix", MaturityMatrix);

})();
