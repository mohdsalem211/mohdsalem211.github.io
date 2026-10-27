(function () {
  function $(id) { return document.getElementById(id); }
  function num(id) { var v = parseFloat(($(id) || {}).value); return isFinite(v) ? v : NaN; }
  function fmt(v, d) { return isFinite(v) ? v.toLocaleString("en-US", { maximumFractionDigits: d == null ? 1 : d }) : "—"; }
  function on(ids, fn) { ids.forEach(function (i) { var e = $(i); if (e) { e.addEventListener("input", fn); e.addEventListener("change", fn); } }); fn(); }
  var LB_CC = 10.5; // 1 lb/hr ≈ 10.5 cc/min (gasoline, common approximation)

  // 1) Injector size
  if ($("inj-hp")) on(["inj-hp", "inj-cyl", "inj-bsfc", "inj-duty", "inj-fuel"], function () {
    var hp = num("inj-hp"), n = num("inj-cyl"), b = num("inj-bsfc"), d = num("inj-duty") / 100, f = parseFloat($("inj-fuel").value);
    var lb = hp * b * f / (n * d);
    $("inj-out").innerHTML = "تقريباً <b>" + fmt(lb * LB_CC, 0) + " cc/min</b> لكل بخاخ (" + fmt(lb, 1) + " lb/hr)";
  });
  // 2) Flow at new pressure
  if ($("fp-flow")) on(["fp-flow", "fp-p1", "fp-p2"], function () {
    var q = num("fp-flow") * Math.sqrt(num("fp-p2") / num("fp-p1"));
    $("fp-out").innerHTML = "التدفق الجديد تقريباً <b>" + fmt(q, 0) + " cc/min</b>";
  });
  // 3) Fuel pump requirement
  if ($("pump-hp")) on(["pump-hp", "pump-bsfc", "pump-fuel"], function () {
    var lbh = num("pump-hp") * num("pump-bsfc") * parseFloat($("pump-fuel").value);
    var lph = lbh * 0.4536 / (parseFloat($("pump-fuel").value) > 1.2 ? 0.785 : 0.74);
    $("pump-out").innerHTML = "تحتاج طرمبة تعطي تقريباً <b>" + fmt(lph, 0) + " لتر/ساعة</b> على ضغط البنزين اللي بتشتغل عليه، وخلّ هامش أمان فوقها.";
  });
  // 4) Lambda / AFR
  if ($("lam")) {
    var lock = false;
    function fromLam() { if (lock) return; lock = true; $("afr").value = fmt(num("lam") * parseFloat($("stoich").value), 2).replace(/,/g, ""); lock = false; }
    function fromAfr() { if (lock) return; lock = true; $("lam").value = fmt(num("afr") / parseFloat($("stoich").value), 3).replace(/,/g, ""); lock = false; }
    $("lam").addEventListener("input", fromLam); $("stoich").addEventListener("change", fromLam); $("afr").addEventListener("input", fromAfr); fromLam();
  }
  // 5) Pressure units
  if ($("pr-v")) on(["pr-v", "pr-u"], function () {
    var v = num("pr-v"), u = $("pr-u").value, bar = u === "bar" ? v : u === "psi" ? v / 14.5038 : v / 100;
    $("pr-out").innerHTML = "<b>" + fmt(bar, 2) + "</b> bar · <b>" + fmt(bar * 14.5038, 1) + "</b> psi · <b>" + fmt(bar * 100, 0) + "</b> kPa";
  });
  // 6) Injector units
  if ($("iu-v")) on(["iu-v", "iu-u"], function () {
    var v = num("iu-v"), cc = $("iu-u").value === "cc" ? v : v * LB_CC;
    $("iu-out").innerHTML = "<b>" + fmt(cc, 0) + "</b> cc/min · <b>" + fmt(cc / LB_CC, 1) + "</b> lb/hr";
  });
  // 7) Duty cycle
  if ($("dc-rpm")) on(["dc-rpm", "dc-pw"], function () {
    var dc = num("dc-pw") * num("dc-rpm") / 1200;
    $("dc-out").innerHTML = "Duty تقريباً <b>" + fmt(dc, 0) + "%</b>" + (dc > 85 ? " · <span style='color:var(--bad)'>عالي، البخاخ قريب من حده</span>" : "");
  });
})();
