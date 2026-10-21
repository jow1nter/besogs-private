import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

interface Employee {
  id: string;
  name: string;
  department: string;
}

interface TeachingLoad {
  subjectId: string;
  subjectTitle: string;
  section: string;
  unitsHours: number;
}

@Component({
  selector: 'app-assign-loads',
  templateUrl: './assign-loads.component.html',
  styleUrls: ['./assign-loads.component.scss']
})
export class AssignLoadsComponent implements OnDestroy {
  private addPanelRef: MatDialogRef<any>;
  selectedSubjects: TeachingLoad[] = [];

  constructor(private dialog: MatDialog) { }

  openAddPanel(template: TemplateRef<any>): void {
    if (!this.selectedEmployee || this.addPanelRef) { return; }
    this.selectedSubjects = [];
    this.addPanelRef = this.dialog.open(template, {
      width: '420px', maxWidth: '100vw', height: '100%', maxHeight: '100vh',
      position: { top: '0', right: '0' },
      panelClass: 'faculty-load-drawer',
      ariaLabelledBy: 'add-load-heading', autoFocus: true, restoreFocus: true
    });
    const panelRef = this.addPanelRef;
    panelRef.beforeClosed().subscribe(() => panelRef.addPanelClass('faculty-load-drawer-closing'));
    panelRef.afterClosed().subscribe(() => this.addPanelRef = null);
  }

  closeAddPanel(): void {
    if (this.addPanelRef) { this.addPanelRef.close(); }
  }

  get canAddLoad(): boolean {
    return this.selectedSubjects.length > 0;
  }

  toggleSubject(subject: TeachingLoad, checked: boolean): void {
    this.selectedSubjects = this.selectedSubjects.filter(item => item !== subject);
    if (checked) { this.selectedSubjects.push(subject); }
  }

  addLoad(): void {
    if (!this.selectedEmployee || !this.canAddLoad) { return; }
    const id = this.selectedEmployee.id;
    const additions = this.availableSubjects.filter(subject => this.selectedSubjects.indexOf(subject) !== -1);
    this.loadsByEmployee[id] = [...(this.loadsByEmployee[id] || []), ...additions.map(subject => ({ ...subject }))];
    this.closeAddPanel();
  }

  deleteLoad(load: TeachingLoad): void {
    if (!this.selectedEmployee) { return; }
    this.loadsByEmployee[this.selectedEmployee.id] = this.employeeLoads.filter(item => item !== load);
  }

  ngOnDestroy(): void { this.closeAddPanel(); }
  readonly employees: Employee[] = [
    { id: 'EMP-001', name: 'Maria Santos', department: 'Elementary' },
    { id: 'EMP-002', name: 'Juan Dela Cruz', department: 'Junior High School' },
    { id: 'EMP-003', name: 'Ana Reyes', department: 'Senior High School' },
    { id: 'EMP-004', name: 'Jose Garcia', department: 'Elementary' },
    { id: 'EMP-005', name: 'Patricia Mendoza', department: 'Junior High School' },
    { id: 'EMP-006', name: 'Mark Villanueva', department: 'Senior High School' }
  ];

  employeeQuery: string | Employee = '';
  selectedEmployee: Employee = null;

