import * as env from "./environment";
import p5 from "p5";

export let click = false;

export class Canvas {
  p: p5;
  w: number;
  h: number;
  f: number;

  constructor(sketch: p5, w?: number, h?: number, f?: number) {
    this.p = sketch;
    if (!w) {
      this.w = env.canvasWidth;
    } else {
      this.w = w;
    }
    if (!h) {
      this.h = env.canvasHeight;
    } else {
      this.h = h;
    }
    if (!f) {
      this.f = env.frameRate;
    } else {
      this.f = f;
    }
  }

  create() {
    this.p.colorMode(this.p.HSL, 360, 1, 1, 1);
    this.p.createCanvas(this.w, this.h);
    this.fill(0, 0, 0.1, 1);
    this.p.frameRate(this.f);
  }

  fill(h: number, s: number, l: number, a: number) {
    this.p.background(h, s, l, a);
  }

  resize() {
    this.w = Math.min(700, document.body.clientWidth - 80);

    this.p.resizeCanvas(this.w, this.h);
  }
}

export class Ball {
  p: p5;
  d: number;
  x: number;
  y: number;
  vX: number;
  vY: number;
  m: number;
  uuid: string;

  constructor(
    sketch: p5,
    d?: any,
    x?: any,
    y?: any,
    vX?: any,
    vY?: any,
    m?: any,
    uuid?: string
  ) {
    this.p = sketch;
    if (!d) {
      this.d =
        (env.size +
          env.size * (env.sizeVariance * Math.random()) -
          env.sizeVariance) >>
        1;
    } else {
      this.d = d;
    }
    if (!x) {
      this.x = this.d / 2 + (env.canvasWidth - this.d) * Math.random();
    } else {
      this.x = x;
    }
    if (!y) {
      this.y = this.d / 2 + (env.canvasHeight - this.d) * Math.random();
    } else {
      this.y = y;
    }
    if (!vX) {
      (this.vX =
        env.velocity *
          (env.veloVariance * Math.random() - env.veloVariance / 2) -
        env.velocity / 2) / env.frameRate;
    } else {
      this.vX = vX;
    }
    if (!vY) {
      (this.vY =
        env.velocity *
          (env.veloVariance * Math.random() - env.veloVariance / 2) -
        env.velocity / 2) / env.frameRate;
    } else {
      this.vY = vY;
    }
    if (!m) {
      this.m = this.d + this.d * Math.random();
    } else {
      this.m = m;
    }
    if (!uuid) {
      this.uuid = Math.random().toString(36).substr(2, 9);
    } else {
      this.uuid = uuid;
    }
  }

  hue = Math.floor(Math.random() * 360);
  saturation = env.ballSaturation;
  lightness = env.ballLightness;
  alpha = env.ballOpacity;

  g = env.g / env.frameRate;

  translate(canvas: { h: number }) {
    if (this.y + this.d / 2 < canvas.h) {
      this.vY += this.g;
    }

    this.x += this.vX;
    this.y += this.vY;
  }

  collide(obj: { w: number; h: number }) {
    if (obj instanceof Canvas) {
      if (
        (this.x + this.d / 2 >= obj.w && this.vX >= 0) ||
        (this.x - this.d / 2 < 0 && this.vX < 0)
      ) {
        this.vX = -this.vX * env.b;
      }

      if (
        (this.y + this.d / 2 >= obj.h && this.vY >= 0) ||
        (this.y - this.d / 2 < 0 && this.vY < 0)
      ) {
        this.vY = -this.vY * env.b;
      }
    } else {
      // TODO object collision
    }
  }

  render(canvas: any) {
    this.p.colorMode(this.p.HSL, 360, 1, 1, 1);
    this.p.noStroke();
    this.p.fill(this.hue, this.saturation, this.lightness, this.alpha);

    this.p.ellipse(this.x, this.y, this.d);

    this.collide(canvas);
    this.translate(canvas);
  }

  nSqrt(n: number) {
    return n > 0 ? this.p.sqrt(Math.abs(n)) : -this.p.sqrt(Math.abs(n));
  }
}
