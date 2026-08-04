function localizePage() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const message = browser.i18n.getMessage(key);
    if (message) {
      if (el.tagName === 'TITLE') {
        document.title = message;
      } else {
        el.textContent = message;
      }
    }
  });
}

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    region: document.querySelector('#region').value,
  });
}

function restoreOptions() {
  localizePage();
  function setCurrentChoice(result) {
    document.querySelector('#region').value = result.region || browser.i18n.getUILanguage();
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get('region');
  getting.then(setCurrentChoice, onError);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);

