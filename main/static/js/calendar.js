/*
  Design inspired by http://madebyevan.com/calendar/app/
  (c) 2015 George Brova
*/

// Store global properties about this calendar
var calendarProperties = {};

function renderCalendar(startDate, endDate) {
    // Save the start and end dates
    calendarProperties.startDate = startDate;
    calendarProperties.endDate   = endDate;

    // Reset any previously rendered calendar
    var calendarTableElement = calendarProperties.calendarTableElement;
    calendarTableElement.innerHTML = "";

    // Write the column for the days of the week
    generateWeekdayLabels();
    
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

function generateWeekdayLabels() {
    var calendarTableElement = calendarProperties.calendarTableElement;
    weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekHeader = calendarTableElement.insertRow(); 
    for (i = 0; i < weekdayNames.length; i++) {
	var weekday = weekHeader.insertCell();
	weekday.className += " weekdays";
	weekday.innerHTML = "<span>" + weekdayNames[i] + "</span>";
    }
}


monthNames =  [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];

function generateDay(day, date) {
    var isShaded = (date.getMonth() % 2);
    var isInRange = (date >= calendarProperties.startDate && date <= calendarProperties.endDate);
    
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
