(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.toggle("reduced", reduced);

  pressSheets(reduced);
  typeLabels(reduced);

  function pressSheets(reduced) {
    var sheets = document.querySelectorAll(".sheet[data-press]");
    if (!sheets.length) return;

    function flatten(el) {
      el.classList.add("pressed");
    }

    if (reduced || !("IntersectionObserver" in window)) {
      sheets.forEach(flatten);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            flatten(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
    );

    sheets.forEach(function (el) {
      io.observe(el);
    });
  }

  function typeLabels(reduced) {
    var nodes = document.querySelectorAll("[data-type]");
    nodes.forEach(function (el) {
      var text = el.getAttribute("data-type") || "";
      if (reduced) {
        el.textContent = text;
        return;
      }
      el.textContent = "";
      var caret = document.createElement("span");
      caret.className = "caret";
      caret.setAttribute("aria-hidden", "true");
      el.appendChild(caret);
      var i = 0;
      var delay = 420;
      function tick() {
        if (i >= text.length) {
          return;
        }
        el.insertBefore(document.createTextNode(text.charAt(i)), caret);
        i += 1;
        var wait = text.charAt(i - 1) === " " ? 38 : 52;
        window.setTimeout(tick, wait);
      }
      window.setTimeout(tick, delay);
    });
  }
})();
