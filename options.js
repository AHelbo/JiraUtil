const emailInput = document.getElementById('email');
const tokenInput = document.getElementById('token');
const epicMapInput = document.getElementById('epicMapInput');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');

chrome.storage.sync.get(['email', 'token', 'EPICMAP'], (data) => {
  if (data.email) emailInput.value = data.email;
  if (data.token) tokenInput.value = data.token;
  if (data.EPICMAP) {
    epicMapInput.value = JSON.stringify(data.EPICMAP, null, 4);
  } else {
    epicMapInput.value = "{}";
  }
});

saveBtn.addEventListener('click', () => {
  let epicMapParsed = {};

  try {
    epicMapParsed = JSON.parse(epicMapInput.value);
  } catch (err) {
    status.textContent = "EPIC map JSON invalid";
    return;
  }

  chrome.storage.sync.set({
    email: emailInput.value,
    token: tokenInput.value,
    EPICMAP: epicMapParsed
  }, () => {
    status.textContent = "Saved";
    setTimeout(() => status.textContent = "", 2000);
  });
});
