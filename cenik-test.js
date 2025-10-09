// CENÍK – finální 09.10.2025 14:11 (hover i na záhlaví)
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
    .then(r => r.json())
    .then(data => {
      var table = document.getElementById("cenik-test");
      if (!table) return;

      table.style.tableLayout = "fixed";
      table.style.width = "100%";

      var thead = table.querySelector("thead");
      var tbody = table.querySelector("tbody");

      var items = (data && Array.isArray(data.items)) ? data.items : data;
      if (!items || !items.length) return;

      var headerKeys = Object.keys(items[0]);

      // --- COLGROUP ---
      var oldCol = table.querySelector("colgroup");
      if (oldCol) oldCol.remove();

      var colgroup = document.createElement("colgroup");
      for (var i = 0; i < headerKeys.length; i++) {
        var col = document.createElement("col");
        if (headerKeys.length === 4) {
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
        th.style.cssText = "padding:4px 8px;font-weight:bold;border-top:1px solid #ddd;border-bottom:1px solid #ddd;text-align:center;overflow-wrap:anywhere;word-break:break-word;white-space:normal;font-size:15px;";
        
        if (i === 0) {
          th.style.textAlign = "left";
          th.style.lineHeight = "1.2"; 
        }
        if (i >= 1 && i <= 3) {
          th.style.fontSize = "13px"; 
          th.style.padding = "2px 4px";
        }

        trh.appendChild(th);
      }
      thead.appendChild(trh);

      // --- DATA ---
      for (var r=0;r<items.length;r++){
        var row = items[r];
        var tr = document.createElement("tr");

        for (var c=0;c<headerKeys.length;c++){
          var key = headerKeys[c];
          var val = row[key];
          var td = document.createElement("td");

          td.style.padding = "3px"; 
          td.style.borderBottom = "1px solid #eee";
          td.style.textAlign = (c>0 ? "center" : "left");
          td.style.wordBreak = "break-word";
          td.style.whiteSpace = "normal";

          if (c === 0) {
            td.style.lineHeight = "1.2"; 
            td.style.padding = "2px 3px"; 
          }

          td.innerHTML = isChecked(val) ? checkIcon() : (val == null ? "" : val);
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }

      // --- POSLEDNÍ ŘÁDEK ---
      var bodyRows = tbody.rows;
      if (bodyRows.length > 0) {
        var lastIdx = bodyRows.length - 1;
        for (var c2=0; c2<bodyRows[lastIdx].cells.length; c2++){
          var cell2 = bodyRows[lastIdx].cells[c2];
          cell2.style.padding = "4px";
          cell2.style.fontWeight = "bold";
          cell2.style.fontSize = "18px";
          cell2.style.borderTop = "1px solid #ddd"; 
          if (c2 === 0) cell2.style.textAlign = "center";
        }
      }

      // --- Zvýraznění sloupců (thead + tbody) ---
      var lastCol = -1;
      var colors = { 1: "#d4edda", 2: "#dbeafe", 3: "#f8d7da" };

      function clearHighlight(){
        if (lastCol === -1) return;
        // tělo
        var rows = tbody ? tbody.rows : [];
        for (var r=0; r<rows.length; r++){
          var cell = rows[r].cells[lastCol];
          if (cell) cell.style.backgroundColor = "";
        }
        // záhlaví
        var headRows = thead ? thead.rows : [];
        for (var h=0; h<headRows.length; h++){
          var hcell = headRows[h].cells[lastCol];
          if (hcell) hcell.style.backgroundColor = "";
        }
        lastCol = -1;
      }

      function highlightCol(col){
        if (col === lastCol) return;
        clearHighlight();
        if (colors[col]) {
          // tělo
          var rows = tbody ? tbody.rows : [];
          for (var r=0; r<rows.length; r++){
            var cell = rows[r].cells[col];
            if (cell) cell.style.backgroundColor = colors[col];
          }
          // záhlaví
          var headRows = thead ? thead.rows : [];
          for (var h=0; h<headRows.length; h++){
            var hcell = headRows[h].cells[col];
            if (hcell) hcell.style.backgroundColor = colors[col];
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
        if (typeof idx === "number") highlightCol(idx); else clearHighlight();
      });

      table.addEventListener("mouseleave", clearHighlight);
    })
    .catch(function(){
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();
