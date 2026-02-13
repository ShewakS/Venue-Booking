import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockBookings, mockSpaces, mockTimetable } from "../utils/mockData";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    setSpaces(mockSpaces);
    setBookings(mockBookings);
    setTimetable(mockTimetable);
  }, []);

  const addSpace = (space) => {
    setSpaces((prev) => [...prev, { ...space, id: Date.now() }]);
  };

  const updateSpace = (space) => {
    setSpaces((prev) => prev.map((item) => (item.id === space.id ? space : item)));
  };

  const deleteSpace = (id) => {
    setSpaces((prev) => prev.filter((space) => space.id !== id));
    setBookings((prev) => prev.filter((booking) => booking.spaceId !== id));
  };

  const addBooking = (booking) => {
    setBookings((prev) => [
      ...prev,
      {
        ...booking,
        id: Date.now(),
        status: "Pending",
      },
    ]);
  };

  const updateBookingStatus = (id, status) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
  };

  const value = useMemo(
    () => ({
      spaces,
      bookings,
      timetable,
      addSpace,
      updateSpace,
      deleteSpace,
      addBooking,
      updateBookingStatus,
    }),
    [spaces, bookings, timetable]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
