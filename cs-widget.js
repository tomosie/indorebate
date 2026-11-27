// Tombol "Chat CS" mengambang: membuka bot CS Indorebate di Telegram.
// Pasang di tiap halaman dengan: <script src="/cs-widget.js?v=1" defer></script> sebelum </body>
(function () {
  if (window.__csWidget) return;
  window.__csWidget = true;
  var en = /^\/en(\/|$)/.test(location.pathname) || document.documentElement.lang === "en";
  var url = "https://t.me/cs_indorebate_bot?start=" + (en ? "web_en" : "web_id");
  var label = en ? "Chat with CS" : "Chat CS";
  var title = en ? "Chat with Indorebate support on Telegram" : "Chat dengan CS Indorebate di Telegram";

  var css =
    ".csw{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:40;display:inline-flex;align-items:center;gap:8px;" +
    "padding:12px 18px;border-radius:999px;background:#0B1B3A;color:#fff;border:2px solid #C9973A;text-decoration:none;" +
    "font:600 14px/1 'Plus Jakarta Sans',Inter,system-ui,sans-serif;box-shadow:0 6px 20px rgba(11,27,58,.28);transition:background-color .15s}" +
    ".csw:hover{background:#14305e}.csw:focus-visible{outline:3px solid #E8B84B;outline-offset:2px}" +
    ".csw svg{width:20px;height:20px;fill:none;stroke:#E8B84B;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}" +
    "@media(max-width:360px){.csw span{display:none}.csw{padding:12px}}" +
    "@media print{.csw{display:none}}";

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var a = document.createElement("a");
  a.className = "csw";
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", title);
  a.title = title;
  a.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 3 2.5 10.5l6.5 2.5 2.5 6.5z"/><path d="M21.5 3 9 13"/></svg><span></span>';
  a.querySelector("span").textContent = label;
  document.body.appendChild(a);
})();
