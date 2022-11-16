export default function formatDate(date?: Date | string): string {
  if (!date) return 'Present';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
