/* Indorebate rebate calculator widget. Needs /rebate-rates.js. Any element with [data-rc-root] becomes a calculator.
   data-lang="id|en"; add data-deeplink to read ?broker=&account=&pair= from the URL. */
(function(){
  var TEXT = {"id": {"lang": "id", "hint_spread": "Isi spread dalam poin, seperti di kolom Spread MT5 Anda (Market Watch). Contoh: {ex} poin = selisih harga {price}. Rebate akun ini dihitung dari persentase spread.", "warn_spread": "Spread terlihat sangat besar. Periksa kembali nilainya di MT5 Anda.", "r_empty": "Isi spread untuk melihat estimasi", "d_pct": "Spread {sp} poin × ${pv} per poin = ${cost} biaya spread per lot → {pct}% = {unit} {per} per lot", "d_ref": " · kurs acuan {pair} {rate} (perkiraan)", "d_fixed": "Rebate tetap {unit} {per} per lot", "d_cent": "Akun Cent: hasil ditampilkan dalam cent (USC).", "loc": "id-ID", "rules_h": "Ketentuan rebate {broker}", "cta_open": "Buka Akun {broker}", "cta_info": "Info Lengkap Rebate {broker}", "min_thr": "Perkiraan lot minimum per hari agar rebate terbayar: ~{lots} lot (rebate di bawah 1 sen tidak dibayarkan)", "min_lots": "Akumulasi lot minimum untuk mendapat rebate: {lots} lot (ketentuan {broker})", "min_warn": "Lot Anda di bawah minimum — rebate mungkin tidak terbayar."}, "en": {"lang": "en", "hint_spread": "Enter the spread in points, as shown in the Spread column of your MT5 (Market Watch). Example: {ex} points = price difference of {price}. This account type's rebate is calculated as a percentage of the spread.", "warn_spread": "This spread looks very large. Please double-check the value in your MT5.", "r_empty": "Enter the spread to see an estimate", "d_pct": "Spread {sp} points × ${pv} per point = ${cost} spread cost per lot → {pct}% = {unit} {per} per lot", "d_ref": " · reference rate {pair} {rate} (approximate)", "d_fixed": "Fixed rebate of {unit} {per} per lot", "d_cent": "Cent account: the result is shown in cents (USC).", "loc": "en-US", "rules_h": "{broker} rebate terms", "cta_open": "Open Account at {broker}", "cta_info": "Full {broker} Rebate Info", "min_thr": "Estimated minimum lots per day for the rebate to be paid: ~{lots} lots (rebates under 1 cent are not paid)", "min_lots": "Minimum accumulated lots to earn a rebate: {lots} lots ({broker} rule)", "min_warn": "Your lots are below the minimum — the rebate may not be paid."}};
  function init(root){
    var R = window.REBATE_RATES, T = TEXT[root.getAttribute('data-lang')] || TEXT.id;
    var $ = function(k){ return root.querySelector('[data-rc="'+k+'"]'); };
    var brokerEl=$('broker'), acctEl=$('account'), pairEl=$('pair'), spreadEl=$('spread'), lotEl=$('lot');
    function num(v){ var s=String(v); return T.loc==='id-ID' ? s.replace('.',',') : s; }
    function nf(n,min,max){ return n.toLocaleString(T.loc,{minimumFractionDigits:min,maximumFractionDigits:max}); }
    function clean(x){ return parseFloat(x.toFixed(8)).toString(); }
    function pointValue(spec){ return spec.contractSize * spec.pointSize / (spec.usdBaseRate || 1); }
    function computeRebate(acct, spec, pairKey, spreadPts, lots){
      if (acct.model === 'fixed') { var f = acct.fixed[pairKey]; return { perLot: f, total: f * lots, cost: null }; }
      var cost = spreadPts * pointValue(spec), per = cost * acct.pct / 100;
      return { perLot: per, total: per * lots, cost: cost };
    }
    function broker(){ return R.brokers[brokerEl.value]; }
    function account(){ var b=broker(); for (var i=0;i<b.accounts.length;i++) if (b.accounts[i].id===acctEl.value) return b.accounts[i]; return b.accounts[0]; }
    function pairKeys(a){ return a.model==='fixed' ? Object.keys(a.fixed) : a.pairs; }
    function pairLabel(k){ var b=broker(); return (b.symbols[k] && b.symbols[k].label) || (b.labels && b.labels[k]) || k; }
    function fillBrokers(){ Object.keys(R.brokers).forEach(function(k){ var o=document.createElement('option'); o.value=k; o.textContent=R.brokers[k].name; brokerEl.appendChild(o); }); }
    function fillAccounts(){ acctEl.innerHTML=''; broker().accounts.forEach(function(a){ var o=document.createElement('option'); o.value=a.id; o.textContent=a.label; acctEl.appendChild(o); }); }
    function fillPairs(){ var keep=pairEl.value; pairEl.innerHTML=''; pairKeys(account()).forEach(function(k){ var o=document.createElement('option'); o.value=k; o.textContent=pairLabel(k); pairEl.appendChild(o); }); if (keep) { for (var i=0;i<pairEl.options.length;i++) if (pairEl.options[i].value===keep) pairEl.value=keep; } }
    function renderBrokerUi(){
      var b=broker(), u=b.ui[T.lang];
      $('rulesTitle').textContent = T.rules_h.replace('{broker}', b.name);
      var ul=$('rulesList'); ul.innerHTML='';
      u.rules.forEach(function(r){ var li=document.createElement('li'); li.textContent=r; ul.appendChild(li); });
      $('ctaOpen').href=u.openUrl; $('ctaOpen').textContent=T.cta_open.replace('{broker}', b.name);
      $('ctaInfo').href=u.infoUrl; $('ctaInfo').textContent=T.cta_info.replace('{broker}', b.name);
    }
    function renderMin(a, perLot, lots){
      var el=$('rMin'); el.style.display='none'; el.className='rc-r-min';
      if (!a.centMin) return;
      var minLots=null, txt='';
      if (a.centMin.mode==='lots') { minLots=a.centMin.lots; txt=T.min_lots.replace('{lots}',nf(minLots,1,2)).replace('{broker}',broker().name); }
      else if (a.centMin.mode==='threshold' && perLot>0) { minLots=Math.ceil(a.centMin.usc/perLot*100-1e-9)/100; txt=T.min_thr.replace('{lots}',nf(minLots,2,2)); }
      if (minLots===null) return;
      if (lots>0 && lots<minLots) { txt += ' · ' + T.min_warn; el.className='rc-r-min bad'; }
      el.textContent=txt; el.style.display='block';
    }
    function hint(spec){ $('spreadHint').textContent = T.hint_spread.replace('{ex}', num(spec.example)).replace('{price}', num(clean(spec.example*spec.pointSize))); }
    function render(){
      var a=account(), key=pairEl.value, isPct=a.model==='spread_pct', spec=isPct?broker().symbols[key]:null;
      $('spreadField').style.display = isPct ? '' : 'none';
      if (isPct) hint(spec);
      var lots = parseFloat(lotEl.value); if (!(lots>=0)) lots = 0;
      var sp = parseFloat(spreadEl.value);
      $('spreadWarn').style.display = (isPct && sp>spec.maxPoints) ? 'block' : 'none';
      var main=$('rMain'), per=$('rPer'), det=$('rDetail');
      if (isPct && !(sp>=0)) { main.textContent='—'; per.textContent='—'; det.textContent=T.r_empty; renderMin(a, null, lots); return; }
      var r = computeRebate(a, spec, key, isPct?sp:0, lots);
      var tot = function(v){ return (v>0 && v<0.01) ? '< 0.01' : nf(v,2,2); };
      main.textContent = (isPct?'~ ':'') + a.unit + ' ' + tot(r.total);
      per.textContent  = (isPct?'~ ':'') + a.unit + ' ' + nf(r.perLot,2,3);
      var text;
      if (isPct) {
        text = T.d_pct.replace('{sp}',num(sp)).replace('{pv}',num(parseFloat(pointValue(spec).toFixed(4)).toString())).replace('{cost}',nf(r.cost,2,2)).replace('{pct}',num(a.pct)).replace('{unit}',a.unit).replace('{per}',nf(r.perLot,2,3));
        if (spec.usdBaseRate) text += T.d_ref.replace('{pair}',key).replace('{rate}',num(spec.usdBaseRate));
      } else { text = T.d_fixed.replace('{unit}',a.unit).replace('{per}',nf(r.perLot,2,3)); }
      if (a.unit==='USC') text += ' · ' + T.d_cent;
      det.textContent = text;
      renderMin(a, r.perLot, lots);
    }
    fillBrokers();
    var q = root.hasAttribute('data-deeplink') ? new URLSearchParams(location.search) : new URLSearchParams('');
    if (q.get('broker') && R.brokers[q.get('broker')]) brokerEl.value = q.get('broker');
    fillAccounts();
    if (q.get('account')) { for (var i=0;i<acctEl.options.length;i++) if (acctEl.options[i].value===q.get('account')) acctEl.value=q.get('account'); }
    fillPairs(); renderBrokerUi();
    if (q.get('pair')) { for (var k=0;k<pairEl.options.length;k++) if (pairEl.options[k].value===q.get('pair')) pairEl.value=q.get('pair'); }
    render();
    brokerEl.addEventListener('change', function(){ pairEl.innerHTML=''; fillAccounts(); fillPairs(); renderBrokerUi(); render(); });
    acctEl.addEventListener('change', function(){ fillPairs(); render(); });
    pairEl.addEventListener('change', render);
    spreadEl.addEventListener('input', render); lotEl.addEventListener('input', render);
  }
  function start(){ if (!window.REBATE_RATES) return; Array.prototype.forEach.call(document.querySelectorAll('[data-rc-root]'), init); }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
