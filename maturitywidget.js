(function() {

  var CSS_STYLES = [
    '<style>',
    ':host { display:block; width:100%; height:100%; font-family:"72",Arial,sans-serif; }',
    '.mc { display:flex; flex-direction:column; width:100%; height:100%; padding:16px; box-sizing:border-box; background:#fff; }',
    '.hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }',
    '.hdr-title { font-size:15px; font-weight:700; color:#333; }',
    '.hdr-filters { display:flex; gap:8px; }',
    '.fbtn { padding:4px 12px; border-radius:4px; font-size:11px; font-weight:600; background:#FFF3E0; border:1px solid #FF9800; color:#E65100; cursor:pointer; }',
    '.arrow { text-align:right; font-size:11px; color:#888; font-style:italic; margin-bottom:4px; }',
    '.mbody { display:flex; flex:1; overflow:hidden; }',
    '.dcol { width:220px; display:flex; flex-direction:column; flex-shrink:0; padding-right:10px; }',
    '.dcol-hdr { height:36px; display:flex; align-items:center; font-size:11px; font-weight:700; color:#666; border-bottom:2px solid #333; }',
    '.dlabels { display:flex; flex-direction:column; flex:1; }',
    '.dlbl { display:flex; align-items:center; flex:1; padding:0 8px; font-size:11px; font-weight:600; color:#333; border-bottom:1px solid #eee; cursor:pointer; }',
    '.dlbl:hover { background:#f0f7ff; }',
    '.gcol { flex:1; display:flex; flex-direction:column; }',
    '.lhdrs { display:flex; height:36px; border-bottom:2px solid #333; }',
    '.lh { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#333; }',
    '.lh span { font-size:9px; font-weight:400; color:#888; }',
    '.grows { flex:1; display:flex; flex-direction:column; }',
    '.grow { flex:1; display:flex; align-items:center; border-bottom:1px solid #eee; }',
    '.gcell { flex:1; display:flex; align-items:center; justify-content:center; height:100%; position:relative; }',
    '.gcell::after { content:""; position:absolute; right:0; top:20%; bottom:20%; width:1px; background:#eee; }',
    '.gcell:last-child::after { display:none; }',
    '.tri { width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; border-bottom:18px solid #1B6AC9; cursor:pointer; transition:transform 0.2s; }',
    '.tri:hover { transform:scale(1.3); }',
    '.tri.target { border-bottom-color:#ccc; opacity:0.35; }',
    '.legend { display:flex; justify-content:center; gap:20px; padding-top:10px; margin-top:8px; border-top:1px solid #eee; }',
    '.leg-item { display:flex; align-items:center; gap:6px; font-size:10px; color:#666; }',
    '.leg-tri { width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-bottom:9px solid #1B6AC9; }',
    '.leg-tri.tgt { border-bottom-color:#ccc; opacity:0.5; }',
    '</style>'
  ].join('\n');

  var HTML_BODY = [
    '<div class="mc">',
    '  <div class="hdr">',
    '    <div class="hdr-title" id="title">Process Maturity Overview</div>',
    '    <div class="hdr-filters">',
    '      <div class="fbtn">L0 Process</div>',
    '      <div class="fbtn">L1 Process</div>',
    '      <div class="fbtn">Period</div>',
    '    </div>',
    '  </div>',
    '  <div class="arrow">&rarr; Maturity Levels</div>',
    '  <div class="mbody">',
    '    <div class="dcol">',
    '      <div class="dcol-hdr">Dimension</div>',
    '      <div class="dlabels" id="dimLabels"></div>',
    '    </div>',
    '    <div class="gcol">',
    '      <div class="lhdrs" id="lvlHeaders"></div>',
    '      <div class="grows" id="gridRows"></div>',
    '    </div>',
    '  </div>',
    '  <div class="legend">',
    '    <div class="leg-item"><div class="leg-tri"></div>Current Level</div>',
    '    <div class="leg-item"><div class="leg-tri tgt"></div>Target Level</div>',
    '  </div>',
    '</div>'
  ].join('\n');

  // Create template
  var tmpl = document.createElement("template");
  tmpl.innerHTML = CSS_STYLES + HTML_BODY;

  // Define Custom Element
  function MaturityMatrix() {
    var el = HTMLElement.call(this) || this;
    return el;
  }

  MaturityMatrix.prototype = Object.create(HTMLElement.prototype);
  MaturityMatrix.prototype.constructor = MaturityMatrix;

  MaturityMatrix.prototype.connectedCallback = function() {
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(tmpl.content.cloneNode(true));

    this._shadow = shadow;

    this._data = [
      { id:"D001", name:"Governance & Ownership", level:4, target:5 },
      { id:"D002", name:"System & Data Linkage", level:3, target:5 },
      { id:"D003", name:"Performance & Measurement", level:3, target:4 },
      { id:"D004", name:"Digital Adoption & Execution Quality", level:4, target:5 },
      { id:"D005", name:"User Experience", level:3, target:4 },
      { id:"D006", name:"Innovation & Improvement", level:2, target:4 }
    ];

    this._levels = [
      { id:1, short:"L1", name:"Initial" },
      { id:2, short:"L2", name:"Managed" },
      { id:3, short:"L3", name:"Defined" },
      { id:4, short:"L4", name:"Quant. Mgd" },
      { id:5, short:"L5", name:"Optimizing" }
    ];

    this._renderHeaders();
    this._renderDimensions();
    this._renderGrid();
  };

  MaturityMatrix.prototype._renderHeaders = function() {
    var container = this._shadow.getElementById("lvlHeaders");
    var html = "";
    for (var i = 0; i < this._levels.length; i++) {
      var lvl = this._levels[i];
      html += '<div class="lh">' + lvl.short + '<span>' + lvl.name + '</span></div>';
    }
    container.innerHTML = html;
  };

  MaturityMatrix.prototype._renderDimensions = function() {
    var container = this._shadow.getElementById("dimLabels");
    var html = "";
    for (var i = 0; i < this._data.length; i++) {
      html += '<div class="dlbl">' + this._data[i].name + '</div>';
    }
    container.innerHTML = html;
  };

  MaturityMatrix.prototype._renderGrid = function() {
    var container = this._shadow.getElementById("gridRows");
    var html = "";

    for (var r = 0; r < this._data.length; r++) {
      var dim = this._data[r];
      html += '<div class="grow">';

      for (var c = 1; c <= 5; c++) {
        html += '<div class="gcell">';

        if (c === dim.level) {
          html += '<div class="tri" title="' + dim.name + ': Level ' + dim.level + '"></div>';
        }

        if (c === dim.target && c !== dim.level) {
          html += '<div class="tri target" title="Target: Level ' + dim.target + '"></div>';
        }

        html += '</div>';
      }

      html += '</div>';
    }

    container.innerHTML = html;
  };

  // Public method for SAC
  MaturityMatrix.prototype.setMaturityData = function(data) {
    this._data = data;
    this._renderDimensions();
    this._renderGrid();
  };

  MaturityMatrix.prototype.setTitle = function(value) {
    this._shadow.getElementById("title").innerText = value;
  };

  // Register
  customElements.define("com-sap-bpm-maturity-matrix", MaturityMatrix);

})();
