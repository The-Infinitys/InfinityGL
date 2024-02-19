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
```
