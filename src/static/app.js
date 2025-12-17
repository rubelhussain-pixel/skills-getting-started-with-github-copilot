document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to get icon for activity
  function getActivityIcon(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('soccer')) return '⚽';
    if (lowerName.includes('basketball')) return '🏀';
    if (lowerName.includes('tennis')) return '🎾';
    if (lowerName.includes('football')) return '🏈';
    if (lowerName.includes('baseball')) return '⚾';
    if (lowerName.includes('volleyball')) return '🏐';
    if (lowerName.includes('swimming')) return '🏊';
    if (lowerName.includes('running') || lowerName.includes('track')) return '🏃';
    if (lowerName.includes('chess')) return '♟️';
    if (lowerName.includes('music') || lowerName.includes('band')) return '🎵';
    if (lowerName.includes('art')) return '🎨';
    if (lowerName.includes('drama') || lowerName.includes('theater')) return '🎭';
    if (lowerName.includes('science')) return '🔬';
    if (lowerName.includes('math')) return '🔢';
    if (lowerName.includes('debate')) return '💬';
    return '🎯'; // default icon
  }

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4><span class="activity-icon">${getActivityIcon(name)}</span> ${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p><strong>Participants:</strong></p>
          <ul class="participants-list">
            ${details.participants.map(participant => `<li>${participant}</li>`).join('')}
          </ul>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
