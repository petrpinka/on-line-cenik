<script>
// CENÍK – verze 10-10-25, permanentní zvýraznění 3. sloupce + hover na 1. sloupec
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
      table.style.position = "relative";

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

      // --- HOVER: podbarvení řádku při najetí na 1. sloupec ---
      var lastRow = null;
      function clearRow(){
        if (lastRow){
          for (var i=0;i<lastRow.cells.length;i++){
            lastRow.cells[i].style.backgroundColor = "";
          }
        }
        lastRow = null;
      }
      table.addEventListener("mousemove", function(e){
        var cell = e.target.closest("td,th");
        if (!cell) return;
        if (cell.cellIndex === 0 && cell.tagName === "TD") {
          clearRow();
          var row = cell.parentNode;
          for (var i=0;i<row.cells.length;i++){
            row.cells[i].style.backgroundColor = "#f5f5f5";
          }
          lastRow = row;
        } else {
          clearRow();
        }
      });
      table.addEventListener("mouseleave", clearRow);

      // --- PERMANENTNÍ zvýraznění 3. sloupce ---
      var col = 2; // třetí sloupec (0 = první)
      // záhlaví
      if (thead.rows[0] && thead.rows[0].cells[col]) {
        thead.rows[0].cells[col].style.background = "#fc0303";
        thead.rows[0].cells[col].style.color = "#fff";
        thead.rows[0].cells[col].style.borderRadius = "8px 8px 0 0";
      }
      // zápatí
      if (tbody.rows.length > 0) {
        var lc = tbody.rows[tbody.rows.length-1].cells[col];
        lc.style.background = "#fc0303";
        lc.style.color = "#fff";
        lc.style.borderRadius = "0 0 8px 8px";
      }
    })
    .catch(function(){
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();
</script>
