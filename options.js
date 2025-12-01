const emailInput = document.getElementById('email');
const tokenInput = document.getElementById('token');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');

chrome.storage.sync.get(['email', 'token'], (data) => {
  if (data.email) emailInput.value = data.email;
  if (data.token) tokenInput.value = data.token;
});

saveBtn.addEventListener('click', () => {
  chrome.storage.sync.set({
    email: emailInput.value,
    token: tokenInput.value
  }, () => {
    status.textContent = "Saved!";
    setTimeout(() => status.textContent = "", 2000);
  });
});
