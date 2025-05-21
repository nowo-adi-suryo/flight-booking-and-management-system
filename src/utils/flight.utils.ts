export function generateBookingId(prefix = 'BOOK'): string {
  const now = new Date();

  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const timePart = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${datePart}${timePart}-${randomPart}`;
}

export function findAvailableSeat(
  bookedSeats: number[],
  maxSeatCapacity: number,
) {
  if (bookedSeats.length === maxSeatCapacity) {
    return null;
  }

  let availableSeat: number | null = null;

  for (let i = 1; i <= maxSeatCapacity; i++) {
    if (!bookedSeats.includes(i)) {
      availableSeat = i;
      break;
    }
  }

  return availableSeat;
}

export function countAvailableSeat(
  bookedSeats: number[],
  maxSeatCapacity: number,
): number {
  return maxSeatCapacity - bookedSeats.length;
}
