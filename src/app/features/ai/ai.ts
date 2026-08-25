import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiAssistantService } from './ai.service';
import { AiAnswer } from './ai.models';

@Component({
  selector: 'app-ai',
  imports: [FormsModule],
  templateUrl: './ai.html',
  styleUrl: './ai.css',
})
export class Ai {
  question = '';
  readonly loading = signal(false);
  readonly result = signal<AiAnswer | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor(private readonly aiService: AiAssistantService) {}

  ask(): void {
    if (!this.question.trim() || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.aiService.ask(this.question).subscribe({
      next: (answer) => {
        this.result.set(answer);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not reach the assistant. Try again.');
        this.loading.set(false);
      },
    });
  }
}
