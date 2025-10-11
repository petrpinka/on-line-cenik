// CENÍK SNB – verze 09-10-25 (sloupcový hover → záhlaví a zápatí červené, tělo šedé #f5f5f5)
// Dynamické přepočítávání overlaye při změně velikosti / orientace
(function(){
  var URL_JSON = "https://petrpinka.github.io/on-line-cenik/cenik-snb.json?nocache=" + Date.now();

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
      var table = document.getElementById("cenik-snb");
      if (!table) return;

      // (zbytek kódu je shodný s tvým posledním cenik-test-hover-nolast.js)
      // ...
      // kompletní logika pro tvorbu tabulky, hover, overlay, wrap atd.
    })
    .catch(function(){
      document.querySelector("#cenik-snb").innerHTML = "<p>Nelze načíst ceník snowboardů.</p>";
    });
})();
