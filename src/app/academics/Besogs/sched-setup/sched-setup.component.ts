import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from "sweetalert2";

@Component({
  selector: 'app-sched-setup',
  templateUrl: './sched-setup.component.html',
  styleUrls: ['./sched-setup.component.scss']
})
export class SchedSetupComponent implements OnInit {

  @ViewChild('modalTime', { static: false }) modalTime;

  constructor(public dialog: MatDialog) { }

  storageKey = 'grade-schedule-v2';

  departments = [
    { id: 'ELEM', name: 'Elementary', range: 'P–6', label: 'Pre-School to Grade 6' },
    { id: 'JHS', name: 'Junior High School', range: '7–10', label: 'Grades 7–10' },
    { id: 'SHS', name: 'Senior High School', range: '11–12', label: 'Grades 11–12' }
  ];

  days = [
    { id: 'MON', name: 'Monday' },
    { id: 'TUE', name: 'Tuesday' },
    { id: 'WED', name: 'Wednesday' },
    { id: 'THU', name: 'Thursday' },
    { id: 'FRI', name: 'Friday' }
  ];

  // edit this list to match the strands your school offers
  strands = ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Arts and Design', 'Sports'];

  // mock section choices per grade level (keyed by badge); each grade has its own list
  // replace with your sections from the database
  sectionChoices = {
    'P': ['Rose'],
    'K': ['Sampaguita', 'Rosal', 'Camia', 'Waling-Waling'],
    '1': ['Gumamela', 'Ilang-Ilang', 'Dama de Noche', 'Santan'],
    '2': ['Dahlia', 'Orchid', 'Lily', 'Tulip'],
    '3': ['Mabini', 'Bonifacio', 'Rizal', 'Aguinaldo'],
    '4': ['Luna', 'Silang', 'Jaena', 'Burgos'],
    '5': ['Jacinto', 'Aquino', 'Lapu-Lapu', 'Soliman'],
    '6': ['Del Pilar', 'Ponce', 'Tandang Sora', 'Dagohoy'],
    '7': ['Narra', 'Molave', 'Acacia', 'Ipil'],
    '8': ['Yakal', 'Mahogany', 'Dao', 'Tindalo'],
    '9': ['Apitong', 'Kamagong', 'Bagtikan', 'Guijo'],
    '10': ['Lauan', 'Banaba', 'Almaciga', 'Tanguile'],
    '11': ['Set A', 'Set B', 'Set C', 'Set D', 'Set E'],
    '12': ['Set A', 'Set B', 'Set C', 'Set D', 'Set E']
  };

  grades: any[] = [];
  activeDept = 'ELEM';

  // which section / strand each grade card is showing, keyed by grade badge
  selected = {};
  selectedStrand = {};

  // loader per grade card while switching section / strand
  loading = {};
  loadingTimers = {};

  dialogRef;
  activeGrade = null;
  activeSection = null;
  activeDay = 'MON';
  editIndex = -1;
  start = '';
  end = '';
  isBreak = false;
  error = '';

