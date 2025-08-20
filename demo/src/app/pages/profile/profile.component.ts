import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  title = 'MY app';

  navLinks = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' }
  ];

  formData = {
    name: '',
    email: '',
    message: '',
    gender: 'male',
    subscribe: false
  };
  people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 32 }
  ];

  steps = ['Install Angular CLI', 'Create Project', 'Serve App'];
  items = ['Item 1', 'Item 2', 'Item 3'];

  onSubmit() {
    console.log('Form submitted:', this.formData);
  }
}
