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