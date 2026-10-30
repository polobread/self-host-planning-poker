import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import decodeQR from 'qr/decode.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import english from '../../../../assets/i18n/en.json';
import { QrCodeModalContentComponent } from './qr-code-modal-content.component';

// Record canvas pixels so a separate decoder can verify the rendered QR code.
function recordCanvas(canvas: HTMLCanvasElement) {
  let pixels: Uint8ClampedArray;
  let offsetX = 0;
  let offsetY = 0;
  const context = {
    fillStyle: 'black',
    save() {},
    restore() { offsetX = offsetY = 0; },
    translate(x: number, y: number) { offsetX += x; offsetY += y; },
    fillRect(x: number, y: number, width: number, height: number) {
      pixels ??= new Uint8ClampedArray(canvas.width * canvas.height * 4);
      const channel = context.fillStyle === 'white' ? 255 : 0;
      for (let row = y + offsetY; row < y + offsetY + height; row++) {
        for (let col = x + offsetX; col < x + offsetX + width; col++) {
          const index = (row * canvas.width + col) * 4;
          pixels.set([channel, channel, channel, 255], index);
        }
      }
    }
  };
  return { context, image: () => ({ width: canvas.width, height: canvas.height, data: pixels }) };
}

afterEach(() => vi.restoreAllMocks());

describe('Room QR code', () => {
  it.each([
    'http://localhost:5000/game/38532413-6b9b-439e-a437-4096ef7a2f75',
    `https://example.com/${'planning-poker/'.repeat(40)}game/room-id`
  ])('renders a complete, scannable room URL: %s', async (url) => {
    let recording: ReturnType<typeof recordCanvas>;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function(this: HTMLCanvasElement) {
      recording = recordCanvas(this);
      return recording.context as unknown as CanvasRenderingContext2D;
    });
    TestBed.configureTestingModule({
      imports: [QrCodeModalContentComponent, TranslocoTestingModule.forRoot({
        langs: { en: english },
        translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        preloadLangs: true
      })],
      providers: [NgbActiveModal]
    });
    const fixture = TestBed.createComponent(QrCodeModalContentComponent);
    fixture.componentRef.setInput('url', url);
    await fixture.whenStable();
    const image = recording!.image();
    expect(decodeQR(image)).toBe(url);
    expect(image.width).toBe(image.height);
    expect(Array.from(image.data.slice(0, 4))).toEqual([255, 255, 255, 255]);
  });
});
