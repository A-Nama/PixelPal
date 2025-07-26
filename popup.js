document.addEventListener('DOMContentLoaded', () => {
  // Screen elements
  const nameScreen = document.getElementById('name-screen');
  const goalScreen = document.getElementById('goal-screen');
  const statusScreen = document.getElementById('status-screen');

  // Button and Input elements
  const palNameInput = document.getElementById('pal-name-input');
  const saveNameButton = document.getElementById('save-name-button');
  const goalInput = document.getElementById('goal-input');
  const saveGoalButton = document.getElementById('save-goal-button');
  const chillModeButton = document.getElementById('chill-mode-button');
  const doneButton = document.getElementById('done-button'); 
  
  // Text elements
  const goalPrompt = document.getElementById('goal-prompt');
  const goalDisplay = document.getElementById('goal-display');
  const statusGreeting = document.getElementById('status-greeting');

  // Function to switch between views
  const showView = (viewToShow) => {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    if (viewToShow) {
      viewToShow.classList.remove('hidden');
    }
  };

  // Initial setup: Check what to show when the popup opens
  chrome.storage.local.get(['palName', 'dailyGoal', 'focusState'], (data) => {
    if (!data.palName) {
      showView(nameScreen);
    } else if (!data.dailyGoal || data.focusState === 'chill') {
      goalPrompt.textContent = "What's your plan for today?";
      showView(goalScreen);
    } else {
      statusGreeting.textContent = `${data.palName} is cheering for you!`;
      goalDisplay.textContent = data.dailyGoal;
      showView(statusScreen);
    }
  });

  // Event Listeners
  saveNameButton.addEventListener('click', () => {
    const name = palNameInput.value;
    if (name) {
      chrome.storage.local.set({ palName: name }, () => {
        goalPrompt.textContent = "What's your plan for today?";
        showView(goalScreen);
      });
    }
  });

  saveGoalButton.addEventListener('click', () => {
    const goal = goalInput.value;
    if (goal) {
      chrome.storage.local.get(['palName'], (data) => {
        chrome.storage.local.set({ dailyGoal: goal, focusState: 'focus' }, () => {
          statusGreeting.textContent = `${data.palName} is cheering for you!`;
          goalDisplay.textContent = goal;
          showView(statusScreen);
        });
      });
    }
  });
  
  chillModeButton.addEventListener('click', () => {
      // Set the state to chill and clear any old goal
      chrome.storage.local.set({ focusState: 'chill', dailyGoal: null }, () => {
          // You can add a confirmation message here if you want
          // For now, it just closes the popup.
          window.close();
      });
  });

  // NEW: Listener for the "Done & Next" button
  doneButton.addEventListener('click', () => {
      // Clear the completed goal and set state to chill, then go back to the goal screen
      chrome.storage.local.set({ dailyGoal: null, focusState: 'chill' }, () => {
          goalInput.value = ''; // Clear the input field for the next goal
          showView(goalScreen);
      });
  });
});
