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

      // === STYLY ===
      const css = `
        #cenik-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
          text-align: center;
          position: relative; /* důležité pro pozicování highlightu */
        }
        #cenik-table th,
        #cenik-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        #cenik-table th {
          font-weight: bold;
          background: #f7f7f7;
        }

        /* box okolo celého 3. sloupce */
        #cenik-table .highlight-col {
          position: absolute;
          top: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 5;
        }
        #cenik-table .highlight-col-inner {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          border: 3px solid #e60000;
          border-radius: 6px;
          background: rgba(230,0,0,0.05); /* světle červené pozadí */
          box-shadow: 0 4px 15px rgba(0,0,0,0.15); /* jemný stín */
        }

        /* štítek */
        #cenik-table .recommended-label {
          position: absolute;
          left: -50px;
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

        @media (max-width: 768px) {
          #cenik-table th, #cenik-table td {
            font-size: 13px;
            padding: 6px;
          }
          #cenik-table .recommended-label {
            font-size: 12px;
            padding: 4px 8px;
            left: -38px;
          }
        }
      `;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);

      // výpočet highlightu až po vykreslení
      requestAnimationFrame(() => {
        const colIndex = 2; // 0-based index = třetí sloupec
        const firstRow = table.querySelector("tr");
        if(firstRow){
          const cells = firstRow.children;
          if(cells[colIndex]){
            const rect = cells[colIndex].getBoundingClientRect();
            const tableRect = table.getBoundingClientRect();
            const left = rect.left - tableRect.left;
            const width = rect.width;

            const highlight = document.createElement("div");
            highlight.className = "highlight-col";
            highlight.style.left = left + "px";
            highlight.style.width = width + "px";

            const inner = document.createElement("div");
            inner.className = "highlight-col-inner";
            highlight.appendChild(inner);

            table.appendChild(highlight);

            // vložení nápisu "DOPORUČUJEME"
            const label = document.createElement("div");
            label.className = "recommended-label";
            label.textContent = "DOPORUČUJEME";
            highlight.appendChild(label);
          }
        }
      });
    });
})();
