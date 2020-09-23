const app = document.getElementById('question');
const $answer = $('#answer');
const $cta_btn = $('.say-it');


var typewriter = new Typewriter(app, {
    loop: false,
    delay: 75,
    cursor: ''
});


typewriter
    .pauseFor(1000)
    .typeString('Write something kind to yourself')
    .start();



const checkVal = () => {
    setInterval(function () {
        if ($answer.val() !== '') {
            $cta_btn.css('opacity', '1');
        } else {
            $cta_btn.css('opacity', '0');
        }

        $cta_btn.on('mousedown', () => {
            clearInterval();
        });
    }, 300);
}


setTimeout(() => {
    $answer.css('opacity', '1');
    checkVal();
}, 4000)



