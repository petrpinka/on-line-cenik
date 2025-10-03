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
    .then(function(r){ return r.json(); })
    .then(function(data){
      var table = document.getElementById("cenik-table");
      if (!table) return;

      table.style.tableLayout = "fixed";
      table.style.width = "100%";

      var thead = table.querySelector("thead");
      var tbody = table.querySelector("tbody");

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
          // 34% - 22% - 22% - 22%
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
        th.style.cssText = "padding:6px;font-weight:bold;border-bottom:1px solid #ddd;text-align:center;overflow-wrap:anywhere;word-break:break-word;white-space:normal;";
        if (i === 0) th.style.textAlign = "left";
        trh.appendChild(th);
      }
      thead.appendChild(trh);

      // --- DATA ---
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
            + (c>0 ? "text-align:center;" : "text-align:left;")
            + "overflow-wrap:anywhere;word-break:break-word;white-space:normal;";

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

      // --- Zvýraznění celých sloupců 2–4 (barevně) ---
      var lastCol = -1;
      var colors = {
        1: "#d4edda", // sloupec 2 zelená
        2: "#dbeafe", // sloupec 3 modrá
        3: "#f8d7da"  // sloupec 4 červená
      };

      function clearHighlight(){
        if (lastCol === -1) return;
        for (var r=0; r<table.rows.length; r++){
          var cell = table.rows[r].cells[lastCol];
          if (cell) cell.style.backgroundColor = "";
        }
        lastCol = -1;
      }

      function highlightCol(col){
        if (col === lastCol) return;
        clearHighlight();
        if (colors[col]) {
          for (var r=0; r<table.rows.length; r++){
            var cell = table.rows[r].cells[col];
            if (cell) cell.style.backgroundColor = colors[col];
          }
          lastCol = col;
        }
      }

      table.addEventListener("mousemove", function(e){
        var cell = e.target;
        while (cell && cell !== table && cell.tagName !== 'TD' && cell.tagName !== 'TH') {
          cell = cell.parentNode;
        }
        if (!cell) { clearHighlight(); return; }
        var idx = cell.cellIndex;
        if (typeof idx === "number") {
          highlightCol(idx);
        } else {
          clearHighlight();
        }
      });

      table.addEventListener("mouseleave", clearHighlight);
    })
    .catch(function(){
      document.querySelector("#cenik").innerHTML = "<p>Nelze načíst ceník.</p>";
    });
})();

<script>
(function(){
  // počkáme, až se tabulka z původního skriptu vytvoří
  function onReady(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(() => {
    const MAX_WAIT = 6000;   // ms
    const INTERVAL = 60;     // ms
    let waited = 0;
    const timer = setInterval(() => {
      const table = document.querySelector('#cenik-table');
      const theadReady = table?.querySelector('thead tr th:nth-child(3)');
      const bodyReady  = table?.querySelector('tbody tr td:nth-child(3)');
      if (theadReady && bodyReady) {
        clearInterval(timer);
        highlightThirdColumn(table);
      } else {
        waited += INTERVAL;
        if (waited >= MAX_WAIT) clearInterval(timer); // tichý stop, nic nepadá
      }
    }, INTERVAL);
  });

  function highlightThirdColumn(table){
    const colIndex = 2; // 0-based => třetí sloupec

    // 1) přidáme třídy do hlavičky a těla
    const th = table.querySelector('thead tr th:nth-child(3)');
    if (th) {
      th.classList.add('col3','col3-top');
      th.style.position = 'relative';
      // štítek „DOPORUČUJEME“
      const label = document.createElement('div');
      label.className = 'recommended-label';
      label.textContent = 'DOPORUČUJEME';
      th.appendChild(label);
    }

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((tr, i) => {
      const td = tr.children[colIndex];
      if (!td) return;
      td.classList.add('col3');
      if (i === rows.length - 1) td.classList.add('col3-bottom'); // poslední řádek = spodní hrana boxu
    });

    // 2) styly — vytvoří „jediný box“ kolem celého sloupce (bez JS měření)
    const css = `
      #cenik-table { border-collapse: collapse; position: relative; }

      /* podbarvení celé kolony */
      #cenik-table .col3 {
        background: rgba(230,0,0,0.05);
        /* svislé hrany boxu — dáme je na KAŽDOU buňku sloupce,
           border-collapse zajistí plynulé spojení bez mezer */
        border-left: 3px solid #e60000 !important;
        border-right: 3px solid #e60000 !important;
        /* a potlačíme vnitřní horizontální hrany,
           vršek/spodek doplníme zvlášť níže */
        border-top: none !important;
        border-bottom: none !important;
      }

      /* horní hrana boxu (jen hlavička sloupce) */
      #cenik-table thead th.col3-top {
        border-top: 3px solid #e60000 !important;
      }

      /* spodní hrana boxu (jen poslední řádek sloupce) */
      #cenik-table tbody td.col3.col3-bottom {
        border-bottom: 3px solid #e60000 !important;
      }

      /* jemný stín, aby sloupec vystoupil */
      #cenik-table .col3.col3-top,
      #cenik-table .col3.col3-bottom {
        /* nic navíc – stín uděláme přes pseudo-element na hlavičce,
           ať je jen jednou a nepere se s border-collapse */
      }
      #cenik-table thead th.col3-top {
        position: relative;
      }
      #cenik-table thead th.col3-top::after {
        content: "";
        position: absolute;
        left: -3px; right: -3px; top: -3px;
        height: calc(100% + 3px + var(--col3-height, 0px)); /* výšku dopočítáme níže skrz CSS var */
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        pointer-events: none;
        border-radius: 6px;
      }

      /* štítek */
      #cenik-table .recommended-label {
        position: absolute;
        left: -50px;
        top: 40%;
        transform: rotate(-90deg);
        background: #e60000;
        color: #fff;
        font-weight: 700;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1;
        pointer-events: none;
        z-index: 2;
      }

      @media (max-width: 768px){
        #cenik-table .recommended-label {
          left: -38px; font-size: 12px; padding: 4px 8px;
        }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    /* Volitelně: pokus o dopočet výšky pro stín (bez měření layoutu).
       Jednoduchý hack: kolik je řádků v tbody * průměrná výška buňky?
       Necháváme pryč, aby nic nespadlo. Pokud stín nechceš, smaž ::after výše.
    */
  }
})();
</script>

