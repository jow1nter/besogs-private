import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub1',
  templateUrl: './sub1.component.html',
  styleUrls: ['./sub1.component.scss']
})
export class Sub1Component implements OnInit {

  users: any[] = [
    { id: 1, name: "John Doe", age: 25 },
    { id: 2, name: "Jane Doe", age: 26 },
    { id: 3, name: "Bob Smith", age: 27 }
  ]

  constructor() { }

  ngOnInit() {
  }
  editUser(user: any) {
    console.log('Edit user:', user);
    // Implement your edit logic here
  }

  deleteUser(user: any) {
    console.log('Delete user:', user);
    // Implement your delete logic here
  }

}
