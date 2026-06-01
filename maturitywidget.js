(function() {

    var container = document.getElementById("widget");

    var dimensions = [
        { id: "D001", name: "Governance & Ownership", level: 4 },
        { id: "D002", name: "System & Data Linkage", level: 3 },
        { id: "D003", name: "Performance & Measurement", level: 3 },
        { id: "D004", name: "Digital Adoption & Execution Quality", level: 4 },
        { id: "D005", name: "User Experience", level: 3 },
        { id: "D006", name: "Innovation & Improvement", level: 2 }
    ];

    var levels = ["L1", "L2", "L3", "L4", "L5"];
    var levelNames = ["Initial", "Managed", "Defined", "Quant. Mgd", "Optimizing"];

    // Build HTML
    var html = "";

    // Header
    html += "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'>";
    html += "<div style='font-size:16px;font-weight:700;color:#333;'>Process Maturity Overview</div>";
    html += "<div style='display:flex;gap:8px;'>";
    html += "<span style='padding:4px 12px;border-radius:4px;font-size:11px;font-weight:600;background:#FFF3E0;border:1px solid #FF9800;color:#E65100;'>L0 Process</span>";
    html += "<span style='padding:4px 12px;border-radius:4px;font-size:11px;font-weight:600;background:#FFF3E0;border:1px solid #FF9800;color:#E65100;'>L1 Process</span>";
    html += "<span style='padding:4px 12px;border-radius:4px;font-size:11px;font-weight:600;background:#FFF3E0;border:1px solid #FF9800;color:#E65100;'>Period</span>";
    html += "</div>";
    html += "</div>";

    // Arrow
    html += "<div style='text-align:right;font-size:11px;color:#888;font-style:italic;margin-bottom:8px;'>&rarr; Maturity Levels</div>";

    // Table
    html += "<table style='width:100%;border-collapse:collapse;'>";

    // Header row
    html += "<tr>";
    html += "<th style='text-align:left;padding:8px 12px;border-bottom:2px solid #333;font-size:12px;color:#666;width:240px;'>Dimension</th>";
    for (var i = 0; i < levels.length; i++) {
        html += "<th style='text-align:center;padding:8px;border-bottom:2px solid #333;font-size:12px;font-weight:700;color:#333;'>" + levels[i] + "
<span style='font-size:9px;font-weight:400;color:#888;'>" + levelNames[i] + "</span></th>";
    }
    html += "</tr>";

    // Data rows
    for (var d = 0; d < dimensions.length; d++) {
        var dim = dimensions[d];
        html += "<tr style='border-bottom:1px solid #eee;'>";
        html += "<td style='padding:12px;font-size:12px;font-weight:600;color:#333;'>" + dim.name + "</td>";

        for (var l = 1; l <= 5; l++) {
            html += "<td style='text-align:center;padding:12px;'>";
            if (l === dim.level) {
                html += "<div style='width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:18px solid #1B6AC9;margin:0 auto;cursor:pointer;' title='" + dim.name + ": Level " + dim.level + "'></div>";
            }
            html += "</td>";
        }

        html += "</tr>";
    }

    html += "</table>";

    // Legend
    html += "<div style='display:flex;justify-content:center;gap:20px;padding-top:16px;margin-top:16px;border-top:1px solid #eee;'>";
    html += "<div style='display:flex;align-items:center;gap:6px;font-size:10px;color:#666;'><div style='width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:10px solid #1B6AC9;'></div>Current Level</div>";
    html += "<div style='display:flex;align-items:center;gap:6px;font-size:10px;color:#666;'><div style='width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:10px solid #ccc;'></div>Target Level</div>";
    html += "</div>";

    // Render
    container.innerHTML = html;

})();
