/* ── Language toggle ──────────────────────────────── */
let currentLang = 'de';

const translations = {
  de: {
    pageTitle: 'Neue Website in Minuten',
    errorEmpty: 'Bitte gib eine Website-Adresse ein.',
    errorInvalid: 'Bitte gib eine gültige URL ein, z.B. https://www.deinbetrieb.de',
  },
  en: {
    pageTitle: 'New website in minutes',
    errorEmpty: 'Please enter a website address.',
    errorInvalid: 'Please enter a valid URL, e.g. https://www.yourbusiness.com',
  },
};

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = translations[lang].pageTitle;

  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    if (el.tagName === 'INPUT') {
      el.placeholder = el.dataset['placeholder' + lang.charAt(0).toUpperCase() + lang.slice(1)] || el.placeholder;
    } else {
      el.innerHTML = el.dataset[lang];
    }
  });

  const urlInput = document.getElementById('urlInput');
  const placeholderKey = 'placeholder' + lang.charAt(0).toUpperCase() + lang.slice(1);
  if (urlInput && urlInput.dataset[placeholderKey]) {
    urlInput.placeholder = urlInput.dataset[placeholderKey];
  }

  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) toggleBtn.textContent = lang === 'de' ? 'EN' : 'DE';

  clearError();
}

document.getElementById('langToggle').addEventListener('click', () => {
  setLang(currentLang === 'de' ? 'en' : 'de');
});

/* ── Form handling ────────────────────────────────── */
const form = document.getElementById('mainForm');
const urlInput = document.getElementById('urlInput');
const errorMsg = document.getElementById('errorMsg');
const inputWrap = document.getElementById('inputWrap');
const ctaBtn = document.getElementById('ctaBtn');
const loadingState = document.getElementById('loadingState');

function clearError() {
  errorMsg.textContent = '';
  inputWrap.classList.remove('has-error');
}

function showError(msg) {
  errorMsg.textContent = msg;
  inputWrap.classList.add('has-error');
  urlInput.focus();
}

function isValidUrl(value) {
  try {
    const url = new URL(value.startsWith('http') ? value : 'https://' + value);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
}

function normaliseUrl(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return 'https://' + trimmed;
  }
  return trimmed;
}

urlInput.addEventListener('input', clearError);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();

  const raw = urlInput.value.trim();
  const t = translations[currentLang];

  if (!raw) {
    showError(t.errorEmpty);
    return;
  }

  if (!isValidUrl(raw)) {
    showError(t.errorInvalid);
    return;
  }

  const normalisedUrl = normaliseUrl(raw);

  // Enter loading state
  ctaBtn.disabled = true;
  loadingState.hidden = false;
  urlInput.disabled = true;

  /*
   * TODO: hand off normalisedUrl to the backend pipeline.
   * Replace the setTimeout below with your actual fetch/redirect.
   * e.g. window.location.href = `/generate?url=${encodeURIComponent(normalisedUrl)}`;
   */
  console.log('Submitting URL:', normalisedUrl);

  setTimeout(() => {
    // Placeholder: keep loading for demo; real impl replaces this block.
  }, 0);
});
