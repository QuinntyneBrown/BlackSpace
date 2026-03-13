import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

import {
  AdminDataTableComponent,
  AdminSearchBarComponent,
  AdminConfirmDialogComponent,
  AdminSnackbarService,
} from 'components';
import type { ColumnConfig, RowActionEvent, AdminConfirmDialogData } from 'components';
import { AdminMemberService, MemberResponse, MemberListParams } from 'api';

import { MemberEditDialogComponent } from '../member-edit-dialog/member-edit-dialog.component';
import type { MemberEditDialogData } from '../member-edit-dialog/member-edit-dialog.component';

@Component({
  selector: 'lib-member-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AdminDataTableComponent,
    AdminSearchBarComponent,
  ],
  templateUrl: './member-list-page.component.html',
  styleUrl: './member-list-page.component.scss',
})
export class MemberListPageComponent implements OnInit {
  private readonly adminMemberService = inject(AdminMemberService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(AdminSnackbarService);

  readonly columns: ColumnConfig[] = [
    { name: 'fullName', label: 'Name', sortable: true },
    { name: 'email', label: 'Email', sortable: true },
    { name: 'roleTitle', label: 'Role', sortable: false },
    { name: 'organization', label: 'Organization', sortable: true },
    { name: 'referralSource', label: 'Source', sortable: false },
    { name: 'createdAtUtc', label: 'Joined', sortable: true },
  ];

  readonly members = signal<Record<string, unknown>[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);

  private currentParams: MemberListParams = {
    page: 1,
    pageSize: 10,
  };

  ngOnInit(): void {
    this.loadMembers();
  }

  onSearchChange(search: string): void {
    this.currentParams = { ...this.currentParams, search, page: 1 };
    this.loadMembers();
  }

  onSortChange(sort: Sort): void {
    this.currentParams = {
      ...this.currentParams,
      sortBy: sort.active,
      sortDirection: sort.direction as 'asc' | 'desc' || undefined,
      page: 1,
    };
    this.loadMembers();
  }

  onPageChange(event: PageEvent): void {
    this.currentParams = {
      ...this.currentParams,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    };
    this.loadMembers();
  }

  onRowAction(event: RowActionEvent): void {
    const member = event.row as MemberResponse;
    if (event.action === 'edit') {
      this.openEditDialog(member);
    } else if (event.action === 'delete') {
      this.openDeleteConfirm(member);
    }
  }

  openEditDialog(member?: MemberResponse): void {
    const data: MemberEditDialogData = member
      ? { mode: 'edit', member }
      : { mode: 'create' };

    const dialogRef = this.dialog.open(MemberEditDialogComponent, {
      data,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackbar.showSuccess('Member saved successfully');
        this.loadMembers();
      }
    });
  }

  private openDeleteConfirm(member: MemberResponse): void {
    const data: AdminConfirmDialogData = {
      title: 'Delete Member',
      message: `Are you sure you want to delete ${member.fullName}?`,
      confirmLabel: 'Delete',
      confirmColor: 'warn',
    };

    const dialogRef = this.dialog.open(AdminConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.adminMemberService.deleteMember(member.id).subscribe({
          next: () => {
            this.snackbar.showSuccess('Member deleted successfully');
            this.loadMembers();
          },
          error: () => {
            this.snackbar.showError('Failed to delete member');
          },
        });
      }
    });
  }

  loadMembers(): void {
    this.loading.set(true);
    this.adminMemberService.listMembers(this.currentParams).subscribe({
      next: (response) => {
        this.members.set(response.items as unknown as Record<string, unknown>[]);
        this.totalCount.set(response.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.snackbar.showError('Failed to load members');
        this.loading.set(false);
      },
    });
  }
}
