fetch('/nudges/api')
.then(function(response) {
  return response.json();
})
.then(function(json){
  populateCalendar(json.userNudges);
})

const populateCalendar = function(nudges) {
  nudges.forEach(nudge => {
    const calendarNudge = {
      title: nudge.taskName,
      start: nudge.scheduledFor,
      id: nudge._id
    }
    calendar.addEventSource([calendarNudge]);
  })
}

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
    allDaySlot: false,
    dayHeaders: false,
    dateClick: function(info) {
      $('input[name="scheduledFor"]').val(info.dateStr);
      $('#nudge-modal').css('display', 'block');
    },
    eventClick: function(info) {
      editNudge(info.event);
    }
  });
  calendar.render();
