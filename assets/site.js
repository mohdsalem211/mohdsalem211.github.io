(function () {
  var grid = document.querySelector(".pgrid");
  if (grid && document.querySelector(".filters")) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".prod"));
    var btns = Array.prototype.slice.call(document.querySelectorAll(".filters button"));
    var search = document.querySelector(".search");
    var cat = "all", shown = 36;
    var more = document.createElement("button"); more.type = "button"; more.className = "btn more"; more.textContent = "عرض المزيد";
    grid.parentNode.insertBefore(more, grid.nextSibling);
    function apply() {
      var q = (search && search.value || "").trim().toLowerCase(), n = 0, total = 0;
      cards.forEach(function (c) {
        var ok = (cat === "all" || c.getAttribute("data-c") === cat) && (!q || c.getAttribute("data-q").indexOf(q) !== -1);
        if (ok) { total++; n++; c.hidden = n > shown; } else c.hidden = true;
      });
      more.hidden = total <= shown;
      more.textContent = "عرض المزيد (" + (total - Math.min(shown, total)) + ")";
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { cat = b.getAttribute("data-f"); shown = 36; btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); apply(); }); });
    if (search) search.addEventListener("input", function () { shown = 36; apply(); });
    more.addEventListener("click", function () { shown += 36; apply(); });
    apply();
  }
  var gq = document.getElementById("gq");
  if (gq) gq.addEventListener("input", function () { var q = gq.value.trim().toLowerCase(); document.querySelectorAll(".gi").forEach(function (g) { g.hidden = q && g.getAttribute("data-q").indexOf(q) === -1; }); });
})();
