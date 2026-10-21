import { Component, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SectionRecord {
  id: number;
  grade: string;
  name: string;
  adviser?: string;
  cluster?: string;
}

export interface SectionDialogData {
  schoolYear: string;
  gradeLevels: string[];
  sections: SectionRecord[];
  section: SectionRecord | null;
}

export interface SectionDialogResult {
  grade: string;
  sections: { name: string; adviser?: string; cluster?: string }[];
}

@Component({
  selector: 'app-section-dialog',
  templateUrl: './section-dialog.component.html',
  styleUrls: ['./section-dialog.component.scss']
})
export class SectionDialogComponent implements OnDestroy {
  selectedYear: string;
  gradeLevels: string[];
  editingId: number | null;
  sectionForm: FormGroup;
  private gradeSubscription: Subscription;

  get sectionRows(): FormArray {
    return this.sectionForm.get('sections') as FormArray;
  }

  get draftGrade(): string {
    return this.sectionForm.get('grade').value;
  }

  private requiredText(control: AbstractControl) {
    return typeof control.value === 'string' && control.value.trim() ? null : { required: true };
  }
  error = '';

  get isSeniorHigh(): boolean {
    return this.draftGrade === 'Grade 11' || this.draftGrade === 'Grade 12';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SectionDialogData,
    private dialogRef: MatDialogRef<SectionDialogComponent, SectionDialogResult>
  ) {
    this.selectedYear = data.schoolYear;
    const hasExistingAdviser = data.section && (data.section.adviser || '').trim().length > 0;
    this.gradeLevels = hasExistingAdviser
      ? data.gradeLevels.filter(grade => grade !== 'Grade 11' && grade !== 'Grade 12')
      : data.section
        ? data.gradeLevels.filter(grade => grade === 'Grade 11' || grade === 'Grade 12')
        : data.gradeLevels.slice();
    this.editingId = data.section ? data.section.id : null;
    this.sectionForm = new FormGroup({
      grade: new FormControl(data.section ? data.section.grade : 'Grade 1', [
        Validators.required,
        control => this.gradeLevels.indexOf(control.value) === -1 ? { invalidGrade: true } : null
      ]),
      sections: new FormArray([], Validators.required)
    });
    this.sectionRows.push(this.createSectionRow(data.section));
    this.updateRowValidators();
    this.gradeSubscription = this.sectionForm.get('grade').valueChanges.subscribe(() => {
      this.error = '';
      this.updateRowValidators();
    });
  }

  ngOnDestroy() {
    this.gradeSubscription.unsubscribe();
  }

  private createSectionRow(section?: SectionRecord): FormGroup {
    return new FormGroup({
      name: new FormControl(section ? section.name : '', this.requiredText),
      adviser: new FormControl(section ? section.adviser || '' : ''),
      cluster: new FormControl(section ? section.cluster || '' : '')
    });
  }

  private updateRowValidators() {
    this.sectionRows.controls.forEach(row => {
      const adviser = row.get('adviser');
      const cluster = row.get('cluster');
      adviser.setValidators(this.isSeniorHigh ? [] : [this.requiredText]);
      cluster.setValidators(this.isSeniorHigh ? [this.requiredText] : []);
      adviser.updateValueAndValidity({ emitEvent: false });
      cluster.updateValueAndValidity({ emitEvent: false });
    });
  }

  addSectionRow() {
    this.sectionRows.push(this.createSectionRow());
    this.updateRowValidators();
  }

  removeSectionRow(index: number) {
    this.sectionRows.removeAt(index);
  }

  closeSectionDialog() {
    this.dialogRef.close();
  }

  saveSection() {
    this.sectionForm.markAllAsTouched();
    if (this.sectionForm.invalid) {
      this.error = this.isSeniorHigh
        ? 'Enter a cluster and section name for every section.'
        : 'Choose a year level and enter a section name and adviser for every section.';
      return;
    }
    const rows: { name: string; adviser: string; cluster: string }[] = this.sectionRows.value;
    const names = rows.map(row => row.name.trim());
    const normalized = names.map(name => name.toLowerCase());
    const duplicate = normalized.some((name, index) => normalized.indexOf(name) !== index) ||
      this.data.sections.some(section => section.id !== this.editingId &&
        section.grade === this.draftGrade && normalized.indexOf(section.name.toLowerCase()) !== -1);
    if (duplicate) {
      this.error = 'Section names must be unique within this year level and school year.';
      return;
    }
    this.dialogRef.close({
      grade: this.draftGrade,
      sections: rows.map(row => this.isSeniorHigh
        ? { name: row.name.trim(), cluster: row.cluster.trim() }
        : { name: row.name.trim(), adviser: row.adviser.trim() })
    });
  }
}
