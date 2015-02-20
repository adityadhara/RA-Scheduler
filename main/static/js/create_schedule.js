// When the document is ready
$(document).ready(function () {
    
    //make shift box editable
    $.fn.editable.defaults.mode = 'inline';
    $('#shift-type-box-1').editable()
    
    // Attach datepicker to textboxes
    $('#start_date').datepicker({
        format: "mm/dd/yyyy"
    });
    $('#end_date').datepicker({
        format: "mm/dd/yyyy"
    });
});

function render_calendar_if_dates() {
    startDate = new Date(document.getElementById("start_date").value);
    endDate = new Date(document.getElementById("end_date").value);
    
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        renderCalendar(startDate, endDate);
    }
}
