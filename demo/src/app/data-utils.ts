// src/utils/data.utils.ts
export function sum(a: number, b: number): number {
    return a + b;
  }
  
  export function average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((acc, n) => acc + n, 0) / numbers.length;
  }
  
  export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  