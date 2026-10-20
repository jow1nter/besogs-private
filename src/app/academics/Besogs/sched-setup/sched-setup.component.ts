import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sched-setup',
  templateUrl: './sched-setup.component.html',
  styleUrls: ['./sched-setup.component.scss']
})
export class SchedSetupComponent implements OnInit {

  @ViewChild('modalTime', { static: false }) modalTime;

  constructor(public dialog: MatDialog) { }

  storageKey = 'grade-schedule';

  departments = [
    { id: 'ELEM', name: 'Elementary', range: 'K–6', label: 'Kinder to Grade 6' },
    { id: 'JHS', name: 'Junior High School', range: '7–10', label: 'Grades 7–10' },
    { id: 'SHS', name: 'Senior High School', range: '11–12', label: 'Grades 11–12' }
  ];

  grades: any[] = [];
  activeDept = 'ELEM';

  dialogRef;
  gradeIndex = -1;
  editIndex = -1;
  start = '';
  end = '';
  error = '';

  ngOnInit() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      this.grades = JSON.parse(saved);
      return;
    }

    this.grades = [
      { badge: 'K', name: 'Kinder', dept: 'ELEM', blocks: [{ start: '08:00', end: '09:30' }, { start: '09:50', end: '11:30' }] },
      { badge: '1', name: 'Grade 1', dept: 'ELEM', blocks: [] },
      { badge: '2', name: 'Grade 2', dept: 'ELEM', blocks: [] },
      { badge: '3', name: 'Grade 3', dept: 'ELEM', blocks: [] },
      { badge: '4', name: 'Grade 4', dept: 'ELEM', blocks: [] },
      { badge: '5', name: 'Grade 5', dept: 'ELEM', blocks: [] },
      { badge: '6', name: 'Grade 6', dept: 'ELEM', blocks: [] },
      { badge: '7', name: 'Grade 7', dept: 'JHS', blocks: [{ start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' }, { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' }] },
      { badge: '8', name: 'Grade 8', dept: 'JHS', blocks: [] },
      { badge: '9', name: 'Grade 9', dept: 'JHS', blocks: [] },
      { badge: '10', name: 'Grade 10', dept: 'JHS', blocks: [] },
      { badge: '11', name: 'Grade 11', dept: 'SHS', blocks: [] },
      { badge: '12', name: 'Grade 12', dept: 'SHS', blocks: [] }
    ];
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.grades));
  }

  // ---------- display ----------
  gradesFor(dept: string) {
    return this.grades.filter(g => g.dept === dept);
  }

  setCount(dept: string) {
    return this.gradesFor(dept).filter(g => g.blocks.length > 0).length;
  }

  activeDepartment() {
    return this.departments.find(d => d.id === this.activeDept);
  }

  formatTime(time: string) {
    const parts = time.split(':').map(Number);
    const h = parts[0];
    const m = parts[1];
    return (h % 12 || 12) + ':' + (m < 10 ? '0' + m : m) + ' ' + (h < 12 ? 'AM' : 'PM');
  }

  // ---------- modal ----------
  openModalTime() {
    this.dialogRef = this.dialog.open(this.modalTime, {
      width: '500px',
      height: 'auto',
      autoFocus: false
    });
  }

  openAdd(grade: any) {
    this.gradeIndex = this.grades.indexOf(grade);
    this.editIndex = -1;
    this.start = '';
    this.end = '';
    this.error = '';
    this.openModalTime();
  }

  openEdit(grade: any, index: number) {
    this.gradeIndex = this.grades.indexOf(grade);
    this.editIndex = index;
    this.start = grade.blocks[index].start;
    this.end = grade.blocks[index].end;
    this.error = '';
    this.openModalTime();
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  // ---------- CRUD ----------
  saveTime() {
    if (!this.start || !this.end) {
      this.error = 'Enter a start and end time.';
      return;
    }
    if (this.start >= this.end) {
      this.error = 'End time must be after start time.';
      return;
    }

    const blocks = this.grades[this.gradeIndex].blocks;
    const taken = blocks.some((b: any, i: number) =>
      i !== this.editIndex && this.start < b.end && b.start < this.end
    );
    if (taken) {
      this.error = 'This time is already added or overlaps another time.';
      return;
    }

    if (this.editIndex === -1) {
      blocks.push({ start: this.start, end: this.end });
    } else {
      blocks[this.editIndex] = { start: this.start, end: this.end };
    }
    blocks.sort((a: any, b: any) => a.start.localeCompare(b.start));

    this.saveToStorage();
    this.closeModal();
  }

  removeTime(grade: any, index: number) {
    if (!confirm('Remove this time?')) return;
    grade.blocks.splice(index, 1);
    this.saveToStorage();
  }
}