  readonly loadsByEmployee: { [employeeId: string]: TeachingLoad[] } = {
    'EMP-001': [
      { subjectId: 'ENG-101', subjectTitle: 'English 1', section: 'Grade 1 - Rose', unitsHours: 5 },
      { subjectId: 'ENG-102', subjectTitle: 'English 2', section: 'Grade 2 - Lily', unitsHours: 5 },
      { subjectId: 'READ-101', subjectTitle: 'Reading and Literacy', section: 'Grade 1 - Rose', unitsHours: 3 }
    ],
    'EMP-002': [
      { subjectId: 'MATH-701', subjectTitle: 'Mathematics 7', section: 'Grade 7 - St. Matthew', unitsHours: 4 },
      { subjectId: 'MATH-801', subjectTitle: 'Mathematics 8', section: 'Grade 8 - St. Mark', unitsHours: 4 },
      { subjectId: 'MATH-901', subjectTitle: 'Mathematics 9', section: 'Grade 9 - St. Luke', unitsHours: 4 }
    ],
    'EMP-003': [
      { subjectId: 'SHS-GM', subjectTitle: 'General Mathematics', section: 'Grade 11 - STEM A', unitsHours: 3 },
      { subjectId: 'SHS-STAT', subjectTitle: 'Statistics and Probability', section: 'Grade 11 - ABM A', unitsHours: 3 },
      { subjectId: 'SHS-PC', subjectTitle: 'Pre-Calculus', section: 'Grade 11 - STEM A', unitsHours: 3 },
      { subjectId: 'SHS-BC', subjectTitle: 'Basic Calculus', section: 'Grade 12 - STEM A', unitsHours: 3 }
    ],
    'EMP-004': [
      { subjectId: 'SCI-401', subjectTitle: 'Science 4', section: 'Grade 4 - Jasmine', unitsHours: 4 },
      { subjectId: 'SCI-501', subjectTitle: 'Science 5', section: 'Grade 5 - Orchid', unitsHours: 4 }
    ],
    'EMP-005': [
      { subjectId: 'FIL-701', subjectTitle: 'Filipino 7', section: 'Grade 7 - St. Matthew', unitsHours: 4 },
      { subjectId: 'FIL-801', subjectTitle: 'Filipino 8', section: 'Grade 8 - St. Mark', unitsHours: 4 },
      { subjectId: 'FIL-901', subjectTitle: 'Filipino 9', section: 'Grade 9 - St. Luke', unitsHours: 4 }
    ],
    'EMP-006': [
      { subjectId: 'SHS-OC', subjectTitle: 'Oral Communication', section: 'Grade 11 - HUMSS A', unitsHours: 3 },
      { subjectId: 'SHS-RW', subjectTitle: 'Reading and Writing', section: 'Grade 11 - ABM A', unitsHours: 3 },
      { subjectId: 'SHS-LIT', subjectTitle: '21st Century Literature', section: 'Grade 12 - HUMSS A', unitsHours: 3 }
    ]
  };

  readonly subjectCatalog = this.employees.map(employee => ({
    department: employee.department,
    subjects: this.loadsByEmployee[employee.id].map(load => ({ ...load }))
  }));

  get availableSubjects(): TeachingLoad[] {
    if (!this.selectedEmployee) { return []; }
    return this.subjectCatalog
      .filter(group => group.department === this.selectedEmployee.department)
      .reduce((subjects, group) => subjects.concat(group.subjects), [] as TeachingLoad[])
      .filter(subject => !this.employeeLoads.some(load =>
        load.subjectId === subject.subjectId && load.section === subject.section));
  }

  get employeeLoads(): TeachingLoad[] {
    return this.selectedEmployee ? this.loadsByEmployee[this.selectedEmployee.id] || [] : [];
  }

  get totalUnitsHours(): number {
    return this.employeeLoads.reduce((total, load) => total + load.unitsHours, 0);
  }

  get employeeProfile() {
    if (!this.selectedEmployee) { return null; }
    const employee = this.selectedEmployee;
    const index = this.employees.indexOf(employee);
    return {
      email: employee.name.toLowerCase().replace(/\s+/g, '.') + '@example.com',
      phone: '+63 917 000 ' + ('000' + (index + 1)).slice(-4),
      address: (12 + index) + ' Sample Street, Tuguegarao City',
      joined: ['June 15, 2020', 'August 2, 2021', 'June 6, 2019', 'July 12, 2022', 'June 3, 2020', 'August 7, 2023'][index],
      position: 'Faculty Member',
      employment: 'Full-time',
      office: 'Faculty Room ' + (201 + index)
    };
  }

  get filteredEmployees(): Employee[] {
    const query = typeof this.employeeQuery === 'string' ? this.employeeQuery : this.employeeQuery.name;
    const terms = query.trim().toLowerCase().split(/\s+/);
    return this.employees.filter(employee =>
      terms.every(term => (employee.name + ' ' + employee.id).toLowerCase().includes(term)));
  }

  displayEmployee(employee: Employee): string {
    return employee ? employee.name : '';
  }

  onQueryChange(value: string | Employee): void {
    this.employeeQuery = value;
    this.selectedEmployee = typeof value === 'string' ? null : value;
  }

  clearEmployee(): void {
    this.employeeQuery = '';
    this.selectedEmployee = null;
  }
}
