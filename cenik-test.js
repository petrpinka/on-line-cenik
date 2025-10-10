<script>
document.addEventListener("DOMContentLoaded", function(){
  const URL = "https://petrpinka.github.io/on-line-cenik/cenik4.json?nocache=" + Date.now();

  fetch(URL)
    .then(r => r.json())
    .then(data => {
      const table = document.getElementById("cenik-test");
      if (!table) return;

      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");
      thead.innerHTML = "";
      tbody.innerHTML = "";

      const items = Array.isArray(data.items) ? data.items : data;
      if (!items || !items.length) return;

      const keys = Object.keys(items[0]);

      // hlavička
      const trh = document.createElement("tr");
      keys.forEach((k,i) => {
        const th = document.createElement("th");
        th.textContent = k;
        th.style.cssText = "padding:6px;border:1px solid #ddd;text-align:"+(i===0?"left":"center")+";font-weight:bold;";
        trh.appendChild(th);
      });
      thead.appendChild(trh);

      // data
      items.forEach(row => {
        const tr = document.createElement("tr");
        keys.forEach((k,i) => {
          const td = document.createElement("td");
          td.textContent = row[k] || "";
          td.style.cssText = "padding:6px;border-bottom:1px solid #eee;text-align:"+(i===0?"left":"center");
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // poslední řádek tučně
      if (tbody.rows.length){
        const last = tbody.rows[tbody.rows.length-1];
        for (let cell of last.cells){
          cell.style.fontWeight = "bold";
          cell.style.fontSize = "16px";
          cell.style.borderTop = "1px solid #ddd";
        }
      }
    })
    .catch(err => {
      console.error("Ceník se nepodařilo načíst:", err);
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
});
</script>
