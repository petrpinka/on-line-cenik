<script>
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

      // --- jistota, že existuje thead/tbody ---
      var thead = table.querySelector("thead");
      if (!thead) {
        thead = document.createElement("thead");
        table.appendChild(thead);
      } else {
        thead.innerHTML = "";
      }

      var tbody = table.querySelector("tbody");
      if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
      } else {
        tbody.innerHTML = "";
      }

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
        th.style.cssText = "padding:6px;font-weight:bold;border-bottom:1px solid #ddd;text-align:center;word-break:break-word;white-space:normal;";
        if (i === 0) th.style.textAlign = "left";
        trh.appendChild(th);
      }
      thead.appendChild(trh);

      // --- DATA ---
      for (var r=0;r<items.length;r++){
        var row = items[r];
        var tr = document.createElement("tr");
        var isLast = (r === items.length - 1);
        var isFirst = (r === 0);

        for (var c=0;c<headerKeys.length;c++){
          var key = headerKeys[c];
          var val = row[key];
          var td = document.createElement("td");

          // základní styly
          td.style.cssText =
            "border-bottom:1px solid #eee;"
            + (c>0 ? "text-align:center;" : "text-align:left;");

          // padding: první a poslední řádek větší, ostatní menší
          if (isFirst || isLast) {
            td.style.padding = "8px";
          } else {
            td.style.padding = "3px";
          }

          // poslední řádek tučný
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
    })
    .catch(err => {
      console.error("Chyba při načítání ceníku:", err);
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();

// nastavení tabulky tak, aby šel použít border-radius
var style = document.createElement("style");
style.textContent = `
  #cenik-test {
    border-collapse: separate !important;
    border-spacing: 0 !important;
  }
`;
document.head.appendChild(style);
</script>
