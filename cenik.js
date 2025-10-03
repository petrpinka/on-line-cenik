(function(){
  var URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik4.json?nocache=" + Date.now();

  function checkIcon(){
    // SVG ikona zatržítka – funguje bezpečně z externího JS
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
      var thead = document.querySelector("#cenik-table thead");
      var tbody = document.querySelector("#cenik-table tbody");

      var items = (data && Array.isArray(data.items)) ? data.items : data;
      if (!items || !items.length) return;

      var headerKeys = Object.keys(items[0]);

      // záhlaví
      var trh = document.createElement("tr");
      for (var i=0;i<headerKeys.length;i++){
        var th = document.createElement("th");
        th.textContent = headerKeys[i];
        th.style.cssText = "padding:6px;font-weight:bold;border-bottom:1px solid #ddd;text-align:center;";
        trh.appendChild(th);
      }
      thead.appendChild(trh);

      // řádky dat
      for (var r=0;r<items.length;r++){
        var row = items[r];
        var tr = document.createElement("tr");
        var isLast = (r === items.length - 1);

        for (var c=0;c<headerKeys.length;c++){
          var key = headerKeys[c];
          var val = row[key];
          var td = document.createElement("td");

          td.style.cssText = "padding:5px;border-bottom:1px solid #eee;" + (c>0 ? "text-align:center;" : "text-align:left;");

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
    .catch(function(){
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();
