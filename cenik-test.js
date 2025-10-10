<script>
// SNOWLAB CENÍK – „nezničitelný“ renderer pro Shoptet
(function(){
  var JSON_URL = "https://petrpinka.github.io/on-line-cenik/cenik4.json";

  // Pomůcky
  function byId(id){ return document.getElementById(id); }
  function getItems(data){
    if (data && Array.isArray(data.items)) return data.items;
    if (Array.isArray(data)) return data;
    return null;
  }

  // Jednorázové vykreslení (idempotentní)
  async function renderOnce(){
    var tbl = byId("cenik-test");
    if (!tbl) return false;               // tabulka ještě není v DOM
    if (tbl.dataset.rendered === "1") return true; // už vykresleno

    // zajistit thead/tbody
    var thead = tbl.querySelector("thead") || tbl.createTHead();
    var tbody = tbl.querySelector("tbody") || tbl.createTBody();
    thead.innerHTML = "";
    tbody.innerHTML = "";

    // stáhnout data (s no-cache param, ale max. jednoduchost)
    var r = await fetch(JSON_URL + "?nocache=" + Date.now());
    if (!r.ok) { console.error("Ceník: HTTP", r.status); return false; }
    var data = await r.json();
    var items = getItems(data);
    if (!items || !items.length){ console.error("Ceník: prázdná data"); return false; }

    var keys = Object.keys(items[0]);

    // COLGROUP (rovnoměrně, ať nic nepadá)
    var oldCol = tbl.querySelector("colgroup");
    if (oldCol) oldCol.remove();
    var cg = document.createElement("colgroup");
    for (var i=0;i<keys.length;i++){
      var col = document.createElement("col");
      col.style.width = (100/keys.length) + "%";
      cg.appendChild(col);
    }
    tbl.insertBefore(cg, thead);

    // HLAVIČKA
    var trh = document.createElement("tr");
    keys.forEach((k,i)=>{
      var th = document.createElement("th");
      th.textContent = k;
      th.style.cssText = "padding:6px;border-bottom:1px solid #ddd;text-align:"+ (i===0?"left":"center")+";font-weight:700;background:#fafafa";
      trh.appendChild(th);
    });
    thead.appendChild(trh);

    // DATA
    items.forEach(row=>{
      var tr = document.createElement("tr");
      keys.forEach((k,i)=>{
        var td = document.createElement("td");
        var v  = row[k];
        td.textContent = (v==null?"":v);
        td.style.cssText = "padding:6px;border-bottom:1px solid #eee;text-align:"+ (i===0?"left":"center");
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // poslední řádek zvýraznit
    if (tbody.rows.length){
      var last = tbody.rows[tbody.rows.length-1];
      for (var c=0;c<last.cells.length;c++){
        last.cells[c].style.fontWeight = "700";
        last.cells[c].style.fontSize   = "16px";
        last.cells[c].style.borderTop  = "1px solid #ddd";
        if (c===0) last.cells[c].style.textAlign = "center";
      }
    }

    // označit jako vykreslené
    tbl.dataset.rendered = "1";
    console.log("Ceník: vykresleno");
    return true;
  }

  // Bezpečné spuštění v různých stavech Shoptetu
  function tryRender(){
    renderOnce().then(function(done){
      if (!done){
        // Ještě to nevyšlo? Zkusíme to později.
        setTimeout(renderOnce, 250);
        setTimeout(renderOnce, 1000);
      }
    });
  }

  // Spouštěče
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", tryRender);
  } else {
    tryRender();
  }
  window.addEventListener("load", tryRender);

  // Pokud Shoptet používá vlastní DOM ready/eventy – zachytit:
  window.addEventListener("ShoptetDOMReady", tryRender);
  document.addEventListener("shoptet.contentLoaded", tryRender);
  document.addEventListener("shoptet.ajaxComplete", tryRender);

  // A navíc hlídáme DOM, kdyby editor/šablona tabulku dopsala později
  var mo = new MutationObserver(function(muts){
    for (var m of muts){
      if (m.type === "childList"){
        if (byId("cenik-test") && byId("cenik-test").dataset.rendered !== "1"){
          tryRender();
          break;
        }
      }
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();
</script>
