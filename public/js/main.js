const app = document.getElementById('question');
const answer = $('#answer');
const btn = $('.btn');

var typewriter = new Typewriter(app, {
    loop: false,
    delay: 75,
    cursor: ''
});

typewriter
    .pauseFor(2500)
    .typeString('Write something kind to yourself')
    .start();

const checkVal = () => {
    setInterval(function () {
        if (answer.val() !== '') {
            btn.css('visibility', 'visible');
            clearInterval();
        }
    }, 300);
}

checkVal();


