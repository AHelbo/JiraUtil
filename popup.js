const output = document.getElementById('output');
const callBtn = document.getElementById('callBtn');
const issueField = document.getElementById('issueField');

async function getJiraIssue(issueKey) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'jira', payload: { issueKey } }, (res) => {

      if (!res) {
        reject(new Error("No response from background"));
        return;
      }

      if (res.status !== 200) {
        reject(res.error || new Error("Jira error"));
        return;
      }

      resolve(res.data);   
    });
  });
}
async function resolveTaskID(taskID) {
    if (taskID.startsWith("FDO")) {
        const issue = await getJiraIssue(taskID);
        const links = issue.fields?.issuelinks || [];
        for (const link of links) {
            const inward = link.inwardIssue?.key;
            if (inward) return inward;
        }
    }
    return taskID.startsWith("FDK") ? taskID : "FDK-" + taskID;
}

async function getEpic(key) {
    const issue =await getJiraIssue(key);
    return issue.fields?.parent?.key
}

let EPICMAP = {};

chrome.storage.sync.get(["EPICMAP"], (data) => {
    EPICMAP = data.EPICMAP || {};
});

callBtn.addEventListener('click', async () => {
    if (!issueField.value) {
        output.value = "Skriv no'et for pokker";
        return;
    }

    let [taskID, taskDescription] = issueField.value.split(":");
    taskID = taskID.toUpperCase().trim();

    const fdoTaskID = taskID.startsWith("FDO") ? taskID + " => " : "";

    taskID = await resolveTaskID(taskID);
    
    const epicID = await getEpic(taskID);

    const projectName = EPICMAP[epicID] || ("UNKNOWN EPIC: " + epicID);

    taskDescription = taskDescription && EPICMAP[epicID]
         ? "\n\nFixed time registration:\n" + taskID + ":" + taskDescription
         : "";

    output.value = `${fdoTaskID}${taskID} => ${projectName}${taskDescription}`;
    issueField.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
  issueField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      callBtn.click();
    }
  });
});

function sendTimeRegistration({ start, end, duration, description, project }) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        { type: "timeSubmit", payload: { start, end, duration, description, project } },
        response => resolve(response)
      );
    });
  }