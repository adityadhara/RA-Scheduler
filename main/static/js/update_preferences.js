var preferenceLabels = {"-2": "Very bad", "-1": "Bad",
			"0": "Neutral", "1": "Good", "2": "Very good"};

function updateDate(date, labelObj, delta) {

    newValue = calendarProperties.data[date] + delta;
    if (newValue >= -2 && newValue <= 2) {
	calendarProperties.data[date] = newValue;
    }
    
    labelObj.innerHTML = preferenceLabels[calendarProperties.data[date]];
}

window.onload = function()
{
    calendarProperties.calendarTableElement = document.getElementById('calendar');
    calendarProperties.data = {};
    calendarProperties.fillCellFn = function(cellObj, date) {

	var currentPriorityLabel = document.createElement("span");
	currentPriorityLabel.className = "label label-default";
	currentPriorityLabel.innerHTML = "Neutral";
	calendarProperties.data[date] = 0;

	var plusBtn = document.createElement("a");
	plusBtn.className = "btn btn-xs btn-default";
	plusBtn.innerHTML = "+";
	// Note: we have to return this function because otherwise date won't
	// be copied until the onclick() event happens (so it won't have the right
	// value)
	plusBtn.onclick = function(frozenDate) {
	    return function() {
		updateDate(frozenDate, currentPriorityLabel, 1);
	    };
	} (date.toString());

	var minusBtn = document.createElement("a");
	minusBtn.className = "btn btn-xs btn-default";
	minusBtn.innerHTML = "-";
	minusBtn.onclick = function(frozenDate) {
	    return function() {
		updateDate(frozenDate, currentPriorityLabel, -1);
	    };
	} (date.toString());

	var controlsDiv = document.createElement("div");
	controlsDiv.style.width = "100px";

	//TODO: fix alignments, make this pretty. 
	//controlsDiv.style.background = "red";
	
	controlsDiv.style.position = "relative";
	controlsDiv.style.top = "20";
	controlsDiv.appendChild(currentPriorityLabel);
	controlsDiv.appendChild(document.createElement("br"));
	controlsDiv.appendChild(document.createElement("br"));
	controlsDiv.appendChild(plusBtn);
	controlsDiv.appendChild(minusBtn);
	cellObj.appendChild(controlsDiv);
	//cellObj.innerHTML += "<p>hello2</p>";
    };
    renderCalendar(new Date("2014-12-10"), new Date("2015-02-22"));


}
