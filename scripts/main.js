var intro = document.getElementById("gxbf");
var gxbf_win = document.getElementById("gxbf_win");
intro.onclick = function() {
  gxbf_win.style.display = "block";
  gxbf_win.style.animation = "out 1s";
}
var close_intro = document.getElementById("close_gxbf");
close_intro.onclick = function() {
  gxbf_win.style.display = "none";
  gxbf_win.style.animation = "in 1s";
}
gxbf_win.onmousedown = function(event) {
  var disX = event.clientX - this.offsetLeft;
  var disY = event.clientY - this.offsetTop;
  document.onmousemove = function(event) {
    var l = event.clientX - disX;
    var t = event.clientY - disY;
    gxbf_win.style.left = l + "px";
    gxbf_win.style.top = t + "px";
  }
  document.onmouseup = function() {
    document.onmousemove = null;
  }
}

var intro = document.getElementById("shengrui11");
var shengrui11_win = document.getElementById("shengrui11_win");
intro.onclick = function() {
  shengrui11_win.style.display = "block";
  shengrui11_win.style.animation = "out 1s";
}
var close_intro = document.getElementById("close_shengrui11");
close_intro.onclick = function() {
  shengrui11_win.style.display = "none";
  shengrui11_win.style.animation = "in 1s";
}
shengrui11_win.onmousedown = function(event) {
  var disX = event.clientX - this.offsetLeft;
  var disY = event.clientY - this.offsetTop;
  document.onmousemove = function(event) {
    var l = event.clientX - disX;
    var t = event.clientY - disY;
    shengrui11_win.style.left = l + "px";
    shengrui11_win.style.top = t + "px";
  }
  document.onmouseup = function() {
    document.onmousemove = null;
  }
}

var intro = document.getElementById("qigege");
var qigege_win = document.getElementById("qigege_win");
intro.onclick = function() {
  qigege_win.style.display = "block";
  qigege_win.style.animation = "out 1s";
}
var close_intro = document.getElementById("close_qigege");
close_intro.onclick = function() {
  qigege_win.style.display = "none";
  qigege_win.style.animation = "in 1s";
}
qigege_win.onmousedown = function(event) {
  var disX = event.clientX - this.offsetLeft;
  var disY = event.clientY - this.offsetTop;
  document.onmousemove = function(event) {
    var l = event.clientX - disX;
    var t = event.clientY - disY;
    qigege_win.style.left = l + "px";
    qigege_win.style.top = t + "px";
  }
  document.onmouseup = function() {
    document.onmousemove = null;
  }
}
