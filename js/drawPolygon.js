  function initMain(id) {
      document.getElementById("show_btn_main").blur();
      document.getElementById("show_btn_main").style.display = "none";
      if (timer != null) {
          clearInterval(timer);
      }
      //初始化四叉树分层
      if (treeCount > 0) {
          var unit = Math.sqrt(Math.pow(4, treeCount));
          for (var i = 0; i < Math.pow(4, treeCount); i++) {
              var widthUnit = width / unit;
              var heightUnit = height / unit;
              var treeArea = {};
              treeArea.id = i;
              if (i % unit == 0) {
                  var unitRow = i / unit;
                  treeArea.x1 = 0;
                  treeArea.y1 = unitRow * heightUnit;
                  treeArea.x2 = widthUnit;
                  treeArea.y2 = unitRow * heightUnit;
                  treeArea.x3 = widthUnit;
                  treeArea.y3 = unitRow * heightUnit + heightUnit;
                  treeArea.x4 = 0;
                  treeArea.y4 = unitRow * heightUnit + heightUnit;
              } else {
                  treeArea.x1 = treeAreas[i - 1].x1 + widthUnit;
                  treeArea.y1 = treeAreas[i - 1].y1;
                  treeArea.x2 = treeAreas[i - 1].x2 + widthUnit;
                  treeArea.y2 = treeAreas[i - 1].y2;
                  treeArea.x3 = treeAreas[i - 1].x3 + widthUnit;
                  treeArea.y3 = treeAreas[i - 1].y3;
                  treeArea.x4 = treeAreas[i - 1].x4 + widthUnit;
                  treeArea.y4 = treeAreas[i - 1].y4;
              }
              treeArea.polygonList = "";
              treeAreas[treeAreas.length] = treeArea;
          }
      }
      console.log(treeAreas);
      drawInit(id);
  }

  function drawInit(id) {
      var canvas = document.getElementById(id);
      canvas.style.background = backColor;
      if (canvas == null) {
          console.log('获取的画布为null');
          return false;
      }
      init();
      while (!initPolygonData()) {};
      drawPolygonAnim(canvas);
  }

  //初始化多边形的数据
  function initPolygonData() {
      for (var i = 0; i < polygonCount; i++) {
          var polygonClass = {};
          polygonClass.id = i;
          var pointx = parseInt(Math.random() * width);
          pointx = pointx > width - 50 ? pointx - 50 : pointx < 10 ? pointx + 30 : pointx;
          var pointy = parseInt(Math.random() * height);
          pointy = pointy > height - 70 ? pointy - 70 : pointy < 10 ? pointy + 30 : pointy;
          var x1 = 0 + pointx;
          var x2 = 20 + pointx;
          var x3 = 10 + pointx;
          var y1 = 30 + pointy;
          var y2 = 30 + pointy;
          var y3 = 10 + pointy;
          polygonClass.x = x1 + ";" + x2 + ";" + x3;
          polygonClass.y = y1 + ";" + y2 + ";" + y3;
          var vv = parseInt(Math.random() * 8);
          var dr = 1;
          if (vv < 4) {
              dr = -1;
          }
          polygonClass.vx = dr * (1 + parseInt(Math.random() * 5));
          polygonClass.vy = dr * (1 + parseInt(Math.random() * 5));
          polygonClass.isColl = false;
          polygon[i] = polygonClass;
      }
      return true;
  }

  //画矩形
  function drawPolygonAnim(canvas) {
      document.getElementById("canvasDiv1").style.display = "";
      document.getElementById("canvasDiv2").style.display = "";
      var context = canvas.getContext('2d');
      context.strokeStyle = canStokeColor;
      context.lineWidth = 1;
      context.strokeRect(0, 0, width, height);
      timer = setInterval(function() {
          //清空碰撞列表
          collisionList = [];
          //擦除
          context.clearRect(0, 0, width, height);
          //显示帧数
          showFps(context);
          for (var i = 0; i < polygonCount; i++) {
              context.beginPath();
              context.strokeStyle = stokeColor;
              //撞墙判断
              collisionWall(polygon[i]);
              //碰撞判断
              var isColl = false;
              if (isTreeOpen) {
                  //检查碰撞列表
                  for (var k = 0; k < collisionList.length; k++) {
                      if (i == collisionList[k]) {
                          isColl = true;
                          break;
                      }
                  }
                  //碰撞判断
                  if (k == collisionList.length) {
                      if (isCollisionPolygon(polygon[i], i)) {
                          context.fillStyle = collColor;
                          isColl = true;
                      }
                  }
              } else {
                  if (isCollisionPolygon(polygon[i], i)) {
                      context.fillStyle = collColor;
                      isColl = true;
                  }
              }
              //坐标处理
              var xx = polygon[i].x.split(";");
              var xs = "";
              for (var j = 0; j < xx.length; j++) {
                  xs += parseInt(xx[j]) + polygon[i].vx;
                  if (j != xx.length - 1)
                      xs += ";";
                  xx[j] = parseInt(xx[j]) + polygon[i].vx;
              }
              var yy = polygon[i].y.split(";");
              var ys = "";
              for (var j = 0; j < yy.length; j++) {
                  ys += parseInt(yy[j]) + polygon[i].vy;
                  if (j != yy.length - 1)
                      ys += ";";
                  yy[j] = parseInt(yy[j]) + polygon[i].vy;
              }
              polygon[i].x = xs;
              polygon[i].y = ys;

              for (var k = 0; k < yy.length; k++) {
                  if (k == 0) {
                      context.moveTo(xx[k], yy[k]);
                  } else {
                      context.lineTo(xx[k], yy[k]);
                  }
              }
              context.closePath();
              if (isColl)
                  context.fill();
              context.stroke();
          }
      }, 30);
  }

  //碰撞墙壁判断
  function collisionWall(polygonTemp) {
      if (getMin(polygonTemp.x) <= lineWidth + 2 * err_round || getMax(polygonTemp.x) > width - 2 * err_round) {
          if (getMin(polygonTemp.x) <= lineWidth + 2 * err_round) {
              polygonTemp.vx = Math.abs(polygonTemp.vx);
          } else {
              polygonTemp.vx = -Math.abs(polygonTemp.vx);
          }
      }
      if (getMin(polygonTemp.y) <= lineWidth + 2 * err_round || getMax(polygonTemp.y) >= height - 2 * err_round) {
          if (getMin(polygonTemp.y) <= lineWidth + 2 * err_round) {
              polygonTemp.vy = Math.abs(polygonTemp.vy);
          } else {
              polygonTemp.vy = -Math.abs(polygonTemp.vy);
          }
      }
  }

  //显示帧数
  function showFps(context) {
      if (fpsCount / fpsTotal == 1) {
          fps = parseInt(1000 / (new Date().getTime() - time));
          context.beginPath();
          context.strokeStyle = fpsTextColor;
          context.font = "20px 宋体";
          context.strokeText(fps, 20, 20);
          context.strokeText(polygonCount, width - 60, 20);
          context.closePath();
          fpsCount = 1;
      } else {
          fpsCount++;
          context.beginPath();
          context.strokeStyle = fpsTextColor;
          context.font = "20px 宋体";
          context.strokeText(fps, 20, 20);
          context.strokeText(polygonCount, width - 60, 20);
          context.closePath();
      }
      time = new Date().getTime();
  }

  function mult(pointa, pointb, pointc) {
      return (pointa.x - pointc.x) * (pointb.y - pointc.y) - (pointb.x - pointc.x) * (pointa.y - pointc.y);
  }

  function intersect(polygon1, polygon2, polygonFlag1, polygonFlag2, isStartCollList) {
      var isCallsion = false;
      var xs1 = polygon1.x.split(";");
      var ys1 = polygon1.y.split(";");
      var xs2 = polygon2.x.split(";");
      var ys2 = polygon2.y.split(";");
      for (var i = 0; i < xs1.length; i++) {
          //线段斜率
          var x11 = xs1[i];
          var y11 = ys1[i];
          var x12 = xs1[i == xs1.length - 1 ? 0 : i + 1];
          var y12 = ys1[i == xs1.length - 1 ? 0 : i + 1];
          var k1 = (y12 - y11) / (x12 - x11);
          var distance1 = [];
          if (x12 == x11) { //斜率不存在
              distance1[0] = y11;
              distance1[1] = y12;
          } else {
              distance1 = getMaxS(x11, y11, k1, xs1, ys1);
          }
          var s11 = distance1[0];
          var s12 = distance1[1];
          //[s11,s12]为y轴投影碰撞判断区域
          isCallsion = false;
          for (var k = 0; k < xs2.length; k++) {
              var x21 = xs2[k];
              var y21 = ys2[k];
              var distance2 = [];
              if (x12 == x11) { //斜率不存在
                  distance2[0] = y11;
                  distance2[1] = y12;
              } else {
                  distance2 = getMaxS(x21, y21, k1, xs2, ys2);
              }
              var s21 = distance2[0];
              var s22 = distance2[1];
              if (max(s11, s12) < min(s21, s22) || min(s11, s12) > max(s21, s22)) {
                  //未碰撞
              } else {
                  isCallsion = true;
                  break;
              }
          }
          if (isCallsion == false) { //未碰撞
              return false;
          }
      }
      if (isStartCollList) { //是否开启碰撞列表
          if (true) {
              collisionList[collisionList.length] = polygonFlag1;
              for (var k = 0; k < collisionList.length; k++) { //添加到碰撞列表中
                  if (polygonFlag1 == collisionList[k]) {
                      break;
                  }
              }
              if (k == collisionList.length - 1) {
                  collisionList[collisionList.length] = polygonFlag2;
              }
          }
      }
      return true;
  }

  //获取y轴投影最大值
  function getMaxS(x, y, k, xs, ys) {
      var s1 = y - k * x;
      var s2 = 0;
      var max = 0;
      for (var j = 0; j < ys.length; j++) {
          s2 = ys[j] - k * xs[j];
          max = Math.abs(max) >= Math.abs(s1 - s2) ? max : s2;
      }
      var distance = [s1, max];
      return distance;
  }

  //判断中断方式4[最优化判断]
  function intersect4(polygon2, polygon1, polygonFlag1, polygonFlag2, isStartCollList) {
      var returnflag;
      var x1min = getMin(polygon1.x);
      var x1max = getMax(polygon1.x);
      var y1min = getMin(polygon1.y);
      var y1max = getMax(polygon1.y);
      var x2min = getMin(polygon2.x);
      var x2max = getMax(polygon2.x);
      var y2min = getMin(polygon2.y);
      var y2max = getMax(polygon2.y);
      if (!isInRange(x1min, x1max, x2min) && !isInRange(x1min, x1max, x2max)) {
          returnflag = false;
      } else if (!isInRange(y1min, y1max, y2min) && !isInRange(y1min, y1max, y2max)) {
          returnflag = false;
      } else {
          returnflag = true;
      }
      if (isStartCollList) { //是否开启碰撞列表
          if (returnflag) {
              collisionList[collisionList.length] = polygonFlag1;
              for (var k = 0; k < collisionList.length; k++) { //添加到碰撞列表中
                  if (polygonFlag1 == collisionList[k]) {
                      break;
                  }
              }
              if (k == collisionList.length - 1) {
                  collisionList[collisionList.length] = polygonFlag2;
              }
          }
      }
      return returnflag;
  }

  function isInRange(x1min, x1max, x2min) {
      if ((x2min - x1min) * (x2min - x1max) <= 0) {
          return true;
      }
  }


  function max(x, y) {
      return x > y ? x : y;
  }

  function min(x, y) {
      return x < y ? x : y;
  }

  //判断多边形是否相交
  function isCollisionPolygon(polygonTemp, polygonFlag1) {
      if (isTreeOpen && polygonFlag1 == 0) {
          for (var a = 0; a < treeAreas.length; a++) { //
              treeAreas[a].polygonList = "";
          }
          for (var k = 0; k < polygon.length; k++) {
              distingTreeArea(polygon[k]);
              polygon[k].isColl = false;
          }
          //console.log(treeAreas);
          for (var k = 0; k < treeAreas.length; k++) { //区域碰撞处理
              var treeAreasFlag = treeAreas[k].polygonList.split(";");
              for (var j = 0; j < treeAreasFlag.length - 1; j++) {
                  for (var m = 0; m < treeAreasFlag.length - 1; m++) {
                      if (j == m) {
                          break;
                      }
                      if (polygon[treeAreasFlag[j]].isColl) {
                          break;
                      }
                      if (intersect(polygon[treeAreasFlag[j]], polygon[treeAreasFlag[m]], -1, -1, false)) {
                          polygon[treeAreasFlag[j]].isColl = true;
                          polygon[treeAreasFlag[m]].isColl = true;
                      }
                  }
              }
          }
      } else if (isTreeOpen && polygonFlag1 > 0) {
          return polygonTemp.isColl;
      } else if (!isTreeOpen) {
          for (var i = 0; i < polygonCount; i++) {
              if (polygon[i].id != polygonTemp.id) {
                  //是否相交
                  if (intersect(polygonTemp, polygon[i], polygonFlag1, i, true)) {
                      return true;
                  }
              }
          }
      }
      return false;
  }

  //区分树形区域
  function distingTreeArea(polygonTemp) {
      for (var k = 0; k < treeAreas.length; k++) { //
          var polygonClass = {};
          polygonClass.x = treeAreas[k].x1 + ";" + treeAreas[k].x2 + ";" + treeAreas[k].x3 + ";" + treeAreas[k].x4;
          polygonClass.y = treeAreas[k].y1 + ";" + treeAreas[k].y2 + ";" + treeAreas[k].y3 + ";" + treeAreas[k].y4;
          if (intersect(polygonTemp, polygonClass, -1, -1, false)) {
              if (treeAreas[k].polygonList.indexOf(polygonTemp.id + ";") < 0) {
                  treeAreas[k].polygonList = treeAreas[k].polygonList + polygonTemp.id + ";";
              }
          }
      }
  }

  function getMax(str) {
      var str = str.split(";");
      var pMax = str[0];
      for (var k = 0; k < str.length; k++) {
          if (pMax < str[k]) {
              pMax = str[k];
          }
      }
      return pMax;
  }

  function getMin(str) {
      var str = str.split(";");
      var pMin = str[0];
      for (var k = 0; k < str.length; k++) {
          if (pMin > str[k]) {
              pMin = str[k];
          }
      }
      return pMin;
  }

  function getRandomColor() {
      return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
  }