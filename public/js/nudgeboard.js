document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
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
      // const hour = thisDate.getHours();
      // const minutes = thisDate.getMinutes();
      $('input[name="scheduledFor"]').val(info.dateStr);
      $('#nudge-modal').css('display', 'block');
    }
  });
  calendar.render();
});
