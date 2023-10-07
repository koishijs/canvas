import { Awaitable, Context, h, Service } from 'koishi'

declare module 'koishi' {
  interface Context {
    canvas: CanvasService
  }
}

export interface CanvasRenderingContext2D<
  C extends Canvas = Canvas,
  I extends Image = Image,
> extends Omit<globalThis.CanvasRenderingContext2D, 'drawImage' | 'canvas'> {
  canvas: C
  drawImage(image: C | I, dx: number, dy: number): void
  drawImage(image: C | I, dx: number, dy: number, dw: number, dh: number): void
  drawImage(image: C | I, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
}

export interface Canvas {
  width: number
  height: number
  getContext(type: '2d'): CanvasRenderingContext2D
  toBuffer(type: 'image/png'): Promise<Buffer>
  toDataURL(type: 'image/png'): Promise<string>
  dispose(): Promise<void>
}

export interface Image {
  // src: Buffer
  // alt: string
  // width: number
  // height: number
  readonly naturalWidth: number
  readonly naturalHeight: number
  // readonly complete: boolean
  // onload?(): void
  // onerror?(err: Error): void
  dispose(): Promise<void>
}

abstract class CanvasService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'canvas')
  }

  abstract createCanvas(width: number, height: number): Promise<Canvas>
  abstract loadImage(source: string | URL | Buffer | ArrayBufferLike): Promise<Image>

  async render(width: number, height: number, callback: (ctx: CanvasRenderingContext2D) => Awaitable<void>) {
    const canvas = await this.createCanvas(width, height)
    try {
      await callback(canvas.getContext('2d'))
      const buffer = await canvas.toBuffer('image/png')
      return h.image(buffer, 'image/png')
    } finally {
      await canvas.dispose()
    }
  }
}

export default CanvasService
