import React, { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Trash2, Check } from 'lucide-react';

interface CustomDateTimeControlProps {
  label: string;
  icon?: 'calendar' | 'clock';
  value: string; // Format: "YYYY-MM-DDTHH:mm" or ""
  onChange: (val: string) => void;
  currentLang?: string;
  tUi?: Record<string, string>;
  isCreationDate?: boolean;
  onSyncWithCreationDate?: () => void;
}

export const CustomDateTimeControl: React.FC<CustomDateTimeControlProps> = ({
  label,
  icon = 'calendar',
  value,
  onChange,
  currentLang = 'en',
  tUi = {},
  isCreationDate = true,
  onSyncWithCreationDate,
}) => {
  const t = (key: string, fallback: string) => tUi[key] || fallback;

  const [isOpen, setIsOpen] = useState(false);

  // Helper to parse "YYYY-MM-DDTHH:mm" safely
  const parsedDate = useMemo(() => {
    if (!value) {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(), // 0-indexed
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        isValid: false,
      };
    }
    const [datePart, timePart] = value.split('T');
    if (!datePart) {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        isValid: false,
      };
    }
    const [y, m, d] = datePart.split('-').map(Number);
    let hour = 12;
    let minute = 0;
    if (timePart) {
      const [h, min] = timePart.split(':').map(Number);
      hour = isNaN(h) ? 12 : h;
      minute = isNaN(min) ? 0 : min;
    }
    return {
      year: isNaN(y) ? new Date().getFullYear() : y,
      month: isNaN(m) ? new Date().getMonth() : m - 1,
      day: isNaN(d) ? new Date().getDate() : d,
      hour,
      minute,
      isValid: true,
    };
  }, [value]);

  // Current calendar view navigation month & year
  const [viewYear, setViewYear] = useState<number>(parsedDate.year);
  const [viewMonth, setViewMonth] = useState<number>(parsedDate.month);

  // Sync view when parsedDate changes if user selects a preset
  const syncViewToDate = (y: number, m: number) => {
    setViewYear(y);
    setViewMonth(m);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  const buildDateTimeString = (y: number, m: number, d: number, h: number, min: number): string => {
    return `${y}-${pad(m + 1)}-${pad(d)}T${pad(h)}:${pad(min)}`;
  };

  const getDatetimeLocal = (d?: Date): string => {
    const now = d || new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const getPastDate = (daysAgo: number = 0, monthsAgo: number = 0, yearsAgo: number = 0): string => {
    const d = new Date();
    if (yearsAgo) d.setFullYear(d.getFullYear() - yearsAgo);
    if (monthsAgo) d.setMonth(d.getMonth() - monthsAgo);
    if (daysAgo) d.setDate(d.getDate() - daysAgo);
    return getDatetimeLocal(d);
  };

  // Human-readable formatted string for header badge
  const formattedDisplay = useMemo(() => {
    if (!value || !parsedDate.isValid) return null;
    try {
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) return value.replace('T', ', ');
      return new Intl.DateTimeFormat(currentLang || 'en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(dateObj);
    } catch {
      return value.replace('T', ', ');
    }
  }, [value, parsedDate.isValid, currentLang]);

  // Month names for current language
  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(currentLang || 'en', { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2026, i, 15);
      return formatter.format(d);
    });
  }, [currentLang]);

  // Weekday abbreviations
  const weekdayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(currentLang || 'en', { weekday: 'narrow' });
    // Jan 4, 2026 is Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2026, 0, 4 + i);
      return formatter.format(d);
    });
  }, [currentLang]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const days: { day: number; monthOffset: number; isCurrentMonth: boolean; dateKey: string }[] = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push({
        day: d,
        monthOffset: -1,
        isCurrentMonth: false,
        dateKey: `prev-${d}`,
      });
    }

    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push({
        day: d,
        monthOffset: 0,
        isCurrentMonth: true,
        dateKey: `curr-${d}`,
      });
    }

    // Trailing days from next month to fill grid (multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        day: d,
        monthOffset: 1,
        isCurrentMonth: false,
        dateKey: `next-${d}`,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Navigation handlers
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleSelectDay = (day: number, monthOffset: number) => {
    let targetYear = viewYear;
    let targetMonth = viewMonth + monthOffset;
    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
    const newStr = buildDateTimeString(targetYear, targetMonth, day, parsedDate.hour, parsedDate.minute);
    onChange(newStr);
    syncViewToDate(targetYear, targetMonth);
  };

  const handleTimeChange = (type: 'hour' | 'minute', val: number) => {
    const newHour = type === 'hour' ? val : parsedDate.hour;
    const newMin = type === 'minute' ? val : parsedDate.minute;
    const newStr = buildDateTimeString(
      parsedDate.isValid ? parsedDate.year : viewYear,
      parsedDate.isValid ? parsedDate.month : viewMonth,
      parsedDate.isValid ? parsedDate.day : 1,
      newHour,
      newMin
    );
    onChange(newStr);
  };

  // Year options for quick jump (2030 down to 1980)
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear + 4; y >= 1980; y--) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  // Today indicator
  const today = new Date();
  const isTodayDate = (d: number, isCurr: boolean) => {
    return isCurr && viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate();
  };

  const isSelectedDate = (d: number, isCurr: boolean) => {
    return (
      parsedDate.isValid &&
      isCurr &&
      viewYear === parsedDate.year &&
      viewMonth === parsedDate.month &&
      d === parsedDate.day
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Label and Clear action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {icon === 'clock' ? (
            <Clock size={13} className="text-brand-primary" />
          ) : (
            <Calendar size={13} className="text-brand-primary" />
          )}
          <span>{label}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '0.7rem',
              cursor: 'pointer',
              padding: '2px 4px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Trash2 size={11} />
            <span>{t('quick_date_clear', 'Clear')}</span>
          </button>
        )}
      </div>

      {/* Modern Interactive Display Button (Replaces ugly browser input) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isOpen && parsedDate.isValid) {
            syncViewToDate(parsedDate.year, parsedDate.month);
          }
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: 8,
          border: isOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: isOpen ? '0 0 0 2px rgba(59, 130, 246, 0.15)' : 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          {icon === 'clock' ? (
            <Clock size={14} style={{ color: value ? 'var(--brand-primary)' : 'var(--text-muted)', flexShrink: 0 }} />
          ) : (
            <Calendar size={14} style={{ color: value ? 'var(--brand-primary)' : 'var(--text-muted)', flexShrink: 0 }} />
          )}
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: value ? 600 : 400,
              color: value ? 'var(--text-main)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {formattedDisplay || t('no_date_set', 'No timestamp set (Cleared)')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span
            style={{
              fontSize: '0.7rem',
              padding: '2px 7px',
              borderRadius: 6,
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            {isOpen ? t('close_btn', 'Close') : t('edit_date_btn', 'Edit')}
          </span>
          {isOpen ? (
            <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
      </div>

      {/* Quick 1-Click Preset Badges (Always Accessible) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        <button
          type="button"
          onClick={() => {
            const nowStr = getDatetimeLocal();
            onChange(nowStr);
            const now = new Date();
            syncViewToDate(now.getFullYear(), now.getMonth());
          }}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.15s ease',
          }}
        >
          ⚡ {t('quick_date_now', 'Now')}
        </button>

        {isCreationDate ? (
          <>
            <button
              type="button"
              onClick={() => {
                const past = getPastDate(1);
                onChange(past);
                const d = new Date(past);
                syncViewToDate(d.getFullYear(), d.getMonth());
              }}
              style={{
                padding: '3px 8px',
                fontSize: '0.7rem',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              📅 {t('quick_date_yesterday', 'Yesterday')}
            </button>
            <button
              type="button"
              onClick={() => {
                const past = getPastDate(7);
                onChange(past);
                const d = new Date(past);
                syncViewToDate(d.getFullYear(), d.getMonth());
              }}
              style={{
                padding: '3px 8px',
                fontSize: '0.7rem',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              🗓️ {t('quick_date_1week', '1 Week Ago')}
            </button>
            <button
              type="button"
              onClick={() => {
                const past = getPastDate(0, 1);
                onChange(past);
                const d = new Date(past);
                syncViewToDate(d.getFullYear(), d.getMonth());
              }}
              style={{
                padding: '3px 8px',
                fontSize: '0.7rem',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              🗓️ {t('quick_date_1month', '1 Month Ago')}
            </button>
            <button
              type="button"
              onClick={() => {
                const past = getPastDate(0, 0, 1);
                onChange(past);
                const d = new Date(past);
                syncViewToDate(d.getFullYear(), d.getMonth());
              }}
              style={{
                padding: '3px 8px',
                fontSize: '0.7rem',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              🗓️ {t('quick_date_1year', '1 Year Ago')}
            </button>
          </>
        ) : (
          onSyncWithCreationDate && (
            <button
              type="button"
              onClick={onSyncWithCreationDate}
              style={{
                padding: '3px 8px',
                fontSize: '0.7rem',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              🔄 {t('quick_date_sync', 'Match Creation Date')}
            </button>
          )
        )}
      </div>

      {/* Sleek Custom Calendar & Time Picker Panel (Expanded) */}
      {isOpen && (
        <div
          style={{
            marginTop: 4,
            padding: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 10,
            boxShadow: '0 4px 16px -2px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Calendar Header: Month & Year Jump Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                padding: '4px 6px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Previous Month"
            >
              <ChevronLeft size={14} />
            </button>

            <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center' }}>
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                style={{
                  padding: '3px 6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                style={{
                  padding: '3px 6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                padding: '4px 6px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Next Month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday Names Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              paddingBottom: 2,
            }}
          >
            {weekdayNames.map((w, idx) => (
              <span key={idx}>{w}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 2,
            }}
          >
            {calendarDays.map((item) => {
              const selected = isSelectedDate(item.day, item.isCurrentMonth);
              const isToday = isTodayDate(item.day, item.isCurrentMonth);

              return (
                <button
                  key={item.dateKey}
                  type="button"
                  onClick={() => handleSelectDay(item.day, item.monthOffset)}
                  style={{
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: selected ? 700 : isToday ? 600 : 500,
                    borderRadius: 6,
                    border: isToday && !selected ? '1px solid var(--brand-primary)' : '1px solid transparent',
                    background: selected ? 'var(--brand-primary, #3b82f6)' : 'transparent',
                    color: selected
                      ? '#ffffff'
                      : item.isCurrentMonth
                      ? 'var(--text-main)'
                      : 'var(--text-muted)',
                    opacity: item.isCurrentMonth ? 1 : 0.35,
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    padding: 0,
                  }}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-color)', margin: '2px 0' }} />

          {/* Time Picker Row & Close Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} className="text-brand-primary" />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {t('time_label', 'Time')}:
              </span>

              {/* Hour Selector */}
              <select
                value={parsedDate.hour}
                onChange={(e) => handleTimeChange('hour', Number(e.target.value))}
                style={{
                  padding: '2px 5px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 5,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>
                    {pad(h)}
                  </option>
                ))}
              </select>

              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>:</span>

              {/* Minute Selector */}
              <select
                value={parsedDate.minute}
                onChange={(e) => handleTimeChange('minute', Number(e.target.value))}
                style={{
                  padding: '2px 5px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 5,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                {Array.from({ length: 60 }, (_, m) => (
                  <option key={m} value={m}>
                    {pad(m)}
                  </option>
                ))}
              </select>
            </div>

            {/* Done / Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                background: 'var(--brand-primary, #3b82f6)',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <Check size={12} />
              <span>{t('done_btn', 'Done')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
