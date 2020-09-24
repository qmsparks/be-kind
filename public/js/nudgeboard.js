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
      // NOTE some oddness with populating the description in the edit modal, I suspect it starts here
      description: nudge.taskDescription,
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
      slotDuration: '00:15:00'
    }
  },
  defaultTimedEventDuration: '00:15:00',
  allDaySlot: false,
  dayHeaders: false,
  dateClick: function (info) {
    $('input[name="scheduledFor"]').val(info.dateStr);
    $('#nudge-modal').css('display', 'block');
  },
  eventClick: function (info) {
    editNudge(info.event);
  }
});


calendar.render();
