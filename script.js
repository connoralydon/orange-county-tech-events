console.log("Script Loaded");


  const LOOK_BEFORE_LENGTH = 4 * 60 * 60 * 1000;

document.addEventListener("DOMContentLoaded", function() {
  // Select all li elements with the 'dates' attribute
  const listItems = document.querySelectorAll('li[dates]');

  listItems.forEach(listItem => {
    let itemDates = listItem.getAttribute('dates').split(',').map(date => new Date(date.trim()));
    
    // Filter out invalid dates
    itemDates = itemDates.filter(date => !isNaN(date.getTime()));
    
    // Sort dates in ascending order
    itemDates.sort((a, b) => a - b);

    // Find the next upcoming date
    let endDate = itemDates.find(date => date > new Date());

    if (!endDate) {
      // If no future date, use the last date in the list
      // Getting closest to date to current. We already know that the date is before now.
      endDate = new Date(Math.max(...itemDates.map(date => date.getTime())));
    }

    const timerSpan = listItem.querySelector('.timer');

    function updateTimer() {
      const now = new Date();
      const remainingTime = endDate - now;

      if (remainingTime >= 0) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        timerSpan.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        timerSpan.classList.remove("timer-negative");
        timerSpan.classList.add("timer-positive");
      } else if (remainingTime > - 4 * 60 * 60 * 1000){
        const timeSinceEvent = now - endDate;
        const days = Math.floor(timeSinceEvent / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeSinceEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeSinceEvent % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeSinceEvent % (1000 * 60)) / 1000);

        timerSpan.textContent = `Event started ${days}d ${hours}h ${minutes}m ${seconds}s ago`;
        timerSpan.classList.remove("timer-positive");
        timerSpan.classList.add("timer-negative");
      } else {
        timerSpan.classList.remove("timer-positive")
        timerSpan.classList.remove("timer-negative")
      }
    }

    // Update the timer immediately and then every second
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  });
});

function reorderEvents() {
  const ul = document.getElementById('event-list');
  const lis = Array.from(ul.getElementsByTagName('li'));
  const now = new Date();

  lis.sort((a, b) => {
    const aDates = a.getAttribute('dates').split(',')
      .map(date => new Date(date.trim()))
      .filter(date => date > now - LOOK_BEFORE_LENGTH && !isNaN(date));  // Only future dates
    const bDates = b.getAttribute('dates').split(',')
      .map(date => new Date(date.trim()))
      .filter(date => date > now - LOOK_BEFORE_LENGTH && !isNaN(date));  // Only future dates

    const aMinDate = aDates.length ? aDates[0] : Infinity;
    const bMinDate = bDates.length ? bDates[0] : Infinity;

    return aMinDate - bMinDate;
  });

  // Re-append sorted <li> elements to the <ul>
  lis.forEach(li => ul.appendChild(li));
}

reorderEvents();
