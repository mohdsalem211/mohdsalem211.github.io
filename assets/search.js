(function () {
  var inp = document.getElementById("sq"), box = document.getElementById("sres"), cnt = document.getElementById("scount");
  if (!inp) return;
  var data = null, root = "../";
  var norm = function (s) { return String(s).toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي"); };
  var params = new URLSearchParams(location.search); if (params.get("q")) inp.value = params.get("q");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function run() {
    if (!data) return;
    var q = norm(inp.value.trim()); box.innerHTML = "";
    if (q.length < 2) { cnt.textContent = "اكتب حرفين على الأقل."; return; }
    var terms = q.split(/\s+/);
    var hits = data.filter(function (d) { var s = norm(d.t + " " + d.x + " " + d.k); return terms.every(function (t) { return s.indexOf(t) !== -1; }); });
    hits.sort(function (a, b) { return (a.e ? 1 : 0) - (b.e ? 1 : 0); });
    cnt.textContent = hits.length + " نتيجة" + (hits.length > 60 ? "، أول 60" : "");
    hits.slice(0, 60).forEach(function (d) {
      var href = d.e ? d.u : root + d.u;
      box.insertAdjacentHTML("beforeend", '<a class="sr" href="' + esc(href) + '"' + (d.e ? ' target="_blank" rel="noopener nofollow sponsored"' : "") + '><span class="chip' + (d.e ? "" : " amber") + '">' + esc(d.k) + '</span><b' + (d.e ? ' dir="ltr"' : "") + '>' + esc(d.t) + '</b><span class="muted sm">' + esc(d.x) + "</span></a>");
    });
  }
  fetch(root + "assets/search.json").then(function (r) { return r.json(); }).then(function (j) { data = j; run(); });
  inp.addEventListener("input", function () { history.replaceState(null, "", "?q=" + encodeURIComponent(inp.value)); run(); });
})();
