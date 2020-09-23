$('.fa-user-edit').on('click', () => {
  $('#update-modal').css('display', 'block');
})

const editNudge = function (nudge) {
  $('#edit-nudge').css('display', 'block');
  console.log(nudge.title);
  $('form[name="edit-nudge"]').attr('action', `/nudges/${nudge.id}?_method=PUT`);
  $('form[name="edit-nudge"] input[name="taskName"]').val(nudge.title);

  if (nudge.description) {
    $('form[name="edit-nudge"] input[name="taskDescription"]').val(nudge.description);
  }
  $('form[name="edit-nudge"] input[name="scheduledFor"]').val(nudge.start);

  $('form[name="delete-nudge"').attr('action', `/nudges/${nudge.id}?_method=DELETE`);
}