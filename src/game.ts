import * as PIXI from "pixi.js";
import { Shark } from "./shark";
import { Bubble } from "./bubble";
import sharkImage from "./img/gun.jpg";
import bubbleImage from "./img/rick.jpg";
import waterImage from "./img/bg.jpg";

export class Game {
  private pixi: PIXI.Application;
  private loader: PIXI.Loader;
  private bubbles: Bubble[] = [];
  private shark: Shark;

  constructor() {
    this.pixi = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight
    });
    document.body.appendChild(this.pixi.view);

    console.log("starting .. ?");

    this.loader = new PIXI.Loader();
    this.loader
      .add("bubbleTexture", bubbleImage)
      .add("waterTexture", waterImage)
      .add("sharkTexture", sharkImage);

    this.loader.onProgress.add((loader) => this.showProgress(loader));
    this.loader.onError.add((arg) => {
      console.error(arg);
    });
    this.loader.load(() => this.startGame());
  }

  private showProgress(p: PIXI.Loader) {
    console.log(p.progress);
  }

  private startGame() {
    let bg = new PIXI.TilingSprite(
      this.loader.resources["waterTexture"].texture!,
      this.pixi.screen.width,
      this.pixi.screen.height
    );
    this.pixi.stage.addChild(bg);

    this.shark = new Shark(
      this,
      this.loader.resources["sharkTexture"].texture!
    );
    this.pixi.stage.addChild(this.shark);

    this.pixi.ticker.add(() => this.update());
  }

  public shootBubble(bx: number, by: number) {
    let bubble = new Bubble(
      bx,
      by,
      this,
      this.loader.resources["bubbleTexture"].texture!
    );
    this.pixi.stage.addChild(bubble);
    this.bubbles.push(bubble);
  }

  public removeBubble(bubble: Bubble) {
    this.bubbles = this.bubbles.filter((b) => b !== bubble);
  }

  private update() {
    for (let bubble of this.bubbles) {
      bubble.update();
    }

    this.shark.swim();
  }

  private collision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite) {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}