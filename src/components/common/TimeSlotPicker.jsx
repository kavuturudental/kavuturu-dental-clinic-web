// src/components/common/TimeSlotPicker.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { timeSlots } from "../../data/appointment/appointmentData";

export const TimeSlotPicker = ({
  selectedDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  error,
  disabled = false,
  className = ""
}) => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedSlots = async () => {
      try {
        setLoadingSlots(true);
        const res = await axios.get(`http://localhost:5000/api/appointment-requests/booked-slots?date=${selectedDate}`);
        if (isMounted && res.data?.bookedSlots) {
          setBookedSlots(res.data.bookedSlots);
        }
      } catch (err) {
        console.warn("Failed to load booked time slots:", err);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    };

    fetchBookedSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const allSlots = [
    ...timeSlots.morning.map((s) => s.time),
    ...timeSlots.afternoon.map((s) => s.time),
    ...timeSlots.evening.map((s) => s.time)
  ];

  return (
    <div className="w-full text-left">
      <div className="relative">
        <select
          value={selectedTimeSlot || ""}
          onChange={(e) => onSelectTimeSlot(e.target.value)}
          disabled={disabled || !selectedDate || loadingSlots}
          className={`w-full rounded-xl border bg-white px-3.5 h-10 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer appearance-none ${
            error
              ? "border-rose-400"
              : "border-slate-200 focus:border-[#0E2A6D] focus:ring-1 focus:ring-[#0E2A6D]"
          } ${(!selectedDate || disabled || loadingSlots) ? "opacity-50 cursor-not-allowed bg-slate-50" : ""} ${className}`}
        >
          <option value="" disabled>
            {!selectedDate
              ? "Select Date First"
              : loadingSlots
              ? "Checking Availability..."
              : "Select 30-Min Time Slot"}
          </option>

          {allSlots.map((time) => {
            const isBooked = bookedSlots.includes(time);
            return (
              <option
                key={time}
                value={time}
                disabled={isBooked}
                className={isBooked ? "text-slate-400 bg-slate-100 font-normal line-through" : "text-slate-900 font-semibold"}
              >
                {time} {isBooked ? "— Booked" : "— Available"}
              </option>
            );
          })}
        </select>

        <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {error && (
        <p className="mt-1 text-[11px] font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
};

export default TimeSlotPicker;
