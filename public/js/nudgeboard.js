fetch('/nudges/api')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    populateCalendar(json.userNudges);
  })




/**
 * @function populateCalendar()
 * @description reformats nudge information from database to be read and displayed by fullcalendar
 * @param {Array} nudges nudge data attached to this user 
 */
const populateCalendar = function (nudges) {
  nudges.forEach(nudge => {
    const calendarNudge = {
      title: nudge.content,
      id: nudge._id,
      rrule: {
        freq: 'daily',
        dtstart: nudge.scheduledFor
      }
    }
    calendar.addEventSource([calendarNudge]);
  })
}




/**
 * @function editNudge()
 * @description populates edit form based on clicked calendar event
 * @param {Object} nudge information from database for selected nudge
 */
const editNudge = function (nudge) {
  $('#edit-nudge').css('display', 'flex');
  $('form[name="edit-nudge"]').attr('action', `/nudges/${nudge.id}?_method=PUT`);
  $('form[name="edit-nudge"] input[name="content"]').val(nudge.title);

  if (nudge.description) {
    $('form[name="edit-nudge"] input[name="taskDescription"]').val(nudge.description);
  }

  $('form[name="edit-nudge"] input[name="scheduledFor"]').val(nudge.start);

  $('form[name="delete-nudge"').attr('action', `/nudges/${nudge.id}?_method=DELETE`);
}




const calendarEl = document.getElementById('calendar');

/**
 * Instantiates calendar using fullcalendar.io with custom appearance and behavior
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
  eventColor: 'rgba(0, 0, 0, 0)',
  aspectRatio: 0.5,
  displayEventTime: false,
  defaultTimedEventDuration: '00:15:00',
  allDaySlot: false,
  dayHeaders: false,
  dateClick: function (info) {
    $('input[name="scheduledFor"]').val(new Date(info.dateStr));
    $('#new-nudge').css('display', 'flex');
  },
  eventClick: function (info) {
    editNudge(info.event);
  }
});


calendar.render();
