const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
  headerToolbar: false,
  initialView: 'timeGridOneDay',
  views: {
    timeGridOneDay: {
      type: 'timeGrid',
      dayCount: 1
    }
  },
  aspectRatio: .5,
  allDaySlot: false,
  dayHeaders: false,
  dateClick: function(info) {
    date = new Date(info.dateStr);
    $('input[name="scheduledFor"]').val(info.dateStr);
    $('#nudge-modal').css('display', 'block');

  }, 
});

$('#show-nudges').on('click', () => {
  calendar.render();
})