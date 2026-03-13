import { Component, input, output, signal, OnInit, OnDestroy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-admin-search-bar',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './admin-search-bar.component.html',
  styleUrl: './admin-search-bar.component.scss',
})
export class AdminSearchBarComponent implements OnInit, OnDestroy {
  placeholder = input<string>('Search...');
  searchChange = output<string>();

  searchValue = signal('');
  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((value) => this.searchChange.emit(value));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.searchSubject.complete();
  }

  onInput(value: string): void {
    this.searchValue.set(value);
    this.searchSubject.next(value);
  }

  onClear(): void {
    this.searchValue.set('');
    this.searchSubject.next('');
  }
}
