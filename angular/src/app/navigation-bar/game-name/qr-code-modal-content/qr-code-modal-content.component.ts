import { ChangeDetectionStrategy, AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslocoDirective } from "@jsverse/transloco";
import qrcode from "qrcode-generator"

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'shpp-qr-code-modal-content',
  standalone: true,
  templateUrl: './qr-code-modal-content.component.html',
  imports: [
    TranslocoDirective
  ]
})
export class QrCodeModalContentComponent implements AfterViewInit {
  activeModal = inject(NgbActiveModal);
  @Input() private url?: string;

  @ViewChild('qrCanvas')
  private qrCanvas?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    if (this.url) {
      const canvas = this.qrCanvas?.nativeElement;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        const code = qrcode(0, 'M');
        code.addData(this.url);
        code.make();
        const scale = 4;
        const margin = 4 * scale;
        canvas.width = canvas.height = code.getModuleCount() * scale + 2 * margin;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(margin, margin);
        code.renderTo2dContext(context, scale);
        context.restore();
      }
    }
  }
}
