import { playPop, playSparkle, playSuccess } from './audio.js';
import { OCCASION_FILTERS, UPCOMING_EVENTS, DAILY_STYLE_TIPS } from '../data/defaultCloset.js';

export function renderPlanner(container, state, navigateTo, openModal) {
  let activeViewMode = 'month'; // 'month' (Mes) or 'week' (Semana)
  let activeOccasionFilter = 'Casual'; // Default matching Image 1 & 3
  let selectedDate = '2026-09-01'; // Default selected day

  const calendarDays = [
    // Week 1
    { day: 29, isPrevMonth: true },
    { day: 30, isPrevMonth: true },
    { day: 1, dateStr: '2026-09-01', temp: '22°', weather: '☀️', lookId: 'look-1', eventName: 'New Work Styling' },
    { day: 2, dateStr: '2026-09-02', temp: '18°', weather: '☁️', lookId: 'look-6', eventName: 'Presentation' },
    { day: 3, dateStr: '2026-09-03', temp: '24°', weather: '☀️', lookId: 'look-1', eventName: 'Dinner Look' },
    { day: 4, dateStr: '2026-09-04', isRest: true },
    { day: 5, dateStr: '2026-09-05', isFreeDay: true, label: 'Día libre' },

    // Week 2
    { day: 6, dateStr: '2026-09-06', temp: '20°', weather: '☀️', lookId: 'look-2', eventName: 'Coffee & Books' },
    { day: 7, dateStr: '2026-09-07', temp: '21°', weather: '☀️', lookId: 'look-1', eventName: 'Work Monday' },
    { day: 8, dateStr: '2026-09-08', temp: '19°', weather: '☁️', lookId: 'look-2', eventName: 'Library Fit' },
    { day: 9, dateStr: '2026-09-09', temp: '17°', weather: '☁️', lookId: 'look-6', eventName: 'Client Pitch' },
    { day: 10, dateStr: '2026-09-10', temp: '20°', weather: '☀️', lookId: 'look-3', eventName: "Riya's Party ✨" },
    { day: 11, dateStr: '2026-09-11', isRest: true },
    { day: 12, dateStr: '2026-09-12', isBirthday: true, label: 'Cumpleaños 19:00' },

    // Week 3
    { day: 13, dateStr: '2026-09-13', temp: '23°', weather: '☀️', lookId: 'look-5', eventName: 'Brunch Outfit' },
    { day: 14, dateStr: '2026-09-14', temp: '18°', weather: '☁️', lookId: 'look-1', eventName: 'Office Styling' },
    { day: 15, dateStr: '2026-09-15', temp: '22°', weather: '☀️', lookId: 'look-2', eventName: 'Campus Casual' },
    { day: 16, dateStr: '2026-09-16', isRest: true },
    { day: 17, dateStr: '2026-09-17', temp: '19°', weather: '☁️', lookId: 'look-4', eventName: 'Shopping Day' },
    { day: 18, dateStr: '2026-09-18', isRest: true },
    { day: 19, dateStr: '2026-09-19', isFreeDay: true, label: 'Día libre' },

    // Week 4
    { day: 20, dateStr: '2026-09-20', temp: '21°', weather: '☀️', lookId: 'look-1', eventName: 'Minimal Monday' },
    { day: 21, dateStr: '2026-09-21', temp: '20°', weather: '☁️', lookId: 'look-2', eventName: 'Cafe Meetup' },
    { day: 22, dateStr: '2026-09-22', temp: '18°', weather: '☁️', lookId: 'look-1', eventName: 'Team Sync' },
    { day: 23, dateStr: '2026-09-23', temp: '22°', weather: '☀️', lookId: 'look-4', eventName: 'Pastel Trench' },
    { day: 24, dateStr: '2026-09-24', isRest: true },
    { day: 25, dateStr: '2026-09-25', isRest: true },
    { day: 26, dateStr: '2026-09-26', isTrip: true, label: 'Viaje ✈️' }
  ];

  function renderView() {
    const selectedDayData = calendarDays.find(d => d.dateStr === selectedDate) || calendarDays[2];
    const selectedLook = state.savedLooks.find(l => l.id === selectedDayData?.lookId) || state.savedLooks[0];
    const selectedPieces = (selectedLook?.itemIds || []).map(id => state.closetItems.find(c => c.id === id)).filter(Boolean);

    container.innerHTML = `
      <div class="h-full flex flex-col overflow-y-auto pb-28 bg-[#FAF8F5]">
        <!-- Top Editorial Header (Inspired by Image 3) -->
        <div class="px-5 pt-3 pb-2 sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md z-20 border-b border-[#EBE5DF]/60">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h1 class="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
                Calendario
              </h1>
              <p class="text-xs text-[#78716C] mt-0.5">
                Planifica tus looks y organiza tu semana.
              </p>
            </div>
            <button id="cal-notif-bell" class="w-8 h-8 rounded-full bg-white border border-[#EBE5DF] flex items-center justify-center text-xs shadow-xs">
              🔔
            </button>
          </div>

          <!-- Occasion Filters Scroll Bar (Matching Image 1 right screen) -->
          <div class="flex gap-2 overflow-x-auto py-1.5 no-scrollbar">
            ${OCCASION_FILTERS.map(occ => `
              <button data-occ-name="${occ}" class="occ-filter-chip px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeOccasionFilter === occ ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#78716C] border border-[#EBE5DF] hover:bg-stone-50'}">
                ${occ}
              </button>
            `).join('')}
          </div>

          <!-- Segmented Switcher: Mes vs Semana (Matching Image 3) -->
          <div class="segmented-control mt-2 max-w-xs mx-auto">
            <button id="seg-mes-btn" class="segmented-btn ${activeViewMode === 'month' ? 'active' : ''}">
              Mes
            </button>
            <button id="seg-semana-btn" class="segmented-btn ${activeViewMode === 'week' ? 'active' : ''}">
              Semana
            </button>
          </div>
        </div>

        <!-- Month Navigation Header -->
        <div class="p-5 pt-3 space-y-4">
          <div class="flex items-center justify-between px-1">
            <button id="prev-month-btn" class="text-sm text-[#78716C] hover:text-[#1C1917]">‹</button>
            <div class="flex items-center gap-1 cursor-pointer">
              <span class="font-serif text-base font-bold text-[#1C1917]">Septiembre 2026</span>
              <span class="text-xs text-[#78716C]">▼</span>
            </div>
            <button id="next-month-btn" class="text-sm text-[#78716C] hover:text-[#1C1917]">›</button>
          </div>

          <!-- Days of Week Header (LUN, MAR, MIÉ, JUE, VIE, SÁB, DOM) -->
          <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#A89F91]">
            <span>LUN</span><span>MAR</span><span>MIÉ</span><span>JUE</span><span>VIE</span><span>SÁB</span><span>DOM</span>
          </div>

          <!-- CALENDAR GRID WITH MINI FLAT-LAYS (Matching Image 3) -->
          <div class="grid grid-cols-7 gap-1.5">
            ${calendarDays.map(item => {
              if (item.isPrevMonth) {
                return `
                  <div class="cal-day-cell opacity-30 bg-[#F6F4F1]">
                    <span class="text-[10px] font-bold text-[#78716C]">${item.day}</span>
                  </div>
                `;
              }

              const isSelected = item.dateStr === selectedDate;
              const look = state.savedLooks.find(l => l.id === item.lookId);
              const piece = look ? state.closetItems.find(c => c.id === look.itemIds[0]) : null;

              return `
                <div data-cal-date="${item.dateStr || ''}" class="cal-day-cell cursor-pointer ${isSelected ? 'active-day' : ''}">
                  <span class="text-[10px] font-bold ${isSelected ? 'text-[#1C1917]' : 'text-[#78716C]'}">${item.day}</span>
                  
                  ${piece ? `
                    <div class="w-full flex-1 flex flex-col items-center justify-center my-0.5">
                      <img src="${piece.image}" alt="outfit" class="w-7 h-7 object-contain drop-shadow-xs" />
                      <span class="text-[8px] font-semibold text-[#78716C] mt-0.5 leading-none">
                        ${item.weather || '☀️'} ${item.temp || '20°'}
                      </span>
                    </div>
                  ` : item.isFreeDay ? `
                    <div class="w-full flex-1 flex flex-col items-center justify-center text-center">
                      <span class="text-[10px] text-rose-500">❤️</span>
                      <span class="text-[7px] text-[#78716C] font-semibold leading-tight">Día libre</span>
                    </div>
                  ` : item.isBirthday ? `
                    <div class="w-full flex-1 flex flex-col items-center justify-center text-center">
                      <span class="text-[10px]">🎂</span>
                      <span class="text-[7px] text-pink-700 font-semibold leading-tight">Fiesta</span>
                    </div>
                  ` : item.isTrip ? `
                    <div class="w-full flex-1 flex flex-col items-center justify-center text-center">
                      <span class="text-[10px]">✈️</span>
                      <span class="text-[7px] text-sky-700 font-semibold leading-tight">Viaje</span>
                    </div>
                  ` : `
                    <div class="w-full flex-1"></div>
                  `}
                </div>
              `;
            }).join('')}
          </div>

          <!-- SELECTED DAY STRIP & HORIZONTAL CAROUSEL (Matching Image 1 right screen) -->
          <div class="rounded-3xl bg-white border border-[#EBE5DF] p-4 shadow-xs">
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Scheduled for ${selectedDate || 'Today'}</span>
                <h4 class="font-serif text-sm font-bold text-[#1C1917]">${selectedDayData?.eventName || selectedLook.name}</h4>
              </div>
              <button id="edit-day-schedule-btn" class="text-xs font-semibold text-[#1C1917] hover:underline flex items-center gap-1">
                <span>Edit</span> <span>✏️</span>
              </button>
            </div>

            <!-- Horizontal Swipe Carousel of Isolated Items -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              ${selectedPieces.map(piece => `
                <div class="w-20 h-24 rounded-2xl bg-[#F6F4F1] p-1.5 shrink-0 flex flex-col items-center justify-between border border-[#EBE5DF]">
                  <img src="${piece.image}" alt="${piece.name}" class="w-12 h-14 object-contain" />
                  <span class="text-[8px] font-bold text-[#1C1917] truncate w-full text-center">${piece.name.split(' ')[0]}</span>
                </div>
              `).join('')}

              <button id="add-piece-to-day-btn" class="w-14 h-24 rounded-2xl border-2 border-dashed border-[#EBE5DF] shrink-0 flex flex-col items-center justify-center text-[#78716C] hover:border-[#1C1917]">
                <span class="text-base">➕</span>
              </button>
            </div>
          </div>

          <!-- UPCOMING EVENTS & TIP OF THE DAY (Exact match to Image 3 bottom cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <!-- Upcoming Events Card -->
            <div class="rounded-3xl bg-white border border-[#EBE5DF] p-4 shadow-xs flex flex-col justify-between">
              <div class="text-xs font-bold text-[#1C1917] mb-2.5 font-serif">Próximos eventos</div>
              
              <div class="space-y-2">
                ${UPCOMING_EVENTS.map(evt => `
                  <div class="flex items-center justify-between text-xs py-1.5 border-b border-[#F6F4F1] last:border-none">
                    <div class="flex items-center gap-2">
                      <span class="text-sm">${evt.icon}</span>
                      <div>
                        <div class="font-semibold text-[#1C1917] text-[11px]">${evt.title}</div>
                        <div class="text-[9px] text-[#78716C]">${evt.date}</div>
                      </div>
                    </div>
                    <span class="text-xs text-[#A89F91]">›</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Tip of the Day Card -->
            <div class="rounded-3xl bg-[#F6F4F1] border border-[#EBE5DF] p-4 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div>
                <div class="flex items-center gap-1 text-[11px] font-bold text-[#1C1917] mb-1.5 font-serif">
                  <span>✨</span> <span>Consejo del día</span>
                </div>
                <p class="text-xs text-[#78716C] leading-relaxed italic">
                  "${DAILY_STYLE_TIPS[0].quote}"
                </p>
              </div>
              <div class="flex justify-end mt-2">
                <span class="text-xl text-[#78716C] opacity-60">🌿</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    setupPlannerEvents();
  }

  function setupPlannerEvents() {
    // Occasion chips
    container.querySelectorAll('.occ-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        playPop();
        activeOccasionFilter = chip.getAttribute('data-occ-name');
        renderView();
      });
    });

    // Segmented Mes / Semana
    const mesBtn = container.querySelector('#seg-mes-btn');
    const semBtn = container.querySelector('#seg-semana-btn');
    if (mesBtn) {
      mesBtn.addEventListener('click', () => {
        playPop();
        activeViewMode = 'month';
        renderView();
      });
    }
    if (semBtn) {
      semBtn.addEventListener('click', () => {
        playPop();
        activeViewMode = 'week';
        renderView();
      });
    }

    // Calendar Day Cell Selection
    container.querySelectorAll('.cal-day-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const date = cell.getAttribute('data-cal-date');
        if (date) {
          playPop();
          selectedDate = date;
          renderView();
        }
      });
    });

    // Edit Schedule Button
    const editBtn = container.querySelector('#edit-day-schedule-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        playPop();
        openModal('schedule', {
          date: selectedDate,
          onScheduled: () => renderView()
        });
      });
    }

    const addPieceBtn = container.querySelector('#add-piece-to-day-btn');
    if (addPieceBtn) {
      addPieceBtn.addEventListener('click', () => {
        playPop();
        openModal('schedule', {
          date: selectedDate,
          onScheduled: () => renderView()
        });
      });
    }
  }

  renderView();
}
