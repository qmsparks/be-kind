$('.fa-user-edit').on('click', () => {
  $('#update-modal').css('display', 'flex');
});

$('.fa-window-close.new').on('click', () =>{
  $('#new-nudge').css('display', 'none');
})
$('.fa-window-close.edit').on('click', () => {
  $('#edit-nudge').css('display', 'none');
})

$('.fa-trash-alt').on('click', () => {
  $('form[name="delete-nudge"]').submit();
})

$('.fa-pen-fancy').on('click', () => {
  $('form[name="edit-nudge"]').submit();
})

$('.fa-upload').on('click', () => {
  $('form[name="add-nudge"]').submit();
})


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