export interface User {
    id: string;
    name: string;
    title: string;
    email: string;
    location: string;
    joinDate: string;
    avatarUrl: string;
    isOnline: boolean;
    stats: {
      projects: number;
      followers: number;
      following: number;
    };
  }
  
  export interface ProfileCardData {
    id: string;
    name: string;
    title: string;
    email: string;
    location: string;
    joinDate: string;
    avatarUrl: string;
    status: 'Available' | 'Busy' | 'Away' | 'Offline';
    displayStats: {
      projects: string;
      followers: string;
      following: string;
    };
  }
  
  export interface NormalizedUsers {
    [userId: string]: User;
  }
  
  export function transformUsersToProfileCards(users: User[]): ProfileCardData[] {
    const usersCopy = [...users];
    return usersCopy.map((user): ProfileCardData => ({
      id: user.id,
      name: user.name,
      title: user.title,
      email: user.email,
      location: user.location,
      joinDate: formatJoinDate(user.joinDate),
      avatarUrl: user.avatarUrl,
      status: user.isOnline ? 'Available' : 'Offline',
      displayStats: {
        projects: formatNumber(user.stats.projects),
        followers: formatNumber(user.stats.followers),
        following: formatNumber(user.stats.following)
      }
    }));
  }
  

  export function getUniqueValues<T, K>(
    items: T[], 
    keyExtractor?: (item: T) => K
  ): (T | K)[] {
    const itemsCopy = [...items];
    
    if (keyExtractor) {
      const uniqueSet = new Set(itemsCopy.map(keyExtractor));
      return Array.from(uniqueSet);
    }
    
    const uniqueSet = new Set(itemsCopy);
    return Array.from(uniqueSet);
  }
  


  export function getUniqueJoinYears(users: User[]): number[] {
    const usersCopy = [...users];
    const years = usersCopy.map(user => new Date(user.joinDate).getFullYear());
    return getUniqueValues(years);
  }
  
  export function normalizeUsers(users: User[]): NormalizedUsers {
    const usersCopy = [...users];
    return usersCopy.reduce((normalized, user) => {
      normalized[user.id] = { ...user };
      return normalized;
    }, {} as NormalizedUsers);
  }
  
  export interface NormalizedUserData {
    byId: NormalizedUsers;
    byLocation: { [location: string]: User[] };
    byTitle: { [title: string]: User[] };
    byOnlineStatus: { online: User[]; offline: User[] };
    allIds: string[];
  }
  
    export function normalizeUsersWithIndices(users: User[]): NormalizedUserData {
    const usersCopy = [...users];
    const byId = normalizeUsers(usersCopy);
    const byLocation: { [location: string]: User[] } = {};
    const byTitle: { [title: string]: User[] } = {};
    const byOnlineStatus = { online: [] as User[], offline: [] as User[] };
    const allIds = usersCopy.map(user => user.id);

    usersCopy.forEach(user => {
      const userCopy = { ...user };
      if (!byLocation[userCopy.location]) {
        byLocation[userCopy.location] = [];
      }
      byLocation[userCopy.location].push(userCopy);
    });

    usersCopy.forEach(user => {
      const userCopy = { ...user };
      if (!byTitle[userCopy.title]) {
        byTitle[userCopy.title] = [];
      }
      byTitle[userCopy.title].push(userCopy);
    });

    usersCopy.forEach(user => {
      const userCopy = { ...user };
      if (userCopy.isOnline) {
        byOnlineStatus.online.push(userCopy);
      } else {
        byOnlineStatus.offline.push(userCopy);
      }
    });

    return {
      byId,
      byLocation,
      byTitle,
      byOnlineStatus,
      allIds
    };
  }
  
  export function getUsersByIds(
    normalizedUsers: NormalizedUsers, 
    userIds: string[]
  ): (User | undefined)[] {
    const userIdsCopy = [...userIds];
    return userIdsCopy.map(id => {
      const user = normalizedUsers[id];
      return user ? { ...user } : undefined; 
    });
  }
  

  export function updateUsersInNormalized(
    normalizedUsers: NormalizedUsers,
    updates: Array<{ id: string } & Partial<User>>
  ): NormalizedUsers {
    const updated: NormalizedUsers = {};
    Object.keys(normalizedUsers).forEach(key => {
      updated[key] = { ...normalizedUsers[key] };
    });
    
    const updatesCopy = [...updates];
    
    updatesCopy.forEach(update => {
      const { id, ...updateData } = update;
      if (updated[id]) {
        updated[id] = { ...updated[id], ...updateData };
      }
    });
    
    return updated;
  }
  
 
  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
  
 
  function formatJoinDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return date.toLocaleDateString('en-US', options);
  }
  

  export function searchUsers(users: User[], searchTerm: string): User[] {
    const usersCopy = [...users];
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return usersCopy.filter(user => 
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.title.toLowerCase().includes(lowerSearchTerm)
    ).map(user => ({ ...user })); 
  }
  

  export interface UserFilters {
    location?: string;
    title?: string;
    isOnline?: boolean;
    minFollowers?: number;
    maxFollowers?: number;
  }
  
  export function filterUsers(users: User[], filters: UserFilters): User[] {
    const usersCopy = [...users];
    const filtersCopy = { ...filters };
    
    return usersCopy.filter(user => {
      if (filtersCopy.location && user.location !== filtersCopy.location) return false;
      if (filtersCopy.title && user.title !== filtersCopy.title) return false;
      if (filtersCopy.isOnline !== undefined && user.isOnline !== filtersCopy.isOnline) return false;
      if (filtersCopy.minFollowers && user.stats.followers < filtersCopy.minFollowers) return false;
      if (filtersCopy.maxFollowers && user.stats.followers > filtersCopy.maxFollowers) return false;
      return true;
    }).map(user => ({ ...user })); 
  }