import { Component, OnInit } from '@angular/core';

interface FacultyLoad {
  id: number;
  schoolYear: string;
  faculty: string;
  department: string;
  subject: string;
  section: string;
  hours: number;
}

@Component({
  selector: 'app-faculty-loads-manager',
  templateUrl: './faculty-loads-manager.component.html',
  styleUrls: ['./faculty-loads-manager.component.scss']
})
export class FacultyLoadsManagerComponent implements OnInit {
  readonly storageKey = 'besogs-faculty-loads-v1';
  readonly departments = ['Elementary', 'Junior High School', 'Senior High School'];
  loads: FacultyLoad[] = [];
  selectedYear = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);
  search = '';
  editorOpen = false;
  draft: FacultyLoad;
  pendingDelete: number = null;
  error = '';
  storageError = '';
  storageAvailable = true;

  ngOnInit() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const records = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(records) || !records.every(record => this.isValid(record)) ||
          new Set(records.map(record => record.id)).size !== records.length) {
        throw new Error('Invalid saved loads');
      }
      this.loads = records;
    } catch (error) {
      this.storageAvailable = false;
      this.storageError = 'Saved faculty loads could not be read. Changes are disabled to protect existing data.';
    }
  }

  get visibleLoads(): FacultyLoad[] {
    const query = this.search.trim().toLowerCase();
    return this.loads.filter(load => load.schoolYear === this.selectedYear.trim() &&
      [load.faculty, load.department, load.subject, load.section].join(' ').toLowerCase().includes(query));
  }

  get totalHours(): number {
    return this.visibleLoads.reduce((total, load) => total + load.hours, 0);
  }

  get facultyCount(): number {
    return new Set(this.visibleLoads.map(load => load.faculty.toLowerCase())).size;
  }

  openEditor(load?: FacultyLoad) {
    this.draft = load ? { ...load } : {
      id: this.loads.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1,
      schoolYear: this.selectedYear.trim(), faculty: '', department: this.departments[0],
      subject: '', section: '', hours: 1
    };
    this.error = '';
    this.pendingDelete = null;
    this.editorOpen = true;
  }

  save() {
    const load = { ...this.draft, schoolYear: this.draft.schoolYear.trim(),
      faculty: this.draft.faculty.trim(), subject: this.draft.subject.trim(),
      section: this.draft.section.trim() };
    if (!this.isValid(load)) {
      this.error = 'Complete all fields. Use consecutive school years (e.g. 2026-2027) and weekly hours greater than 0, up to 168.';
      return;
    }
    if (this.loads.some(item => item.id !== load.id &&
      item.schoolYear === load.schoolYear && item.department === load.department &&
      item.faculty.toLowerCase() === load.faculty.toLowerCase() &&
      item.subject.toLowerCase() === load.subject.toLowerCase() &&
      item.section.toLowerCase() === load.section.toLowerCase())) {
      this.error = 'This faculty member already has this subject and section assigned for the school year.';
      return;
    }
    const next = this.loads.some(item => item.id === load.id)
      ? this.loads.map(item => item.id === load.id ? load : item) : [...this.loads, load];
    if (this.persist(next)) {
      this.selectedYear = load.schoolYear;
      this.editorOpen = false;
    }
  }

  deleteLoad(id: number) {
    if (this.pendingDelete === id && this.persist(this.loads.filter(load => load.id !== id))) {
      this.pendingDelete = null;
      if (this.editorOpen && this.draft.id === id) { this.editorOpen = false; }
    }
  }

  private isValid(load: FacultyLoad): boolean {
    return !!load && Number.isSafeInteger(load.id) && load.id > 0 &&
      typeof load.schoolYear === 'string' && /^\d{4}-\d{4}$/.test(load.schoolYear) &&
      Number(load.schoolYear.slice(5)) === Number(load.schoolYear.slice(0, 4)) + 1 &&
      [load.faculty, load.subject, load.section].every(value => typeof value === 'string' && !!value.trim()) &&
      this.departments.includes(load.department) &&
      typeof load.hours === 'number' && Number.isFinite(load.hours) && load.hours > 0 && load.hours <= 168;
  }

  private persist(loads: FacultyLoad[]): boolean {
    if (!this.storageAvailable) { return false; }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(loads));
      this.loads = loads;
      this.storageError = '';
      return true;
    } catch (error) {
      this.storageError = 'Changes could not be saved in this browser. Please try again.';
      return false;
    }
  }
}
