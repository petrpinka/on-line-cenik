<script>
// CENÍK – SAFE verze (řeší problém s appendChild na null)
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

  function start(){
    fetch(URL_JSON)
      .then(r => r.json())
      .then(data => {
        var table = document.getElementById("cenik-test");
        if (!table) return;

        table.style.tableLayout = "fixed";
        table.style.width = "100%";
        table.style.position = "relative";

        // vždy čerstvé thead/tbody
        var thead = table.querySelector("thead") || table.createTHead();
        var tbody = table.querySelector("tbody") || table.createTBody();
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
        for (var i=0;i<headerKeys.length;i++){
          var th = document.createElement("th");
          th.textContent = headerKeys[i];
          th.style.cssText = "padding:4px 8px;font-weight:bold;border-top:1px solid #ddd;border-bottom:1px solid #ddd;text-align:center;font-size:15px;";
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
        (table.querySelector("thead") || table.createTHead()).appendChild(trh);

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
          (table.querySelector("tbody") || table.createTBody()).appendChild(tr);
        }

        // --- POSLEDNÍ ŘÁDEK ---
        var bodyRows = (table.querySelector("tbody") || table.createTBody()).rows;
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

        // --- Overlay pro rámeček ---
        var highlight = document.createElement("div");
        highlight.style.position = "absolute";
        highlight.style.top = "0";
        highlight.style.bottom = "0";
        highlight.style.border = "1px solid #bbb";
        highlight.style.borderRadius = "8px";
        highlight.style.background = "transparent";
        highlight.style.pointerEvents = "none";
        highlight.style.opacity = "0";
        highlight.style.transition = "opacity .3s ease";
        highlight.style.zIndex = "5";
        table.appendChild(highlight);

        // --- Overlay pro červené pozadí ---
        var overlayHead = document.createElement("div");
        overlayHead.style.position = "absolute";
        overlayHead.style.background = "#fc0303";
        overlayHead.style.borderRadius = "8px 8px 0 0";
        overlayHead.style.display = "none";
        overlayHead.style.pointerEvents = "none";
        overlayHead.style.zIndex = "1";
        overlayHead.style.opacity = "0";
        overlayHead.style.transition = "opacity .3s ease";
        table.appendChild(overlayHead);

        var overlayFoot = document.createElement("div");
        overlayFoot.style.position = "absolute";
        overlayFoot.style.background = "#fc0303";
        overlayFoot.style.borderRadius = "0 0 8px 8px";
        overlayFoot.style.display = "none";
        overlayFoot.style.pointerEvents = "none";
        overlayFoot.style.zIndex = "1";
        overlayFoot.style.opacity = "0";
        overlayFoot.style.transition = "opacity .3s ease";
        table.appendChild(overlayFoot);

        var lastCol = -1;
        var lastRow = null;

        function clearHighlight(){
          highlight.style.opacity = "0";
          overlayHead.style.opacity = "0";
          overlayFoot.style.opacity = "0";
          if (lastCol !== -1) {
            var th = (table.querySelector("thead")||{}).rows[0]?.cells[lastCol];
            if (th) th.style.color = "";
            var tb = (table.querySelector("tbody")||{}).rows;
            if (tb && tb.length){
              var lc = tb[tb.length-1].cells[lastCol];
              if (lc) lc.style.color = "";
            }
          }
          if (lastRow) {
            for (var i=0;i<lastRow.cells.length;i++){
              lastRow.cells[i].style.backgroundColor = "";
            }
          }
          lastCol = -1;
          lastRow = null;
        }

        function highlightCol(col, row){
          if (col === 0) {
            clearHighlight();
            for (var i=0;i<row.cells.length;i++){
              row.cells[i].style.backgroundColor = "#f5f5f5";
            }
            lastRow = row;
            return;
          }

          if (col === lastCol) return;
          clearHighlight();

          var tableRect = table.getBoundingClientRect();
          var th = (table.querySelector("thead")||{}).rows[0]?.cells[col];
          if (!th) return;

          // rámeček
          var rect = th.getBoundingClientRect();
          highlight.style.left = (rect.left - tableRect.left) + "px";
          highlight.style.width = rect.width + "px";
          highlight.style.opacity = "1";

          // záhlaví overlay
          var headRect = th.getBoundingClientRect();
          overlayHead.style.left = (headRect.left - tableRect.left) + "px";
          overlayHead.style.top = (headRect.top - tableRect.top) + "px";
          overlayHead.style.width = headRect.width + "px";
          overlayHead.style.height = headRect.height + "px";
          overlayHead.style.display = "block";
          overlayHead.style.opacity = "1";
          th.style.color = "#fff"; 
          th.style.position = "relative"; 
          th.style.zIndex = "2";

          // zápatí overlay
          var tb = (table.querySelector("tbody")||{}).rows;
          if (tb && tb.length) {
            var lc = tb[tb.length-1].cells[col];
            if (lc) {
              var footRect = lc.getBoundingClientRect();
              overlayFoot.style.left = (footRect.left - tableRect.left) + "px";
              overlayFoot.style.top = (footRect.top - tableRect.top) + "px";
              overlayFoot.style.width = footRect.width + "px";
              overlayFoot.style.height = footRect.height + "px";
              overlayFoot.style.display = "block";
              overlayFoot.style.opacity = "1";
              lc.style.color = "#fff"; 
              lc.style.position = "relative"; 
              lc.style.zIndex = "2";
            }
          }

          lastCol = col;
        }

        table.addEventListener("mousemove", function(e){
          var cell = e.target;
          while (cell && cell !== table && cell.tagName !== 'TD' && cell.tagName !== 'TH') {
            cell = cell.parentNode;
          }
          if (!cell) { clearHighlight(); return; }
          var colIdx = cell.cellIndex;
          var rowEl = cell.parentNode;
          if (typeof colIdx === "number") highlightCol(colIdx, rowEl); else clearHighlight();
        });

        table.addEventListener("mouseleave", clearHighlight);
      })
      .catch(function(err){
        var hole = document.querySelector("#cenik");
        if (hole) hole.innerHTML = "<p>Nelze načíst ceník.</p>";
        console.error("Chyba při načítání ceníku:", err);
      });
  }

  // počkej na DOM
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
</script>
