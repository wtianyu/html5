    var canvas1;
    var canvas2;
    var canvas3;
    var btnAdd;
    var context1;
    var xStart;
    var yStart;
    var xEnd;
    var yEnd;
    var isPressDown = false;
    var lineWidth = 2;
    var lineColor = "red";
    var pointColor = "blue";
    var pointR = 3;
    var points = {};
    var pointsCount = 0;
    var distance = 10; //自动识别点范围
    var isFinish = true;
    //points[i].lineCount：每个点只能拥有两条边
    //moveFlag:线段起点

    function init() {
        canvas1 = document.getElementById("canvas1Bottom");
        canvas2 = document.getElementById("canvas2");
        canvas3 = document.getElementById("canvas1Top");
        btnAdd = document.getElementById("show_btn");
        btnAdd.style.top = 450;
        btnDraw = document.getElementById("draw_btn");
        btnDraw.style.top = 450;
        canvas1.width = screen.width / 3 - 20;
        canvas1.height = 450;
        canvas2.width = screen.width * 2 / 3 - 20;
        canvas2.height = 450;
        canvas2.style.left = (canvas1.width + 15) + "px";
        canvas3.width = screen.width / 3 - 20;
        canvas3.height = 450;
        context1 = canvas1.getContext('2d');
        context3 = canvas3.getContext('2d');
        context2 = canvas2.getContext('2d');
    }

    function initData() {
        points = {};
        pointsCount = 0;
        isPressDown = false;
        isFinish = false;
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
    }

    function mouseKey(key, event) {
        if (isFinish) {
            return false;
        }
        switch (key) {
            case 1:
                isPressDown = true;
                var flagDistance = isInDistance(event.clientX, event.clientY, 1);
                if (flagDistance == -1 && pointsCount == 0) {
                    xStart = event.clientX;
                    yStart = event.clientY;
                } else if (flagDistance != -1) {
                    if (points[flagDistance].lineCount == 2) { //该点已经拥有两条边，不能再继续添加
                        isPressDown = false;
                    } else {
                        points[flagDistance].lineCount = 2;
                    }
                    xStart = points[flagDistance].x;
                    yStart = points[flagDistance].y;
                } else {
                    isPressDown = false;
                }
                break;
            case 2:
                if (isPressDown) {
                    xEnd = event.clientX;
                    yEnd = event.clientY;
                    //自动找寻终点
                    var flagDistanceEnd = isInDistance(event.clientX, event.clientY, 2);
                    if (flagDistanceEnd != -1) {
                        xEnd = points[flagDistanceEnd].x;
                        yEnd = points[flagDistanceEnd].y;
                        isFinish = true;
                        // points[0].moveFlag = isInDistance(xStart, yStart);
                        console.log(points);
                    }
                    context3.clearRect(0, 0, canvas1.width, canvas1.height);
                    context1.beginPath();
                    context1.strokeStyle = lineColor;
                    context1.lineWidth = lineWidth;
                    context1.moveTo(xStart, yStart);
                    context1.lineTo(xEnd, yEnd);
                    context1.closePath();
                    context1.stroke();
                    if (pointsCount == 0)
                        addPoint(xStart, yStart); //第一个点作为起始点
                    if (flagDistanceEnd == -1) {
                        addPoint(xEnd, yEnd);
                    }
                    drawPoint(context1, 1);
                    drawPoint(context1, 2);
                    isPressDown = false;
                }
                break;
            case 3:
                if (isPressDown) {
                    context3.clearRect(0, 0, canvas1.width, canvas1.height);
                    context3.beginPath();
                    context3.strokeStyle = lineColor;
                    context3.lineWidth = lineWidth;
                    context3.moveTo(xStart, yStart);
                    context3.lineTo(event.clientX, event.clientY);
                    context3.closePath();
                    context3.stroke();
                    drawPoint(context3, 1);
                }
                break;
        }

        function addPoint(x, y, moveX, moveY) { //绘画点坐标，起始点坐标
            point = {};
            point.x = x;
            point.y = y;
            point.lineCount = 1;
            points[pointsCount] = point;
            pointsCount++;
        }

        function isExitPoint(x, y) { //获取该点的下标
            for (var i = 0; i < pointsCount; i++) {
                if (x == points[i].x && y == points[i].y) {
                    return i;
                }
            }
        }

        function isInDistance(x, y, flag) { //一定范围内自动进行点识别
            var count;
            if (flag == 1 && pointsCount == 0) return -1;
            if (flag == 1) count = pointsCount - 1;
            if (flag == 2) count = 0;
            for (var i = count; i < pointsCount; i++) {
                if (getDistance(x, y, points[i].x, points[i].y) <= distance) {
                    return i;
                }
            }
            return -1;
        }

        function getDistance(x1, y1, x2, y2) { //获取两点之间的距离
            return parseInt(Math.sqrt(Math.abs(x1 - x2) * Math.abs(x1 - x2) + Math.abs(y1 - y2) * Math.abs(y1 - y2)));
        }

        function drawPoint(context, flag) {
            var x;
            var y;
            if (flag == 1) {
                x = xStart; //起点
                y = yStart;
            } else if (flag == 2) {
                x = xEnd; //终点
                y = yEnd;
            }
            context.beginPath();
            context.fillStyle = pointColor;
            context.arc(x, y, pointR, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }

        function DisplayCoord(event) {
            var top, left, oDiv;
            oDiv = document.getElementById("canvasDiv");
            top = getY(oDiv);
            left = getX(oDiv);
            mouse_x = (event.clientX - left + document.body.scrollLeft);
            mouse_y = (event.clientY - top + document.body.scrollTop);
            console.log(mouse_x + ":" + mouse_y);
        }

        function getX(obj) {
            var parObj = obj;
            var left = obj.offsetLeft;
            while (parObj = parObj.offsetParent) {
                left += parObj.offsetLeft;
            }
            return left;
        }

        function getY(obj) {
            var parObj = obj;
            var top = obj.offsetTop;
            while (parObj = parObj.offsetParent) {
                top += parObj.offsetTop;
            }
            return top;
        }
    }