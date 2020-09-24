fetch('/nudges/api')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    populateCalendar(json.userNudges);
  })




/**
 * FIXME needs docstring
 * Low priority.
 */
const populateCalendar = function (nudges) {
  nudges.forEach(nudge => {
    const calendarNudge = {
      title: nudge.taskName,
      id: nudge._id,
      rrule: {
        freq: 'daily',
        dtstart: nudge.scheduledFor
      }
    }
    calendar.addEventSource([calendarNudge]);
  })
}

const calendarEl = document.getElementById('calendar');






/**
 * FIXME needs docstring
 * Low priority.
 */
const calendar = new FullCalendar.Calendar(calendarEl, {
  headerToolbar: false,
  initialView: 'timeGridOneDay',
  views: {
    timeGridOneDay: {
      type: 'timeGrid',
      dayCount: 1,
      slotDuration: '00:15:00',
      slotMinTime: '07:00:00',
      slotMaxTime: '21:15:00'
    }
  },
  eventColor: 'rgba(60, 179, 113, 0)',
  aspectRatio: 0.5,
  displayEventTime: false,
  defaultTimedEventDuration: '00:15:00',
  allDaySlot: false,
  dayHeaders: false,
  dateClick: function (info) {
    $('input[name="scheduledFor"]').val(new Date(info.dateStr));
    $('#nudge-modal').css('display', 'flex');
  },
  eventClick: function (info) {
    editNudge(info.event);
  }
});


calendar.render();
