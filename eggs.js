/**
 * @Author:      allenAugustine
 * @Email:       iallenaugustine@gmail.com  -  misterji0708@qq.com
 * @DateTime:    2018-04-27 15:59:20
 * @Description: SURPRISE
 */
!(function() {
  console.log('Surprise with konami code');
  console.log("%cSurprise with konami code"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:2.5em;background:rgb(220, 51, 43);color:#fff;padding:20px 10px 30px;");
  console.log('');
  console.log('');
  console.log('');
  //全屏显示
  var handleFullscreen = function() {
    let main = document.body;
    if (main.requestFullscreen) {
      main.requestFullscreen();
    } else if (main.mozRequestFullScreen) {
      main.mozRequestFullScreen();
    } else if (main.webkitRequestFullScreen) {
      main.webkitRequestFullScreen();
    } else if (main.msRequestFullscreen) {
      main.msRequestFullscreen();
    }
  };

  //背景Canvas
  var startEggs = function() {
    var isSupportFullScreen = window.navigator.userAgent.indexOf('MSIE') < 0;
    if (isSupportFullScreen) {
      console.log('111')
      handleFullscreen();
    } else {
      console.log(222);
      return;
    }

    function project3D(x, y, z, vars) {
      var p, d;
      x -= vars.camX;
      y -= vars.camY - 8;
      z -= vars.camZ;
      p = Math.atan2(x, z);
      d = Math.sqrt(x * x + z * z);
      x = Math.sin(p - vars.yaw) * d;
      z = Math.cos(p - vars.yaw) * d;
      p = Math.atan2(y, z);
      d = Math.sqrt(y * y + z * z);
      y = Math.sin(p - vars.pitch) * d;
      z = Math.cos(p - vars.pitch) * d;
      var rx1 = -1000,
        ry1 = 1,
        rx2 = 1000,
        ry2 = 1,
        rx3 = 0,
        ry3 = 0,
        rx4 = x,
        ry4 = z,
        uc = (ry4 - ry3) * (rx2 - rx1) - (rx4 - rx3) * (ry2 - ry1),
        ua = ((rx4 - rx3) * (ry1 - ry3) - (ry4 - ry3) * (rx1 - rx3)) / uc,
        ub = ((rx2 - rx1) * (ry1 - ry3) - (ry2 - ry1) * (rx1 - rx3)) / uc;
      if (!z) z = 0.000000001;
      if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
        return {
          x: vars.cx + (rx1 + ua * (rx2 - rx1)) * vars.scale,
          y: vars.cy + y / z * vars.scale,
          d: (x * x + y * y + z * z)
        };
      } else {
        return { d: -1 };
      }
    }

    function elevation(x, y, z) {
      var dist = Math.sqrt(x * x + y * y + z * z);
      if (dist && z / dist >= -1 && z / dist <= 1) return Math.acos(z / dist);
      return 0.00000001;
    }

    function rgb(col) {
      col += 0.000001;
      var r = parseInt((0.5 + Math.sin(col) * 0.5) * 16),
        g = parseInt((0.5 + Math.cos(col) * 0.5) * 16),
        b = parseInt((0.5 - Math.sin(col) * 0.5) * 16);
      return "#" + r.toString(16) + g.toString(16) + b.toString(16);
    }

    function interpolateColors(RGB1, RGB2, degree) {
      var w2 = degree,
        w1 = 1 - w2;
      return [w1 * RGB1[0] + w2 * RGB2[0], w1 * RGB1[1] + w2 * RGB2[1], w1 * RGB1[2] + w2 * RGB2[2]];
    }

    function rgbArray(col) {
      col += 0.000001;
      var r = parseInt((0.5 + Math.sin(col) * 0.5) * 256),
        g = parseInt((0.5 + Math.cos(col) * 0.5) * 256),
        b = parseInt((0.5 - Math.sin(col) * 0.5) * 256);
      return [r, g, b];
    }


    function colorString(arr) {
      var r = parseInt(arr[0]),
        g = parseInt(arr[1]),
        b = parseInt(arr[2]);
      return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    }

    function process(vars) {
      if (vars.points.length < vars.initParticles)
        for (var i = 0; i < 5; ++i) spawnParticle(vars);
      var p, d, t;
      p = Math.atan2(vars.camX, vars.camZ);
      d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
      d -= Math.sin(vars.frameNo / 80) / 25;
      t = Math.cos(vars.frameNo / 300) / 165;
      vars.camX = Math.sin(p + t) * d;
      vars.camZ = Math.cos(p + t) * d;
      vars.camY = -Math.sin(vars.frameNo / 220) * 15;
      vars.yaw = Math.PI + p + t;
      vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
      var t;
      for (var i = 0; i < vars.points.length; ++i) {
        x = vars.points[i].x;
        y = vars.points[i].y;
        z = vars.points[i].z;
        d = Math.sqrt(x * x + z * z) / 1.0075;
        t = .1 / (1 + d * d / 5);
        p = Math.atan2(x, z) + t;
        vars.points[i].x = Math.sin(p) * d;
        vars.points[i].z = Math.cos(p) * d;
        vars.points[i].y += vars.points[i].vy * t * ((Math.sqrt(vars.distributionRadius) - d) * 2);
        if (vars.points[i].y > vars.vortexHeight / 2 || d < .25) {
          vars.points.splice(i, 1);
          spawnParticle(vars);
        }
      }
    }

    function drawFloor(vars) {
      var x, y, z, d, point, a;
      for (var i = -25; i <= 25; i += 1) {
        for (var j = -25; j <= 25; j += 1) {
          x = i * 2;
          z = j * 2;
          y = vars.floor;
          d = Math.sqrt(x * x + z * z);
          point = project3D(x, y - d * d / 85, z, vars);
          if (point.d != -1) {
            size = 1 + 15000 / (1 + point.d);
            a = 0.15 - Math.pow(d / 50, 4) * 0.15;
            if (a > 0) {
              vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(d / 26 - vars.frameNo / 40), [0, 128, 32], .5 + Math.sin(d / 6 - vars.frameNo / 8) / 2));
              vars.ctx.globalAlpha = a;
              vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
            }
          }
        }
      }
      vars.ctx.fillStyle = "#82f";
      for (var i = -25; i <= 25; i += 1) {
        for (var j = -25; j <= 25; j += 1) {
          x = i * 2;
          z = j * 2;
          y = -vars.floor;
          d = Math.sqrt(x * x + z * z);
          point = project3D(x, y + d * d / 85, z, vars);
          if (point.d != -1) {
            size = 1 + 15000 / (1 + point.d);
            a = 0.15 - Math.pow(d / 50, 4) * 0.15;
            if (a > 0) {
              vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(-d / 26 - vars.frameNo / 40), [32, 0, 128], .5 + Math.sin(-d / 6 - vars.frameNo / 8) / 2));
              vars.ctx.globalAlpha = a;
              vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
            }
          }
        }
      }
    }

    function sortFunction(a, b) {
      return b.dist - a.dist;
    }

    function draw(vars) {
      vars.ctx.globalAlpha = .15;
      vars.ctx.fillStyle = "#000";
      vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawFloor(vars);
      var point, x, y, z, a;
      for (var i = 0; i < vars.points.length; ++i) {
        x = vars.points[i].x;
        y = vars.points[i].y;
        z = vars.points[i].z;
        point = project3D(x, y, z, vars);
        if (point.d != -1) {
          vars.points[i].dist = point.d;
          size = 1 + vars.points[i].radius / (1 + point.d);
          d = Math.abs(vars.points[i].y);
          a = .8 - Math.pow(d / (vars.vortexHeight / 2), 1000) * .8;
          vars.ctx.globalAlpha = a >= 0 && a <= 1 ? a : 0;
          vars.ctx.fillStyle = rgb(vars.points[i].color);
          if (point.x > -1 && point.x < vars.canvas.width && point.y > -1 && point.y < vars.canvas.height) vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
        }
      }
      vars.points.sort(sortFunction);
    }


    function spawnParticle(vars) {
      var p, ls;
      pt = {};
      p = Math.PI * 2 * Math.random();
      ls = Math.sqrt(Math.random() * vars.distributionRadius);
      pt.x = Math.sin(p) * ls;
      pt.y = -vars.vortexHeight / 2;
      pt.vy = vars.initV / 20 + Math.random() * vars.initV;
      pt.z = Math.cos(p) * ls;
      pt.radius = 200 + 800 * Math.random();
      pt.color = pt.radius / 1000 + vars.frameNo / 250;
      vars.points.push(pt);
    }

    function frame(vars) {
      if (vars === undefined) {
        var vars = {};
        vars.canvas = document.querySelector("canvas");
        vars.ctx = vars.canvas.getContext("2d");
        vars.canvas.width = document.body.clientWidth;
        vars.canvas.height = document.body.clientHeight;
        window.addEventListener("resize", function() {
          vars.canvas.width = document.body.clientWidth;
          vars.canvas.height = document.body.clientHeight;
          vars.cx = vars.canvas.width / 2;
          vars.cy = vars.canvas.height / 2;
        }, true);
        vars.frameNo = 0;
        vars.camX = 0;
        vars.camY = 0;
        vars.camZ = -14;
        vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
        vars.yaw = 0;
        vars.cx = vars.canvas.width / 2;
        vars.cy = vars.canvas.height / 2;
        vars.bounding = 10;
        vars.scale = 500;
        vars.floor = 26.5;
        vars.points = [];
        vars.initParticles = 700;
        vars.initV = 0.01;
        vars.distributionRadius = 800;
        vars.vortexHeight = 25;
      }
      vars.frameNo++;
      requestAnimationFrame(function() {
        frame(vars);
      });
      process(vars);
      draw(vars);
    }
    frame();
  };

  //添加背景音乐
  var addBgSound = function() {
    //添加音乐 《Call of the ambulance》
    var audio = document.createElement('audio');
    audio.src = 'http://www.hohu.com.cn/Public/home/images/CallOfTheAmbulance.MP3';
    audio.style.display = 'none';
    audio.autopaly = 'autopaly';
    document.body.appendChild(audio);
    audio.play();
    setTimeout(function() {
      //切换音乐给《大哥点点关注》 时长 30s 之后停止 网页恢复正常
      audio.pause();
      document.body.removeChild(audio);
      var follow = document.createElement('audio');
      follow.src = 'http://www.hohu.com.cn/Public/home/images/follow.mp3';
      document.body.appendChild(follow);
      follow.play();
      document.getElementById('mj_eggs_txt02').style.display = 'block';
      setTimeout(function(){
        window.location.reload();
      }, 12*1000);
    }, 41 * 1000);
  };

  // startEggs();
  var tokeyList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    TOKEN = '38,38,40,40,37,39,37,39,66,65',
    isStartedSurprise = false,
    keyupEvent = function(e) {
      if (isStartedSurprise) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      console.log(e.keyCode);
      tokeyList.push(e.keyCode);
      tokeyList.shift();
      if (tokeyList.join(',') === TOKEN) {
        // document.getElementById('mj_eggs').style.display = 'block';
        var mjEggs = document.createElement('div');
        mjEggs.className = 'mj-eggs';
        mjEggs.id = 'mj_eggs';
        mjEggs.innerHTML = '<canvas id="canvas"></canvas>'+
          '<div class="mj-eggs-wapper">'+
            '<a href="#" class="mj-eggs-txt02" id="mj_eggs_txt02">给大哥点点关注！</a>'+
          '</div>';
        document.body.appendChild(mjEggs);
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        isStartedSurprise = true;
        addBgSound();
        startEggs();
      }
    };
  window.addEventListener('keyup', keyupEvent, false);

})();