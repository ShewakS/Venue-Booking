export const parseTimeToMinutes = (time) => {
  if (!time) {
    return 0;
  }
  const [hours, minutes] = time.split(":").map((value) => Number(value));
  return hours * 60 + minutes;
};

export const isTimeOverlapping = (startA, endA, startB, endB) => {
  return parseTimeToMinutes(startA) < parseTimeToMinutes(endB) && parseTimeToMinutes(endA) > parseTimeToMinutes(startB);
};

export const getDayAbbrev = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};
