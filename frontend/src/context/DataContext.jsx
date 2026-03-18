import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const DataContext = createContext(null);
const OVERRIDES_STORAGE_KEY = "scsb_timetable_overrides";

const uniqueById = (items) => {
  const map = new Map();

  (Array.isArray(items) ? items : []).forEach((item) => {
    if (!item || item.id === undefined || item.id === null) {
      return;
    }
    map.set(String(item.id), item);
  });

  return Array.from(map.values());
};

export const DataProvider = ({ children }) => {
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [timetableOverrides, setTimetableOverrides] = useState(() => {
    try {
      const raw = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const loadSpaces = async () => {
    try {
      const response = await api.get("/spaces");
      const normalized = uniqueById(response?.data?.data || []);
      setSpaces(normalized);
    } catch {
      setSpaces([]);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await api.get("/bookings");
      const normalized = uniqueById(response?.data?.data || []);
      setBookings(normalized);
    } catch {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadSpaces();
    loadBookings();
    setTimetable([]);
  }, []);

  useEffect(() => {
    // Keep UI aligned with DB changes (insert/update/delete) even without manual refresh.
    const intervalId = setInterval(() => {
      loadSpaces();
      loadBookings();
    }, 10000);

    const handleFocus = () => {
      loadSpaces();
      loadBookings();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(timetableOverrides));
    } catch {
      // ignore storage write failures
    }
  }, [timetableOverrides]);

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
