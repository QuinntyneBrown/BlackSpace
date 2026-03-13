import { Component, input, output, OnDestroy, effect, OnInit } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-toast',
  imports: [LucideIconComponent],
  template: `
    @if (visible()) {
      <div class="toast" [class]="'toast toast-' + type()">
        <div class="icon-circle" [class]="'icon-circle icon-circle-' + type()">
          @if (type() === 'success') {
            <lib-lucide-icon name="check" [size]="18" [color]="iconColor()" />
          } @else if (type() === 'warning') {
            <lib-lucide-icon name="triangle-alert" [size]="18" [color]="iconColor()" />
          } @else {
            <lib-lucide-icon name="circle-alert" [size]="18" [color]="iconColor()" />
          }
        </div>
        <div class="content">
          <span class="title">{{ title() }}</span>
          <span class="description">{{ description() }}</span>
        </div>
        <button class="close-btn" (click)="onClose()">
          <lib-lucide-icon name="x" [size]="18" color="#52526A" />
        </button>
      </div>
    }
  `,
  styles: `
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border-radius: 12px;
      padding: 16px 20px;
    }
    .toast-success {
      background: #0D2818;
      border: 1px solid #32D74B30;
    }
    .toast-warning {
      background: #2A1E08;
      border: 1px solid #FF990030;
    }
    .toast-error {
      background: #1E0808;
      border: 1px solid #FF3B3040;
    }
    .icon-circle {
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-circle-success {
      background: #32D74B20;
    }
    .icon-circle-warning {
      background: #FF990020;
    }
    .icon-circle-error {
      background: #FF3B3020;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }
    .title {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
    }
    .description {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 400;
      color: #8A8A9A;
    }
    .close-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  title = input.required<string>();
  description = input.required<string>();
  type = input.required<'success' | 'warning' | 'error'>();
  visible = input<boolean>(true);
  duration = input<number>(5000);

  closed = output<void>();

  private timerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (this.visible() && this.duration() > 0) {
        this.startTimer();
      } else {
        this.clearTimer();
      }
    });
  }

  ngOnInit(): void {
    // effect handles timer setup
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  iconColor(): string {
    switch (this.type()) {
      case 'success':
        return '#32D74B';
      case 'warning':
        return '#FF9900';
      case 'error':
        return '#FF3B30';
    }
  }

  onClose(): void {
    this.clearTimer();
    this.closed.emit();
  }

  private startTimer(): void {
    this.clearTimer();
    this.timerId = setTimeout(() => {
      this.closed.emit();
    }, this.duration());
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
