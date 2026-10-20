/* bentartaglia.tech — privacy-conscious engagement events.
   Requires a configured Cloudflare Zaraz destination to store/report custom events.
   No visitor IDs, cookies, email addresses, freeform URL parameters, or fingerprinting. */
(function () {
  'use strict';
  var allowed = /^[a-zA-Z0-9_-]{1,50}$/;
  function safe(value) { return value && allowed.test(value) ? value : ''; }
  function send(name, properties) {
    if (typeof window.zaraz === 'object' && typeof window.zaraz.track === 'function') {
      try { window.zaraz.track(name, properties); } catch (_) {}
    }
  }
  var params = new URLSearchParams(location.search);
  var campaign = {};
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (key) {
    var value = safe(params.get(key));
    if (value) campaign[key] = value;
  });
  if (Object.keys(campaign).length) {
    send('portfolio_campaign_landing', Object.assign({page:location.pathname},campaign));
  }
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var url;
    try { url = new URL(link.getAttribute('href'), location.href); } catch (_) { return; }
    var name = '', detail = '';
    var filename = url.pathname.split('/').pop().toLowerCase();
    if (/ben_tartaglia_resume.*\.pdf$/.test(filename)) { name='portfolio_document_download'; detail='resume'; }
    else if (/ben_tartaglia_executive_impact.*\.pdf$/.test(filename)) { name='portfolio_document_download'; detail='impact_sheet'; }
    else if (url.protocol === 'mailto:') { name='portfolio_contact_click'; detail='email'; }
    else if (url.protocol === 'tel:') { name='portfolio_contact_click'; detail='phone'; }
    else if (url.hostname === 'www.linkedin.com' || url.hostname === 'linkedin.com') { name='portfolio_outbound_click'; detail='linkedin'; }
    else if (url.hostname === 'github.com') { name='portfolio_outbound_click'; detail='github'; }
    if (name) send(name,{kind:detail,page:location.pathname});
  }, {capture:true});
})();