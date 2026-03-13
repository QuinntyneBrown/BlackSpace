import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import {
  AdminMemberService,
  MemberService,
  MemberResponse,
  AdminContentService,
  ValidationErrorResponse,
  UpdateMemberRequest,
  CreateMemberRequest,
} from 'api';

export interface MemberEditDialogData {
  mode: 'create' | 'edit';
  member?: MemberResponse;
}

@Component({
  selector: 'lib-member-edit-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './member-edit-dialog.component.html',
  styleUrl: './member-edit-dialog.component.scss',
})
export class MemberEditDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MemberEditDialogComponent>);
  readonly dialogData: MemberEditDialogData = inject(MAT_DIALOG_DATA);
  private readonly adminMemberService = inject(AdminMemberService);
  private readonly memberService = inject(MemberService);
  private readonly adminContentService = inject(AdminContentService);

  readonly referralSources = signal<string[]>([]);
  readonly saving = signal(false);
  readonly fieldErrors = signal<Record<string, string>>({});

  readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    roleTitle: new FormControl('', { nonNullable: true }),
    organization: new FormControl('', { nonNullable: true }),
    referralSource: new FormControl('', { nonNullable: true }),
  });

  get title(): string {
    return this.dialogData.mode === 'edit' ? 'Edit Member' : 'Add Member';
  }

  ngOnInit(): void {
    if (this.dialogData.member) {
      this.form.patchValue({
        fullName: this.dialogData.member.fullName,
        email: this.dialogData.member.email,
        roleTitle: this.dialogData.member.roleTitle ?? '',
        organization: this.dialogData.member.organization ?? '',
      });
    }

    this.adminContentService.getReferralSources().subscribe({
      next: (response) => this.referralSources.set(response.sources),
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.fieldErrors.set({});

    const formValue = this.form.getRawValue();

    if (this.dialogData.mode === 'edit' && this.dialogData.member) {
      const request: UpdateMemberRequest = {
        fullName: formValue.fullName,
        email: formValue.email,
        ...(formValue.roleTitle ? { roleTitle: formValue.roleTitle } : {}),
        ...(formValue.organization ? { organization: formValue.organization } : {}),
        ...(formValue.referralSource ? { referralSource: formValue.referralSource } : {}),
      };

      this.adminMemberService
        .updateMember(this.dialogData.member.id, request)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (member) => this.dialogRef.close(member),
          error: (err: HttpErrorResponse) => this.handleError(err),
        });
    } else {
      const request: CreateMemberRequest = {
        fullName: formValue.fullName,
        email: formValue.email,
        ...(formValue.roleTitle ? { roleTitle: formValue.roleTitle } : {}),
        ...(formValue.organization ? { organization: formValue.organization } : {}),
        ...(formValue.referralSource ? { referralSource: formValue.referralSource } : {}),
      };

      this.memberService
        .createMember(request)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (member) => this.dialogRef.close(member),
          error: (err: HttpErrorResponse) => this.handleError(err),
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  fieldError(field: string): string {
    return this.fieldErrors()[field] ?? '';
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 422) {
      const body = err.error as ValidationErrorResponse;
      const errors: Record<string, string> = {};
      if (body.errors) {
        for (const [key, messages] of Object.entries(body.errors)) {
          errors[key] = messages[0];
        }
      }
      this.fieldErrors.set(errors);
    }
  }
}
