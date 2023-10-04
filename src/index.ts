import { Context, Service } from 'koishi'

declare module 'koishi' {
  interface Context {
    canvas: CanvasService
  }
}

export interface Canvas extends Partial<HTMLCanvasElement> {}

export interface Image extends Partial<HTMLImageElement> {}

abstract class CanvasService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'canvas')
  }

  abstract createCanvas(width: number, height: number): Promise<Canvas>
  abstract loadImage(source: string | URL | Buffer | ArrayBufferLike | Image): Promise<Image>
}

export default CanvasService
