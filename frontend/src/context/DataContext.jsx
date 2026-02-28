import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [timetableOverrides, setTimetableOverrides] = useState([]);

  const loadSpaces = async () => {
    try {
      const response = await api.get("/spaces");
      setSpaces(response?.data?.data || []);
    } catch {
      setSpaces([]);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response?.data?.data || []);
    } catch {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadSpaces();
    loadBookings();
    setTimetable([]);
  }, []);

  const addSpace = async (space) => {
    try {
      const response = await api.post("/spaces", space);
      const created = response?.data?.data;
      if (created?.id) {
        await loadSpaces();
      }
      return created;
    } catch {
      return null;
    }
  };

  const updateSpace = async (space) => {
    try {
      const response = await api.put(`/spaces/${space.id}`, space);
      const updated = response?.data?.data;

      if (updated?.id) {
        await loadSpaces();
      }

      return updated;
    } catch {
      return null;
    }
  };

  const deleteSpace = async (id) => {
    try {
      await api.delete(`/spaces/${id}`);
      await loadSpaces();
      await loadBookings();
    } catch {
      return;
    }
  };

  const addBooking = async (booking) => {
    try {
      const response = await api.post("/bookings", booking);
      const created = response?.data?.data;

      if (created?.id) {
        await loadBookings();
      }

      return created;
    } catch {
      return null;
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      const updated = response?.data?.data;

      if (updated?.id) {
        await loadBookings();
      }

      return updated;
    } catch {
      return null;
    }
  };

  const value = useMemo(
    () => ({
      spaces,
      bookings,
      timetable,
      timetableOverrides,
      addSpace,
      updateSpace,
      deleteSpace,
      addBooking,
      updateBookingStatus,
      setTimetableOverride: (override) => {
        setTimetableOverrides((prev) => {
          const rest = prev.filter(
            (item) =>
              !(
                item.spaceId === override.spaceId &&
                item.date === override.date &&
                item.start === override.start &&
                item.end === override.end
              )
          );

          if (!override.status) {
            return rest;
          }

          return [...rest, override];
        });
      },
    }),
    [spaces, bookings, timetable, timetableOverrides]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
