import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarCheck,
  Flame,
  MessagesSquare,
  Sparkles,
  TrendingDown,
  Wind,
} from "lucide-react";
import { useApp } from "../context/AppStateContext";
import { AREA_LABEL } from "../lib/routines";
import { computeStreak } from "../lib/storage";
import { Reveal, StatCard } from "../components/ui";
import { useTokens } from "../components/useTokens";
import { ReminderCard } from "../components/Reminders";

const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export function Progress() {
  const { sessions } = useApp();
  const c = useTokens();

  if (sessions.length === 0) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md text-center">
          <span className="grid mx-auto h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
            <Sparkles size={28} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">
            Your progress starts here
          </h1>
          <p className="mt-3 text-muted">
            Once you complete a session, you'll see your comfort, mobility, and
            streaks build over time — gentle proof that patience works.
          </p>
          <Link to="/safety" className="btn-primary mt-7 h-12 px-6">
            Do your first session
          </Link>
        </div>
        <div className="mx-auto mt-10 max-w-md">
          <ReminderCard />
        </div>
      </div>
    );
  }

  const ordered = [...sessions].sort((a, b) => a.date - b.date);
  const streak = computeStreak(sessions.map((s) => s.date));
  const weekAgo = Date.now() - 7 * 86_400_000;
  const thisWeek = sessions.filter((s) => s.date >= weekAgo).length;
  const reliefs = sessions
    .map((s) => s.painBefore - s.painAfter)
    .filter((d) => Number.isFinite(d));
  const avgRelief =
    reliefs.length > 0
      ? reliefs.reduce((a, b) => a + b, 0) / reliefs.length
      : 0;

  const painData = ordered.map((s, i) => ({
    label: `${fmtDate(s.date)}`,
    idx: i + 1,
    before: s.painBefore,
    after: s.painAfter,
  }));
  const mobilityData = ordered.map((s) => ({
    label: fmtDate(s.date),
    mobility: s.mobility,
  }));

  const recent = [...sessions].sort((a, b) => b.date - a.date).slice(0, 6);

  return (
    <div className="container-page py-10">
      <Reveal>
        <span className="eyebrow">Your recovery, over time</span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Progress
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Small, consistent movement adds up. Here's what you've been building.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal>
          <StatCard
            icon={<CalendarCheck size={16} />}
            label="Sessions"
            value={sessions.length}
            hint="completed in total"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <StatCard
            icon={<Flame size={16} />}
            label="Streak"
            value={`${streak} day${streak === 1 ? "" : "s"}`}
            hint="keep it gently going"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <StatCard
            icon={<TrendingDown size={16} />}
            label="Avg. relief"
            value={`${avgRelief > 0 ? "−" : ""}${Math.abs(avgRelief).toFixed(1)}`}
            hint="discomfort drop per session"
          />
        </Reveal>
        <Reveal delay={0.15}>
          <StatCard
            icon={<Wind size={16} />}
            label="This week"
            value={thisWeek}
            hint="sessions in last 7 days"
          />
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="card p-6">
            <h2 className="font-display text-xl font-semibold">
              Comfort before &amp; after
            </h2>
            <p className="mb-4 text-sm text-muted">
              Lower is better. The gap between the lines is your relief.
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={painData} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={c.line} strokeDasharray="4 4" />
                  <XAxis
                    dataKey="idx"
                    stroke={c.muted}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke={c.muted}
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: c.surface,
                      border: `1px solid ${c.line}`,
                      borderRadius: 12,
                      color: c.ink,
                    }}
                    labelFormatter={(v) => `Session ${v}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="before"
                    name="Before"
                    stroke={c.accent}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="after"
                    name="After"
                    stroke={c.brand}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex gap-5 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: c.accent }}
                />
                Before
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: c.brand }}
                />
                After
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.06}>
          <div className="card p-6">
            <h2 className="font-display text-xl font-semibold">
              Mobility trend
            </h2>
            <p className="mb-4 text-sm text-muted">
              How free the area feels after each session (1–5).
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mobilityData}
                  margin={{ left: -24, right: 8, top: 8 }}
                >
                  <defs>
                    <linearGradient id="mob" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.brand} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={c.brand} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={c.line} strokeDasharray="4 4" />
                  <XAxis dataKey="label" stroke={c.muted} fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 5]} stroke={c.muted} fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: c.surface,
                      border: `1px solid ${c.line}`,
                      borderRadius: 12,
                      color: c.ink,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mobility"
                    stroke={c.brand}
                    strokeWidth={2.5}
                    fill="url(#mob)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <h2 className="mt-10 font-display text-2xl font-semibold">
          Recent sessions
        </h2>
      </Reveal>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {recent.map((s) => {
          const relief = s.painBefore - s.painAfter;
          return (
            <Reveal key={s.id}>
              <div className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-ink">{s.routineTitle}</p>
                  <p className="text-sm text-muted">
                    {AREA_LABEL[s.area]} · {s.minutes} min ·{" "}
                    {new Date(s.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    relief > 0
                      ? "bg-brand-soft text-brand-ink"
                      : "bg-surface-2 text-muted"
                  }`}
                >
                  {relief > 0 ? `−${relief}` : relief === 0 ? "±0" : `+${-relief}`}{" "}
                  discomfort
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.09}>
        <div className="mt-8">
          <ReminderCard />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/safety" className="btn-primary h-12 px-6">
            Start another session
          </Link>
          <Link to="/feedback" className="btn-ghost h-12 px-6">
            <MessagesSquare size={17} /> Share 30-second feedback
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
