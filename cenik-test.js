<script>
(function(){
  var URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik4.json?nocache=" + Date.now();

  fetch(URL_JSON)
    .then(r => r.json())
    .then(data => {
      var table = document.getElementById("cenik-test");
      if (!table) { console.error("Nenalezl jsem #cenik-test"); return; }

      var thead = table.querySelector("thead");
      var tbody = table.querySelector("tbody");

      // vyčistit
      thead.innerHTML = "";
      tbody.innerHTML = "";

      var items = (data && Array.isArray(data.items)) ? data.items : data;
      if (!items || !items.length) { console.error("Data jsou prázdná"); return; }

      var headerKeys = Object.keys(items[0]);

      // hlavička
      var trh = document.createElement("tr");
      headerKeys.forEach(k=>{
        var th = document.createElement("th");
        th.textContent = k;
        trh.appendChild(th);
      });
      thead.appendChild(trh);

      // řádky
      items.forEach(row=>{
        var tr = document.createElement("tr");
        headerKeys.forEach(k=>{
          var td = document.createElement("td");
          td.textContent = row[k] || "";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      console.log("✅ Tabulka byla naplněna");
    })
    .catch(err=>{
      console.error("Chyba při fetchi:", err);
    });
})();
</script>
