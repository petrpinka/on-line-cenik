(function(){
  // URL na JSON (Apps Script nebo GitHub Pages)
  const URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik-full.json?nocache=" + Date.now();

  fetch(URL_JSON)
    .then(r => r.json())
    .then(data => {
      const table = document.querySelector("#cenik-table");
      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");

      // vymazat tabulku
      thead.innerHTML = "";
      tbody.innerHTML = "";

      // záhlaví (první řádek JSONu)
      if (data.length > 0) {
        const headerRow = document.createElement("tr");
        data[0].forEach(cell => {
          const th = document.createElement("th");
          th.innerHTML = cell; // HTML z JSONu
          th.style.border = "1px solid #ddd";
          th.style.padding = "8px";
          th.style.background = "#f5f5f5";
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
      }

      // tělo tabulky
      for (let i = 1; i < data.length; i++) {
        const tr = document.createElement("tr");
        data[i].forEach(cell => {
          const td = document.createElement("td");
          td.innerHTML = cell; // HTML z JSONu
          td.style.border = "1px solid #ddd";
          td.style.padding = "8px";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      // === zvýraznění sloupce při hoveru ===
      const rows = table.querySelectorAll("tr");
      rows.forEach(row => {
        row.querySelectorAll("td, th").forEach((cell, colIndex) => {
          cell.addEventListener("mouseenter", () => {
            rows.forEach(r => {
              const c = r.cells[colIndex];
              if (c) c.style.backgroundColor = "#f0f8ff"; // světle modrá
            });
          });
          cell.addEventListener("mouseleave", () => {
            rows.forEach(r => {
              const c = r.cells[colIndex];
              if (c) c.style.backgroundColor = ""; // reset
            });
          });
        });
      });

    })
    .catch(err => {
      console.error("Chyba při načítání ceníku:", err);
      const table = document.querySelector("#cenik-table");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "<tr><td colspan='99'>Nelze načíst ceník</td></tr>";
    });
})();
