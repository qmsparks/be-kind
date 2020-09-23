const app = document.getElementById('question');
const $answer = $('#answer');
const $btn = $('.btn');


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
            $btn.css('opacity', '1');
        } else {
            $btn.css('opacity', '0');
        }

        btn.on('mousedown', () => {
            clearInterval();
        });
    }, 300);
}


setTimeout(() => {
    $answer.css('opacity', '1');
    checkVal();
}, 4000)



