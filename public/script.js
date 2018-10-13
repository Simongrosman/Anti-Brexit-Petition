var context = document.getElementById("canvas").getContext("2d");
var clearCanvas = document.getElementById("clearCanvas");
var form = document.getElementById("form");

$("#canvas").mousedown(function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});

$("#canvas").mousemove(function(e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

$("#canvas").mouseup(function(e) {
    paint = false;
    var dataURL = canvas.toDataURL();
    $("#signature").val(dataURL);
});
$("#canvas").mouseleave(function(e) {
    paint = false;
});
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

drawSign.addEventListener("touchstart", function(e) {
    e.preventDefault();
    var mouseX = e.touches[0].pageX - canvasOffset.left;
    var mouseY = e.touches[0].pageY - canvasOffset.top;

    paint = true;
    addClick(mouseX, mouseY);
    redraw();
});
drawSign.addEventListener("touchmove", function(e) {
    e.preventDefault();
    addClick(
        e.touches[0].pageX - this.canvasOffset.left,
        e.touches[0].pageY - this.canvasOffset.top,
        true
    );
    redraw();
});
drawSign.addEventListener("touchend", function(e) {
    e.preventDefault();
    paint = false;
});

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}
function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "white";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
    var dataURL = canvas.toDataURL();
    $("#signature").val(dataURL);
}

$("#clearCanvas").on("click", function(e) {
    location.reload(true);
});

$("#submit").on("click", function(e) {
    var signature = $("#signature").val();
    if (signature) {
        form.submit();
    } else {
        $(".error").empty();
        $(".error").append("<h4> Sorry, you have to sign to continue</h4>");
    }
});
