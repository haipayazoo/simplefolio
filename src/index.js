import initTilt from './js/tilt';
import initSr from './js/sr';
import './style/main.scss';

$('a[href^="#"]').on('click', function(event) {
  var target = $(this.getAttribute('href'));
  if (target.length) {
    event.preventDefault();
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: target.offset().top
        },
        1000
      );
  }
});

initSr();
initTilt();

const NUM_CONFETTI = 350;
const COLORS = [[85,71,106], [174,61,99], [219,56,83], [244,92,68], [248,182,70]];
const PI_2 = 2*Math.PI;


const canvas = document.getElementById("world");
const context = canvas.getContext("2d");
window.w = 0;
window.h = 0;

const resizeWindow = function() {
  window.w = (canvas.width = window.innerWidth);
  return window.h = (canvas.height = window.innerHeight);
};

window.addEventListener('resize', resizeWindow, false);
  
window.onload = () => setTimeout(resizeWindow, 0);

const range = (a, b) => ((b-a)*Math.random()) + a;

const drawCircle = function(x,y,r,style) {
  context.beginPath();
  context.arc(x,y,r,0,PI_2,false);
  context.fillStyle = style;
  return context.fill();
};

let xpos = 0.5;

document.onmousemove = e => xpos = e.pageX/w;

window.requestAnimationFrame = ((() => window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
(callback => window.setTimeout(callback, 1000 / 60))))();


class Confetti {

  constructor() {
    this.style = COLORS[~~range(0,5)];
    this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
    this.r = ~~range(2,6);
    this.r2 = 2*this.r;
    this.replace();
  }

  replace() {
    this.opacity = 0;
    this.dop = 0.03*range(1,4);
    this.x = range(-this.r2,w-this.r2);
    this.y = range(-20,h-this.r2);
    this.xmax = w-this.r;
    this.ymax = h-this.r;
    this.vx = (range(0,2)+(8*xpos))-5;
    return this.vy = (0.7*this.r)+range(-1,1);
  }

  draw() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;
    if (this.opacity > 1) {
      this.opacity = 1;
      this.dop *= -1;
    }
    if ((this.opacity < 0) || (this.y > this.ymax)) { this.replace(); }
    if (!(0 < this.x && this.x < this.xmax)) {
      this.x = (this.x + this.xmax) % this.xmax;
    }
    return drawCircle(~~this.x,~~this.y,this.r,`${this.rgb},${this.opacity})`);
  }
}


const confetti = (__range__(1, NUM_CONFETTI, true).map((i) => new Confetti));

window.step = function() {
  requestAnimationFrame(step);
  context.clearRect(0,0,w,h);
  return Array.from(confetti).map((c) => c.draw());
};

step();
function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}