(() => {
  const state = {
    type: null,
    category: null,
    value: 0,
    description: '',
    handling: 'automated',
    insurance: false,
    expert: null,
    physicalSize: 'standard',
    distance: 'regional',
    photos: 0,
    activeTrade: {
      code: '55685599',
      payment: {
        provider: 'Skrill',
        amount: 500,
        currency: 'USD',
        status: 'Confirmation pending',
        reference: '55685599',
      },
      asset: {
        name: 'CNC printer',
        status: 'Awaiting release',
        codeStatus: 'Encrypted handover code required',
      },
    },
  };

  const typeConfig = {
    physical: {
      label: 'Physical goods', icon: 'physical', summary: 'Physical goods',
      intro: 'Artwork, equipment, machinery, collectibles, stock, and other tangible items.',
      warning: 'Physical cash is not accepted.',
      timingNote: 'Delivery distance, item size, packaging, collection, and specialist handling may change this estimate.',
      categories: {
        'Art and collectibles': 6, 'Liquids and bulk materials': 6, 'Machinery and equipment': 8,
        'Vehicles and large items': 10, 'Electronics and equipment': 6, 'Jewellery and valuables': 6,
        'Other physical goods': 6, 'Not sure — help me classify it': 6,
      },
    },
    value: {
      label: 'Payment / digital value', icon: 'value', summary: 'Digital value',
      intro: 'Approved bank, wallet, blockchain, and digital-value transfer methods.',
      warning: 'No cash payments or physical cash trades.',
      timingNote: 'Timing begins after required checks and transfer confirmation. Network conditions, bank cut-off times, provider rules, and verification may affect completion.',
      categories: {
        'Bank transfer': 'approximately 1.5 days', 'PayPal': 'approximately 15 minutes after payment confirmation',
        'Skrill': 'approximately 15 minutes after payment confirmation', 'Cryptocurrency': 'approximately 15–45 minutes depending on network confirmation',
        'NFTs': 'approximately 15–45 minutes depending on blockchain confirmation', 'Stablecoins': 'approximately 15–30 minutes',
        'Digital wallet': 'approximately 15 minutes', 'Other approved payment method': 'approximately 1 day pending review',
      },
    },
    digital: {
      label: 'Digital goods', icon: 'digital', summary: 'Digital goods',
      intro: 'Software, licences, access, files, transferable digital assets, and online services.',
      warning: '',
      timingNote: 'Timing begins after the agreement is complete and required review is confirmed.',
      categories: {
        'Software': 'approximately 15 minutes', 'Software licences': 'approximately 15 minutes',
        'Subscription access': 'approximately 15 minutes', 'Account access': 'approximately 15 minutes, subject to platform rules',
        'Domain names': 'approximately 1 day because registrar transfers may take longer',
        'Digital files and creative assets': 'approximately 15 minutes', 'Gaming assets': 'approximately 30 minutes',
        'Digital services': 'approximately 30 minutes', 'Other digital goods': 'approximately 15–60 minutes depending on review',
        'Not sure — help me classify it': 'approximately 15–60 minutes depending on review',
      },
    },
  };

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const modal = $('#start-modal');
  const modalBody = $('#modal-body');
  const modalTitle = $('#modal-title');
  const modalKicker = $('#modal-kicker');
  let lastFocus = null;

  function formatMoney(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
  }
  function timeFor() {
    if (!state.type || !state.category) return 'set after item type is selected';
    const config = typeConfig[state.type];
    const base = config.categories[state.category] ?? Object.values(config.categories)[0];
    if (state.type !== 'physical') return base;
    let days = Number(base);
    if (state.physicalSize === 'large') days += 2;
    if (state.physicalSize === 'specialist') days += 4;
    if (state.distance === 'international') days += 2;
    return `approximately ${days} days`;
  }
  function recommendation() {
    const c = (state.category || '').toLowerCase();
    return /art|collect|jewellery|machinery|vehicle|licence|nft|not sure|other physical|other digital/.test(c) || state.value >= 10000;
  }
  function itemIconClass() {
    return state.type === 'physical' ? 'box-icon' : state.type === 'value' ? 'value-side-icon' : state.type === 'digital' ? 'digital-side-icon' : 'empty-item-icon';
  }
  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }
  function renderActiveTrade() {
    const trade = state.activeTrade;
    if (!trade) return;
    const payment = trade.payment;
    const asset = trade.asset;
    const paymentAmount = `${formatMoney(payment.amount)} ${payment.currency}`;
    const paymentPending = /pending/i.test(payment.status);
    setText('agreement-kicker', 'ACTIVE AGREEMENT');
    setText('desk-title', `Trade ${trade.code}`);
    setText('trade-code-heading', trade.code);
    setText('status-text', paymentPending ? 'Payment confirmation pending' : 'Payment confirmation recorded');
    setText('your-avatar', 'SK');
    setText('your-side-heading', `${payment.provider} transfer`);
    setText('your-role', `${paymentAmount} · ${payment.status.toLowerCase()}`);
    setText('your-kind', `DIGITAL VALUE · ${payment.provider.toUpperCase()}`);
    setText('your-category', `${paymentAmount} transfer`);
    setText('your-description', 'Confirmation must be verified before any handover is released.');
    setText('your-value', paymentAmount);
    setText('your-photos', payment.provider);
    setText('your-insurance', payment.status);
    setText('your-expert', 'Record locked');
    setText('your-next-step', paymentPending ? 'Confirm payment' : 'Release handover');
    $('#your-icon').className = 'item-icon value-side-icon';

    setText('bridge-status', paymentPending ? 'ACTION REQUIRED' : 'PAYMENT VERIFIED');
    setText('active-trade-code', trade.code);
    setText('trade-phase', paymentPending ? 'PAYMENT PENDING' : 'READY FOR HANDOVER');
    setText('payment-provider', `${payment.provider} transfer`);
    setText('payment-amount', paymentAmount);
    setText('payment-status', payment.status);
    setText('asset-name', asset.name);
    setText('asset-status', asset.status);
    setText('asset-code-status', asset.codeStatus);
    setText('summary-payment-reference', payment.reference);
    setText('summary-payment-status', payment.status);
    setText('summary-asset-status', asset.status);
    setText('summary-code-status', asset.codeStatus);
    setText('agreement-message-text', `${paymentPending ? 'Payment confirmation must be recorded' : 'Payment confirmation has been recorded'} before the ${asset.name} encrypted handover code can be released.`);

    setText('partner-avatar', 'CNC');
    setText('partner-side-heading', asset.name);
    setText('partner-role', asset.codeStatus);
    setText('partner-stage', paymentPending ? 'WAITING' : 'NEXT');
    setText('partner-kind', 'PHYSICAL ASSET');
    setText('partner-category', asset.name);
    setText('partner-description', 'The handover remains protected until a valid encrypted code is supplied.');
    setText('partner-value', paymentPending ? 'Waiting for payment' : 'Ready for code');
    setText('partner-code', paymentPending ? 'Not supplied' : asset.codeStatus);
    setText('partner-collection', paymentPending ? 'Held pending code' : 'Coordinate collection');
    setText('partner-guard', 'Asset record locked');
    setText('partner-next-step', paymentPending ? 'Provide encrypted code' : 'Arrange collection');
  }
  function updateWorkspace() {
    if (state.activeTrade) { renderActiveTrade(); return; }
    if (!state.type) {
      $('#your-kind').textContent = 'SELECT A TRADE TYPE';
      $('#your-category').textContent = 'Add the item you are sending';
      $('#your-description').textContent = 'Choose physical goods, digital value, or digital goods to begin.';
      $('#your-value').textContent = 'Add a value';
      $('#your-photos').textContent = 'Add supporting photos';
      $('#your-insurance').textContent = 'Choose in setup';
      $('#your-expert').textContent = 'Choose in setup';
      $('#your-icon').className = 'item-icon empty-item-icon';
      $('#compare-left').textContent = 'Your item';
      $('#completion-time').textContent = 'Set in agreement';
      $('#summary-handling').textContent = 'Choose handling';
      $('#summary-insurance').textContent = 'Choose insurance';
      $('#summary-expert').textContent = 'Choose review';
      $('#status-text').textContent = 'Ready to define';
      $('#bridge-status').textContent = 'NEW';
      return;
    }
    const config = typeConfig[state.type];
    $('#your-kind').textContent = config.label;
    $('#your-category').textContent = state.category;
    $('#your-description').textContent = state.description || 'Item description to be added';
    $('#your-value').textContent = state.value ? formatMoney(state.value) : 'Not declared';
    $('#your-photos').innerHTML = state.photos ? `<span class="mini-check">✓</span> ${state.photos} attached` : 'No photos added';
    $('#your-insurance').textContent = state.insurance ? `${formatMoney(state.value * .15)} estimated` : 'Not selected';
    $('#your-expert').textContent = state.expert === 'request' ? 'Requested' : recommendation() ? 'Recommended' : 'Not requested';
    $('#your-icon').className = `item-icon ${itemIconClass()}`;
    $('#compare-left').textContent = state.category.replace(' and ', ' & ');
    $('#completion-time').textContent = timeFor().replace('approximately ', '~ ');
    $('#summary-handling').textContent = state.handling === 'human' ? 'Human-assisted · $14' : 'Automated · $0';
    $('#summary-insurance').textContent = state.insurance ? `${formatMoney(state.value * .15)} estimated` : 'Not added';
    $('#summary-expert').textContent = state.expert === 'request' ? 'Requested' : recommendation() ? 'Recommended' : 'Not requested';
    $('#status-text').textContent = 'Your side is ready to share';
    $('#bridge-status').textContent = 'IN PROGRESS';
  }
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.hidden = false;
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => { el.hidden = true; }, 3600);
  }
  function showPage(route, updateHash = true) {
    const safeRoute = $(`[data-page="${route}"]`) ? route : 'home';
    $$('[data-page]').forEach(page => { page.hidden = page.dataset.page !== safeRoute; });
    $$('.desktop-nav a').forEach(a => a.classList.toggle('is-active', a.dataset.route === safeRoute));
    if (updateHash && location.hash !== `#${safeRoute}`) history.replaceState(null, '', `#${safeRoute}`);
    window.scrollTo(0, 0);
    closeMenu();
  }
  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    showStartScreen();
    $('.close-modal').focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus?.focus) lastFocus.focus();
  }
  function setProgress(step) {
    $$('.modal-progress span').forEach((span, index) => span.classList.toggle('is-current', index <= step - 1));
    $('.modal-progress').setAttribute('aria-label', `Step ${step} of 3`);
  }
  function showStartScreen() {
    modalKicker.textContent = 'NEW AGREEMENT';
    modalTitle.textContent = 'Do you have a trade code?';
    setProgress(1);
    modalBody.innerHTML = `
      <p class="modal-intro">Use a code to open a shared agreement, or begin an agreement from your side.</p>
      <div class="choice-stack">
        <button class="choice-card" type="button" data-choice="code"><span class="choice-icon code-icon"></span><span><strong>Yes, I have a code</strong><small>Open a trade shared by another party.</small></span><b>→</b></button>
        <button class="choice-card" type="button" data-choice="new"><span class="choice-icon new-icon"></span><span><strong>No, start a new trade</strong><small>Complete your side, then invite your partner.</small></span><b>→</b></button>
      </div>`;
    $('[data-choice="code"]', modalBody).addEventListener('click', showCodeScreen);
    $('[data-choice="new"]', modalBody).addEventListener('click', showTypeScreen);
  }
  function showCodeScreen() {
    modalKicker.textContent = 'JOIN A TRADE';
    modalTitle.textContent = 'Enter the shared code.';
    setProgress(1);
    modalBody.innerHTML = `
      <p class="modal-intro">Enter the code included in your agreement invitation to continue to the shared terms.</p>
      <div class="form-block"><label for="trade-code">Trade code</label><input id="trade-code" autocomplete="off" placeholder="Enter trade code" /></div>
      <div class="modal-actions"><button class="back-step" type="button">← Back</button><button class="button button-primary" type="button" id="continue-code">Continue <span>→</span></button></div>`;
    $('.back-step', modalBody).addEventListener('click', showStartScreen);
    $('#continue-code', modalBody).addEventListener('click', () => {
      const code = $('#trade-code', modalBody).value.trim();
      const knownTrade = state.activeTrade && code === state.activeTrade.code;
      if (knownTrade) {
        updateWorkspace();
        closeModal();
        showPage('home');
        toast(`Trade ${state.activeTrade.code} opened. Payment confirmation is still pending.`);
        return;
      }
      modalBody.innerHTML = `<div class="agreement-notice"><strong>${code ? `Trade code “${escapeHTML(code)}” could not be opened.` : 'Enter your trade code.'}</strong>${code ? 'Check the invitation code and try again, or ask the agreement owner to resend it.' : 'Enter the code shared by the agreement owner to continue.'}</div><div class="modal-actions"><button class="back-step" type="button">← Back</button></div>`;
      $('.back-step', modalBody).addEventListener('click', showCodeScreen);
    });
    $('#trade-code', modalBody).focus();
  }
  function showTypeScreen() {
    modalKicker.textContent = 'NEW TRADE · STEP 1 OF 3';
    modalTitle.textContent = 'What are you sending?';
    setProgress(2);
    const options = ['physical', 'value', 'digital'].map(key => {
      const item = typeConfig[key];
      return `<button class="item-option ${state.type === key ? 'is-selected' : ''}" type="button" data-type="${key}"><span class="modal-type-icon ${item.icon}"></span><span><strong>${item.label}</strong><small>${item.intro}</small></span><b>→</b></button>`;
    }).join('');
    modalBody.innerHTML = `<p class="modal-intro">Start by defining your side. The agreement keeps the other party’s side in view so the trade stays balanced from the beginning.</p><div class="item-options">${options}</div><div class="modal-actions"><button class="back-step" type="button">← Back</button><button class="button button-primary" type="button" id="next-details" ${state.type ? '' : 'disabled'}>Continue <span>→</span></button></div>`;
    $$('.item-option', modalBody).forEach(button => button.addEventListener('click', () => {
      state.type = button.dataset.type;
      state.category = Object.keys(typeConfig[state.type].categories)[0];
      $$('.item-option', modalBody).forEach(item => item.classList.toggle('is-selected', item === button));
      $('#next-details', modalBody).disabled = false;
    }));
    $('.back-step', modalBody).addEventListener('click', showStartScreen);
    $('#next-details', modalBody).addEventListener('click', showDetailsScreen);
  }
  function showDetailsScreen() {
    if (!state.type) { showTypeScreen(); return; }
    const config = typeConfig[state.type];
    const categories = Object.keys(config.categories);
    modalKicker.textContent = 'NEW TRADE · STEP 2 OF 3';
    modalTitle.textContent = 'Set out your side of the agreement.';
    setProgress(3);
    const categoryButtons = categories.map(category => `<button type="button" data-category="${escapeHTML(category)}" class="${state.category === category ? 'is-selected' : ''}">${escapeHTML(category)}</button>`).join('');
    const physicalFields = state.type === 'physical' ? `
      <div class="details-label">Delivery &amp; handling</div>
      <div class="detail-grid"><div class="form-block"><label for="size">Dimensions or size</label><select id="size"><option value="standard" ${state.physicalSize === 'standard' ? 'selected':''}>Standard size</option><option value="large" ${state.physicalSize === 'large' ? 'selected':''}>Large / bulky</option><option value="specialist" ${state.physicalSize === 'specialist' ? 'selected':''}>Specialist handling</option></select></div><div class="form-block"><label for="distance">Delivery location</label><select id="distance"><option value="regional" ${state.distance === 'regional' ? 'selected':''}>Regional delivery</option><option value="international" ${state.distance === 'international' ? 'selected':''}>International delivery</option></select></div><div class="form-block"><label for="quantity">Quantity</label><input id="quantity" placeholder="e.g. 1 unit" /></div><div class="form-block"><label for="collection">Collection location</label><input id="collection" placeholder="City or depot" /></div><div class="form-block wide"><label for="delivery-requirements">Delivery &amp; packaging requirements</label><input id="delivery-requirements" placeholder="e.g. crated, lift-gate required" /></div></div>` : '';
    const suggestedExpert = recommendation();
    modalBody.innerHTML = `
      <p class="modal-intro">Choose a category, describe the item, and make the handling choices that should be visible to both sides.</p>
      <div class="details-label">${config.label} category</div>
      <div class="category-select" id="categories">${categoryButtons}</div>
      <div class="timing-box" id="timing-box"><strong>Estimated completion: ${timeFor()}</strong>${config.timingNote}</div>
      ${config.warning ? `<div class="agreement-notice"><strong>${config.warning}</strong>Use approved methods when you define the agreement.</div>` : ''}
      <div class="details-label">Item details</div>
      <div class="detail-grid"><div class="form-block wide"><label for="item-description">Describe your item</label><textarea id="item-description" placeholder="Describe your item">${escapeHTML(state.description)}</textarea></div><div class="form-block"><label for="item-value">Declared item value (USD)</label><input id="item-value" inputmode="decimal" value="${state.value || ''}" placeholder="0" /></div><div class="form-block"><label for="condition">Condition</label><select id="condition"><option selected>Choose condition</option><option>New</option><option>Good — used</option><option>Restored / refurbished</option><option>For review</option></select></div><div class="form-block wide"><label>Send photos</label><div class="upload-box"><strong>Attach supporting photos</strong> — optional <input id="photo-input" type="file" accept="image/*" multiple hidden><button type="button" class="link-button" id="photo-button">Choose files</button><span id="photo-status"></span></div></div></div>
      ${physicalFields}
      <label class="checkbox-row"><input type="checkbox" id="help-classify" ${state.category.includes('Not sure') ? 'checked' : ''}> <span>Let Trade Bridge help classify this</span></label>
      <div class="details-label">Handling</div>
      <div class="handling-options"><button class="handling-option ${state.handling === 'automated' ? 'is-selected':''}" type="button" data-handling="automated"><strong>Automated handling · $0</strong><small>Automated trade setup and standard workflow checks.</small></button><button class="handling-option ${state.handling === 'human' ? 'is-selected':''}" type="button" data-handling="human"><strong>Human-assisted · $14</strong><small>A human reviews the setup and helps guide the trade.</small></button></div>
      <div class="details-label">Item insurance</div>
      <label class="checkbox-row"><input type="checkbox" id="insurance-toggle" ${state.insurance ? 'checked' : ''}> <span>Add item insurance</span></label><div class="insurance-cost" id="insurance-cost">${insuranceText()}</div>
      <div class="details-label">Expert evaluation</div>
      <p class="detail-note">Expert evaluation may be recommended for specialist, high-value, fragile, unusual, or difficult-to-classify goods.${suggestedExpert ? ' This item is recommended for review.' : ''}</p>
      <div class="expert-choice"><button type="button" data-expert="request" class="${state.expert === 'request' ? 'is-selected':''}">Request expert evaluation</button><button type="button" data-expert="none" class="${state.expert === 'none' ? 'is-selected':''}">No expert evaluation requested</button></div>
      <p class="detail-note">Photos and descriptions give both sides a clearer, shared record of the terms being discussed.</p>
      <div class="modal-actions"><button class="back-step" type="button">← Back</button><button class="button button-primary" type="button" id="save-draft">Save agreement <span>→</span></button></div>`;

    $$('#categories button', modalBody).forEach(button => button.addEventListener('click', () => {
      state.category = button.dataset.category;
      $$('#categories button', modalBody).forEach(item => item.classList.toggle('is-selected', item === button));
      refreshTiming();
    }));
    $('#help-classify', modalBody).addEventListener('change', (event) => {
      if (event.target.checked) {
        const uncertain = categories.find(item => item.includes('Not sure'));
        if (uncertain) { state.category = uncertain; $$('#categories button', modalBody).forEach(item => item.classList.toggle('is-selected', item.dataset.category === uncertain)); refreshTiming(); }
      }
    });
    $('#size', modalBody)?.addEventListener('change', event => { state.physicalSize = event.target.value; refreshTiming(); });
    $('#distance', modalBody)?.addEventListener('change', event => { state.distance = event.target.value; refreshTiming(); });
    $('#item-value', modalBody).addEventListener('input', event => { state.value = parseCurrency(event.target.value); $('#insurance-cost', modalBody).textContent = insuranceText(); });
    $('#item-description', modalBody).addEventListener('input', event => { state.description = event.target.value; });
    $$('.handling-option', modalBody).forEach(button => button.addEventListener('click', () => { state.handling = button.dataset.handling; $$('.handling-option', modalBody).forEach(item => item.classList.toggle('is-selected', item === button)); }));
    $('#insurance-toggle', modalBody).addEventListener('change', event => { state.insurance = event.target.checked; $('#insurance-cost', modalBody).textContent = insuranceText(); });
    $$('.expert-choice button', modalBody).forEach(button => button.addEventListener('click', () => { state.expert = button.dataset.expert; $$('.expert-choice button', modalBody).forEach(item => item.classList.toggle('is-selected', item === button)); }));
    $('#photo-button', modalBody).addEventListener('click', () => $('#photo-input', modalBody).click());
    $('#photo-input', modalBody).addEventListener('change', event => { state.photos = event.target.files.length; $('#photo-status', modalBody).textContent = state.photos ? ` ${state.photos} selected` : ''; });
    $('.back-step', modalBody).addEventListener('click', showTypeScreen);
    $('#save-draft', modalBody).addEventListener('click', () => { updateWorkspace(); closeModal(); showPage('home'); toast('Your side is ready. Share the agreement when you are ready to invite your trade partner.'); });
  }
  function refreshTiming() {
    const config = typeConfig[state.type];
    $('#timing-box', modalBody).innerHTML = `<strong>Estimated completion: ${timeFor()}</strong>${config.timingNote}`;
  }
  function insuranceText() {
    return state.value ? `Estimated item insurance: ${formatMoney(state.value * .15)} (15% of declared item value).` : 'Insurance is calculated at 15% of declared item value.';
  }
  function parseCurrency(input) {
    return Number(String(input).replace(/[^0-9.]/g, '')) || 0;
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
  }
  function openMenu() { $('#mobile-nav').hidden = false; $('.menu-toggle').setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open'); $('.close-menu').focus(); }
  function closeMenu() { $('#mobile-nav').hidden = true; $('.menu-toggle').setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }

  $$('[data-route]').forEach(link => link.addEventListener('click', event => { const route = link.dataset.route; if (!route) return; event.preventDefault(); showPage(route); }));
  $$('[data-start-trade]').forEach(button => button.addEventListener('click', openModal));
  $('.close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  $('.menu-toggle').addEventListener('click', openMenu);
  $('.close-menu').addEventListener('click', closeMenu);
  $('#help-search').addEventListener('input', event => {
    const query = event.target.value.toLowerCase().trim();
    $$('#help-grid button').forEach(button => { button.hidden = !!query && !button.textContent.toLowerCase().includes(query); });
  });
  $$('#help-grid button').forEach(button => button.addEventListener('click', () => toast(`“${button.textContent.replace('→','').trim()}” is available in the Trade Bridge help centre.`)));

  $('#concierge-contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    toast('Your UK route request is ready for the private concierge desk. We will confirm availability directly.');
    event.currentTarget.reset();
  });
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1), false));
  window.addEventListener('keydown', event => { if (event.key === 'Escape') { if (!modal.hidden) closeModal(); else closeMenu(); } });
  updateWorkspace();
  showPage(location.hash.slice(1) || 'home', false);
})();
