const callBtn = document.getElementById('callBtn');
const output = document.getElementById('output');

callBtn.addEventListener('click', () => {
  chrome.storage.sync.get(['email', 'token'], ({ email, token }) => {
    if (!email || !token) {
      output.value = "Please set email and token in options.";
      return;
    }

    chrome.runtime.sendMessage({ email, token }, (response) => {
      output.value = `Response Code: ${response.status}`;
    });
  });
});
