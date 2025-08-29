import { catchError, map, Observable, of, Subscriber } from 'rxjs';

export interface user {
  name: string;
  age: number;
}

export interface User {
  id: string;
  name: string;
  age: number;
}
async function fetechUser(): Promise<user[]> {
  try {
    //fetech and wait until the network response
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    //guard aganist htto error(400,500)
    if (!response.ok) {
      throw new Error(`http error status`);
    }
    //parse json data
    const data: user[] = await response.json();
    return data;
  } catch (error) {
    console.error('error handling of the user', error);
    return [];
  }
}

//exammple Usage

fetechUser().then((user) => {
  console.log('user value ', user);
});

//2. Observable based function

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export function fetchUsers(): Observable<User[]> {
  return new Observable<User[]>((subscriber) => {
    // Create AbortController so we can cancel the fetch when the subscriber unsubscribes.
    const controller = new AbortController();
    const signal = controller.signal;

    //fetch using abort signal
    fetch(USERS_URL, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json(); 
      })
      .then((data) => {
       //received emitted data
        subscriber.next(data as User[]);
        subscriber.complete();
      })
      .catch((err) => {
        
        subscriber.error(err);
      });

    // unsubscribe
    return () => {
      controller.abort();
    };
  }).pipe(
    // Validate / transform the emitted value. If validation throws, catchError handles it.
    map((users) => {
      if (!Array.isArray(users)) {
        throw new Error('Unexpected response shape: expected an array');
      }
      return users as User[];
    }),

    // error for network and other fallback as well
    catchError((err) => {
      console.error('[fetchUsersObservable] Error inside pipe:', err);
      return of([] as User[]);
    })
  );
}
