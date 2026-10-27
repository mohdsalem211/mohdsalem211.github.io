(function () {
  var grid = document.querySelector(".pgrid");
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".prod"));
  var btns = Array.prototype.slice.call(document.querySelectorAll(".filters button"));
  var search = document.querySelector(".search");
  var cat = "all";
  function apply() {
    var q = (search && search.value || "").trim().toLowerCase();
    cards.forEach(function (c) {
      var ok = (cat === "all" || c.getAttribute("data-c") === cat) && (!q || c.getAttribute("data-q").indexOf(q) !== -1);
      c.hidden = !ok;
    });
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      cat = b.getAttribute("data-f");
      btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      apply();
    });
  });
  if (search) search.addEventListener("input", apply);
})();
