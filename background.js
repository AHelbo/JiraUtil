chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    const { type, payload } = msg;
  
    switch (type) {
      case "jira":
        handleJiraRequest(payload, sendResponse);
        break;
  
      case "mock":
        handleMockRequest(payload, sendResponse);
        break;
  
        case "timeSubmit":
            handleTimeSubmit(payload, sendResponse);
        break;

      default:
        sendResponse({ status: 'Error', error: 'Unknown message type' });
        break;

    }
  
    return true;
});
  
function handleMockRequest({ issueKey }, sendResponse) {
sendResponse({ status: 200, data: issueKey });
}

function handleJiraRequest({ issueKey }, sendResponse) {
    chrome.storage.sync.get(['email', 'token'], async ({ email, token }) => {
        if (!email || !token) {
        sendResponse({ status: 'Error', error: 'Jira credentials not set' });
        return;
        }
        if (!issueKey) {
        sendResponse({ status: 'Error', error: 'issueKey required' });
        return;
        }

        try {
        const url = `https://novataris.atlassian.net/rest/api/3/issue/${issueKey}`;
        const auth = btoa(`${email}:${token}`);
        const res = await fetch(url, {
            method: 'GET',
            headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
            }
        });
        const data = await res.json();
        if (!res.ok) sendResponse({ status: res.status, error: data });
        else sendResponse({ status: res.status, data });
        } catch (err) {
        sendResponse({ status: 'Error', error: err.message });
        }
    });
}

async function handleTimeSubmit(payload, sendResponse) {
    try {
        const res = await fetch("https://time.novataris.com/register", {
        method: "POST",
        credentials: "include", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
        sendResponse({ status: res.status, error: data || "Unknown error" });
        } else {
        sendResponse({ status: res.status, data });
        }

    } catch (err) {
        sendResponse({ status: "Error", error: err.message });
    }
}