/* Site navigation: Home (always) and Back (only when you arrived from another page of this site). */
(function () {
  var me = document.currentScript;
  var root = new URL(".", me.src).href; // .../ai-engineering-summaries/
  var PAGES = {
    "": { en: "Home", ru: "Главная" },
    "cloudflare-connect-2026/": { en: "Cloudflare Connect 2026", ru: "Cloudflare Connect 2026" },
    "behavior-challenge-2026/": { en: "BEHAVIOR Challenge 2026", ru: "BEHAVIOR Challenge 2026" },
    "cloudflare-connect-2026/build-not-buy-workflow.html": { en: "Build, not buy workflow", ru: "Схема «Пора строить, а не покупать»" },
    "behavior-challenge-2026/hiphys-rsi-workflow.html": { en: "HiPhys-RSI learning workflow", ru: "Схема обучения HiPhys-RSI" }
  };
  function clean(u) { try { var x = new URL(u); x.hash = ""; x.search = ""; return x.href.replace(/index\.html$/, ""); } catch (e) { return ""; } }
  var here = clean(location.href);
  var ref = clean(document.referrer);
  var fromSite = ref && ref.indexOf(root) === 0 && ref !== here;
  var fromKey = fromSite ? ref.slice(root.length) : null;

  var css = "\
.aes-nav{position:sticky;top:0;z-index:1000;height:44px;display:flex;align-items:center;gap:6px;padding:0 16px;\
font:500 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:rgba(250,250,248,.92);\
backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.08);color:#1d1d1f}\
[data-theme=dark] .aes-nav{background:rgba(20,21,24,.92);border-bottom-color:rgba(255,255,255,.08);color:#e8e8ea}\
.aes-nav a{display:inline-flex;align-items:center;gap:6px;color:inherit;text-decoration:none;padding:7px 12px;border-radius:999px;\
transition:background .15s}\
.aes-nav a:hover,.aes-nav a:focus-visible{background:rgba(127,127,127,.15);outline:none}\
.aes-nav a[aria-current=page]{background:rgba(127,127,127,.12)}\
.aes-nav svg{width:16px;height:16px;flex:none}\
.aes-nav .sep{width:1px;height:18px;background:rgba(127,127,127,.3);margin:0 4px}\
.aes-nav .aes-back[hidden],.aes-nav .sep[hidden]{display:none}\
body>header,.header{top:44px!important}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var homeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>';
  var backIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';

  var nav = document.createElement("nav");
  nav.className = "aes-nav"; nav.setAttribute("aria-label", "Site");
  nav.innerHTML = '<a class="aes-home" href="' + root + '">' + homeIcon + '<span></span></a>' +
    '<span class="sep" hidden></span><a class="aes-back" href="' + (fromSite ? ref : root) + '" hidden>' + backIcon + '<span></span></a>';
  var home = nav.querySelector(".aes-home"), back = nav.querySelector(".aes-back"), sep = nav.querySelector(".sep");
  if (here === root) home.setAttribute("aria-current", "page");
  if (fromSite) {
    back.hidden = false; sep.hidden = false;
    back.addEventListener("click", function (e) {
      if (history.length > 1) { e.preventDefault(); history.back(); }
    });
  }
  function label() {
    var ru = document.documentElement.lang === "ru";
    home.querySelector("span").textContent = ru ? "Главная" : "Home";
    if (fromSite) {
      var p = PAGES[fromKey];
      var name = p ? (ru ? p.ru : p.en) : (ru ? "предыдущей странице" : "previous page");
      back.querySelector("span").textContent = (ru ? "Назад: " : "Back to ") + name;
    }
  }
  label();
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  function mount() { document.body.insertBefore(nav, document.body.firstChild); var r = document.querySelector("[data-nav-right]"); if (r) { r.style.marginLeft = "auto"; nav.appendChild(r); } }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
