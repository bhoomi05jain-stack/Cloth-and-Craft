import { playPop, playSparkle, playSuccess } from './audio.js';

export function renderLaundry(container, state, navigateTo, openModal) {
  function getLaundryItems() {
    return state.closetItems.filter(i => i.status === 'in_laundry');
  }

  function getAvailableItems() {
    return state.closetItems.filter(i => i.status !== 'in_laundry');
  }

  function renderView() {
    const laundryItems = getLaundryItems();
    const availableCount = getAvailableItems().length;

    container.innerHTML = `
      <div class="h-full flex flex-col overflow-y-auto pb-24 bg-[#FAF7F2]">
        <!-- Sticky Header -->
        <div class="p-5 pb-3 sticky top-0 bg-[#FAF7F2]/90 backdrop-blur-md z-20 border-b border-pink-100/60 flex items-center justify-between">
          <div>
            <div class="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">🧺 Smart Wash Shield</div>
            <h1 class="font-serif text-2xl font-bold text-[#2D2522] flex items-center gap-2">
              <span>Laundry</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-sans">${laundryItems.length} in wash</span>
            </h1>
          </div>

          <button id="send-to-wash-btn" class="btn-press px-3.5 py-2 rounded-2xl bg-white border border-amber-300 text-amber-800 text-xs font-bold shadow-xs hover:bg-amber-50 flex items-center gap-1.5">
            <span>🧺 Wash More</span>
          </button>
        </div>

        <div class="p-5 space-y-5">
          <!-- LAUNDRY CHECK SMART REMINDER BANNER -->
          ${laundryItems.length > 0 ? `
            <div class="rounded-3xl p-4 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 border border-amber-200 shadow-sm relative overflow-hidden">
              <div class="flex items-center gap-2.5 mb-2">
                <div class="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-base">
                  🧺
                </div>
                <div>
                  <h3 class="font-serif text-sm font-bold text-[#2D2522]">Laundry Check ✨</h3>
                  <span class="text-[10px] font-semibold text-amber-800">Friendly Wardrobe AI Reminder</span>
                </div>
              </div>
              <p class="text-xs text-[#786C68] leading-relaxed mb-3">
                "These clothes have been in your laundry for a while. Are they clean and ready to return to your closet?"
              </p>
              
              <div class="grid grid-cols-2 gap-2">
                <button id="return-all-clean-btn" class="btn-press py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1">
                  <span>✅ Back in Closet</span>
                </button>
                <button id="still-washing-btn" class="btn-press py-2.5 px-3 rounded-xl bg-white border border-amber-200 text-amber-900 font-bold text-xs shadow-xs hover:bg-amber-100/50 flex items-center justify-center gap-1">
                  <span>🧺 Still Washing</span>
                </button>
              </div>
            </div>
          ` : `
            <div class="rounded-3xl p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center shadow-xs">
              <div class="w-12 h-12 mx-auto mb-2 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
                ✨
              </div>
              <h3 class="font-serif text-base font-bold text-emerald-900">Your Laundry Basket is Empty!</h3>
              <p class="text-xs text-emerald-700 mt-1">All ${availableCount} wardrobe pieces are clean, fresh, and ready to style.</p>
            </div>
          `}

          <!-- ITEMS CURRENTLY IN LAUNDRY -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h2 class="font-serif text-lg font-bold text-[#2D2522] flex items-center gap-1.5">
                <span>Items in Laundry</span>
                <span class="text-xs text-[#786C68] font-sans font-normal">(Excluded from AI suggestions)</span>
              </h2>
            </div>

            ${laundryItems.length === 0 ? `
              <div class="p-8 text-center rounded-3xl bg-white border border-pink-100">
                <span class="text-3xl">👗🧺</span>
                <p class="text-xs text-[#786C68] mt-2">No clothes in laundry right now.</p>
              </div>
            ` : `
              <div class="space-y-2.5">
                ${laundryItems.map(item => `
                  <div class="rounded-2xl bg-white border border-pink-100 p-3 flex items-center justify-between shadow-xs hover:border-pink-300 transition-all">
                    <div class="flex items-center gap-3">
                      <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl border border-pink-50" />
                      <div>
                        <h4 class="text-xs font-bold text-[#2D2522]">${item.name}</h4>
                        <div class="flex items-center gap-2 mt-0.5">
                          <span class="text-[10px] text-[#786C68]">${item.color} • ${item.category}</span>
                          <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                            🧺 ${item.laundryDays || 2} days in wash
                          </span>
                        </div>
                      </div>
                    </div>

                    <button data-return-item="${item.id}" class="return-item-btn btn-press px-3 py-2 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-100 flex items-center gap-1">
                      <span>✅ Clean</span>
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Quick Tip -->
          <div class="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-start gap-2.5">
            <span class="text-base">💡</span>
            <div class="text-[11px] text-[#786C68]">
              <strong class="text-[#2D2522]">Smart Outfit Protection:</strong> Clothes marked as "In Laundry" will never be suggested in your daily outfits or week planner until you mark them clean.
            </div>
          </div>
        </div>
      </div>
    `;

    setupLaundryEvents();
  }

  function setupLaundryEvents() {
    // Return all items clean
    const returnAllBtn = container.querySelector('#return-all-clean-btn');
    if (returnAllBtn) {
      returnAllBtn.addEventListener('click', () => {
        playSuccess();
        state.closetItems.forEach(item => {
          if (item.status === 'in_laundry') {
            item.status = 'available';
            item.laundryDays = 0;
          }
        });
        if (window.confetti) {
          window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
        }
        showToast('✨ All clothes returned to your active closet!');
        renderView();
      });
    }

    // Still washing reminder snooze
    const stillWashingBtn = container.querySelector('#still-washing-btn');
    if (stillWashingBtn) {
      stillWashingBtn.addEventListener('click', () => {
        playPop();
        showToast('🧺 Got it! We will check back with you later.');
      });
    }

    // Return individual item
    container.querySelectorAll('.return-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSparkle();
        const itemId = btn.getAttribute('data-return-item');
        const item = state.closetItems.find(i => i.id === itemId);
        if (item) {
          item.status = 'available';
          item.laundryDays = 0;
          showToast(`✅ ${item.name.split(' ')[0]} is back in your closet!`);
          renderView();
        }
      });
    });

    // Send more to wash
    container.querySelector('#send-to-wash-btn').addEventListener('click', () => {
      playPop();
      openModal('send_to_wash', {
        onUpdated: () => renderView()
      });
    });
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#2D2522] text-white text-xs font-bold shadow-xl animate-toast-in flex items-center gap-2 border border-white/20';
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  renderView();
}
