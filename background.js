// A default list of distracting websites.
const DEFAULT_DISTRACTION_SITES = [
  "twitter.com",
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "reddit.com",
  "tiktok.com",
  "pinterest.com"
];

const FOCUS_TIME_MINUTES = 60; // Set how long to focus before a break nudge

// Runs once when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(() => {
  // Set default values on installation
  chrome.storage.local.set({
    blockedSites: DEFAULT_DISTRACTION_SITES,
    focusState: 'chill'
  });

  // Create the right-click context menu item
  chrome.contextMenus.create({
    id: "vibeCheck",
    title: "Check the vibe with PixelPal ✨",
    contexts: ["selection"]
  });
});

// Listener for the "Vibe Check" right-click action
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "vibeCheck" && info.selectionText) {
    // Store the selected text so the popup can read it
    chrome.storage.local.set({ vibeCheckText: info.selectionText }, () => {
      // Open the popup window.
      chrome.action.openPopup();
    });
  }
});

// Listener for tab updates (distraction checker)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // We only care when the URL changes.
  if (changeInfo.url) {
    chrome.storage.local.get(['focusState', 'palName', 'blockedSites'], (data) => {
      // ONLY check for distractions if the user is in 'focus' mode.
      if (data.focusState === 'focus') {
        const isDistraction = data.blockedSites.some(site => changeInfo.url.includes(site));
        if (isDistraction) {
          const palName = data.palName || "PixelPal";
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/avatar-sad.png',
            title: 'A Distraction Appeared!',
            message: `${palName} says: Girl, looks like you're getting distracted. Let's lock in!`
          });
        }
      }
    });
  }
});


// Listener for when our alarms go off
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusBreakAlarm") {
    // Check if the user is still focused before sending the notification
    chrome.storage.local.get(['focusState', 'palName'], (data) => {
      if (data.focusState === "focus") {
        const palName = data.palName || "PixelPal";
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/avatar-coffee.png',
          title: 'You are SLAYING this!',
          message: `${palName} says: You've been working hard. Time for a well-deserved break!`
        });
      }
    });
  }
});

// Listen for changes in storage to manage alarms
chrome.storage.onChanged.addListener((changes, namespace) => {
  // Check if the focusState was changed
  if (changes.focusState) {
    const newState = changes.focusState.newValue;
    if (newState === "focus") {
      // When focus starts, create an alarm
      chrome.alarms.create("focusBreakAlarm", {
        delayInMinutes: FOCUS_TIME_MINUTES
      });
      console.log("Focus alarm set!");
    } else {
      // When focus ends (chill, done, etc.), clear the alarm
      chrome.alarms.clear("focusBreakAlarm");
      console.log("Focus alarm cleared!");
    }
  }
});
