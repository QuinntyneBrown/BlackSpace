import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ColumnConfig {
  name: string;
  label: string;
  sortable?: boolean;
}

export interface RowActionEvent {
  action: 'edit' | 'delete';
  row: unknown;
}

@Component({
  selector: 'lib-admin-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './admin-data-table.component.html',
  styleUrl: './admin-data-table.component.scss',
})
export class AdminDataTableComponent {
  columns = input.required<ColumnConfig[]>();
  data = input.required<Record<string, unknown>[]>();
  totalCount = input<number>(0);
  pageSizeOptions = input<number[]>([5, 10, 25]);
  loading = input<boolean>(false);

  sortChange = output<Sort>();
  pageChange = output<PageEvent>();
  rowAction = output<RowActionEvent>();

  get displayedColumns(): string[] {
    return [...this.columns().map((c) => c.name), 'actions'];
  }

  onSortChange(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onEdit(row: Record<string, unknown>): void {
    this.rowAction.emit({ action: 'edit', row });
  }

  onDelete(row: Record<string, unknown>): void {
    this.rowAction.emit({ action: 'delete', row });
  }
}
