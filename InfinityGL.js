//InfinityGL WebGLなどの描画系をScratchの座標みたくして使いやすくする2d描画ライブラリ
class InfinityGL {
  constructor(canvas, FrameRate = null) {
    if (typeof canvas == "object" && canvas.tagName == "CANVAS") {
      this.canvas = canvas; //canvasオブジェクト。横幅等の取得に使用する。
      this.buffer = new OffscreenCanvas(this.canvas.width, this.canvas.height);
      this.graphics = this.buffer.getContext("2d"); //描画コンテクスト。描画に使用する。
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
    this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.Dt = (Date.now() - this.lastDrawed) / 1000;
    this.FPS = 1 / this.Dt;
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
  //ポリゴン(n角形)の描画
  polygon(
    path = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    fill = null,
    stroke = { color: null, width: null }
  ) {
    if (
      path.length >= 3 &&
      !(fill == null && stroke == { color: null, width: null })
    ) {
      this.graphics.beginPath();
      for (let i = 0; i < path.length; ++i) {
        let pos = this.convertPos(path[i].x, path[i].y);
        this.graphics.lineTo(pos.x, pos.y);
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
  image(image, x, y, width, height) {
    let pos = this.convertPos(x, y);
    width = this.convertLength(width);
    height = this.convertLength(height);
    this.graphics.drawImage(image, pos.x - width / 2, pos.y - height / 2, width, height);
  }
  drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    let spos = this.convertPos(sx, sy);
    sWidth = this.convertLength(sWidth);
    sHeight = this.convertLength(sHeight);
    spos.x-=sWidth/2;
    spos.y-=sHeight/2;
    let dpos = this.convertPos(dx, dy);
    dWidth = this.convertLength(dWidth);
    dHeight = this.convertLength(dHeight);
    dpos.x-=dWidth/2;
    dpos.y-=dHeight/2;
    this.graphics.drawimage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
}
