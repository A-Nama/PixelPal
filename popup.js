document.addEventListener('DOMContentLoaded', () => {
  // Screen elements
  const nameScreen = document.getElementById('name-screen');
  const goalScreen = document.getElementById('goal-screen');
  const statusScreen = document.getElementById('status-screen');
  const vibeCheckScreen = document.getElementById('vibe-check-screen'); 
  const breakScreen = document.getElementById('break-screen'); 

  // All other elements
  const palNameInput = document.getElementById('pal-name-input');
  const saveNameButton = document.getElementById('save-name-button');
  const goalInput = document.getElementById('goal-input');
  const saveGoalButton = document.getElementById('save-goal-button');
  const chillModeButton = document.getElementById('chill-mode-button');
  const doneButton = document.getElementById('done-button');
  const rewriteButton = document.getElementById('rewrite-button'); 
  const vibeOkButton = document.getElementById('vibe-ok-button'); 
  const goalPrompt = document.getElementById('goal-prompt');
  const goalDisplay = document.getElementById('goal-display');
  const statusGreeting = document.getElementById('status-greeting');
  const vibeTextDisplay = document.getElementById('vibe-text-display'); 

  const showView = (viewToShow) => {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    if (viewToShow) {
      viewToShow.classList.remove('hidden');
    }
  };

  // Check for a pending vibe check FIRST
  chrome.storage.local.get(['vibeCheckText'], (data) => {
    if (data.vibeCheckText) {
      // If vibe check text exists, show that screen
      vibeTextDisplay.textContent = `"${data.vibeCheckText}"`;
      showView(vibeCheckScreen);
      // IMPORTANT: Clear the text from storage so it doesn't show again
      chrome.storage.local.remove('vibeCheckText');
    } else {
      // If no vibe check, proceed with the normal flow
      chrome.storage.local.get(['palName', 'dailyGoal', 'focusState'], (data) => {
        if (!data.palName) {
          showView(nameScreen);
        } else if (!data.dailyGoal || data.focusState === 'chill') {
          goalPrompt.textContent = "What's your plan for today?";
          showView(goalScreen);
        } else {
          statusGreeting.textContent = `${data.palName} is cheering you on!`;
          goalDisplay.textContent = data.dailyGoal;
          showView(statusScreen);
        }
      });
    }
  });

  // --- Event Listeners ---

  saveNameButton.addEventListener('click', () => {
    const name = palNameInput.value;
    if (name) {
      chrome.storage.local.set({ palName: name }, () => {
        showView(goalScreen);
      });
    }
  });

  saveGoalButton.addEventListener('click', () => {
    const goal = goalInput.value;
    if (goal) {
      chrome.storage.local.get(['palName'], (data) => {
        // This will trigger the alarm to be set via the background script
        chrome.storage.local.set({ dailyGoal: goal, focusState: 'focus' }, () => {
          statusGreeting.textContent = `${data.palName} is cheering you on!`;
          goalDisplay.textContent = goal;
          showView(statusScreen);
        });
      });
    }
  });
  
  chillModeButton.addEventListener('click', () => {
      // This will trigger the alarm to be cleared
      chrome.storage.local.set({ focusState: 'chill', dailyGoal: null }, () => {
          window.close();
      });
  });

  doneButton.addEventListener('click', () => {
      // This will also trigger the alarm to be cleared
      chrome.storage.local.set({ dailyGoal: null, focusState: 'chill' }, () => {
          goalInput.value = '';
          showView(goalScreen);
      });
  });

  // NEW: Vibe Check Button Listeners
  rewriteButton.addEventListener('click', () => {
      // This is where Teammate B's magic will happen!
      // For now, it just closes the popup.
      alert("This is where the AI rewrite suggestions will appear!");
      window.close();
  });

  vibeOkButton.addEventListener('click', () => {
      window.close();
  });
});
