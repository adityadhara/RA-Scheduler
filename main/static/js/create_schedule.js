// When the document is ready
$(document).ready(function () {

    // Set the calendar object
    calendarProperties.calendarTableElement = document.getElementById('calendar');

    
    // Make a default shift 
    $.fn.editable.defaults.mode = 'inline';
    add_shift_type("Regular shift");
    
    // Attach datepicker to textboxes
    $('#start_date').datepicker({
        format: "mm/dd/yyyy"
    });
    $('#end_date').datepicker({
        format: "mm/dd/yyyy"
    });
});

shift_type_ids = new Set();
next_shift_type = 0;

function remove_shift_type(shiftId) {
    document.getElementById("shift-type-div-" + shiftId).remove();
    shift_type_ids.delete(shiftId);
}

function add_shift_type(shiftName) {
    var containerAllDiv = document.getElementById("shift-types-container");
    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("id", "shift-type-div-" + next_shift_type);
    
    var shiftLabel = document.createElement("a");
    shiftLabel.setAttribute("id", "shift-type-box-" + next_shift_type);
    shiftLabel.setAttribute("data-type", "text");
    shiftLabel.setAttribute("class", "editable editable-click");
    shiftLabel.innerHTML = shiftName
    $(shiftLabel).editable()
    containerDiv.appendChild(shiftLabel);

    var nbsp = document.createTextNode( "\u00A0" );            
    containerDiv.appendChild( nbsp );
    

    var shiftDelete = document.createElement("a");
    shiftDelete.setAttribute("class", "btn btn-xs btn-danger");
    shiftDelete.setAttribute("id", "shift-type-delete-" + next_shift_type);
    shiftDelete.setAttribute("onclick", "remove_shift_type(" + next_shift_type + ")");
    shiftDelete.innerHTML = "Delete";
    containerDiv.appendChild(shiftDelete);
    
    var shiftBr = document.createElement("br");
    containerDiv.appendChild(shiftBr);

    containerAllDiv.appendChild(containerDiv);
    shift_type_ids.add(next_shift_type);
    next_shift_type += 1;
}

function render_calendar_if_dates() {
    startDate = new Date(document.getElementById("start_date").value);
    endDate = new Date(document.getElementById("end_date").value);
    
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        renderCalendar(startDate, endDate);
    }
}
