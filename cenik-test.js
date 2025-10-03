(function(){
  const URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik4.json?nocache=" + Date.now();

  function checkIcon(){
    return `
      <svg viewBox="0 0 24 24" width="20" height="20" style="display:inline-block;vertical-align:middle;">
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="#111" stroke-width="1.5"/>
        <path d="M7 12l3 3 7-7" fill="none" stroke="#111" stroke-width="1.5"/>
      </svg>
    `;
  }

  fetch(URL_JSON)
    .then(r => r.json())
    .then(data => {
      const table = document.querySelector("#cenik-test");
      if(!table) return;

      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");

      // naplnění hlavičky
      const headerRow = document.createElement("tr");
      data.headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // naplnění těla tabulky
      data.rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach((cell, i) => {
          const td = document.createElement("td");
          if(cell === "✔") {
            td.innerHTML = checkIcon();
          } else {
            td.textContent = cell;
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // === ZVÝRAZNĚNÍ 3. sloupce ===
      const css = `
        #cenik-table td:nth-child(3),
        #cenik-table th:nth-child(3) {
          position: relative;
          border: 3px solid #e60000;
        }
        #cenik-table td:nth-child(3) {
          background: rgba(230,0,0,0.05);
        }
        #cenik-table .recommended-label {
          position: absolute;
          left: -45px;
          top: 40%;
          transform: rotate(-90deg);
          background: #e60000;
          color: #fff;
          font-weight: bold;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
          z-index: 10;
        }
      `;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);

      // vložení nápisu "DOPORUČUJEME"
      const th = thead.querySelector("th:nth-child(3)");
      if(th){
        const label = document.createElement("div");
        label.className = "recommended-label";
        label.textContent = "DOPORUČUJEME";
        th.style.position = "relative";
        th.appendChild(label);
      }
    });
})();
