console.log("Script Loaded");

document.addEventListener("DOMContentLoaded", function() {
  // Select all li elements with the 'dates' attribute
  const listItems = document.querySelectorAll('li[dates]');

  listItems.forEach(listItem => {
    const itemDates = listItem.getAttribute('dates').split(',').map(date => new Date(date.trim()));
    itemDates.sort((a, b) => a - b);

    let endDate = itemDates.find(date => date > new Date());
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
      } else {
        // infer gap between events, then use the next date
        const dateGap = (itemDates[1] - itemDates[0]) === (itemDates[2] - itemDates[1]) ? itemDates[1] - itemDates[0] : null;

        if (dateGap) {
          do {
            endDate = new Date(endDate.getTime() + dateGap);
          } while(endDate < now);
        } else {
          clearInterval(timerInterval);
        }
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
      .filter(date => date > now && !isNaN(date));  // Only future dates
    const bDates = b.getAttribute('dates').split(',')
      .map(date => new Date(date.trim()))
      .filter(date => date > now && !isNaN(date));  // Only future dates

    const aMinDate = aDates.length ? Math.min(...aDates) : Infinity;
    const bMinDate = bDates.length ? Math.min(...bDates) : Infinity;

    return aMinDate - bMinDate;
  });

  // Re-append sorted <li> elements to the <ul>
  lis.forEach(li => ul.appendChild(li));
}

reorderEvents();