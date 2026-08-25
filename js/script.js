(function () {
  "use strict";

  var mascot = document.getElementById("hero-mascot");
  var webPath = document.getElementById("webPath");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!mascot || !webPath) return;

  // Anchor point: bottom-center of the nav bar, where the "web" is attached.
  var ANCHOR_Y = 70;
  var BASE_TOP = 64;   // starting top offset of the mascot (px)

  var ticking = false;
  var lastScrollY = window.scrollY || 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function render() {
    ticking = false;

    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var scrollY = window.scrollY || 0;

    // Phase 1: descent, tracked over roughly the first section and a bit.
    var descentDistance = vh * 1.3;
    var descentProgress = clamp(scrollY / descentDistance, 0, 1);
    var maxDrop = vh * 0.5;
    var top = BASE_TOP + descentProgress * maxDrop;

    // Phase 2: once "landed", fade him out as the reader moves past the
    // Swing section, as if he has dropped into the page below.
    var fadeStart = vh * 2.1;
    var fadeEnd = vh * 2.9;
    var fadeProgress = clamp((scrollY - fadeStart) / (fadeEnd - fadeStart), 0, 1);
    var opacity = 1 - fadeProgress;

    // Gentle horizontal drift as the page scrolls, on top of the CSS sway.
    var sway = reduceMotion ? 0 : Math.sin(scrollY / 260) * 22;

    mascot.style.top = top + "px";
    mascot.style.opacity = String(opacity);
    mascot.style.transform = "translateX(calc(-50% + " + sway + "px))";
    mascot.style.pointerEvents = opacity <= 0.02 ? "none" : "none";

    if (opacity <= 0.02) {
      mascot.setAttribute("data-landed", "true");
    } else {
      mascot.removeAttribute("data-landed");
    }

    // Draw the web thread from the nav anchor to the mascot's attach point.
    var anchorX = vw / 2;
    var anchorY = ANCHOR_Y;
    var mascotX = vw / 2 + sway;
    var mascotY = top + 8;

    var dx = mascotX - anchorX;
    var dy = mascotY - anchorY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var sag = Math.min(dist * 0.18, 60);

    var controlX = (anchorX + mascotX) / 2 + dx * 0.05;
    var controlY = (anchorY + mascotY) / 2 + sag;

    var d =
      "M" + anchorX + "," + anchorY +
      " Q" + controlX + "," + controlY +
      " " + mascotX + "," + mascotY;

    webPath.setAttribute("d", d);
    webPath.style.opacity = String(Math.max(opacity, fadeProgress >= 1 ? 0 : 1 - fadeProgress));

    lastScrollY = scrollY;
  }

  function onScrollOrResize() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(render);
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);

  // Initial paint.
  render();

  // ------------------------------------------------------------------
  // Fizz bubbles: a few extra randomly-timed bubbles for the hero can.
  // ------------------------------------------------------------------
  var fizz = document.getElementById("fizz");
  if (fizz && !reduceMotion) {
    for (var i = 0; i < 5; i++) {
      var bubble = document.createElement("span");
      var size = 3 + Math.random() * 5;
      var left = Math.random() * 40 - 20;
      var delay = Math.random() * 3;
      var duration = 2.4 + Math.random() * 2;

      bubble.style.position = "absolute";
      bubble.style.left = left + "px";
      bubble.style.bottom = "0";
      bubble.style.width = size + "px";
      bubble.style.height = size + "px";
      bubble.style.borderRadius = "50%";
      bubble.style.background = "rgba(255,255,255,0.65)";
      bubble.style.animation =
        "bubble-rise " + duration + "s ease-in " + delay + "s infinite";

      fizz.appendChild(bubble);
    }
  }

  // ------------------------------------------------------------------
  // Can 3D tilt: rotates toward the cursor for a real pop-off-the-page
  // feel, with a bounded angle range so it never flips unnaturally.
  // ------------------------------------------------------------------
  var canStage = document.getElementById("canStage");
  var can = document.getElementById("can");

  if (canStage && can && !reduceMotion) {
    canStage.addEventListener("mousemove", function (e) {
      var rect = canStage.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;   // 0..1
      var py = (e.clientY - rect.top) / rect.height;   // 0..1
      var rotY = clamp((px - 0.5) * 22, -11, 11);
      var rotX = clamp((0.5 - py) * 14, -7, 7);
      can.style.transform =
        "rotate(-6deg) rotateY(" + rotY + "deg) rotateX(" + rotX + "deg)";
    });
    canStage.addEventListener("mouseleave", function () {
      can.style.transform = "rotate(-6deg) rotateY(0deg) rotateX(0deg)";
    });
  }

  // ------------------------------------------------------------------
  // Scroll-reveal: fade + lift elements once as they enter the viewport.
  // ------------------------------------------------------------------
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ------------------------------------------------------------------
  // Smooth-scroll active-state highlight for nav links (progressive
  // enhancement only, no dependency for basic navigation).
  // ------------------------------------------------------------------
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var linkMap = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      linkMap[id] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.style.opacity = "0.75"; });
            link.style.opacity = "1";
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      if (linkMap[section.id]) observer.observe(section);
    });
  }
})();
