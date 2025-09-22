import { Component, signal } from '@angular/core';
import { ProfileComponent } from '../pages/profile/profile.component';
import { interval, Subscription, take } from 'rxjs';
import { INITIAL_USERS, User } from '../pages/profile/models/user.interface';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent {
 public users = signal<User[]>(INITIAL_USERS);

  private _nextId = 5;
  private _randomNames = [
    'Alex Chen',
    'Maria Garcia',
    'David Brown',
    'Lisa Anderson',
    'James Miller',
    'Emma Davis',
    'Robert Taylor',
    'Ashley Moore',
  ];

  private _notificationSub?: Subscription;

  protected lastNotification = signal<string>('');

  // onUserNotification(message: string) {
  //   this.lastNotification.set(message);

  //   setTimeout(() => {
  //     this.lastNotification.set('');
  //   }, 3000);
  // }

  ngOnDestroy() {
    this._notificationSub?.unsubscribe();
  }

  // better pratice do not use settimeout use interval
  onUserNotification(message: string) {
    this.lastNotification.set(message);
    this._notificationSub?.unsubscribe();

    this._notificationSub = interval(300)
      .pipe(take(1))
      .subscribe(() => {
        this.lastNotification.set('');
      });
  }

  addRandomUser() {
    const randomName =
      this._randomNames[Math.floor(Math.random() * this._randomNames.length)];
    const newUser: User = {
      id: this._nextId++,
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
      age: Math.floor(Math.random() * 40) + 20,
    };

    this.users.update((currentUsers) => [...currentUsers, newUser]);
  }

  clearUsers() {
    this.users.set([]);
    this.onUserNotification('All users cleared!');
  }
}
