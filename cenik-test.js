(function(){
  var URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik4.json?nocache=" + Date.now();

  function checkIcon(){
    return '<svg viewBox="0 0 24 24" width="18" height="18" style="display:inline-block;vertical-align:middle;">'
         + '<circle cx="12" cy="12" r="9.5" fill="none" stroke="#111" stroke-width="1.3"></circle>'
         + '<path d="M7.5 12.5l3 3 6-6" fill="none" stroke="#111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'
         + '</svg>';
  }

  function isChecked(v){
    var t = String(v == null ? "" : v).trim().toLowerCase();
    return ["✓","✔","true","1","ano","x","✔️"].indexOf(t) !== -1;
  }

  fetch(URL_JSON)
    .then(function(r){ return r.json(); })
    .then(function(data){
      var table = document.getElementById("cenik-test");
      if (!table) return;

      table.style.tableLayout = "fixed";
      table.style.width = "100%";

      var thead = table.querySelector("thead");
      var tbody = table.querySelector("tbody");

      var items = (data && Array.isArray(data.items)) ? data.items : data;
      if (!items || !items.length) return;

      var headerKeys = Object.keys(items[0]);

      // --- COLGROUP s pevnými šířkami ---
      var oldCol = table.querySelector("colgroup");
      if (oldCol) oldCol.remove();

      var colgroup = document.createElement("colgroup");
      for (var i = 0; i < headerKeys.length; i++) {
        var col = document.createElement("col");
        if (headerKeys.length === 4) {
          // 34% - 22% - 22% - 22%
          if (i === 0) col.style.width = "34%";
          else col.style.width = "22%";
        } else {
          col.style.width = (100 / headerKeys.length) + "%";
        }
        colgroup.appendChild(col);
      }
      table.insertBefore(colgroup, thead);

      // --- ZÁHLAVÍ ---
      var trh = document.createElement("tr");
      for (var i=0;i<headerKeys.length;i++){
        var th = document.createElement("th");
        th.textContent = headerKeys[i];
        th.style.cssText = "padding:6px;font-weight:bold;border-bottom:1px solid #ddd;text-align:center;overflow-wrap:anywhere;word-break:break-word;white-space:normal;";
        if (i === 0) th.style.textAlign = "left";
        trh.appendChild(th);
      }
      thead.appendChild(trh);

      // --- DATA ---
      for (var r=0;r<items.length;r++){
        var row = items[r];
        var tr = document.createElement("tr");
        var isLast = (r === items.length - 1);

        for (var c=0;c<headerKeys.length;c++){
          var key = headerKeys[c];
          var val = row[key];
          var td = document.createElement("td");

          td.style.cssText =
            "padding:5px;border-bottom:1px solid #eee;"
            + (c>0 ? "text-align:center;" : "text-align:left;")
            + "overflow-wrap:anywhere;word-break:break-word;white-space:normal;";

          if (isLast) {
            td.style.fontWeight = "bold";
            td.style.fontSize = "15px";
            if (c === 0) td.style.textAlign = "center";
          }

          td.innerHTML = isChecked(val) ? checkIcon() : (val == null ? "" : val);
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }

      // --- Zvýraznění celých sloupců 2–4 (barevně) ---
      var lastCol = -1;
      var colors = {
        1: "#d4edda", // sloupec 2 zelená
        2: "#dbeafe", // sloupec 3 modrá
        3: "#f8d7da"  // sloupec 4 červená
      };

      function clearHighlight(){
        if (lastCol === -1) return;
        for (var r=0; r<table.rows.length; r++){
          var cell = table.rows[r].cells[lastCol];
          if (cell) cell.style.backgroundColor = "";
        }
        lastCol = -1;
      }

      function highlightCol(col){
        if (col === lastCol) return;
        clearHighlight();
        if (colors[col]) {
          for (var r=0; r<table.rows.length; r++){
            var cell = table.rows[r].cells[col];
            if (cell) cell.style.backgroundColor = colors[col];
          }
          lastCol = col;
        }
      }

      table.addEventListener("mousemove", function(e){
        var cell = e.target;
        while (cell && cell !== table && cell.tagName !== 'TD' && cell.tagName !== 'TH') {
          cell = cell.parentNode;
        }
        if (!cell) { clearHighlight(); return; }
        var idx = cell.cellIndex;
        if (typeof idx === "number") {
          highlightCol(idx);
        } else {
          clearHighlight();
        }
      });

      table.addEventListener("mouseleave", clearHighlight);
    })
    .catch(function(){
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();

function highlightThirdColumn() {
  var table = document.getElementById("cenik-test");
  if (!table) return;

  var colIndex = 2; // 0-based -> třetí sloupec
  var allRows = table.rows;

  // podbarvení + svislé hrany
  for (var r=0; r<allRows.length; r++) {
    var cell = allRows[r].cells[colIndex];
    if (cell) {
      cell.style.backgroundColor = "rgba(230,0,0,0.05)";
      cell.style.borderLeft = "1px solid #e00000";
      cell.style.borderRight = "1px solid #e00000";
    }
  }

  // horní hrana + zaoblení
  if (allRows[0] && allRows[0].cells[colIndex]) {
    var th = allRows[0].cells[colIndex];
    th.style.borderTop = "1px solid #e00000";
    th.style.borderTopLeftRadius = "10px";
    th.style.borderTopRightRadius = "10px";
  }

  // spodní hrana + zaoblení
  var lastRow = allRows[allRows.length-1];
  if (lastRow && lastRow.cells[colIndex]) {
    var td = lastRow.cells[colIndex];
    td.style.borderBottom = "1px solid #e00000";
    td.style.borderBottomLeftRadius = "10px";
    td.style.borderBottomRightRadius = "10px";
  }

  // === ŠTÍTEK DOPORUČUJEME (svisle uprostřed sloupce) ===
  var rectTop = allRows[0].cells[colIndex].getBoundingClientRect();
  var rectBottom = lastRow.cells[colIndex].getBoundingClientRect();
  var rectTable = table.getBoundingClientRect();

  var topPos = rectTop.top - rectTable.top;
  var colHeight = rectBottom.bottom - rectTop.top;

  var label = document.createElement("div");
  label.textContent = "DOPORUČUJEME";
  label.style.cssText = `
    position:absolute;
    left:${rectTop.left - rectTable.left - 55}px;
    top:${topPos + colHeight/2}px;
    transform:translateY(-50%) rotate(-90deg);
    background:#e60000;
    color:#fff;
    font-weight:bold;
    font-size:14px;
    padding:6px 12px;
    border-radius:6px;
    white-space:nowrap;
    z-index:10;
  `;

  table.style.position = "relative"; // nutné pro absolutní pozicování
  table.appendChild(label);
}

// spustíme s malým zpožděním, aby byla tabulka jistě hotová
setTimeout(highlightThirdColumn, 200);

// nastavení tabulky tak, aby šel použít border-radius
var style = document.createElement("style");
style.textContent = `
  #cenik-test {
    border-collapse: separate !important;
    border-spacing: 0 !important;
  }
`;
document.head.appendChild(style);


