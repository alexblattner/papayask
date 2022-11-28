export default function formatDate(date?: Date | string): string {
  if (!date) return 'Present';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export const formatDateNamed = (date?: Date | string): string => {
  if (!date) return 'Present';
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};
