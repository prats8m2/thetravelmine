/* ==========================================================================
   The Travel Mine — site-wide settings
   --------------------------------------------------------------------------
   Edit the social links here. They are used on every page (home, Privacy
   Policy, Terms & Conditions).

   Leave a value as "" and that link does not appear at all — it is not in
   the page, not even as hidden text. If all three are empty, the whole
   "Follow" block is left out.

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
  var LINKS = [
    ["Instagram", "INSTAGRAM_URL"],
    ["Facebook", "FACEBOOK_URL"],
    ["WhatsApp", "WHATSAPP_URL"]
  ];

  function activeLinks() {
    var cfg = window.TTM_CONFIG || {}, out = [];
    for (var i = 0; i < LINKS.length; i++) {
      var url = String(cfg[LINKS[i][1]] || "").trim();
      if (/^https:\/\//i.test(url)) out.push({ label: LINKS[i][0], url: url });
    }
    return out;
  }

  function linkHTML(l) {
    var safe = l.url.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    return '<a href="' + safe + '" target="_blank" rel="noopener">' + l.label + "</a>";
  }

  // Each page has empty slots (data-social-slot). Links are written into them
  // only when configured, so empty URLs leave nothing in the page at all.
  function applySocial() {
    var links = activeLinks();
    var sig = links.map(function (l) { return l.url; }).join("|");
    var slots = document.querySelectorAll("[data-social-slot]");
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (!links.length) { if (slot.firstChild) slot.innerHTML = ""; continue; }
      if (slot.getAttribute("data-filled") === sig && slot.firstChild) continue;
      var anchors = links.map(linkHTML).join("");
      if (slot.getAttribute("data-social-slot") === "contact") {
        slot.innerHTML =
          '<div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:rgba(255,255,255,.8)">Follow</div>' +
          '<div style="display:flex;gap:16px;margin-top:8px;font-size:16px;font-weight:600">' + anchors + "</div>";
      } else {
        slot.innerHTML = anchors;
      }
      slot.setAttribute("data-filled", sig);
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
