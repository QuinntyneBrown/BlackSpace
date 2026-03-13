import { Component, input, output, OnDestroy, effect, OnInit } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-toast',
  imports: [LucideIconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
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
