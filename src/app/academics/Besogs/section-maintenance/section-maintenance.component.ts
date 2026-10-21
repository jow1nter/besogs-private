import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

import { SectionDialogComponent, SectionDialogResult, SectionRecord } from './section-dialog/section-dialog.component';

@Component({
  selector: 'app-section-maintenance',
  templateUrl: './section-maintenance.component.html',
  styleUrls: ['./section-maintenance.component.scss']
})
export class SectionMaintenanceComponent implements OnDestroy {
  private dialogRef: MatDialogRef<SectionDialogComponent, SectionDialogResult>;
  constructor(private dialog: MatDialog) { }

  ngOnDestroy() {
    if (this.dialogRef) { this.dialogRef.close(); }
  }

  displayedColumns = ['grade', 'name', 'cluster', 'adviser', 'actions'];
  schoolYears = ['2026–2027', '2025–2026', '2024–2025'];
  selectedYear = this.schoolYears[0];
  gradeLevels = ['Kinder', ...Array.from({ length: 12 }, (_, index) => 'Grade ' + (index + 1))];
  sectionsByYear: { [year: string]: SectionRecord[] } = {
    '2026–2027': [
      { id: 1, grade: 'Grade 1', name: 'St. Anne', adviser: 'Maria Santos' },
      { id: 2, grade: 'Grade 1', name: 'St. Clare', adviser: 'Jose Reyes' },
      { id: 3, grade: 'Grade 2', name: 'St. Francis', adviser: 'Ana Cruz' },
      { id: 10, grade: 'Grade 11', name: 'Set 1', cluster: 'STEM' },
      { id: 11, grade: 'Grade 12', name: 'Set 2', cluster: 'ABM' }
    ],
    '2025–2026': [
      { id: 4, grade: 'Grade 1', name: 'St. Anne', adviser: 'Maria Santos' },
      { id: 5, grade: 'Grade 1', name: 'St. Clare', adviser: 'Carlo Garcia' },
      { id: 6, grade: 'Grade 2', name: 'St. Francis', adviser: 'Ana Cruz' },
      { id: 7, grade: 'Grade 2', name: 'St. Joseph', adviser: 'Elena Ramos' },
      { id: 12, grade: 'Grade 11', name: 'Set 1', cluster: 'HUMSS' },
      { id: 13, grade: 'Grade 12', name: 'Set 2', cluster: 'STEM' }
    ],
    '2024–2025': [
      { id: 8, grade: 'Kinder', name: 'St. Gabriel', adviser: 'Sofia Mendoza' },
      { id: 9, grade: 'Grade 1', name: 'St. Anne', adviser: 'Jose Reyes' },
      { id: 14, grade: 'Grade 11', name: 'Set 1', cluster: 'ABM' },
      { id: 15, grade: 'Grade 12', name: 'Set 2', cluster: 'HUMSS' }
    ]
  };
  yearEditorOpen = false;
  draftStartYear: number = 2027;
  pendingDelete: SectionRecord | null = null;
  error = '';
  message = '';
  private nextId = 16;

  get sections(): SectionRecord[] {
    return this.sectionsByYear[this.selectedYear];
  }

  changeYear() {
    this.closePanel();
    this.message = '';
  }

  openYearEditor() {
    this.closePanel();
    this.message = '';
    this.draftStartYear = Math.max(...this.schoolYears.map(year => Number(year.slice(0, 4)))) + 1;
    this.yearEditorOpen = true;
  }

  selectYear(year: string) {
    this.selectedYear = year;
    this.changeYear();
  }

  onYearSelection(year: string, select: MatSelect) {
    if (year === 'add-new') {
      select.value = this.selectedYear;
      this.openYearEditor();
      return;
    }
    this.selectYear(year);
  }

  saveSchoolYear() {
    const start = Number(this.draftStartYear);
    if (!Number.isInteger(start) || start < 2000 || start > 2100) {
      this.error = 'Enter a starting year from 2000 to 2100.';
      return;
    }
    const year = start + '–' + (start + 1);
    if (this.schoolYears.indexOf(year) !== -1) {
      this.error = 'This school year already exists.';
      return;
    }
    this.sectionsByYear[year] = [];
    this.schoolYears = [...this.schoolYears, year].sort().reverse();
    this.selectedYear = year;
    this.closePanel();
    this.message = 'School year ' + year + ' created. You can now add sections.';
  }

  openEditor(section?: SectionRecord) {
    this.closePanel();
    this.message = '';
    const year = this.selectedYear;
    const editingId = section ? section.id : null;
    this.dialogRef = this.dialog.open<SectionDialogComponent, any, SectionDialogResult>(SectionDialogComponent, {
      width: '680px', maxWidth: 'calc(100vw - 32px)',
      panelClass: 'bes-section-dialog', ariaLabelledBy: 'section-dialog-title',
      data: {
        schoolYear: year, gradeLevels: this.gradeLevels.slice(),
        sections: this.sections.map(item => ({ ...item })),
        section: section ? { ...section } : null
      }
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
      if (!result) { return; }
      if (editingId === null) {
        this.sectionsByYear[year] = [...this.sectionsByYear[year],
          ...result.sections.map(section => ({ id: this.nextId++, grade: result.grade, ...section }))];
      } else {
        this.sectionsByYear[year] = this.sectionsByYear[year].map(item =>
          item.id === editingId ? { id: item.id, grade: result.grade, ...result.sections[0] } : item);
      }
      this.message = 'Sections saved for ' + year + '.';
    });
  }

  closePanel() {
    this.yearEditorOpen = false;
    this.pendingDelete = null;
    this.error = '';
  }

  requestDelete(section: SectionRecord) {
    this.closePanel();
    this.message = '';
    this.pendingDelete = section;
  }

  deleteSection() {
    if (!this.pendingDelete) {
      return;
    }
    const id = this.pendingDelete.id;
    this.sectionsByYear[this.selectedYear] = this.sections.filter(section => section.id !== id);
    this.closePanel();
    this.message = 'Section deleted from ' + this.selectedYear + '.';
  }

  trackSection(index: number, section: SectionRecord): number {
    return section.id;
  }
}
