var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
drawQuarters = () => {
    ctx.save();
        for (let step = 0; step < 4; step++) {
            const width = 6;
            const height = 30;
            const distance = 200;
            ctx.rotate(Math.PI/2);
            ctx.fillRect(-width/2, distance, width, height);
        }
    ctx.restore();
}
drawFiveMinutes = () => {
    ctx.save();
        for (let step = 0; step < 16; step++) {
            const width = 6;
            const height = 10;
            const distance = 220;
            ctx.rotate(Math.PI/8);
            ctx.fillRect(-width/2, distance, width, height);
        }
    ctx.restore();
}
drawSecondHand = (seconds) => {
    ctx.save();
    const width = 3;
    const height = 240;
    ctx.fillStyle = '#888';
    ctx.rotate((seconds * Math.PI)/30 + Math.PI);
    ctx.fillRect(-width/2.0, 0, width, height);
    ctx.restore();
}
drawMinutesHand = (minutes) => {
    ctx.save();
    const width = 8
    const height = 150;
    if (!(minutes % 60)) {
    }
    ctx.rotate((minutes * Math.PI)/30 + Math.PI);
    ctx.fillRect(-width/2.0, 0, width, height);
    ctx.restore();
}
drawHoursHand = (hours) => {
    ctx.save();
    const width = 10;
    const height = 125;
    if (!(hours % 60)) {
    }
    ctx.rotate((hours * Math.PI)/30 + Math.PI);
    ctx.fillRect(-width/2, 0, width, height);
    ctx.restore();
}
var d = new Date()
var hours   = d.getHours();
var minutes = d.getMinutes();
var seconds = d.getSeconds();
ctx.save()
drawClock = () => {
    ctx.restore()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save()
    ctx.translate(radius, radius);

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    drawFiveMinutes();
    drawQuarters();
    seconds++;
    if (seconds == 60) {
        minutes++;
        seconds = 0;
    }
    if (minutes == 60) {
        hours++;
        minutes = 0;
    }
    if (hours == 12) {
        hours = 0;
    }
    drawSecondHand(seconds);
    drawMinutesHand(minutes);
    drawHoursHand(hours);
}
drawClock();
setInterval(drawClock, 1000);
