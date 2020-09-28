console.log('hiiii');

let $close = $('.close');
let $createModal = $('.create-modal');

$close.on('click', function () {
    $createModal.css('visibility', 'hidden');
});