document.addEventListener('DOMContentLoaded', () => {
  // --- Get all screen and element references ---
  const nameScreen = document.getElementById('name-screen');
  const goalScreen = document.getElementById('goal-screen');
  const statusScreen = document.getElementById('status-screen');
  const loadingScreen = document.getElementById('loading-screen');
  const analysisScreen = document.getElementById('analysis-screen');
  const resultsScreen = document.getElementById('results-screen');

  // --- Buttons, inputs, and text displays ---
  // Normal flow elements
  const palNameInput = document.getElementById('pal-name-input');
  const saveNameButton = document.getElementById('save-name-button');
  const goalInput = document.getElementById('goal-input');
  const saveGoalButton = document.getElementById('save-goal-button');
  const chillModeButton = document.getElementById('chill-mode-button');
  const doneButton = document.getElementById('done-button');
  const goalPrompt = document.getElementById('goal-prompt');
  const goalDisplay = document.getElementById('goal-display');
  const statusGreeting = document.getElementById('status-greeting');

  // Vibe check flow elements
  const rewriteButton = document.getElementById('rewrite-button');
  const analysisOkButton = document.getElementById('analysis-ok-button');
  const resultsDoneButton = document.getElementById('results-done-button');
  const vibeDisplay = document.getElementById('vibe-display');
  const analysisDisplay = document.getElementById('analysis-display');
  const suggestionsContainer = document.getElementById('suggestions-container');

  let textToCheck = ''; // Variable to hold the original text for vibe checks

  // --- SVG Icons ---
  const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  const checkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  const showView = (viewToShow) => {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    if (viewToShow) viewToShow.classList.remove('hidden');
  };

  // --- Main Logic: Check if we need to do a vibe check ---
  chrome.storage.local.get(['vibeCheckText'], (data) => {
    if (data.vibeCheckText) {
      textToCheck = data.vibeCheckText;
      chrome.storage.local.remove('vibeCheckText');
      handleVibeAnalysis();
    } else {
      // --- Normal Startup Flow ---
      chrome.storage.local.get(['palName', 'dailyGoal', 'focusState'], (userData) => {
        if (!userData.palName) {
          showView(nameScreen);
        } else if (!userData.dailyGoal || userData.focusState === 'chill') {
          goalPrompt.textContent = "What's your plan for today?";
          showView(goalScreen);
        } else {
          statusGreeting.textContent = `${userData.palName} is cheering you on!`;
          goalDisplay.textContent = userData.dailyGoal;
          showView(statusScreen);
        }
      });
    }
  });

  // --- Vibe Check Functions ---
  async function handleVibeAnalysis() {
    showView(loadingScreen);
    try {
      const response = await fetch('http://127.0.0.1:8000/vibe-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToCheck }),
      });
      if (!response.ok) throw new Error('Analysis request failed');
      const result = await response.json();
      
      vibeDisplay.textContent = result.vibe;
      analysisDisplay.textContent = result.analysis;
      showView(analysisScreen);

    } catch (error) {
      console.error('Vibe analysis failed:', error);
      alert('Could not get vibe analysis. Is the backend server running?');
      window.close();
    }
  }

  async function handleVibeRewrite() {
    showView(loadingScreen);
    try {
      const response = await fetch('http://127.0.0.1:8000/vibe-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToCheck }),
      });
      if (!response.ok) throw new Error('Rewrite request failed');
      const result = await response.json();

      suggestionsContainer.innerHTML = '';
      
      for (const key in result.rewrites) {
        const suggestionText = result.rewrites[key];
        const wrapper = document.createElement('div');
        wrapper.className = 'suggestion-wrapper highlight';
        const textEl = document.createElement('p');
        textEl.innerHTML = `<strong>${key}:</strong> ${suggestionText}`;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-button';
        copyBtn.innerHTML = copyIconSVG;
        copyBtn.title = 'Copy to clipboard';
        
        copyBtn.addEventListener('click', () => {
          const tempTextarea = document.createElement('textarea');
          tempTextarea.value = suggestionText;
          document.body.appendChild(tempTextarea);
          tempTextarea.select();
          document.execCommand('copy');
          document.body.removeChild(tempTextarea);

          copyBtn.innerHTML = checkIconSVG;
          setTimeout(() => {
            copyBtn.innerHTML = copyIconSVG;
          }, 1500);
        });
        
        wrapper.appendChild(textEl);
        wrapper.appendChild(copyBtn);
        suggestionsContainer.appendChild(wrapper);
      }
      showView(resultsScreen);

    } catch (error) {
      console.error('Vibe rewrite failed:', error);
      alert('Could not get rewrites. Is the backend server running?');
      window.close();
    }
  }

  // --- Event Listeners ---
  // Normal flow listeners
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
        chrome.storage.local.set({ dailyGoal: goal, focusState: 'focus' }, () => {
          statusGreeting.textContent = `${data.palName} is cheering you on!`;
          goalDisplay.textContent = goal;
          showView(statusScreen);
        });
      });
    }
  });

  chillModeButton.addEventListener('click', () => {
    chrome.storage.local.set({ focusState: 'chill', dailyGoal: null }, () => {
      window.close();
    });
  });

  doneButton.addEventListener('click', () => {
    chrome.storage.local.set({ dailyGoal: null, focusState: 'chill' }, () => {
      goalInput.value = '';
      showView(goalScreen);
    });
  });

  // Vibe check flow listeners
  rewriteButton.addEventListener('click', handleVibeRewrite);
  analysisOkButton.addEventListener('click', () => window.close());
  resultsDoneButton.addEventListener('click', () => window.close());
});
