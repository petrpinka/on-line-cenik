<script>
(function(){
  const URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik4.json?nocache=" + Date.now();

  function checkIcon(){
    return `
      <svg viewBox="0 0 24 24" width="18" height="18" style="display:inline-block;vertical-align:middle;">
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="#111" stroke-width="1.3"/>
        <path d="M7.5 12.5l3 3 6-6" fill="none" stroke="#111" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  function isChecked(v){
    const t = String(v ?? "").trim().toLowerCase();
    return ["✓","✔","true","1","ano","x","✔️"].includes(t);
  }

  fetch(URL_JSON)
    .then(r => r.json())
    .then(data => {
      const thead = document.querySelector("#cenik-table thead");
      const tbody = document.querySelector("#cenik-table tbody");

      const items = Array.isArray(data?.items) ? data.items : data;
      if (!items.length) return;

      const headerKeys = Object.keys(items[0]);

      // záhlaví
      const trh = document.createElement("tr");
      headerKeys.forEach((h,i)=>{
        const th = document.createElement("th");
        th.textContent = h;
        th.style.cssText = "padding:6px;font-weight:bold;border-bottom:1px solid #ddd;text-align:center;";
        trh.appendChild(th);
      });
      thead.appendChild(trh);

      // data
      items.forEach((row,rowIndex)=>{
        const tr = document.createElement("tr");
        const isLast = rowIndex === items.length - 1;

        headerKeys.forEach((key,i)=>{
          const val = row[key];
          const td = document.createElement("td");

          td.style.cssText = "padding:5px;border-bottom:1px solid #eee;" + (i>0 ? "text-align:center;" : "text-align:left;");

          if (isLast) {
            td.style.fontWeight = "bold";
            td.style.fontSize = "15px";
            if (i === 0) td.style.textAlign = "center";
          }

          td.innerHTML = isChecked(val) ? checkIcon() : (val ?? "");
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });

      // zvýraznění sloupců 2–4
      const table = document.getElementById("cenik-table");
      table.querySelectorAll("td, th").forEach(cell=>{
        cell.addEventListener("mouseenter", ()=>{
          const colIndex = cell.cellIndex;
          if (colIndex >= 1 && colIndex <= 3) {
            [...table.rows].forEach(r=>{
              if (r.cells[colIndex]) r.cells[colIndex].classList.add("highlight");
            });
          }
        });
        cell.addEventListener("mouseleave", ()=>{
          table.querySelectorAll("td.highlight, th.highlight").forEach(el=>el.classList.remove("highlight"));
        });
      });
    })
    .catch(e=>{
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();
</script>
