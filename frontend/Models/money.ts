export function formatTWD(value: string) {
  return 'TWD ' + BigInt(value).toLocaleString('en-US');
}
