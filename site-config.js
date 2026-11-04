/* ==========================================================================
   The Travel Mine — site-wide settings
   --------------------------------------------------------------------------
   Edit the social links here. They are used on every page (home, Privacy
   Policy, Terms & Conditions).

   Leave a value as "" to hide that link everywhere — no dead links appear
   on the live site. If all three are empty, the whole "Follow" block hides.

     INSTAGRAM_URL  e.g. "https://www.instagram.com/yourhandle"
     FACEBOOK_URL   e.g. "https://www.facebook.com/yourpage"
     WHATSAPP_URL   format "https://wa.me/91XXXXXXXXXX"
                    (country code + number, no +, spaces or dashes)
   ========================================================================== */
window.TTM_CONFIG = {
  INSTAGRAM_URL: "",
  FACEBOOK_URL: "",
  WHATSAPP_URL: ""
};

/* --- Wiring (no need to edit below) ------------------------------------- */
(function () {
  var KEYS = { instagram: "INSTAGRAM_URL", facebook: "FACEBOOK_URL", whatsapp: "WHATSAPP_URL" };

  // Links ship hidden (display:none) in the HTML and are revealed only when a
  // real https URL is configured, so nothing dead flashes on screen first.
  function applySocial() {
    var cfg = window.TTM_CONFIG || {};
    var links = document.querySelectorAll("[data-social]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var url = String(cfg[KEYS[a.getAttribute("data-social")]] || "").trim();
      if (/^https:\/\//i.test(url)) {
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
        a.style.display = "";
      } else {
        a.removeAttribute("href");
        a.style.display = "none";
      }
    }
    var groups = document.querySelectorAll("[data-social-group]");
    for (var j = 0; j < groups.length; j++) {
      var g = groups[j], any = false, kids = g.querySelectorAll("[data-social]");
      for (var k = 0; k < kids.length; k++) if (kids[k].style.display !== "none") any = true;
      g.style.display = any ? "" : "none";
    }
  }

  window.TTM_applySocial = applySocial;

  // Plain pages are ready at DOMContentLoaded. The home page renders through
  // the dc-runtime, which can rebuild nodes after mount, so re-apply (once
  // per frame at most) whenever new elements are added to the page.
  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; applySocial(); });
  }
  function start() {
    applySocial();
    if ("MutationObserver" in window) new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
