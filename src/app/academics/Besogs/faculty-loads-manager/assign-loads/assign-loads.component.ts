import { Component } from '@angular/core';

interface Employee {
  id: string;
  name: string;
  department: string;
}

@Component({
  selector: 'app-assign-loads',
  templateUrl: './assign-loads.component.html',
  styleUrls: ['./assign-loads.component.scss']
})
export class AssignLoadsComponent {
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
