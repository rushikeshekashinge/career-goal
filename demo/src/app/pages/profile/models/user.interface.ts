export interface User {
    id: number;
    name: string;
    email: string;
    age: number;
  }
  
  export const INITIAL_USERS: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', age: 25 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', age: 31 },
  ];