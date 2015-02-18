window.onload = function()
{
    calendarTableElement = document.getElementById('calendar');
}

function renderCalendar(startDate, endDate) {
    // Reset any previously rendered calendar
    calendarTableElement.innerHTML = "";

    // Initialize to the beginning of the week if necessary
    currentDay = new Date(startDate.getTime());
    currentDay.setDate(currentDay.getDate() - currentDay.getDay());

    // Keep adding weeks until we reach the last requested day
    while (currentDay < endDate) {
	var week = calendarTableElement.insertRow();
	do
	{
	    var day = week.insertCell();
	    generateDay(day, currentDay);
	    
	    // Increment currentDay
	    currentDay.setDate(currentDay.getDate() + 1);
	    
	} while(currentDay.getDay() != 0)
    
    }
}


monthNames =  [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];

function generateDay(day, date) {
    var isShaded = (date.getMonth() % 2);
    var isInRange = (date >= startDate && date <= endDate);
    
    if(isShaded) day.className += " oddmonth";
    else day.className += " evenmonth";
    if(!isInRange) day.className += " notinrange";

    // Write the date
    dateText = date.getDate();
    if (date.getDate() == 1) {
	dateText = monthNames[date.getMonth()] + " " + dateText;
    }
    day.innerHTML = "<span>" + dateText + "</span>";
}
