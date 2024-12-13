let counter = 1;

export function generateProjectId(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const sequence = counter.toString().padStart(4, '0');
  counter = (counter % 9999) + 1;
  
  return `PRJ-${year}${month}-${sequence}`;
}