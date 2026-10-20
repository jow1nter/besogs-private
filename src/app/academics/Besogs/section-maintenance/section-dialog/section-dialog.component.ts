import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SectionRecord {
  id: number;
  grade: string;
  name: string;
  adviser?: string;
}

export interface SectionDialogData {
  schoolYear: string;
  gradeLevels: string[];
  sections: SectionRecord[];
  section: SectionRecord | null;
}

export interface SectionDialogResult {
  grade: string;
  sections: { name: string; adviser: string }[];
}

@Component({
  selector: 'app-section-dialog',
  templateUrl: './section-dialog.component.html',
  styleUrls: ['./section-dialog.component.scss']
})
export class SectionDialogComponent {
  selectedYear: string;
  gradeLevels: string[];
  editingId: number | null;
  draftGrade: string;
  draftSections: { name: string; adviser: string }[];
  error = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SectionDialogData,
    private dialogRef: MatDialogRef<SectionDialogComponent, SectionDialogResult>
  ) {
    this.selectedYear = data.schoolYear;
    this.gradeLevels = data.gradeLevels;
    this.editingId = data.section ? data.section.id : null;
    this.draftGrade = data.section ? data.section.grade : 'Grade 1';
    this.draftSections = [{
      name: data.section ? data.section.name : '',
      adviser: data.section ? data.section.adviser || '' : ''
    }];
  }

  addSectionRow() {
    this.draftSections.push({ name: '', adviser: '' });
  }

  removeSectionRow(index: number) {
    this.draftSections.splice(index, 1);
  }

  closeSectionDialog() {
    this.dialogRef.close();
  }

  saveSection() {
    const names = this.draftSections.map(row => row.name.trim());
    if (!names.length || names.some(name => !name) || this.gradeLevels.indexOf(this.draftGrade) === -1) {
      this.error = 'Choose a year level and enter a name for every section.';
      return;
    }
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
      sections: this.draftSections.map(row => ({ name: row.name.trim(), adviser: row.adviser.trim() }))
    });
  }
}
