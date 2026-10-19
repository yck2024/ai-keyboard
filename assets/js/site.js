(function () {
  "use strict";

  // Fade-and-rise on scroll. Content is fully visible without JS or with reduced motion.
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var t = e.target;
          t.classList.add("in");
          io.unobserve(t);
          // Drop the reveal classes once shown, so hover effects on the element work normally.
          setTimeout(function () { t.classList.remove("reveal", "in"); }, 1200);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Screenshot showcase arrows.
  var strip = document.getElementById("strip");
  if (strip) {
    document.querySelectorAll("[data-strip]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = btn.getAttribute("data-strip") === "next" ? 1 : -1;
        strip.scrollBy({ left: dir * 520, behavior: reduce ? "auto" : "smooth" });
      });
    });
  }
})();
