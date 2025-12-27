export const calculateOverdue = (scheduledDate: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const scheduled = new Date(scheduledDate);
  scheduled.setHours(0, 0, 0, 0);
  
  return scheduled < today;
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
