# InfinityGL (JavaScript2D Graphic Library made by The Infinitys)
## What is InfinityGL?
InfinityGLは、The Infinitysが開発した、JavaScriptでの描画を高速かつ簡便なものにするライブラリ(というよりはClass)です。
## 主な使い方
このようなコードを用いて、InfinityGLを初期化します。
```javascript
let canva=document.createElement("canvas");//canvasオブジェクトを入れておく
let InfinityGraphics=new InfinityGL(canva);//ここで初期化
```
## コード一覧
```javascript
//----------------------------------------------------------------------------
//---------------------------------初期化系統-----------------------------------
//----------------------------------------------------------------------------
InfinityGraphics.start()//描画を開始する際に必ず書く。バッファの初期化が行われる。
InfinityGraphics.end()//描画を終了する際に必ず書く。バッファを用いて、canvasを更新する。
InfinityGraphics.setDrawingProcess(func)
InfinityGraphics.stage(width, height)
InfinityGraphics.beginPath()
InfinityGraphics.moveTo(x, y)
InfinityGraphics.lineTo(x, y)
InfinityGraphics.quadraticCurveTo(cpx, cpy, x, y)
InfinityGraphics.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
InfinityGraphics.arc(x, y, radius, startAngle, endAngle, counterclockwise = false)
InfinityGraphics.arcTo(x1, y1, x2, y2, radius)
InfinityGraphics.ellipse(x,y,radiusX,radiusY,rotation,startAngle,endAngle,counterclockwise = false)
InfinityGraphics.fill(color)
InfinityGraphics.stroke(color, width)
InfinityGraphics.closePath()
InfinityGraphics.line(x1, y1, x2, y2, color = "black", width = 1)
InfinityGraphics.polygon(path = [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },],fill = null,stroke = { color: null, width: null })
InfinityGraphics.rect(x,y,width,height,fill = null,stroke = { color: null, width: null })
InfinityGraphics.image(image, x, y, width, height)
InfinityGraphics.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
```
