(function () {
  "use strict";

  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var sheets = Array.prototype.slice.call(document.querySelectorAll("[data-press]"));
  var labels = Array.prototype.slice.call(document.querySelectorAll("[data-type]"));
  var observers = [];

  if (motion.matches || !("IntersectionObserver" in window)) {
    finishEverything();
    return;
  }

  observeReveals();
  observeSheets();
  observeLabels();

  if (motion.addEventListener) {
    motion.addEventListener("change", function (event) {
      if (event.matches) finishEverything();
    });
  }

  function observeReveals() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    reveals.forEach(function (element) {
      observer.observe(element);
    });
    observers.push(observer);
  }

  function observeSheets() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-pressed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -4% 0px" });

    sheets.forEach(function (element) {
      observer.observe(element);
    });
    observers.push(observer);
  }

  function observeLabels() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        typeLabel(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.75 });

    labels.forEach(function (element) {
      observer.observe(element);
    });
    observers.push(observer);
  }

  function typeLabel(element) {
    if (element.dataset.typed === "true") return;
    element.dataset.typed = "true";
    var text = element.getAttribute("data-type") || "";
    var index = 0;
    element.textContent = "";

    function addCharacter() {
      if (motion.matches) {
        element.textContent = text;
        return;
      }
      if (index >= text.length) return;
      var character = text.charAt(index);
      element.textContent += character;
      index += 1;
      var pause = /[.,]/.test(character) ? 180 : character === " " ? 34 : 52;
      window.setTimeout(addCharacter, pause);
    }

    window.setTimeout(addCharacter, 260);
  }

  function finishEverything() {
    observers.forEach(function (observer) {
      observer.disconnect();
    });
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
    sheets.forEach(function (element) {
      element.classList.add("is-pressed");
    });
    labels.forEach(function (element) {
      element.textContent = element.getAttribute("data-type") || "";
      element.dataset.typed = "true";
    });
  }
})();
