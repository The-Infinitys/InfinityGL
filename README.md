# InfinityGL (JavaScript2D Graphic Library made by The Infinitys)
## What is InfinityGL?
InfinityGLは、The Infinitysが開発した、JavaScriptでの描画を高速かつ簡便かつ便利なものにするライブラリ(というよりはClass)です。
描画する際に、画面の大きさについて一切気にせずに描画をすることができるようになります。
使用例はこちら<br>
https://the-infinitys.github.io/InfinityGL/example
## 主な使い方
このようなコードを用いて、InfinityGLを初期化します。
```javascript
let canva=document.createElement("canvas");//canvasオブジェクトを入れておく
let InfinityGraphics=new InfinityGL(canva);//ここで初期化
```
## コード一覧
### 初期化系統
```javascript
InfinityGraphics.start()//描画を開始する際に必ず書く。バッファの初期化が行われる。
InfinityGraphics.end()//描画を終了する際に必ず書く。バッファを用いて、canvasを更新する。
InfinityGraphics.setDrawingProcess(func)//引数に入れた関数を使って描画をする。この関数の中には必ずstart()とend()を入れること。
InfinityGraphics.stage(width, height)//stageの大きさを取得する、例えば、アスペクト比が4:3だった場合、{width:480,height:360}が帰ってくる。
```
### Pathを用いた描画系統
```javascript
InfinityGraphics.beginPath()//canvasのbeginPath()と全く一緒。
InfinityGraphics.moveTo(x, y)//座標変換を施して、moveTo()を実行する。
InfinityGraphics.lineTo(x, y)//座標変換を施して、lineTo()を実行する。
InfinityGraphics.quadraticCurveTo(cpx, cpy, x, y)//座標変換を施して、quadraticCurveTo()を実行する。
InfinityGraphics.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)//座標変換を施して、bezierCurveTo()を実行する。
InfinityGraphics.arc(x, y, radius, startAngle, endAngle, counterclockwise = false)//座標変換・角度変換を施して、arc()を実行する。
InfinityGraphics.arcTo(x1, y1, x2, y2, radius)//座標変換を施して、arcTo()を実行する。
InfinityGraphics.ellipse(x,y,radiusX,radiusY,rotation,startAngle,endAngle,counterclockwise = false)//座標変換・角度変換を施して、ellipseを実行する。
InfinityGraphics.fill(color)//pathを指定した色で満たす。
InfinityGraphics.stroke(color, width)//pathを指定した色と太さの線で描く。
InfinityGraphics.closePath()//pathを閉じる
```
### 簡易描画系統
```javascript
InfinityGraphics.line(x1, y1, x2, y2, color = "black", width = 1)//線を描画する。
InfinityGraphics.polygon(x1, y1, x2, y2, x3, y3, fill = null, stroke = { color: null, width: null })//三角形を描画する。
InfinityGraphics.rect(x,y,width,height,fill = null,stroke = { color: null, width: null })//長方形を描画する。
InfinityGraphics.img(image, x, y, size)//画像を描画する。(サイズは1で100%を表す。)
```
