// 在canvas中绘制方格线

// 初始化所有的手写输入框
init_canvas();

// 启动手写输入框切换功能
$("#myTab_judge a").click(function (e) {
    e.preventDefault();
    $(this).tab("show");
});
$("#myTab_user a").click(function (e) {
    e.preventDefault();
    $(this).tab("show");
});


// 初始化所有的canvas，包括用户和裁判
function init_canvas() {
    var list = $(".tab-pane");
    for (var index = 0; index < list.length; index++)
        init_canvasobj(list[index]);
}
// 根据canvas进行初始化
function init_canvasobj(canvas) {
    // 初始化canvas
    var cxt = canvas.getContext('2d');
    cxt.strokeStyle = 'rgba(255,0,0,1)';
    cxt.lineWidth = 2;

    // 先清空历史内容
    cxt.clearRect(0, 0, canvas.width, canvas.height);

    cxt.beginPath();
    // 横线
    for (var i = 0; i <= canvas.width; i += 9) {
        cxt.moveTo(i, canvas.height / 2);
        cxt.lineTo(i + 5, canvas.height / 2);
    }
    // 竖线
    for (var i = 0; i <= canvas.height; i += 9) {
        cxt.moveTo(canvas.width / 2, i);
        cxt.lineTo(canvas.width / 2, i + 5);
    }
    // 左斜线
    for (var i = 0; i <= canvas.height; i += 9) {
        cxt.moveTo(i, i);
        cxt.lineTo(i + 5, i + 5);
    }
    // 右斜线
    for (var i = 0; i <= canvas.height; i += 9) {
        cxt.moveTo(i, canvas.height - i);
        cxt.lineTo(i + 5, canvas.height - i - 5);
    }
    cxt.closePath();
    cxt.stroke();
}
// 重置输入框
// param=1表示清空所有的输入框
// param=0为清空当前输入框
function rewrite(param) {
    if (param) {
        // 重置裁判的
        init_canvasobj($(".active")[1]);

        // 重置用户的
        init_canvasobj($(".active")[3]);
    } else {
        var list = $(".tab-pane");
        for (var index = 0; index < list.length; index++) {
            init_canvasobj(list[index]);
        }
    }
}

// 给所有的Canvas添加绘图事件
//
// 标志位：检测鼠标是否按下
var canvas_flag = 0;
var canvs = $(".tab-pane");
for (var i = 0; i < canvs.length; i++) {
    //鼠标按下时设置开始点
    $(canvs[i]).mousedown(function (evt) {
        var startX = evt.pageX - getElementAbsPos(this).left;
        var startY = evt.pageY - getElementAbsPos(this).top;

        var cctx=this.getContext('2d');
        cctx.beginPath();
        cctx.moveTo(startX, startY);
        canvas_flag = 1;
    });
    //鼠标移动时开始绘图
    $(canvs[i]).mousemove(function (evt) {
        var endX = evt.pageX - getElementAbsPos(this).left;
        var endY = evt.pageY - getElementAbsPos(this).top;

        //判断一下鼠标是否按下
        if (canvas_flag) {
            var cctx = this.getContext('2d');
            cctx.strokeStyle = 'rgb(0,0,0)';//线条颜色
            cctx.lineWidth = 4;             //线宽
            cctx.lineTo(endX, endY);        //移动的时候设置路径并且画出来
            cctx.stroke();
        }
    });
    //鼠标抬起时结束绘图
    $(canvs[i]).mouseup(function () {
        canvas_flag = 0;
    });
    //鼠标移出canvas时取消画图操作
    $(canvs[i]).mouseout(function () {
        canvas_flag = 0;
    });
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