  ngOnInit() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      this.grades = JSON.parse(saved);
      this.toSections();
      return;
    }

    this.grades = [
      {
        badge: 'P', name: 'Pre-School', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Rose', blocks: {
              MON:
                [
                  { start: '13:00', end: '13:50' }, { start: '13:50', end: '14:50' },
                  { start: '14:50', end: '15:10', isBreak: true },
                  { start: '15:10', end: '15:30' }, { start: '15:30', end: '15:50' }
                ],
              TUE:
                [
                  { start: '13:00', end: '13:50' }, { start: '13:50', end: '14:50' },
                  { start: '14:50', end: '15:10', isBreak: true },
                  { start: '15:10', end: '15:30' }, { start: '15:30', end: '15:50' }
                ],
              WED:
                [
                  { start: '13:00', end: '13:50' }, { start: '13:50', end: '14:50' },
                  { start: '14:50', end: '15:10', isBreak: true },
                  { start: '15:10', end: '15:30' }, { start: '15:30', end: '15:50' }
                ],
              THU:
                [
                  { start: '13:00', end: '13:50' }, { start: '13:50', end: '14:50' },
                  { start: '14:50', end: '15:10', isBreak: true },
                  { start: '15:10', end: '15:30' }, { start: '15:30', end: '15:50' }
                ],
              FRI:
                [
                ]
            }
          },
        ]
      },
      {
        badge: 'K', name: 'Kindergarten', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Sampaguita', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Rosal', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '1', name: 'Grade 1', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Gumamela', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Ilang-Ilang', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '2', name: 'Grade 2', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Dahlia', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Orchid', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '3', name: 'Grade 3', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Mabini', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Bonifacio', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '4', name: 'Grade 4', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Luna', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Silang', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '5', name: 'Grade 5', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Jacinto', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Aquino', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '6', name: 'Grade 6', dept: 'ELEM', sections: [
          {
            strand: '', name: 'Del Pilar', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Ponce', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '7', name: 'Grade 7', dept: 'JHS', sections: [
          {
            strand: '', name: 'Narra', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Molave', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Acacia', blocks: {
              MON:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '09:45' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              TUE:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '09:45' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              WED:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '09:45' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              THU:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '09:45' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '8', name: 'Grade 8', dept: 'JHS', sections: [
          {
            strand: '', name: 'Yakal', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '08:45' },
                  { start: '08:15', end: '08:45', isBreak: true },
                  { start: '08:45', end: '09:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Mahogany', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:15' },
                  { start: '08:45', end: '09:15', isBreak: true },
                  { start: '09:15', end: '10:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '9', name: 'Grade 9', dept: 'JHS', sections: [
          {
            strand: '', name: 'Apitong', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Kamagong', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '10', name: 'Grade 10', dept: 'JHS', sections: [
          {
            strand: '', name: 'Lauan', blocks: {
              MON:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              WED:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '11:45', end: '12:45', isBreak: true },
                  { start: '12:45', end: '13:45' }, { start: '13:45', end: '14:45' },
                  { start: '14:45', end: '15:45' }, { start: '15:45', end: '16:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: '', name: 'Banaba', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '11', name: 'Grade 11', dept: 'SHS', sections: [
          {
            strand: 'STEM', name: 'Set A', blocks: {
              MON:
                [
                  { start: '07:45', end: '09:15' }, { start: '09:15', end: '10:45' },
                  { start: '10:45', end: '12:15' }, { start: '12:15', end: '13:45' },
                  { start: '13:45', end: '15:15' }, { start: '15:15', end: '16:45' }
                ],
              TUE:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '13:15', end: '14:15' }, { start: '15:15', end: '16:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '09:15' }, { start: '09:15', end: '10:45' },
                  { start: '10:45', end: '12:15' }, { start: '12:15', end: '13:45' },
                  { start: '13:45', end: '15:15' }, { start: '15:15', end: '16:45' }
                ],
              THU:
                [
                  { start: '07:15', end: '08:15' }, { start: '08:15', end: '09:15' },
                  { start: '09:15', end: '09:45', isBreak: true },
                  { start: '09:45', end: '10:45' }, { start: '10:45', end: '11:45' },
                  { start: '13:15', end: '14:15' }, { start: '15:15', end: '16:15' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: 'STEM', name: 'Set B', blocks: {
              MON:
                [
                  { start: '08:15', end: '09:45' }, { start: '09:45', end: '11:15' },
                  { start: '11:15', end: '12:45' }, { start: '12:45', end: '14:15' },
                  { start: '14:15', end: '15:45' }, { start: '15:45', end: '17:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '13:45', end: '14:45' }, { start: '15:45', end: '16:45' }
                ],
              WED:
                [
                  { start: '08:15', end: '09:45' }, { start: '09:45', end: '11:15' },
                  { start: '11:15', end: '12:45' }, { start: '12:45', end: '14:15' },
                  { start: '14:15', end: '15:45' }, { start: '15:45', end: '17:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '13:45', end: '14:45' }, { start: '15:45', end: '16:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: 'ABM', name: 'Set A', blocks: {
              MON:
                [
                  { start: '08:00', end: '09:30' }, { start: '09:30', end: '11:00' },
                  { start: '11:00', end: '12:30' }, { start: '12:30', end: '14:00' },
                  { start: '14:00', end: '15:30' }, { start: '15:30', end: '17:00' }
                ],
              TUE:
                [
                  { start: '07:30', end: '08:30' }, { start: '08:30', end: '09:30' },
                  { start: '09:30', end: '10:00', isBreak: true },
                  { start: '10:00', end: '11:00' }, { start: '11:00', end: '12:00' },
                  { start: '13:30', end: '14:30' }, { start: '15:30', end: '16:30' }
                ],
              WED:
                [
                  { start: '08:00', end: '09:30' }, { start: '09:30', end: '11:00' },
                  { start: '11:00', end: '12:30' }, { start: '12:30', end: '14:00' },
                  { start: '14:00', end: '15:30' }, { start: '15:30', end: '17:00' }
                ],
              THU:
                [
                  { start: '07:30', end: '08:30' }, { start: '08:30', end: '09:30' },
                  { start: '09:30', end: '10:00', isBreak: true },
                  { start: '10:00', end: '11:00' }, { start: '11:00', end: '12:00' },
                  { start: '13:30', end: '14:30' }, { start: '15:30', end: '16:30' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: 'HUMSS', name: 'Set A', blocks: {
              MON:
                [
                  { start: '08:30', end: '10:00' }, { start: '10:00', end: '11:30' },
                  { start: '11:30', end: '13:00' }, { start: '13:00', end: '14:30' },
                  { start: '14:30', end: '16:00' }, { start: '16:00', end: '17:30' }
                ],
              TUE:
                [
                  { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' },
                  { start: '10:00', end: '10:30', isBreak: true },
                  { start: '10:30', end: '11:30' }, { start: '11:30', end: '12:30' },
                  { start: '14:00', end: '15:00' }, { start: '16:00', end: '17:00' }
                ],
              WED:
                [
                  { start: '08:30', end: '10:00' }, { start: '10:00', end: '11:30' },
                  { start: '11:30', end: '13:00' }, { start: '13:00', end: '14:30' },
                  { start: '14:30', end: '16:00' }, { start: '16:00', end: '17:30' }
                ],
              THU:
                [
                  { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' },
                  { start: '10:00', end: '10:30', isBreak: true },
                  { start: '10:30', end: '11:30' }, { start: '11:30', end: '12:30' },
                  { start: '14:00', end: '15:00' }, { start: '16:00', end: '17:00' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      },
      {
        badge: '12', name: 'Grade 12', dept: 'SHS', sections: [
          {
            strand: 'STEM', name: 'Set A', blocks: {
              MON:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              TUE:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              WED:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              THU:
                [
                  { start: '07:45', end: '08:45' }, { start: '08:45', end: '09:45' },
                  { start: '09:45', end: '10:15', isBreak: true },
                  { start: '10:15', end: '11:15' }, { start: '11:15', end: '12:15' },
                  { start: '12:15', end: '13:15', isBreak: true },
                  { start: '13:15', end: '14:15' }, { start: '14:15', end: '15:15' },
                  { start: '15:15', end: '16:15' }, { start: '16:15', end: '17:15' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: 'ABM', name: 'Set A', blocks: {
              MON:
                [
                  { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' },
                  { start: '10:00', end: '10:30', isBreak: true },
                  { start: '10:30', end: '11:30' }, { start: '11:30', end: '12:30' },
                  { start: '12:30', end: '13:30', isBreak: true },
                  { start: '13:30', end: '14:30' }, { start: '14:30', end: '15:30' },
                  { start: '15:30', end: '16:30' }, { start: '16:30', end: '17:30' }
                ],
              TUE:
                [
                  { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' },
                  { start: '10:00', end: '10:30', isBreak: true },
                  { start: '10:30', end: '11:30' }, { start: '11:30', end: '12:30' },
                  { start: '12:30', end: '13:30', isBreak: true },
                  { start: '13:30', end: '14:30' }, { start: '14:30', end: '15:30' },
                  { start: '15:30', end: '16:30' }, { start: '16:30', end: '17:30' }
                ],
              WED:
                [
                  { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' },
                  { start: '10:00', end: '10:30', isBreak: true },
                  { start: '10:30', end: '11:30' }, { start: '11:30', end: '12:30' },
                  { start: '12:30', end: '13:30', isBreak: true },
                  { start: '13:30', end: '14:30' }, { start: '14:30', end: '15:30' },
                  { start: '15:30', end: '16:30' }, { start: '16:30', end: '17:30' }
                ],
              THU:
                [
                  { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' },
                  { start: '10:00', end: '10:30', isBreak: true },
                  { start: '10:30', end: '11:30' }, { start: '11:30', end: '12:30' },
                  { start: '12:30', end: '13:30', isBreak: true },
                  { start: '13:30', end: '14:30' }, { start: '14:30', end: '15:30' },
                  { start: '15:30', end: '16:30' }, { start: '16:30', end: '17:30' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: 'HUMSS', name: 'Set A', blocks: {
              MON:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '10:15' },
                  { start: '10:15', end: '10:45', isBreak: true },
                  { start: '10:45', end: '11:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              TUE:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '10:15' },
                  { start: '10:15', end: '10:45', isBreak: true },
                  { start: '10:45', end: '11:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              WED:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '10:15' },
                  { start: '10:15', end: '10:45', isBreak: true },
                  { start: '10:45', end: '11:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              THU:
                [
                  { start: '08:15', end: '09:15' }, { start: '09:15', end: '10:15' },
                  { start: '10:15', end: '10:45', isBreak: true },
                  { start: '10:45', end: '11:45' }, { start: '11:45', end: '12:45' },
                  { start: '12:45', end: '13:45', isBreak: true },
                  { start: '13:45', end: '14:45' }, { start: '14:45', end: '15:45' },
                  { start: '15:45', end: '16:45' }, { start: '16:45', end: '17:45' }
                ],
              FRI:
                [
                ]
            }
          },
          {
            strand: 'TVL', name: 'Set A', blocks: {
              MON:
                [
                  { start: '08:30', end: '09:30' }, { start: '09:30', end: '10:30' },
                  { start: '10:30', end: '11:00', isBreak: true },
                  { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' },
                  { start: '13:00', end: '14:00', isBreak: true },
                  { start: '14:00', end: '15:00' }, { start: '15:00', end: '16:00' },
                  { start: '16:00', end: '17:00' }, { start: '17:00', end: '18:00' }
                ],
              TUE:
                [
                  { start: '08:30', end: '09:30' }, { start: '09:30', end: '10:30' },
                  { start: '10:30', end: '11:00', isBreak: true },
                  { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' },
                  { start: '13:00', end: '14:00', isBreak: true },
                  { start: '14:00', end: '15:00' }, { start: '15:00', end: '16:00' },
                  { start: '16:00', end: '17:00' }, { start: '17:00', end: '18:00' }
                ],
              WED:
                [
                  { start: '08:30', end: '09:30' }, { start: '09:30', end: '10:30' },
                  { start: '10:30', end: '11:00', isBreak: true },
                  { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' },
                  { start: '13:00', end: '14:00', isBreak: true },
                  { start: '14:00', end: '15:00' }, { start: '15:00', end: '16:00' },
                  { start: '16:00', end: '17:00' }, { start: '17:00', end: '18:00' }
                ],
              THU:
                [
                  { start: '08:30', end: '09:30' }, { start: '09:30', end: '10:30' },
                  { start: '10:30', end: '11:00', isBreak: true },
                  { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' },
                  { start: '13:00', end: '14:00', isBreak: true },
                  { start: '14:00', end: '15:00' }, { start: '15:00', end: '16:00' },
                  { start: '16:00', end: '17:00' }, { start: '17:00', end: '18:00' }
                ],
              FRI:
                [
                ]
            }
          }
        ]
      }
    ];
    this.saveToStorage();
  }

  // converts old saved data (grade.blocks) into one section per grade, keeping its times
  toSections() {
    let changed = false;
    this.grades.forEach(g => {
      if (!g.sections) {
        const isShs = g.dept === 'SHS';
        g.sections = [{
          strand: isShs ? this.strands[0] : '',
          name: isShs ? 'Set A' : 'Section A',
          blocks: g.blocks || this.makeWeek([])
        }];
        delete g.blocks;
        changed = true;
      }
    });
    if (changed) {
      this.saveToStorage();
    }
  }

  copyBlocks(blocks: any[]) {
    return blocks.map(b => ({ start: b.start, end: b.end, isBreak: !!b.isBreak }));
  }

  // builds { MON: [...], ..., FRI: [...] } with a separate copy for each day
  makeDays(mon: any[], tue: any[], wed: any[], thu: any[], fri: any[]) {
    return {
      MON: this.copyBlocks(mon),
      TUE: this.copyBlocks(tue),
      WED: this.copyBlocks(wed),
      THU: this.copyBlocks(thu),
      FRI: this.copyBlocks(fri)
    };
  }

  // same times on every day
  makeWeek(blocks: any[]) {
    return this.makeDays(blocks, blocks, blocks, blocks, blocks);
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.grades));
  }

  // ---------- display ----------
  gradesFor(dept: string) {
    return this.grades.filter(g => g.dept === dept);
  }

  sectionBlocks(section: any) {
    return this.days.reduce((sum, d) => sum + section.blocks[d.id].length, 0);
  }

  totalBlocks(grade: any) {
    return grade.sections.reduce((sum, s) => sum + this.sectionBlocks(s), 0);
  }

  setCount(dept: string) {
    return this.gradesFor(dept).filter(g => this.totalBlocks(g) > 0).length;
  }

  activeDepartment() {
    return this.departments.find(d => d.id === this.activeDept);
  }

  isShs(grade: any) {
    return !!grade && grade.dept === 'SHS';
  }

  // "Section" for Elementary and JHS, "Set" for SHS
  sectionLabel(grade: any) {
    return this.isShs(grade) ? 'Set' : 'Section';
  }

  sectionSummary(grade: any) {
    const count = grade.sections.length;
    const label = this.sectionLabel(grade).toLowerCase() + (count === 1 ? '' : 's');
    return count + ' ' + label;
  }

  sectionTitle(grade: any, section: any) {
    if (!grade || !section) return '';
    return this.isShs(grade) ? section.strand + ' ' + section.name : section.name;
  }

  dayName(id: string) {
    const day = this.days.find(d => d.id === id);
    return day ? day.name : '';
  }

  formatTime(time: string) {
    const parts = time.split(':').map(Number);
    const h = parts[0];
    const m = parts[1];
    return (h % 12 || 12) + ':' + (m < 10 ? '0' + m : m) + ' ' + (h < 12 ? 'AM' : 'PM');
  }

  // ---------- sections ----------
  sectionOptions(grade: any) {
    return this.sectionChoices[grade.badge] || [];
  }

  // a name is taken if another section of this grade already uses it
  // (for SHS, only within the same strand: STEM Set A and ABM Set A can both exist)
  isTaken(grade: any, section: any, name: string) {
    return grade.sections.some(o =>
      o !== section && o.name === name && (!this.isShs(grade) || o.strand === section.strand)
    );
  }

  firstFreeName(grade: any, section: any) {
    return this.sectionOptions(grade).find(n => !this.isTaken(grade, section, n));
  }

  // SHS: strand shown in the strand dropdown (defaults to the first set's strand)
  shownStrand(grade: any) {
    if (this.selectedStrand[grade.badge]) return this.selectedStrand[grade.badge];
    return grade.sections.length ? grade.sections[0].strand : this.strands[0];
  }

  // sections listed in the section dropdown (SHS: only the sets of the shown strand)
  visibleSections(grade: any) {
    if (!this.isShs(grade)) return grade.sections;
    const strand = this.shownStrand(grade);
    return grade.sections.filter(s => s.strand === strand);
  }

  // the one section whose times the card displays
  currentSection(grade: any) {
    const list = this.visibleSections(grade);
    const sel = this.selected[grade.badge];
    return list.indexOf(sel) > -1 ? sel : list[0];
  }

  selectSection(grade: any, section: any) {
    this.selected[grade.badge] = section;
    this.showLoader(grade);
  }

  selectStrand(grade: any, strand: string) {
    this.selectedStrand[grade.badge] = strand;
    this.selected[grade.badge] = null;
    this.showLoader(grade);
  }

  // shows the loader on one grade card; replace the timeout with your API call later
  showLoader(grade: any) {
    clearTimeout(this.loadingTimers[grade.badge]);
    this.loading[grade.badge] = true;
    this.loadingTimers[grade.badge] = setTimeout(() => {
      this.loading[grade.badge] = false;
    }, 500);
  }

  addSection(grade: any) {
    const section = {
      strand: this.isShs(grade) ? this.shownStrand(grade) : '',
      name: '',
      blocks: this.makeWeek([])
    };
    const name = this.firstFreeName(grade, section);

    if (!name) {
      Swal.fire(
        "",
        "All " + (this.isShs(grade) ? section.strand + " sets" : "sections") + " are already added for " + grade.name,
        "info"
      );
      return;
    }

    section.name = name;
    grade.sections.push(section);
    this.selectedStrand[grade.badge] = section.strand || null;
    this.selected[grade.badge] = section;
    this.saveToStorage();
  }

  removeSection(grade: any, section: any) {
    if (!confirm('Remove ' + this.sectionTitle(grade, section) + ' and all its times?')) return;
    grade.sections.splice(grade.sections.indexOf(section), 1);
    this.selected[grade.badge] = null;
    this.saveToStorage();
  }

  // ---------- modal ----------
  openModalTime() {
    this.dialogRef = this.dialog.open(this.modalTime, {
      width: '500px',
      height: 'auto',
      autoFocus: false
    });
  }

  openAdd(grade: any, section: any, day: string) {
    this.activeGrade = grade;
    this.activeSection = section;
    this.activeDay = day;
    this.editIndex = -1;
    this.start = '';
    this.end = '';
    this.isBreak = false;
    this.error = '';
    this.openModalTime();
  }

  openEdit(grade: any, section: any, day: string, index: number) {
    this.activeGrade = grade;
    this.activeSection = section;
    this.activeDay = day;
    this.editIndex = index;
    this.start = section.blocks[day][index].start;
    this.end = section.blocks[day][index].end;
    this.isBreak = !!section.blocks[day][index].isBreak;
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
      Swal.fire(
        "Invalid time",
        "Enter a start and end time",
        "info"
      );
      return;
    }
    if (this.start >= this.end) {
      Swal.fire(
        "Invalid time",
        "End time must be after start time",
        "info"
      );
      return;
    }

    const blocks = this.activeSection.blocks[this.activeDay];
    const taken = blocks.some((b: any, i: number) =>
      i !== this.editIndex && this.start < b.end && b.start < this.end
    );
    if (taken) {
      Swal.fire(
        "",
        "This time is already added or overlaps another time",
        "info"
      );
      return;
    }

    if (this.editIndex === -1) {
      blocks.push({ start: this.start, end: this.end, isBreak: this.isBreak });
    } else {
      blocks[this.editIndex] = { start: this.start, end: this.end, isBreak: this.isBreak };
    }
    blocks.sort((a: any, b: any) => a.start.localeCompare(b.start));

    this.saveToStorage();
    this.closeModal();
  }

  removeTime(section: any, day: string, index: number) {
    if (!confirm('Remove this time?')) return;
    section.blocks[day].splice(index, 1);
    this.saveToStorage();
  }

  copyToAllDays(section: any, day: string) {
    if (!confirm('Replace the other days of ' + section.name + ' with ' + this.dayName(day) + '\'s times?')) return;
    section.blocks = this.makeWeek(section.blocks[day]);
    this.saveToStorage();
  }
}