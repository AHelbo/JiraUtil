chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const { email, token } = msg;
  
    const url = 'https://your-domain.atlassian.net/rest/api/3/myself';
    const auth = btoa(`${email}:${token}`);
  
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    })
    .then(res => sendResponse({ status: res.status }))
    .catch(err => sendResponse({ status: 'Error', error: err.message }));
  
    return true;
  });
  