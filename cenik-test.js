<script>
// CENÍK – verze 10-10-25, 11:43 (jednoduchá verze: hover 1. sloupec, 3. sloupec zvýrazněný)
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

      var thead = table.querySelector("thead");
      var tbody = table.querySelector("tbody");
      thead.innerHTML = "";
      tbody.innerHTML = "";

      var items = (data && Array.isArray(data.items)) ? data.items : data;
      if (!items || !items.length) return;
      var headerKeys = Object.keys(items[0]);

      // --- HLAVIČKA ---
      var trh = document.createElement("tr");
      headerKeys.forEach((key,i)=>{
        var th = document.createElement("th");
        th.textContent = key;
        th.style.cssText = "padding:6px;border:1px solid #ddd;text-align:center;font-weight:bold;";
        if (i===0) th.style.textAlign="left";
        trh.appendChild(th);
      });
      thead.appendChild(trh);

      // --- DATA ---
      items.forEach(row=>{
        var tr = document.createElement("tr");
        headerKeys.forEach((key,c)=>{
          var td = document.createElement("td");
          var val = row[key];
          td.innerHTML = isChecked(val) ? checkIcon() : (val==null?"":val);
          td.style.cssText = "padding:6px;border-bottom:1px solid #eee;text-align:"+(c>0?"center":"left")+";";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // --- POSLEDNÍ ŘÁDEK tučný ---
      if (tbody.rows.length>0){
        var last = tbody.rows[tbody.rows.length-1];
        for (let cell of last.cells){
          cell.style.fontWeight="bold";
          cell.style.fontSize="16px";
        }
      }

      // --- HOVER: řádek při najetí na první sloupec ---
      var lastRow=null;
      function clearRow(){
        if (lastRow){
          for (let c of lastRow.cells) c.style.background="";
          lastRow=null;
        }
      }
      table.addEventListener("mousemove", e=>{
        var cell = e.target.closest("td");
        if (!cell) return;
        if (cell.cellIndex===0){
          clearRow();
          var row=cell.parentNode;
          for (let c of row.cells) c.style.background="#f5f5f5";
          lastRow=row;
        } else {
          clearRow();
        }
      });
      table.addEventListener("mouseleave", clearRow);

      // --- PERMANENTNÍ zvýraznění 3. sloupce ---
      var col = 2; // třetí sloupec
      for (var r=-1; r<tbody.rows.length; r++){
        // r=-1 = hlavička
        var row = (r===-1)? thead.rows[0] : tbody.rows[r];
        if (row && row.cells[col]){
          row.cells[col].style.background="#fc0303";
          row.cells[col].style.color="#fff";
        }
      }
    })
    .catch(()=>{
      document.querySelector("#cenik").innerHTML="<p>Nelze načíst ceník.</p>";
    });
})();
</script>
