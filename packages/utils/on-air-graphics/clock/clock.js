var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;

roundRect = (ctx, x,y,width,height,radius, roundBothEnds = true) => {
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI+Math.PI/2);
  ctx.lineTo(x + width - radius, y);
  ctx.arc(x + width - radius, y + radius, radius, Math.PI + Math.PI/2, 0);
  ctx.lineTo(x + width, y + height - radius);
  if (!roundBothEnds) { radius = 0 }
  ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI/2)
  ctx.lineTo(x + radius, y + height)
  ctx.arc(x + radius, y + height - radius, radius, Math.PI/2, Math.PI)
  ctx.lineTo(x , y + radius)
  ctx.fill()
}

drawMarkers = () => {
    ctx.save();
        for (let step = 0; step < 12; step++) {
            const width = 8;
            const height = 40;
            const distance = 200;
            ctx.rotate(Math.PI/6);
            roundRect(ctx, -width/2, distance, width, height, 2);
        }
    ctx.restore();
}

drawCentralSpot = () => {
  ctx.save();
  const dimen = 12;
  const innerDimen = dimen - 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, dimen, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, innerDimen, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#F00';
  ctx.fill();
  ctx.restore();
}

drawSecondHand = (seconds) => {
    ctx.save();
    const width = 4;
    const height = 150;
    ctx.fillStyle = '#F00';
    ctx.rotate((seconds * Math.PI)/30 + Math.PI);
    roundRect(ctx, -width/2.0, 0, width, height, width / 2)
    ctx.restore();
}

drawMinutesHand = (minutes) => {
    ctx.save();
    const width = 10
    const height = 195;
    if (!(minutes % 60)) {
    }
    ctx.rotate((minutes * Math.PI)/30 + Math.PI);
    roundRect(ctx, -width/2.0, 0, width, height, width / 2, false);
    ctx.restore();
}
drawHoursHand = (hours) => {
    ctx.save();
    const width = 10;
    const height = 125;
    if (!(hours % 60)) {
    }
    ctx.rotate((hours * (2 * Math.PI/12))- Math.PI);
    roundRect(ctx, -width/2.0, 0, width, height, width / 2, false)
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
    drawMarkers();
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

    drawMinutesHand(minutes);
    drawHoursHand(hours + (minutes / 60.0));
    drawCentralSpot();
    drawSecondHand(seconds);
}
drawClock();
setInterval(drawClock, 1000);
