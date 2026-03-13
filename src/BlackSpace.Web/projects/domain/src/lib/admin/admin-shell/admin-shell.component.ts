import { Component, signal, ChangeDetectionStrategy, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

export interface AdminNavLink {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'lib-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent implements OnInit, OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private subscription?: Subscription;

  readonly navLinks: AdminNavLink[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Members', route: '/admin/members', icon: 'group' },
    { label: 'Content', route: '/admin/content', icon: 'article' },
  ];

  readonly sidenavMode = signal<'side' | 'over'>('side');
  readonly sidenavOpened = signal(true);

  ngOnInit(): void {
    this.subscription = this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.sidenavMode.set('side');
          this.sidenavOpened.set(true);
        } else {
          this.sidenavMode.set('over');
          this.sidenavOpened.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  onSidenavClosed(): void {
    this.sidenavOpened.set(false);
  }
}
