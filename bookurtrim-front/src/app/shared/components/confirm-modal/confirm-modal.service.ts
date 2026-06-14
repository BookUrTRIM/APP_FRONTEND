import { Injectable, signal } from '@angular/core';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
  readonly isOpen  = signal(false);
  readonly config  = signal<ConfirmConfig | null>(null);

  private _resolve: ((value: boolean) => void) | null = null;

  confirm(config: ConfirmConfig): Promise<boolean> {
    this.config.set(config);
    this.isOpen.set(true);
    return new Promise(resolve => { this._resolve = resolve; });
  }

  accept(): void {
    this._resolve?.(true);
    this._close();
  }

  cancel(): void {
    this._resolve?.(false);
    this._close();
  }

  private _close(): void {
    this.isOpen.set(false);
    this._resolve = null;
  }
}
