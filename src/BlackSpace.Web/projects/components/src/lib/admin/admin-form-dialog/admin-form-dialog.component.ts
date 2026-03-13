import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface AdminFormDialogData {
  title: string;
  fields: FormFieldConfig[];
  initialValues?: Record<string, unknown>;
}

@Component({
  selector: 'lib-admin-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './admin-form-dialog.component.html',
  styleUrl: './admin-form-dialog.component.scss',
})
export class AdminFormDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AdminFormDialogComponent>);
  readonly dialogData: AdminFormDialogData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;

  ngOnInit(): void {
    const controls: Record<string, FormControl> = {};
    for (const field of this.dialogData.fields) {
      const initialValue = this.dialogData.initialValues?.[field.name] ?? '';
      const validators = field.required ? [Validators.required] : [];
      controls[field.name] = new FormControl(initialValue, validators);
    }
    this.form = new FormGroup(controls);
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }
}
