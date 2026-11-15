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
    form.addEventListener("submit", function (ev) {
      var endpoint = form.getAttribute("data-endpoint");
      if (endpoint) {
        ev.preventDefault();
        var status = document.getElementById("form-status");
        fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error("bad");
            form.reset();
            status.textContent = "Thanks. We got your note and will reply within one business day.";
            status.classList.add("show");
          })
          .catch(function () {
            status.textContent = "Something went wrong. Please email us directly at hello@getrefrsh.com.";
            status.classList.add("show");
          });
        return;
      }
      // No form service connected yet: open an email draft instead.
      ev.preventDefault();
      var d = new FormData(form);
      var body =
        "Name: " + (d.get("name") || "") + "\n" +
        "Company: " + (d.get("company") || "") + "\n" +
        "Email: " + (d.get("email") || "") + "\n" +
        "Website: " + (d.get("website") || "") + "\n\n" +
        (d.get("message") || "");
      window.location.href = "mailto:hello@getrefrsh.com?subject=" +
        encodeURIComponent("Inquiry from " + (d.get("company") || d.get("name") || "the website")) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
