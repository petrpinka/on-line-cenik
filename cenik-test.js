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

      var thead = table.querySelector("thead");
      var tbody = table.querySelector("tbody");

      if (!thead) { thead = document.createElement("thead"); table.appendChild(thead); }
      if (!tbody) { tbody = document.createElement("tbody"); table.appendChild(tbody); }

      thead.innerHTML = "";
      tbody.innerHTML = "";

      var items = (data && Array.isArray(data.items)) ? data.items : data;
      if (!items || !items.length) return;

      var headerKeys = Object.keys(items[0]);

      // COLGROUP
      var oldCol = table.querySelector("colgroup");
      if (oldCol) oldCol.remove();

      var colgroup = document.createElement("colgroup");
      for (var i=0;i<headerKeys.length;i++){
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

      // ZÁHLAVÍ
      var trh = document.createElement("tr");
      for (var i=0;i<headerKeys.length;i++){
        var th = document.createElement("th");
        th.style.cssText = "padding:6px;font-weight:bold;border-bottom:1px solid #ddd;text-align:center;word-break:break-word;";
        if (i === 0) th.style.textAlign = "left";

        // název sloupce
        var title = document.createElement("div");
        title.textContent = headerKeys[i];
        th.appendChild(title);

        // pokud je to 3. sloupec → přidáme badge
        if (i === 2) {
          var label = document.createElement("div");
          label.textContent = "DOPORUČUJEME";
          label.style.cssText = `
            display:inline-block;
            margin-top:4px;
            background:#e60000;
            color:#fff;
            font-weight:bold;
            font-size:13px;
            padding:4px 10px;
            border-radius:4px;
          `;
          th.appendChild(label);
        }

        trh.appendChild(th);
      }
      thead.appendChild(trh);

      // DATA
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
            + (c>0 ? "text-align:center;" : "text-align:left;");

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
    .catch(() => {
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });

})();

// Border-radius fix
var style = document.createElement("style");
style.textContent = `
  #cenik-test {
    border-collapse: separate !important;
    border-spacing: 0 !important;
  }
`;
document.head.appendChild(style);
</script>
