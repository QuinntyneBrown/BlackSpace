import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { AdminSnackbarService } from 'components';
import { AdminContentService } from 'api';

@Component({
  selector: 'lib-content-management-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './content-management-page.component.html',
  styleUrl: './content-management-page.component.scss',
})
export class ContentManagementPageComponent implements OnInit {
  private readonly adminContentService = inject(AdminContentService);
  private readonly snackbar = inject(AdminSnackbarService);

  readonly meetupDate = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly meetupTime = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly savingMeetup = signal(false);

  readonly referralSources = signal<string[]>([]);
  readonly newSource = new FormControl('', { nonNullable: true });
  readonly savingSources = signal(false);

  ngOnInit(): void {
    this.loadMeetupDate();
    this.loadReferralSources();
  }

  saveMeetupDate(): void {
    if (this.meetupDate.invalid || this.meetupTime.invalid) {
      return;
    }

    this.savingMeetup.set(true);
    const dateValue = this.meetupDate.value;
    const timeValue = this.meetupTime.value;
    const combined = `${dateValue}T${timeValue}:00`;

    this.adminContentService.updateNextMeetupDate({ nextMeetupDate: combined }).subscribe({
      next: () => {
        this.snackbar.showSuccess('Meetup date updated successfully');
        this.savingMeetup.set(false);
      },
      error: () => {
        this.snackbar.showError('Failed to update meetup date');
        this.savingMeetup.set(false);
      },
    });
  }

  addSource(): void {
    const value = this.newSource.value.trim();
    if (value && !this.referralSources().includes(value)) {
      this.referralSources.set([...this.referralSources(), value]);
      this.newSource.reset();
    }
  }

  removeSource(source: string): void {
    this.referralSources.set(this.referralSources().filter((s) => s !== source));
  }

  saveReferralSources(): void {
    this.savingSources.set(true);
    this.adminContentService.updateReferralSources({ sources: this.referralSources() }).subscribe({
      next: () => {
        this.snackbar.showSuccess('Referral sources updated successfully');
        this.savingSources.set(false);
      },
      error: () => {
        this.snackbar.showError('Failed to update referral sources');
        this.savingSources.set(false);
      },
    });
  }

  private loadMeetupDate(): void {
    this.adminContentService.getNextMeetupDate().subscribe({
      next: (response) => {
        if (response.nextMeetupDate) {
          const dt = new Date(response.nextMeetupDate);
          const dateStr = dt.toISOString().split('T')[0];
          const hours = dt.getHours().toString().padStart(2, '0');
          const minutes = dt.getMinutes().toString().padStart(2, '0');
          this.meetupDate.setValue(dateStr);
          this.meetupTime.setValue(`${hours}:${minutes}`);
        }
      },
    });
  }

  private loadReferralSources(): void {
    this.adminContentService.getReferralSources().subscribe({
      next: (response) => this.referralSources.set(response.sources),
    });
  }
}
