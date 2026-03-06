const dataStore = {
  users: [
    {
      id: 1,
      name: "Event Organizer",
      email: "organizer@venue.local",
      password: "password123",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Faculty User",
      email: "faculty@venue.local",
      password: "password123",
      role: "faculty",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Student Coordinator",
      email: "coordinator@venue.local",
      password: "password123",
      role: "coordinator",
      createdAt: new Date().toISOString(),
    },
  ],
  spaces: [
    { id: 1, name: "Bytes Lab", type: "Computer Lab", capacity: 120 },
    { id: 2, name: "Vista Hall", type: "Seminar Hall", capacity: 200 },
    { id: 3, name: "Classroom SF05", type: "Classroom", capacity: 80 },
    { id: 4, name: "Code Studio", type: "Computer Lab", capacity: 250 },
  ],
  bookings: [
    {
      id: 101,
      title: "AI Lab Session",
      type: "Training",
      spaceId: 1,
      date: "2026-02-14",
      start: "09:00",
      end: "11:00",
      participants: 35,
      status: "Approved",
      requestedBy: "Dr. Ram Charan",
      requestedRole: "faculty",
      organizedBy: "CSE Department",
      notes: "",
      createdAt: new Date().toISOString(),
    },
    {
      id: 102,
      title: "Robotics Club Meetup",
      type: "Club",
      spaceId: 4,
      date: "2026-02-14",
      start: "14:00",
      end: "16:00",
      participants: 24,
      status: "Pending",
      requestedBy: "Mr. Kumar",
      requestedRole: "coordinator",
      organizedBy: "Robotics Club",
      notes: "",
      createdAt: new Date().toISOString(),
    },
    {
      id: 103,
      title: "Faculty Seminar",
      type: "Seminar",
      spaceId: 2,
      date: "2026-02-15",
      start: "10:00",
      end: "12:00",
      participants: 90,
      status: "Pending",
      requestedBy: "Prof. Rani",
      requestedRole: "faculty",
      organizedBy: "MBA Department",
      notes: "",
      createdAt: new Date().toISOString(),
    },
  ],
};

const counters = {
  user: 4,
  space: 5,
  booking: 104,
};

const nextId = (type) => {
  const value = counters[type];
  counters[type] += 1;
  return value;
};

module.exports = {
  dataStore,
  nextId,
};
