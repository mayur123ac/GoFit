"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaDumbbell, FaChartLine, FaFire, FaArrowRight, FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ── Types ──────────────────────────────────────────────────────────────────────
type DayStatus = "workout" | "skipped" | "future" | "today" | "none";

interface DayInfo {
  date: number;
  status: DayStatus;
}

// ── Calendar Component ─────────────────────────────────────────────────────────
function WorkoutCalendar({ workoutDates, skippedDates }: { workoutDates: string[]; skippedDates: string[] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const getStatus = (day: number): DayStatus => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cellDate = new Date(year, month, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (cellDate > todayMidnight) return "future";
    if (cellDate.toDateString() === todayMidnight.toDateString()) return "today";
    if (workoutDates.includes(dateStr)) return "workout";
    if (skippedDates.includes(dateStr)) return "skipped";
    return "none"; // past day with no data
  };

  const days: (DayInfo | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      status: getStatus(i + 1),
    })),
  ];

  const statusStyles: Record<DayStatus, string> = {
    workout: "bg-green-500/20 border-green-500/40 text-green-400",
    skipped: "bg-red-500/10 border-red-500/30 text-red-400",
    today: "bg-green-500 border-green-400 text-black font-black ring-2 ring-green-400/50",
    future: "bg-transparent border-zinc-800 text-zinc-600",
    none: "bg-zinc-900/50 border-zinc-800 text-zinc-500",
  };

  const statusIcon: Record<DayStatus, string> = {
    workout: "✓",
    skipped: "✕",
    today: "",
    future: "",
    none: "",
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Summary counts
  const workoutCount = days.filter(d => d?.status === "workout").length;
  const skippedCount = days.filter(d => d?.status === "skipped").length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 hover:border-green-500/30 transition-all duration-300">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <FaCalendarAlt className="text-green-400 text-sm" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Gym Calendar</h2>
            <p className="text-zinc-500 text-xs">Track your consistency</p>
          </div>
        </div>

        {/* Month navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          >
            <FaChevronLeft className="text-zinc-400 text-xs" />
          </button>
          <span className="text-white font-bold text-sm w-28 text-center">
            {monthName} {year}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          >
            <FaChevronRight className="text-zinc-400 text-xs" />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-zinc-600 text-xs font-semibold py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) =>
          day === null ? (
            <div key={`empty-${idx}`} />
          ) : (
            <div
              key={day.date}
              className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center text-xs transition-all ${statusStyles[day.status]}`}
            >
              <span className={`font-bold ${day.status === "today" ? "text-sm" : "text-xs"}`}>
                {day.date}
              </span>
              {statusIcon[day.status] && (
                <span className={`text-[9px] leading-none font-black ${day.status === "skipped" ? "text-red-400" : "text-green-400"}`}>
                  {statusIcon[day.status]}
                </span>
              )}
            </div>
          )
        )}
      </div>

      {/* Legend + stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-green-500/20 border border-green-500/40 flex items-center justify-center">
              <span className="text-[8px] text-green-400 font-black">✓</span>
            </div>
            <span className="text-zinc-500 text-xs">Workout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <span className="text-[8px] text-red-400 font-black">✕</span>
            </div>
            <span className="text-zinc-500 text-xs">Skipped</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-green-400 font-bold">{workoutCount} 💪</span>
          <span className="text-red-400 font-bold">{skippedCount} ❌</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: session } = useSession();

  // Replace these with real API data from your workout history
  // workoutDates = days user actually logged a workout
  // skippedDates = days user explicitly marked as skipped (or days with no workout logged, past today)
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [skippedDates, setSkippedDates] = useState<string[]>([]);

  useEffect(() => {
    if (!session) return;

    // TODO: Replace with your actual API call
    // Example: fetch("/api/workout-dates").then(r => r.json()).then(data => {
    //   setWorkoutDates(data.workoutDates);
    //   setSkippedDates(data.skippedDates);
    // });

    // ── Demo data (remove once you wire up your API) ──
    const today = new Date();
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const demoWorkouts: string[] = [];
    const demoSkipped: string[] = [];

    for (let i = 1; i <= 22; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), i);
      if (d >= today) break;
      if (i % 3 === 0) demoSkipped.push(fmt(d));
      else demoWorkouts.push(fmt(d));
    }

    setWorkoutDates(demoWorkouts);
    setSkippedDates(demoSkipped);
    // ── End demo data ──
  }, [session]);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
            <FaFire className="text-orange-400" />
            Your Ultimate Workout Tracker
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-4">
            <span className="gradient-text">GO</span>
            <span className="text-white"> FIT</span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-md mx-auto mb-10 leading-relaxed">
            Track every rep, every set, every gain.
            <br />
            <span className="text-white font-medium">Crush your personal records.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={session ? "/track" : "/login"}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-black font-bold text-lg rounded-2xl hover:bg-green-400 transition-all hover:scale-105 pulse-glow"
            >
              <FaDumbbell />
              {session ? "Go to Tracker" : "Start Tracking Free"}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {session && (
              <Link
                href="/history"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white font-bold text-lg rounded-2xl hover:bg-zinc-700 transition-all"
              >
                <FaChartLine />
                View History
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Cards section */}
      <section className="px-4 pb-16 max-w-4xl mx-auto space-y-4">
        {/* Track Progress Card */}
        <Link href={session ? "/track" : "/login"} className="block group">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/5 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FaChartLine className="text-2xl text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Track Progress</h2>
                <p className="text-zinc-500 text-sm">Log today&apos;s exercises, sets, reps & weights</p>
              </div>
              <FaArrowRight className="text-3xl text-zinc-700 group-hover:text-green-400 group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        </Link>

        {/* Calendar Card — only shown when logged in */}
        {session && (
          <WorkoutCalendar workoutDates={workoutDates} skippedDates={skippedDates} />
        )}

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "💪", title: "Track Sets & Reps", desc: "Log every exercise with precision" },
            { icon: "📈", title: "Progressive Overload", desc: "See +kg and +reps vs last session" },
            { icon: "📅", title: "Workout History", desc: "Review every past workout day" },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-zinc-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}