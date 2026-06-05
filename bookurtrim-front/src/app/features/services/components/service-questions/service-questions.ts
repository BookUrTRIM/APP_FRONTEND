import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceQuestionService } from '../../services/service-question.service';
import { ConfirmModalService } from '../../../../core/services/confirm-modal.service';
import type { ServiceQuestionModel } from '../../models';

@Component({
  selector: 'app-service-questions',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './service-questions.html',
})
export class ServiceQuestionsComponent implements OnInit {
  private readonly fb              = inject(FormBuilder);
  private readonly questionService = inject(ServiceQuestionService);
  private readonly confirmModal    = inject(ConfirmModalService);

  readonly serviceId    = input.required<number>();
  readonly questions    = this.questionService.questions;
  readonly isLoading    = signal(false);
  readonly errorMessage = signal('');
  readonly editingId    = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    question: ['', Validators.required],
    options:  this.fb.array<ReturnType<typeof this.newOptionGroup>>([]),
  });

  get optionsArray(): FormArray { return this.form.get('options') as FormArray; }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.questionService.loadByService(this.serviceId()).subscribe({
      next: () => this.isLoading.set(false),
      error: () => { this.isLoading.set(false); this.errorMessage.set('Impossible de charger les questions.'); },
    });
    this.addOption();
  }

  newOptionGroup() {
    return this.fb.nonNullable.group({
      label:        ['', Validators.required],
      extra_minutes: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addOption(): void { this.optionsArray.push(this.newOptionGroup()); }

  removeOption(i: number): void {
    if (this.optionsArray.length > 1) this.optionsArray.removeAt(i);
  }

  startEdit(q: ServiceQuestionModel): void {
    this.editingId.set(q.id);
    this.form.setControl('options', this.fb.array(
      q.options.map(o => this.fb.nonNullable.group({
        label:         [o.label,        Validators.required],
        extra_minutes: [o.extraMinutes, [Validators.required, Validators.min(0)]],
      }))
    ));
    this.form.patchValue({ question: q.question });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ question: '' });
    this.optionsArray.clear();
    this.addOption();
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const dto = { question: raw.question, options: raw.options };
    this.isLoading.set(true);
    this.errorMessage.set('');

    const id = this.editingId();
    const req$ = id
      ? this.questionService.update(id, dto)
      : this.questionService.create(this.serviceId(), dto);

    req$.subscribe({
      next: () => { this.isLoading.set(false); this.cancelEdit(); },
      error: () => { this.isLoading.set(false); this.errorMessage.set('Erreur lors de la sauvegarde.'); },
    });
  }

  async delete(id: number): Promise<void> {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer la question',
      message: 'Cette question sera définitivement supprimée.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'danger',
    });
    if (!confirmed) return;
    this.questionService.delete(id).subscribe({
      error: () => this.errorMessage.set('Erreur lors de la suppression.'),
    });
  }
}
