(function () {
  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var hdr = document.querySelector(".site-header");
      if (hdr) nav.style.setProperty("--nav-top", Math.round(hdr.getBoundingClientRect().bottom) + "px");
      var open = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Gentle reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Contact form
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var button = form.querySelector('button[type="submit"]');
    var show = function (msg) { status.textContent = msg; status.classList.add("show"); };

    // Shown after the no-JavaScript fallback redirects back here
    if (/[?&]sent=1/.test(location.search)) show("Thanks. We got your note and will reply within one business day.");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      if (form.elements._honey && form.elements._honey.value) return; // likely spam

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data._replyto = data.email;

      button.disabled = true;
      var label = button.textContent;
      button.textContent = "Sending...";
      status.classList.remove("show");

      fetch(form.getAttribute("data-endpoint"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) === "false") throw new Error(j.message || "failed"); }); })
        .then(function () {
          form.reset();
          show("Thanks. We got your note and will reply within one business day.");
        })
        .catch(function () {
          show("Sorry, something went wrong sending your message. Please email us at hello@getrefrsh.com.");
        })
        .then(function () { button.disabled = false; button.textContent = label; });
    });
  }
})();
