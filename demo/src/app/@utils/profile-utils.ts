/**
 * Data Utility Functions for Profile Card Components
 * Provides efficient data transformation and normalization utilities
 */

// Type definitions for profile card data
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
  
  /**
   * Transform an array of User objects into ProfileCardData objects
   * Uses Array.map for efficient transformation
   * 
   * @param users - Array of User objects
   * @returns Array of ProfileCardData objects ready for UI rendering
   */
  export function transformUsersToProfileCards(users: User[]): ProfileCardData[] {
    return users.map((user): ProfileCardData => ({
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
  
  /**
   * Get unique values from an array using Set
   * Useful for extracting unique locations, titles, or other properties
   * 
   * @param items - Array of any type
   * @param keyExtractor - Optional function to extract specific property
   * @returns Array of unique values
   */
  export function getUniqueValues<T, K>(
    items: T[], 
    keyExtractor?: (item: T) => K
  ): (T | K)[] {
    if (keyExtractor) {
      const uniqueSet = new Set(items.map(keyExtractor));
      return Array.from(uniqueSet);
    }
    
    const uniqueSet = new Set(items);
    return Array.from(uniqueSet);
  }
  

  
  /**
   * Get unique join years from an array of users
   * 
   * @param users - Array of User objects
   * @returns Array of unique years
   */
  export function getUniqueJoinYears(users: User[]): number[] {
    const years = users.map(user => new Date(user.joinDate).getFullYear());
    return getUniqueValues(years);
  }
  
  /**
   * Normalize an array of users into an object keyed by user ID
   * Converts O(n) lookup time to O(1) for user retrieval
   * 
   * @param users - Array of User objects
   * @returns Object with user IDs as keys and User objects as values
   */
  export function normalizeUsers(users: User[]): NormalizedUsers {
    return users.reduce((normalized, user) => {
      normalized[user.id] = user;
      return normalized;
    }, {} as NormalizedUsers);
  }
  
  /**
   * Normalize users and create lookup indices for common queries
   * Creates multiple indexed views for different access patterns
   * 
   * @param users - Array of User objects
   * @returns Object with normalized data and various indices
   */
  export interface NormalizedUserData {
    byId: NormalizedUsers;
    byLocation: { [location: string]: User[] };
    byTitle: { [title: string]: User[] };
    byOnlineStatus: { online: User[]; offline: User[] };
    allIds: string[];
  }
  
  export function normalizeUsersWithIndices(users: User[]): NormalizedUserData {
    const byId = normalizeUsers(users);
    const byLocation: { [location: string]: User[] } = {};
    const byTitle: { [title: string]: User[] } = {};
    const byOnlineStatus = { online: [] as User[], offline: [] as User[] };
    const allIds = users.map(user => user.id);
  
    // Build location index
    users.forEach(user => {
      if (!byLocation[user.location]) {
        byLocation[user.location] = [];
      }
      byLocation[user.location].push(user);
    });
  
    // Build title index
    users.forEach(user => {
      if (!byTitle[user.title]) {
        byTitle[user.title] = [];
      }
      byTitle[user.title].push(user);
    });
  
    // Build online status index
    users.forEach(user => {
      if (user.isOnline) {
        byOnlineStatus.online.push(user);
      } else {
        byOnlineStatus.offline.push(user);
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
  
  /**
   * Batch operations for efficient data processing
   */
  
  /**
   * Get multiple users by their IDs from normalized data
   * O(k) complexity where k is the number of requested IDs
   * 
   * @param normalizedUsers - Normalized user data object
   * @param userIds - Array of user IDs to retrieve
   * @returns Array of User objects (undefined for non-existent IDs)
   */
  export function getUsersByIds(
    normalizedUsers: NormalizedUsers, 
    userIds: string[]
  ): (User | undefined)[] {
    return userIds.map(id => normalizedUsers[id]);
  }
  
  /**
   * Update multiple users in normalized data structure
   * Efficient batch update operation
   * 
   * @param normalizedUsers - Normalized user data object
   * @param updates - Array of partial user updates with id
   * @returns Updated normalized users object
   */
  export function updateUsersInNormalized(
    normalizedUsers: NormalizedUsers,
    updates: Array<{ id: string } & Partial<User>>
  ): NormalizedUsers {
    const updated = { ...normalizedUsers };
    
    updates.forEach(update => {
      const { id, ...updateData } = update;
      if (updated[id]) {
        updated[id] = { ...updated[id], ...updateData };
      }
    });
    
    return updated;
  }
  
  /**
   * Helper functions for data formatting
   */
  
  /**
   * Format numbers for display (e.g., 1200 -> "1.2k")
   * 
   * @param num - Number to format
   * @returns Formatted string
   */
  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
  
  /**
   * Format join date for display
   * 
   * @param dateString - ISO date string
   * @returns Formatted date string (e.g., "March 2019")
   */
  function formatJoinDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return date.toLocaleDateString('en-US', options);
  }
  
  /**
   * Search and filter utilities
   */
  
  /**
   * Search users by name or title (case-insensitive)
   * 
   * @param users - Array of User objects
   * @param searchTerm - Search string
   * @returns Filtered array of users
   */
  export function searchUsers(users: User[], searchTerm: string): User[] {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.title.toLowerCase().includes(lowerSearchTerm)
    );
  }
  
  /**
   * Filter users by multiple criteria
   * 
   * @param users - Array of User objects
   * @param filters - Filter criteria object
   * @returns Filtered array of users
   */
  export interface UserFilters {
    location?: string;
    title?: string;
    isOnline?: boolean;
    minFollowers?: number;
    maxFollowers?: number;
  }
  
  export function filterUsers(users: User[], filters: UserFilters): User[] {
    return users.filter(user => {
      if (filters.location && user.location !== filters.location) return false;
      if (filters.title && user.title !== filters.title) return false;
      if (filters.isOnline !== undefined && user.isOnline !== filters.isOnline) return false;
      if (filters.minFollowers && user.stats.followers < filters.minFollowers) return false;
      if (filters.maxFollowers && user.stats.followers > filters.maxFollowers) return false;
      return true;
    });
  }