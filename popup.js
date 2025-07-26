document.addEventListener('DOMContentLoaded', () => {
  const intentionForm = document.getElementById('intention-form');
  const intentionDisplay = document.getElementById('intention-display');
  const todaysIntention = document.getElementById('todays-intention');
  const saveButton = document.getElementById('save-button');
  const clearButton = document.getElementById('clear-button');
  const intentionInput = document.getElementById('intention-input');

  // Check if a goal is already saved and update the UI
  chrome.storage.local.get(['dailyGoal'], (result) => {
    if (result.dailyGoal) {
      todaysIntention.textContent = result.dailyGoal;
      intentionForm.classList.add('hidden');
      intentionDisplay.classList.remove('hidden');
    }
  });

  // Save button click listener
  saveButton.addEventListener('click', () => {
    const goal = intentionInput.value;
    if (goal) {
      // Save the goal using the chrome.storage API
      chrome.storage.local.set({ dailyGoal: goal }, () => {
        todaysIntention.textContent = goal;
        intentionForm.classList.add('hidden');
        intentionDisplay.classList.remove('hidden');
        console.log('Goal saved:', goal);
      });
    }
  });

  // Clear button click listener
  clearButton.addEventListener('click', () => {
    // Clear the goal from storage
    chrome.storage.local.remove(['dailyGoal'], () => {
      intentionInput.value = '';
      intentionDisplay.classList.add('hidden');
      intentionForm.classList.remove('hidden');
      console.log('Goal cleared.');
    });
  });
});