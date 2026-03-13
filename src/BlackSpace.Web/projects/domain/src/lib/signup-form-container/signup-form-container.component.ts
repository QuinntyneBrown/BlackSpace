import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import {
  FormInputComponent,
  ButtonPrimaryComponent,
  SuccessStateComponent,
  AlertBannerComponent,
  ToastComponent,
} from 'components';
import {
  MemberService,
  ContentService,
  CreateMemberRequest,
  ValidationErrorResponse,
} from 'api';

@Component({
  selector: 'lib-signup-form-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonPrimaryComponent,
    SuccessStateComponent,
    AlertBannerComponent,
    ToastComponent,
  ],
  templateUrl: './signup-form-container.component.html',
  styleUrl: './signup-form-container.component.scss',
})
export class SignupFormContainerComponent implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly contentService = inject(ContentService);

  readonly formState = signal<'form' | 'success'>('form');
  readonly isLoading = signal(false);
  readonly referralSources = signal<string[]>([]);
  readonly alertMessage = signal('');
  readonly fieldErrors = signal<Record<string, string>>({});

  readonly toastVisible = signal(false);
  readonly toastTitle = signal('');
  readonly toastDescription = signal('');
  readonly toastType = signal<'success' | 'warning' | 'error'>('error');

  readonly signupForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    roleTitle: new FormControl('', { nonNullable: true }),
    organization: new FormControl('', { nonNullable: true }),
    referralSource: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.contentService.getReferralSources().subscribe({
      next: (sources) => this.referralSources.set(sources),
    });
  }

  fieldError(field: string): string {
    return this.fieldErrors()[field] ?? '';
  }

  onSubmit(): void {
    if (this.signupForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.alertMessage.set('');
    this.fieldErrors.set({});

    const formValue = this.signupForm.getRawValue();
    const request: CreateMemberRequest = {
      fullName: formValue.fullName,
      email: formValue.email,
      ...(formValue.roleTitle ? { roleTitle: formValue.roleTitle } : {}),
      ...(formValue.organization ? { organization: formValue.organization } : {}),
      ...(formValue.referralSource ? { referralSource: formValue.referralSource } : {}),
    };

    this.memberService
      .createMember(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.formState.set('success');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.alertMessage.set('This email is already registered in our community.');
            this.showToast('Already Registered', 'This email is already part of the community.', 'warning');
          } else if (err.status === 422) {
            const body = err.error as ValidationErrorResponse;
            const errors: Record<string, string> = {};
            if (body.errors) {
              for (const [key, messages] of Object.entries(body.errors)) {
                errors[key] = messages[0];
              }
            }
            this.fieldErrors.set(errors);
          } else {
            this.showToast('Network Error', 'Something went wrong. Please try again later.', 'error');
          }
        },
      });
  }

  onToastClosed(): void {
    this.toastVisible.set(false);
  }

  private showToast(title: string, description: string, type: 'success' | 'warning' | 'error'): void {
    this.toastTitle.set(title);
    this.toastDescription.set(description);
    this.toastType.set(type);
    this.toastVisible.set(true);
  }
}
