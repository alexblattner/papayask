export default function formatCurrency(value: number): string {
  //return value without cents
  let formatedString = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  if (formatedString.includes('.00')) {
    formatedString = formatedString.replace('.00', '');
  }
  return formatedString;
}
