//import "../InfinityGL.js";
//InfinityGL WebGLなどの描画系をScratchの座標みたくして使いやすくする2d描画ライブラリ
class InfinityGL {
  constructor(canvas, FrameRate = null) {
    if (typeof canvas == "object" && canvas.tagName == "CANVAS") {
      this.canvas = canvas; //canvasオブジェクト。横幅等の取得に使用する。
      this.buffer = new OffscreenCanvas(this.canvas.width, this.canvas.height);
      this.graphics = this.buffer.getContext("2d"); //描画コンテクスト。描画に使用する。
      this.backCanvas = document.createElement("canvas"); //画像処理用のcanvas
      this.backGraphics = this.backCanvas.getContext("2d"); //画像処理用の描画機構。高速化の為、座標変換をせずにdirectにする。
      this.aspect_ratio = canvas.width / canvas.height; //アスペクト比は、横幅÷縦幅で表す。
      this.FrameRate = FrameRate; //この値は最高のFPSを指定する。24はアニメ等に向いており、30はバランスが取れている。60はゲーム向き。(規定値でないと、setIntervalを使い出す)
      this.FPS = Infinity; //FPSを入れておく
      this.Dt = 0; //デルタタイムを入れておく
      this.lastDrawed = Date.now();
      this.drawingProcess = null; //描画処理を置いておく部分。
      this.imageCache = []; //imageのcacheが入る
    } else {
      console.error(canvas, "is not canvas");
    }
  }
  start() {
    this.canvas
      .getContext("2d")
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.Dt = (Date.now() - this.lastDrawed) / 1000;
    this.FPS = 1 / this.Dt;
  }
  clear() {
    this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  end() {
    this.canvas
      .getContext("2d")
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.getContext("2d").drawImage(this.buffer, 0, 0);
    this.lastDrawed = Date.now();
    if (this.FrameRate == null) {
      window.requestAnimationFrame(this.drawingProcess);
    }
  }
  setDrawingProcess(func) {
    //描画用の処理はここに入れること。ここではないと動作しなくなります。
    if (this.drawingProcess != null) {
      if (this.FrameRate == null) {
        this.drawingProcess = window.cancelAnimationFrame(this.drawingProcess);
      } else {
        clearInterval(this.drawingProcess);
      }
    }
    if (this.FrameRate == null) {
      this.drawingProcess = func;
      window.requestAnimationFrame(func);
    } else {
      this.drawingProcess = setInterval(
        func,
        Math.round(1000 / this.FrameRate)
      );
    }
  }
  //変換系
  stage(width, height) {
    this.aspect_ratio = width / height;
    let stage = { width: 480, height: 360 };
    if (this.aspect_ratio >= 4 / 3) {
      stage.width = stage.height * this.aspect_ratio;
    } else {
      stage.height = stage.width / this.aspect_ratio;
    }
    return stage;
  }
  convertPos(x, y) {
    let width = this.canvas.width;
    let height = this.canvas.height;
    let stage = this.stage(width, height);
    let return_x = (width * (x + stage.width / 2)) / stage.width;
    let return_y = (height * (y + stage.height / 2)) / stage.height;
    return { x: return_x, y: return_y };
  }
  convertLength(length) {
    let width = this.canvas.width;
    let height = this.canvas.height;
    let stage = this.stage(width, height);
    return (width * length) / stage.width;
  }
  randomPos() {
    return {
      x: (Math.random() - 0.5) * this.canvas.width,
      y: (Math.random() - 0.5) * this.canvas.height,
    };
  }
  getColorDistance(rgb1, rgb2) {
    // 三次元空間の距離が返る
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
  }
  rgb2hsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let diff = max - min;

    let h = 0;

    switch (min) {
      case max:
        h = 0;
        break;

      case r:
        h = 60 * ((b - g) / diff) + 180;
        break;

      case g:
        h = 60 * ((r - b) / diff) + 300;
        break;

      case b:
        h = 60 * ((g - r) / diff) + 60;
        break;
    }

    let s = max == 0 ? 0 : diff / max;
    let v = max;

    return [h, s, v];
  }
  //明度、彩度は0以上100以下の数値で指定すること。
  hsva(hue, saturation, value, alpha) {
    let result = false;
    if (
      (saturation || saturation === 0) &&
      saturation <= 100 &&
      (value || value === 0) &&
      value <= 100 &&
      (alpha || alpha === 0) &&
      alpha <= 1
    ) {
      let red = 0,
        green = 0,
        blue = 0,
        i = 0,
        f = 0,
        q = 0,
        p = 0,
        t = 0;
      hue = Number(hue % 360) / 60;
      saturation = Number(saturation) / 100;
      value = Number(value) / 100;
      if (saturation === 0) {
        red = value;
        green = value;
        blue = value;
      } else {
        i = Math.floor(hue);
        f = hue - i;
        p = value * (1 - saturation);
        q = value * (1 - saturation * f);
        t = value * (1 - saturation * (1 - f));
        switch (i) {
          case 0:
            red = value;
            green = t;
            blue = p;
            break;
          case 1:
            red = q;
            green = value;
            blue = p;
            break;
          case 2:
            red = p;
            green = value;
            blue = t;
            break;
          case 3:
            red = p;
            green = q;
            blue = value;
            break;
          case 4:
            red = t;
            green = p;
            blue = value;
            break;
          case 5:
            red = value;
            green = p;
            blue = q;
            break;
        }
      }
      result = {
        red: Math.round(red * 255).toString(),
        green: Math.round(green * 255).toString(),
        blue: Math.round(blue * 255).toString(),
        alpha: alpha.toString(),
      };
    }
    return (
      "rgba(" +
      result.red +
      "," +
      result.green +
      "," +
      result.blue +
      "," +
      result.alpha +
      ")"
    );
  }
  //パスを用いた描画集
  beginPath() {
    this.graphics.beginPath();
  }
  //ペンの移動
  moveTo(x, y) {
    let pos = this.convertPos(x, y);
    this.graphics.moveTo(pos.x, pos.y);
  }
  //直線
  lineTo(x, y) {
    let pos = this.convertPos(x, y);
    this.graphics.lineTo(pos.x, pos.y);
  }
  //2次ベジェ曲線
  quadraticCurveTo(cpx, cpy, x, y) {
    let cp = this.convertPos(cpx, cpy);
    let pos = this.convertPos(x, y);
    this.graphics.quadraticCurveTo(cp.x, cp.y, pos.x, pos.y);
  }
  //3次ベジェ曲線
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    let cp1pos = this.convertPos(cp1x, cp1y);
    let cp2pos = this.convertPos(cp2x, cp2y);
    let pos = this.convertPos(x, y);
    this.graphics.bezierCurveTo(
      cp1pos.x,
      cp1pos.y,
      cp2pos.x,
      cp2pos.y,
      pos.x,
      pos.y
    );
  }
  //円の描画
  arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
    startAngle = (startAngle / 180) * Math.PI;
    endAngle = (endAngle / 180) * Math.PI;
    radius = this.convertLength(radius);
    let pos = this.convertPos(x, y);
    this.graphics.arc(
      pos.x,
      pos.y,
      radius,
      startAngle,
      endAngle,
      counterclockwise
    );
  }
  arcTo(x1, y1, x2, y2, radius) {
    let pos1 = this.convertPos(x1, y1);
    let pos2 = this.convertPos(x2, y2);
    radius = this.convertLength(radius);
    this.graphics.arcTo(pos1.x, pos1.y, pos2.x, pos2.y, radius);
  }
  ellipse(
    x,
    y,
    radiusX,
    radiusY,
    rotation,
    startAngle,
    endAngle,
    counterclockwise = false
  ) {
    startAngle = (startAngle / 180) * Math.PI;
    endAngle = (endAngle / 180) * Math.PI;
    radiusX = this.convertLength(radiusX);
    radiusY = this.convertLength(radiusY);
    rotation = (rotation / 180) * Math.PI;
    let pos = this.convertPos(x, y);
    this.graphics.ellipse(
      pos.x,
      pos,
      y,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      counterclockwise
    );
  }
  //色で埋める
  fill(color) {
    this.graphics.fillStyle = color;
    this.graphics.fill();
  }
  //線を描く
  stroke(color, width) {
    this.strokeStyle = color;
    this.graphics.lineWidth = this.convertLength(width);
    this.graphics.stroke();
  }
  closePath() {
    this.graphics.closePath();
  }
  //直線の描画
  line(x1, y1, x2, y2, color = "black", width = 1) {
    let posFrom = this.convertPos(x1, y1);
    let posTo = this.convertPos(x2, y2);
    width = this.convertLength(width);
    this.graphics.beginPath();
    this.graphics.strokeStyle = color;
    this.graphics.lineWidth = width;
    this.graphics.moveTo(posFrom.x, posFrom.y);
    this.graphics.lineTo(posTo.x, posTo.y);
    this.graphics.stroke();
    this.graphics.closePath();
  }
  //ポリゴン(3角形)の描画
  polygon(
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    fill = null,
    stroke = { color: null, width: null }
  ) {
    if (!(fill == null && stroke == { color: null, width: null })) {
      this.graphics.beginPath();
      let pos = [];
      pos.append(this.convertPos(x1, y1));
      pos.append(this.convertPos(x2, y2));
      pos.append(this.convertPos(x3, y3));
      for (let i = 0; i < e; ++i) {
        this.graphics.lineTo(pos[i].x, pos[i].y);
      }
      if (fill != null) {
        this.graphics.fillStyle = fill;
        this.graphics.fill();
      }
      if (stroke.color != null && stroke.width != null) {
        this.graphics.lineWidth = this.convertLength(stroke.width);
        this.graphics.strokeStyle = stroke.color;
        this.graphics.closePath();
        this.graphics.stroke();
      }
    }
  }
  //長方形の描画
  rect(
    x,
    y,
    width,
    height,
    fill = null,
    stroke = { color: null, width: null }
  ) {
    let pos = this.convertPos(x, y);
    width = this.convertLength(width);
    height = this.convertLength(height);
    this.graphics.beginPath();
    this.graphics.rect(pos.x - width / 2, pos.y - height / 2, width, height);
    if (fill != null) {
      this.graphics.fillStyle = fill;
      this.graphics.fill();
    }
    if (stroke.color != null && stroke.width != null) {
      this.graphics.lineWidth = stroke.width;
      this.graphics.strokeStyle = stroke.color;
      this.graphics.closePath();
      this.graphics.stroke();
    }
  }
  //画像の描画系統
  img(image, x, y, size) {
    let pos = this.convertPos(x, y);
    let width, height;
    width = this.convertLength(image.width * size);
    height = this.convertLength(image.height * size);
    this.graphics.drawImage(
      image,
      pos.x - width / 2,
      pos.y - height / 2,
      width,
      height
    );
  }
  rotateImg(img, direction) {
    const canvasize = Math.sqrt(img.width ** 2 + img.height ** 2);
    this.backCanvas.width = canvasize;
    this.backCanvas.height = canvasize;
    this.backGraphics.clearRect(
      0,
      0,
      this.backCanvas.width,
      this.backCanvas.height
    );
    this.backGraphics.setTransform(1, 0, 0, 1, 0, 0);
    this.backGraphics.translate(
      this.backCanvas.width / 2,
      this.backCanvas.height / 2
    );
    direction %= 360;
    this.backGraphics.rotate(((direction * Math.PI) / 180) % (2 * Math.PI));
    this.backGraphics.drawImage(img, img.width / -2, img.height / -2);
    const result = new Image();
    this.backGraphics.setTransform(1, 0, 0, 1, 0, 0);
    result.src = this.backCanvas.toDataURL();
    return result;
  }
  resizeImg(img, persentage) {
    this.backCanvas.width = img.width * persentage;
    this.backCanvas.height = img.height * persentage;
    this.backGraphics.clearRect(
      0,
      0,
      this.backCanvas.width,
      this.backCanvas.height
    );
    this.backGraphics.drawImage(
      img,
      0,
      0,
      img.width * persentage,
      img.height * persentage
    );
    const result = new Image();
    result.src = this.backCanvas.toDataURL();
    return result;
  }
}
///////////////////////////

function makeRandomColor() {
  base16 = "0123456789abcdef";
  result = "#";
  for (let i = 0; i < 6; ++i) {
    result += base16.substr(Math.floor(Math.random() * 16), 1);
  }
  return result;
}
function rgb(r, g, b) {
  return { r: r, g: g, b: b };
}

const canva = document.getElementById("screen");
canva.width = "480";
canva.height = "360";
let InfinityGraphics = new InfinityGL(canva);
let count = 0;
let img = document.querySelector("img");
img = InfinityGraphics.resizeImg(img, 0.05);
function drawingProcess() {
  InfinityGraphics.start();
  count += 1;
  document.querySelector("h1").innerHTML =
    Math.floor(InfinityGraphics.FPS * 100) / 100;
  InfinityGraphics.rect(-50, 0, 100, 100, (fill = "red"));
  InfinityGraphics.rect(50, 0, 100, 100, (fill = "green"));
  InfinityGraphics.img(
    InfinityGraphics.rotateImg(img, count),
    100,
    (100 * Math.sin(count / 10)) % 100,
    2
  );
  InfinityGraphics.end();
}
InfinityGraphics.setDrawingProcess(drawingProcess);
