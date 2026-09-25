const prisma = require('../lib/prisma');

// Bookings in these statuses are considered to be occupying kennels
const ACTIVE_STATUSES = ['CONFIRMED', 'PENDING'];

/**
 * Get the set of kennel IDs occupied during a date range.
 * A booking occupies its kennels if it overlaps [checkIn, checkOut)
 * and is in an active status.
 */
async function getOccupiedKennelIds(checkIn, checkOut, excludeBookingId = null) {
  const overlapping = await prisma.booking.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      checkInDate: { lt: checkOut },
      checkOutDate: { gt: checkIn },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: { kennels: { select: { id: true } } },
  });

  const occupied = new Set();
  overlapping.forEach((b) => b.kennels.forEach((k) => occupied.add(k.id)));
  return occupied;
}

/**
 * Return the N lowest-numbered kennels that are free for the given date range.
 * Kennels are named "1".."12". We fill from lowest number to highest.
 *
 * @returns {Promise<object[]>} array of free kennels (length <= count).
 *   If fewer than `count` are free, returns however many are available.
 */
async function findAvailableKennels(checkIn, checkOut, count, excludeBookingId = null) {
  const kennels = await prisma.kennel.findMany({ where: { isActive: true } });
  kennels.sort((a, b) => Number(a.name) - Number(b.name));

  const occupied = await getOccupiedKennelIds(checkIn, checkOut, excludeBookingId);
  const free = kennels.filter((k) => !occupied.has(k.id));
  return free.slice(0, count);
}

/**
 * Count how many kennels are free for a date range.
 */
async function countAvailableKennels(checkIn, checkOut, excludeBookingId = null) {
  const totalActive = await prisma.kennel.count({ where: { isActive: true } });
  const occupied = await getOccupiedKennelIds(checkIn, checkOut, excludeBookingId);
  return Math.max(0, totalActive - occupied.size);
}

module.exports = {
  findAvailableKennels,
  countAvailableKennels,
  getOccupiedKennelIds,
  ACTIVE_STATUSES,
};
