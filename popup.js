const output = document.getElementById('output');
const callBtn = document.getElementById('callBtn');
const issueField = document.getElementById('issueField');

const EPICMAP = {
    "FDK-2317": "FDK - Deployment",
    "FDK-2320": "FDK - Maintenance",
    "FDK-3151": "FDK - Development",
    "FDK-4040": "FDK - Enhancing Mitwaoo Product changes",
    "FDK-4084": "FDK - Enhanced Fibia Online",
    "FDK-4186": "FDK - Enhanced SSO for Private",
    "FDK-4564": "FDK - WCAG",
    "FDK-4629": "FDK - MitID Integration",
    "FDK-4948": "FDK - Online Optimization",
    "FDK-5028": "FDK - MitID Integration",
    "FDK-5145": "FDK - Online Optimization"
};

async function getJiraIssue(issueKey) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'mock', payload: { issueKey } }, (response) => {
      resolve(response);
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
    const issue = await getJiraIssue(key);
    return issue.fields?.parent?.key
}

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
});
