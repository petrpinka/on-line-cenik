<script>
// DIAGNOSTIKA CENÍKU – 10-10-25
(function(){
  var TABLE_SEL = "#cenik-test";
  var URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik4.json?nocache=" + Date.now();

  // --- malý debug panel ---
  var panel = document.createElement("div");
  panel.id = "cenik-debug";
  panel.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:99999;background:#fff;border:1px solid #ddd;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.08);font:12px/1.3 Arial, sans-serif;min-width:260px;max-width:320px";
  panel.innerHTML = '<div style="padding:8px 10px;border-bottom:1px solid #eee;font-weight:bold">Ceník – diagnostika</div><div id="cenik-log" style="padding:8px 10px;max-height:220px;overflow:auto"></div>';
  document.body.appendChild(panel);
  var logEl = panel.querySelector("#cenik-log");
  function log(msg, ok){ var d=document.createElement("div"); d.textContent=(ok?"✅ ":"❌ ")+msg; logEl.appendChild(d); }

  // --- helpery ---
  function waitFor(sel, timeout){
    return new Promise(function(resolve, reject){
      var t0 = Date.now();
      var iv = setInterval(function(){
        var el = document.querySelector(sel);
        if (el){ clearInterval(iv); resolve(el); }
        else if (Date.now()-t0 > (timeout||4000)){ clearInterval(iv); reject(new Error("Nenašel jsem "+sel)); }
      }, 100);
    });
  }

  function checkIcon(){
    return '<svg viewBox="0 0 24 24" width="18" height="18" style="display:inline-block;vertical-align:middle;">'
         + '<circle cx="12" cy="12" r="9.5" fill="none" stroke="#111" stroke-width="1.3"></circle>'
         + '<path d="M7.5 12.5l3 3 6-6" fill="none" stroke="#111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'
         + '</svg>';
  }
  function isChecked(v){
    var t = String(v==null?"":v).trim().toLowerCase();
    return ["✓","✔","true","1","ano","x","✔️"].indexOf(t)!==-1;
  }

  // --- start ---
  waitFor(TABLE_SEL, 5000)
  .then(function(table){
    log("Našel jsem tabulku "+TABLE_SEL, true);

    // zajistíme THEAD/TBODY
    var thead = table.querySelector("thead") || table.createTHead();
    var tbody = table.querySelector("tbody") || table.createTBody();
    table.style.tableLayout = "fixed";
    table.style.width = "100%";

    // vyčistit
    thead.innerHTML = "";
    tbody.innerHTML = "";

    // stáhnout data
    return fetch(URL_JSON).then(function(r){
      log("Fetch JSON: status "+r.status, r.ok);
      if(!r.ok) throw new Error("HTTP "+r.status);
      return r.json();
    }).then(function(data){
      // rozpoznat strukturu
      var items = (data && Array.isArray(data.items)) ? data.items
                 : (Array.isArray(data) ? data : null);
      if(!items || !items.length){ log("Data jsou prázdná nebo v nečekaném formátu", false); return; }
      log("Načteno položek: "+items.length, true);

      var keys = Object.keys(items[0] || {});
      if(!keys.length){ log("První položka nemá klíče (hlavičku)", false); return; }
      log("Detekované sloupce: "+keys.join(" | "), true);

      // COLGROUP (volitelné; nechme rovnoměrně)
      var oldCol = table.querySelector("colgroup");
      if (oldCol) oldCol.remove();
      var colgroup = document.createElement("colgroup");
      for (var i=0;i<keys.length;i++){
        var col = document.createElement("col");
        col.style.width = (100/keys.length) + "%";
        colgroup.appendChild(col);
      }
      table.insertBefore(colgroup, thead);

      // HLAVIČKA
      var trh = document.createElement("tr");
      for (var i=0;i<keys.length;i++){
        var th = document.createElement("th");
        th.textContent = keys[i];
        th.style.cssText = "padding:6px;border-bottom:1px solid #ddd;text-align:"+ (i===0?"left":"center") +";font-weight:bold;background:#fafafa";
        trh.appendChild(th);
      }
      thead.appendChild(trh);

      // DATA
      for (var r=0;r<items.length;r++){
        var tr = document.createElement("tr");
        for (var c=0;c<keys.length;c++){
          var td = document.createElement("td");
          var val = items[r][keys[c]];
          td.innerHTML = isChecked(val) ? checkIcon() : (val==null?"":val);
          td.style.cssText = "padding:6px;border-bottom:1px solid #eee;text-align:"+ (c>0?"center":"left");
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      log("Tabulka byla vygenerována", true);

      // POSLEDNÍ ŘÁDEK tučně
      if (tbody.rows.length){
        var last = tbody.rows[tbody.rows.length-1];
        for (var i=0;i<last.cells.length;i++){
          last.cells[i].style.fontWeight = "bold";
          last.cells[i].style.fontSize = "16px";
          last.cells[i].style.borderTop = "1px solid #ddd";
        }
      }

      // HOVER: řádek při najetí na 1. sloupec
      var lastRow=null;
      function clearRow(){
        if(lastRow){
          for (var i=0;i<lastRow.cells.length;i++) lastRow.cells[i].style.background="";
          lastRow=null;
        }
      }
      table.addEventListener("mousemove", function(e){
        var cell = e.target.closest("td");
        if(!cell) return;
        if(cell.cellIndex===0){
          clearRow();
          var row = cell.parentNode;
          for (var i=0;i<row.cells.length;i++) row.cells[i].style.background="#f5f5f5";
          lastRow=row;
        } else {
          clearRow();
        }
      });
      table.addEventListener("mouseleave", clearRow);

      // TRVALÉ zvýraznění 3. sloupce (index 2)
      var highlightColIndex = 2;
      var totalCols = thead.rows[0] ? thead.rows[0].cells.length : 0;
      if (highlightColIndex >= totalCols){
        log("3. sloupec neexistuje (počet sloupců: "+totalCols+")", false);
      } else {
        // hlavička
        thead.rows[0].cells[highlightColIndex].style.background = "#fc0303";
        thead.rows[0].cells[highlightColIndex].style.color = "#fff";
        thead.rows[0].cells[highlightColIndex].style.borderRadius = "8px 8px 0 0";
        // tělo
        for (var r=0;r<tbody.rows.length;r++){
          var cell = tbody.rows[r].cells[highlightColIndex];
          if (cell){ cell.style.background="#ffe5e5"; cell.style.color="#111"; }
        }
        // poslední řádek červeně a bíle
        if (tbody.rows.length){
          var lastC = tbody.rows[tbody.rows.length-1].cells[highlightColIndex];
          if (lastC){ lastC.style.background="#fc0303"; lastC.style.color="#fff"; lastC.style.borderRadius="0 0 8px 8px"; }
        }
        log("3. sloupec zvýrazněn", true);
      }

    }).catch(function(err){
      log("Chyba při fetch/JSON: "+err.message, false);
    });

  }).catch(function(err){
    log(err.message, false);
    log("Ujistěte se, že na stránce máte např.:", false);
    log('<div id="cenik"><table id="cenik-test"><thead></thead><tbody></tbody></table></div>', false);
  });

})();
</script>
