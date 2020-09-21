const CronJob = require('cron').CronJob;
let count = 0;

const job = new CronJob('* * * * * *', () => {
    console.log('doing something');
    count++;
});

job.start();

setTimeout(() => {
    job.stop()
}, 5000);



// NOTE cron string = second*, minute, hour, day of month, month, day of week 
// NOTE date string = year, monthIndex, day, hour, minute

const playDate = new Date('September 30, 2020, 3:24:00');


const getCronValues = (createdAt) => {
    const minute = createdAt.getMinutes();
    const hour = createdAt.getHours();
    const dayOfMonth = createdAt.getDate();
    const month = createdAt.getMonth() + 1;
    const dayOfWeek = createdAt.getDay();

    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
}

const sendMessage = (message) => {
    // twilio message send
}

const sendNudge = (nudge) => {
    // twilio message send
}

const getRandomTimeOfDay = () => {
    const minute = randomNumInRange(0, 59);
    const hour = randomNumInRange(9, 18);
    return `${minute} ${hour} * * *`;
}



const getRandomTimeOfWeek = (cronValues) => {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const valNums = cronValues.split(' ').map(val => parseInt(val));
    const createDate = valNums[2];
    const createDay = valNums[4];
    const daysInMonth = days[valNums[3] - 1];

    // if the user has receiveDailyMessages set to true, daysFromSend = 1 else :
    const daysFromSend = Math.floor(Math.random() * 7);


    if ((createDate + daysFromSend) > daysInMonth) {
        valNums[2] = (createDate + daysFromSend) - daysInMonth;
        valNums[3] += 1;
    } else {
        valNums[2] = createDate + daysFromSend;
    }

    if ((createDay + daysFromSend) > 6) {
        valNums[4] = (createDay + daysFromSend) - 6;
    } else {
        valNums[4] = createDay + daysFromSend;
    }

    valNums[0] = randomNumInRange(0, 59);
    valNums[1] = randomNumInRange(9, 17);

    return valNums.join(' ');
}



const randomNumInRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const schedule = (cronValues, transmission, daily = false) => {
    // check if length of arguments is 2
    // if yes, declare job, pass in cron values and sendMessage(message)
    // job.start()
    // if no, declare job, pass in cron values and sendNudge(nudge)
    // job.start()
}


console.log(getRandomTimeOfDay());
console.log(getCronValues(playDate));
getRandomTimeOfWeek(getCronValues(playDate));