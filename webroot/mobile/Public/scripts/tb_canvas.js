$(document).ready(function () {

    // 页面首次加载，显示组选择界面
    $("#panel_right").panel("open");


    /* 初始化panel和canvas的尺寸 */
    // panel
    obj = $("#panel_left");
    obj.children(".ui-panel-inner").css("height", obj.css("height"));
    $("#chatbox").css("height", parseInt(obj.css("height")) - 250);
    // 给panel添加滑动关闭事件
    $("#panel_right").on("swiperight", function () {
        $(this).panel("close");
    });
    $("#panel_left").on("swipeleft", function () {
        $(this).panel("close");
    });

    // 控制canvas的宽高
    obj = $("#main_content");
    width = parseInt(obj.css("width")) - 100 - 15;
    obj.find("canvas").attr("width", width);
    obj.find("canvas").attr("height", width);
    

    var canvas = document.getElementById('txtAnswer4'),
	context = canvas.getContext('2d'),
	flag = 0;
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(0,0,0,1)';
    var canvasPosX, canvasPosY;
    init_canvas();
    function init_canvas() {
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(0,0,0,1)';
        context.save();
        context.strokeStyle = 'rgba(255,0,0,1)';
        context.beginPath();
        for (i = 0; i <= canvas.width; i += 9) {
            context.moveTo(i, canvas.height / 2);
            context.lineTo(i + 5, canvas.height / 2);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width / 2, i);
            context.lineTo(canvas.width / 2, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(i, i);
            context.lineTo(i + 5, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width - i, i);
            context.lineTo(canvas.width - 5 - i, i + 5);
        }
        context.closePath();
        context.stroke();
        context.restore();
    }
    function getElementAbsPos(e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }

        return { left: l, top: t };
    }

    function mouseOrTouchStart(x, y) {
        context.beginPath();
        context.moveTo(x, y);
        flag = 1;
    }
    function mouseOrTouchMove(x, y) {
        if (flag) {
            context.lineTo(x, y);
            context.stroke();
        }
    }
    canvas.ontouchstart = function (e) {
        e.preventDefault();
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);

    }
    canvas.ontouchmove = function (e) {
        e.preventDefault();
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);


    }
    canvas.ontouchend = function (e) {
        e.preventDefault();
        flag = 0;
    }
    canvas.ontouchcancel = function (e) {
        e.preventDefault();
        flag = 0;
    }

    canvas.onmousedown = function (e) {
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);
    }
    canvas.onmousemove = function (e) {
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);
    }
    canvas.onmouseout = function (e) {
        flag = 0;
    }
    canvas.onmouseup = function (e) {
        flag = 0;

    }


    var canvas = document.getElementById('txtAnswer2'),
	context = canvas.getContext('2d'),
	flag = 0;
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(0,0,0,1)';
    var canvasPosX, canvasPosY;
    init_canvas();
    function init_canvas() {
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(0,0,0,1)';
        context.save();
        context.strokeStyle = 'rgba(255,0,0,1)';
        context.beginPath();
        for (i = 0; i <= canvas.width; i += 9) {
            context.moveTo(i, canvas.height / 2);
            context.lineTo(i + 5, canvas.height / 2);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width / 2, i);
            context.lineTo(canvas.width / 2, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(i, i);
            context.lineTo(i + 5, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width - i, i);
            context.lineTo(canvas.width - 5 - i, i + 5);
        }
        context.closePath();
        context.stroke();
        context.restore();
    }
    function getElementAbsPos(e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }

        return { left: l, top: t };
    }

    function mouseOrTouchStart(x, y) {
        context.beginPath();
        context.moveTo(x, y);
        flag = 1;
    }
    function mouseOrTouchMove(x, y) {
        if (flag) {
            context.lineTo(x, y);
            context.stroke();
        }
    }
    canvas.ontouchstart = function (e) {
        e.preventDefault();
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);

    }
    canvas.ontouchmove = function (e) {
        e.preventDefault();
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);


    }
    canvas.ontouchend = function (e) {
        e.preventDefault();
        flag = 0;
    }
    canvas.ontouchcancel = function (e) {
        e.preventDefault();
        flag = 0;
    }

    canvas.onmousedown = function (e) {
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);
    }
    canvas.onmousemove = function (e) {
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);
    }
    canvas.onmouseout = function (e) {
        flag = 0;
    }
    canvas.onmouseup = function (e) {
        flag = 0;

    }


    var canvas = document.getElementById('txtAnswer3'),
	context = canvas.getContext('2d'),
	flag = 0;
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(0,0,0,1)';
    var canvasPosX, canvasPosY;
    init_canvas();
    function init_canvas() {
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(0,0,0,1)';
        context.save();
        context.strokeStyle = 'rgba(255,0,0,1)';
        context.beginPath();
        for (i = 0; i <= canvas.width; i += 9) {
            context.moveTo(i, canvas.height / 2);
            context.lineTo(i + 5, canvas.height / 2);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width / 2, i);
            context.lineTo(canvas.width / 2, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(i, i);
            context.lineTo(i + 5, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width - i, i);
            context.lineTo(canvas.width - 5 - i, i + 5);
        }
        context.closePath();
        context.stroke();
        context.restore();
    }
    function getElementAbsPos(e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }

        return { left: l, top: t };
    }

    function mouseOrTouchStart(x, y) {
        context.beginPath();
        context.moveTo(x, y);
        flag = 1;
    }
    function mouseOrTouchMove(x, y) {
        if (flag) {
            context.lineTo(x, y);
            context.stroke();
        }
    }
    canvas.ontouchstart = function (e) {
        e.preventDefault();
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);

    }
    canvas.ontouchmove = function (e) {
        e.preventDefault();
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);


    }
    canvas.ontouchend = function (e) {
        e.preventDefault();
        flag = 0;
    }
    canvas.ontouchcancel = function (e) {
        e.preventDefault();
        flag = 0;
    }

    canvas.onmousedown = function (e) {
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);
    }
    canvas.onmousemove = function (e) {
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);
    }
    canvas.onmouseout = function (e) {
        flag = 0;
    }
    canvas.onmouseup = function (e) {
        flag = 0;

    }


    var canvas = document.getElementById('txtAnswer1'),
	context = canvas.getContext('2d'),
	flag = 0;
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(0,0,0,1)';
    var canvasPosX, canvasPosY;
    init_canvas();
    function init_canvas() {
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(0,0,0,1)';
        context.save();
        context.strokeStyle = 'rgba(255,0,0,1)';
        context.beginPath();
        for (i = 0; i <= canvas.width; i += 9) {
            context.moveTo(i, canvas.height / 2);
            context.lineTo(i + 5, canvas.height / 2);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width / 2, i);
            context.lineTo(canvas.width / 2, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(i, i);
            context.lineTo(i + 5, i + 5);
        }
        for (i = 0; i <= canvas.height; i += 9) {
            context.moveTo(canvas.width - i, i);
            context.lineTo(canvas.width - 5 - i, i + 5);
        }
        context.closePath();
        context.stroke();
        context.restore();
    }
    function getElementAbsPos(e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }

        return { left: l, top: t };
    }

    function mouseOrTouchStart(x, y) {
        context.beginPath();
        context.moveTo(x, y);
        flag = 1;
    }
    function mouseOrTouchMove(x, y) {
        if (flag) {
            context.lineTo(x, y);
            context.stroke();
        }
    }
    canvas.ontouchstart = function (e) {
        e.preventDefault();
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);

    }
    canvas.ontouchmove = function (e) {
        e.preventDefault();
        var endX = e.touches[0].pageX - canvasPosX;
        var endY = e.touches[0].pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);


    }
    canvas.ontouchend = function (e) {
        e.preventDefault();
        flag = 0;
    }
    canvas.ontouchcancel = function (e) {
        e.preventDefault();
        flag = 0;
    }

    canvas.onmousedown = function (e) {
        canvasPosX = getElementAbsPos(canvas).left;
        canvasPosY = getElementAbsPos(canvas).top;
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchStart(endX, endY);
    }
    canvas.onmousemove = function (e) {
        var endX = e.pageX - canvasPosX;
        var endY = e.pageY - canvasPosY;
        mouseOrTouchMove(endX, endY);
    }
    canvas.onmouseout = function (e) {
        flag = 0;
    }
    canvas.onmouseup = function (e) {
        flag = 0;

    }
});