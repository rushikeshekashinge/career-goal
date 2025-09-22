import { Component, input, output,} from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { User } from './models/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
user =input.required<User>();
notify = output<string>();
onClick() {
  this.notify.emit(`Clicked on ${this.user().name} (ID: ${this.user().id})`);
}
}
