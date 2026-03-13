import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { AdminStatCardComponent, AdminDataTableComponent, AdminSnackbarService } from 'components';
import type { ColumnConfig } from 'components';
import { AdminMemberService, AdminContentService, MemberResponse } from 'api';

import { MemberEditDialogComponent } from '../member-edit-dialog/member-edit-dialog.component';
import type { MemberEditDialogData } from '../member-edit-dialog/member-edit-dialog.component';

@Component({
  selector: 'lib-admin-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    AdminStatCardComponent,
    AdminDataTableComponent,
  ],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly adminMemberService = inject(AdminMemberService);
  private readonly adminContentService = inject(AdminContentService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly snackbar = inject(AdminSnackbarService);

  readonly totalMembers = signal('0');
  readonly newThisMonth = signal('0');
  readonly nextMeetupDate = signal('--');
  readonly activeReferralSources = signal('0');

  readonly recentMembers = signal<Record<string, unknown>[]>([]);
  readonly recentMembersTotal = signal(0);
  readonly loadingRecent = signal(false);

  readonly recentColumns: ColumnConfig[] = [
    { name: 'fullName', label: 'Name', sortable: false },
    { name: 'email', label: 'Email', sortable: false },
    { name: 'createdAtUtc', label: 'Joined', sortable: false },
  ];

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentMembers();
  }

  openAddMember(): void {
    const data: MemberEditDialogData = { mode: 'create' };
    const dialogRef = this.dialog.open(MemberEditDialogComponent, {
      data,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackbar.showSuccess('Member added successfully');
        this.loadStats();
        this.loadRecentMembers();
      }
    });
  }

  navigateToContent(): void {
    this.router.navigate(['/admin/content']);
  }

  private loadStats(): void {
    this.adminMemberService.listMembers({ page: 1, pageSize: 1 }).subscribe({
      next: (response) => {
        this.totalMembers.set(response.totalCount.toString());

        // Calculate new this month from the full list
        this.adminMemberService.listMembers({ page: 1, pageSize: response.totalCount }).subscribe({
          next: (allResponse) => {
            const now = new Date();
            const thisMonth = allResponse.items.filter((m: MemberResponse) => {
              const created = new Date(m.createdAtUtc);
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            });
            this.newThisMonth.set(thisMonth.length.toString());
          },
        });
      },
    });

    this.adminContentService.getNextMeetupDate().subscribe({
      next: (response) => {
        if (response.nextMeetupDate) {
          const dt = new Date(response.nextMeetupDate);
          this.nextMeetupDate.set(dt.toLocaleDateString());
        }
      },
    });

    this.adminContentService.getReferralSources().subscribe({
      next: (response) => {
        this.activeReferralSources.set(response.sources.length.toString());
      },
    });
  }

  private loadRecentMembers(): void {
    this.loadingRecent.set(true);
    this.adminMemberService.listMembers({ page: 1, pageSize: 5, sortBy: 'createdAtUtc', sortDirection: 'desc' }).subscribe({
      next: (response) => {
        this.recentMembers.set(response.items as unknown as Record<string, unknown>[]);
        this.recentMembersTotal.set(response.totalCount);
        this.loadingRecent.set(false);
      },
      error: () => {
        this.loadingRecent.set(false);
      },
    });
  }
}
