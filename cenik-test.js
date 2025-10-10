<script>
// CENÍK – verze 10-10-25, 11:41 (hover na 1. sloupec, permanentní zvýraznění 3. sloupce)
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
      thead.innerHTML = "";
      tbody.innerHTML = "";

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
      headerKeys.forEach((key,i)=>{
        var th = document.createElement("th");
        th.textContent = key;
        th.style.cssText = "padding:4px 8px;font-weight:bold;border-top:1px solid #ddd;border-bottom:1px solid #ddd;text-align:center;font-size:15px;";
        if (i === 0) th.style.textAlign = "left";
        if (i >= 1 && i <= 3) {
          th.style.fontSize = "13px"; 
          th.style.padding = "2px 4px";
        }
        trh.appendChild(th);
      });
      thead.appendChild(trh);

      // --- DATA ---
      items.forEach(row=>{
        var tr = document.createElement("tr");
        headerKeys.forEach((key,c)=>{
          var td = document.createElement("td");
          var val = row[key];
          td.style.padding = "3px";
          td.style.borderBottom = "1px solid #eee";
          td.style.textAlign = (c>0 ? "center" : "left");
          td.innerHTML = isChecked(val) ? checkIcon() : (val == null ? "" : val);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // --- POSLEDNÍ ŘÁDEK ---
      if (tbody.rows.length > 0) {
        var lastIdx = tbody.rows.length - 1;
        for (var c=0;c<tbody.rows[lastIdx].cells.length;c++){
          var cell = tbody.rows[lastIdx].cells[c];
          cell.style.fontWeight = "bold";
          cell.style.fontSize = "18px";
          cell.style.borderTop = "1px solid #ddd"; 
          if (c === 0) cell.style.textAlign = "center";
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
        var cell = e.target.closest("td");
        if (!cell) return;
        if (cell.cellIndex === 0) {
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
      if (thead.rows[0] && thead.rows[0].cells[col]) {
        var th = thead.rows[0].cells[col];
        th.style.background = "#fc0303";
        th.style.color = "#fff";
        th.style.borderRadius = "8px 8px 0 0";
      }
      if (tbody.rows.length > 0) {
        var lc = tbody.rows[tbody.rows.length-1].cells[col];
        if (lc) {
          lc.style.background = "#fc0303";
          lc.style.color = "#fff";
          lc.style.borderRadius = "0 0 8px 8px";
        }
      }
    })
    .catch(function(){
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();
</script>
