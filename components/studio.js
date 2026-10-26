import { playPop, playSparkle, playSuccess } from './audio.js';

export function renderStudio(container, state, navigateTo, openModal) {
  let selectedSlots = {
    top: state.closetItems.find(i => i.category === 'tops' && i.status === 'available') || null,
    bottom: state.closetItems.find(i => i.category === 'bottoms' && i.status === 'available') || null,
    outerwear: null,
    shoes: state.closetItems.find(i => i.category === 'shoes' && i.status === 'available') || null,
    bag: state.closetItems.find(i => i.category === 'bags' && i.status === 'available') || null,
    accessory: state.closetItems.find(i => i.category === 'accessories' && i.status === 'available') || null
  };

  let outfitName = 'Sunday Brunch 🌸';
  let outfitOccasion = 'Brunch';
  let outfitVibe = 'Romantic';

  const nameIdeas = [
    'Sunday Brunch 🌸',
    'College Casual 📚',
    'Party Night ✨',
    'Comfort Day ☁️',
    'Chic Presentation 💼',
    'Coffee & Books ☕'
  ];

  function renderView() {
    const activeItems = Object.values(selectedSlots).filter(Boolean);
    const matchScore = Math.min(99, 85 + activeItems.length * 3);

    container.innerHTML = `
      <div class="h-full flex flex-col overflow-y-auto pb-24 bg-[#FAF7F2]">
        <!-- Sticky Header -->
        <div class="p-5 pb-3 sticky top-0 bg-[#FAF7F2]/90 backdrop-blur-md z-20 border-b border-pink-100/60 flex items-center justify-between">
          <div>
            <div class="text-[11px] font-semibold text-pink-600 uppercase tracking-wider">✨ Styling Studio</div>
            <h1 class="font-serif text-2xl font-bold text-[#2D2522]">Create a Look</h1>
          </div>
          <button id="studio-clear-btn" class="text-xs font-semibold text-[#786C68] hover:text-pink-600 px-3 py-1 rounded-xl bg-white border border-pink-200">
            Clear All
          </button>
        </div>

        <div class="p-5 space-y-5">
          <!-- Look Title Input & Quick Name Chips -->
          <div class="glass-card rounded-3xl p-4 border border-pink-200 shadow-xs">
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1.5">Outfit Name</label>
            <input type="text" id="look-name-input" value="${outfitName}" placeholder="e.g. Sunday Brunch 🌸" class="w-full px-4 py-2.5 rounded-2xl bg-white border border-pink-200 text-sm font-bold text-[#2D2522] focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-xs mb-2.5" />
            
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span class="text-[10px] text-[#A89F91] shrink-0">Suggestions:</span>
              ${nameIdeas.map(idea => `
                <button type="button" class="name-idea-chip px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[10px] font-semibold text-pink-700 hover:bg-pink-100 whitespace-nowrap">
                  ${idea}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Interactive Styling Mannequin / Grid Canvas -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-[#2D2522] flex items-center gap-1.5">
                <span>Mix & Match Canvas</span>
                <span class="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">✨ ${matchScore}% Harmony</span>
              </span>
              <span class="text-[11px] text-[#786C68]">Tap slot to swap</span>
            </div>

            <!-- Mannequin Grid Layout -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Top Slot -->
              ${renderSlot('top', '👕 Top / Kurti', selectedSlots.top)}
              
              <!-- Bottom Slot -->
              ${renderSlot('bottom', '👖 Bottom / Skirt', selectedSlots.bottom)}

              <!-- Outerwear Slot -->
              ${renderSlot('outerwear', '🧥 Outerwear / Blazer', selectedSlots.outerwear)}

              <!-- Shoes Slot -->
              ${renderSlot('shoes', '👟 Footwear', selectedSlots.shoes)}

              <!-- Bag Slot -->
              ${renderSlot('bag', '👜 Bag / Purse', selectedSlots.bag)}

              <!-- Accessory Slot -->
              ${renderSlot('accessory', '💍 Jewelry / Acc', selectedSlots.accessory)}
            </div>
          </div>

          <!-- Occasion & Vibe Tags Selector -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Occasion</label>
              <select id="look-occasion-select" class="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]">
                <option value="Brunch" ${outfitOccasion === 'Brunch' ? 'selected' : ''}>🌸 Brunch</option>
                <option value="College" ${outfitOccasion === 'College' ? 'selected' : ''}>📚 College</option>
                <option value="Party Night" ${outfitOccasion === 'Party Night' ? 'selected' : ''}>✨ Party Night</option>
                <option value="Work" ${outfitOccasion === 'Work' ? 'selected' : ''}>💼 Work & Office</option>
                <option value="Vacation" ${outfitOccasion === 'Vacation' ? 'selected' : ''}>🏖️ Vacation</option>
                <option value="Everyday" ${outfitOccasion === 'Everyday' ? 'selected' : ''}>☁️ Everyday Casual</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Aesthetic Vibe</label>
              <select id="look-vibe-select" class="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]">
                <option value="Cute & Girly" ${outfitVibe === 'Cute & Girly' ? 'selected' : ''}>💗 Cute & Girly</option>
                <option value="Clean & Minimal" ${outfitVibe === 'Clean & Minimal' ? 'selected' : ''}>🤍 Clean & Minimal</option>
                <option value="Dark & Edgy" ${outfitVibe === 'Dark & Edgy' ? 'selected' : ''}>🖤 Dark & Edgy</option>
                <option value="Romantic" ${outfitVibe === 'Romantic' ? 'selected' : ''}>🌸 Romantic</option>
                <option value="Cozy" ${outfitVibe === 'Cozy' ? 'selected' : ''}>☕ Cozy</option>
                <option value="Party Ready" ${outfitVibe === 'Party Ready' ? 'selected' : ''}>✨ Party Ready</option>
              </select>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="space-y-2 pt-2">
            <button id="save-look-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2">
              <span>Save Outfit to Style Vault</span>
              <span>❤️</span>
            </button>

            <div class="grid grid-cols-2 gap-2">
              <button id="wear-now-btn" class="btn-press py-3 rounded-2xl bg-white border border-pink-200 text-[#2D2522] font-bold text-xs shadow-xs hover:bg-pink-50/50 flex items-center justify-center gap-1.5">
                <span>👗 Wear Today</span>
              </button>
              <button id="schedule-look-btn" class="btn-press py-3 rounded-2xl bg-white border border-pink-200 text-[#2D2522] font-bold text-xs shadow-xs hover:bg-pink-50/50 flex items-center justify-center gap-1.5">
                <span>📅 Schedule It</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    setupStudioEvents();
  }

  function renderSlot(slotKey, title, item) {
    return `
      <div data-slot-key="${slotKey}" class="studio-slot-box cursor-pointer rounded-3xl bg-white border-2 ${item ? 'border-pink-200' : 'border-dashed border-pink-200/80'} p-3 shadow-xs flex flex-col justify-between hover:border-pink-400 transition-all aspect-square relative group">
        <div class="flex items-center justify-between w-full mb-1">
          <span class="text-[10px] font-bold text-[#786C68] truncate">${title}</span>
          ${item ? `
            <button data-remove-slot="${slotKey}" class="remove-slot-btn w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold flex items-center justify-center hover:bg-pink-200">
              ✕
            </button>
          ` : ''}
        </div>

        ${item ? `
          <div class="flex-1 flex flex-col items-center justify-center">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl shadow-xs group-hover:scale-105 transition-transform" />
            <span class="text-[10px] font-bold text-[#2D2522] truncate w-full text-center mt-1.5">${item.name}</span>
          </div>
        ` : `
          <div class="flex-1 flex flex-col items-center justify-center text-center">
            <div class="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 text-xl mb-1">
              ➕
            </div>
            <span class="text-[10px] text-[#A89F91] font-semibold">Tap to choose</span>
          </div>
        `}
      </div>
    `;
  }

  function setupStudioEvents() {
    const nameInput = container.querySelector('#look-name-input');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        outfitName = e.target.value;
      });
    }

    container.querySelectorAll('.name-idea-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        outfitName = btn.innerText.trim();
        nameInput.value = outfitName;
      });
    });

    container.querySelector('#studio-clear-btn').addEventListener('click', () => {
      playPop();
      selectedSlots = { top: null, bottom: null, outerwear: null, shoes: null, bag: null, accessory: null };
      renderView();
    });

    // Tap slot to pick item
    container.querySelectorAll('.studio-slot-box').forEach(box => {
      box.addEventListener('click', (e) => {
        if (e.target.closest('.remove-slot-btn')) return;
        playPop();
        const slotKey = box.getAttribute('data-slot-key');
        let categoryTarget = 'tops';
        if (slotKey === 'bottom') categoryTarget = 'bottoms';
        if (slotKey === 'outerwear') categoryTarget = 'outerwear';
        if (slotKey === 'shoes') categoryTarget = 'shoes';
        if (slotKey === 'bag') categoryTarget = 'bags';
        if (slotKey === 'accessory') categoryTarget = 'accessories';

        openModal('pick_item_for_slot', {
          slotKey,
          category: categoryTarget,
          onSelect: (item) => {
            selectedSlots[slotKey] = item;
            renderView();
          }
        });
      });
    });

    // Remove slot item
    container.querySelectorAll('.remove-slot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playPop();
        const slotKey = btn.getAttribute('data-remove-slot');
        selectedSlots[slotKey] = null;
        renderView();
      });
    });

    // Save Outfit
    container.querySelector('#save-look-btn').addEventListener('click', () => {
      const items = Object.values(selectedSlots).filter(Boolean);
      if (items.length === 0) {
        showToast('⚠️ Please select at least one clothing piece!');
        return;
      }

      playSuccess();
      const newLook = {
        id: 'look-' + Date.now(),
        name: outfitName || 'My Custom Look ✨',
        occasion: container.querySelector('#look-occasion-select').value,
        vibe: container.querySelector('#look-vibe-select').value,
        itemIds: items.map(i => i.id),
        isFavorite: true,
        dateCreated: new Date().toISOString().split('T')[0],
        matchScore: 98
      };

      state.savedLooks.unshift(newLook);
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
      showToast('💖 Outfit saved to My Style Vault!');
      navigateTo('insights');
    });

    // Wear Now
    container.querySelector('#wear-now-btn').addEventListener('click', () => {
      const items = Object.values(selectedSlots).filter(Boolean);
      if (!items.length) {
        showToast('⚠️ Please select pieces first');
        return;
      }
      playSuccess();
      items.forEach(item => {
        const found = state.closetItems.find(c => c.id === item.id);
        if (found) {
          found.wearCount = (found.wearCount || 0) + 1;
          found.status = 'wearing_today';
          found.lastWorn = new Date().toISOString().split('T')[0];
        }
      });
      showToast('👗 Wearing this look today!');
      navigateTo('closet');
    });

    // Schedule Look
    container.querySelector('#schedule-look-btn').addEventListener('click', () => {
      const items = Object.values(selectedSlots).filter(Boolean);
      if (!items.length) {
        showToast('⚠️ Please select pieces first');
        return;
      }
      openModal('schedule', {
        outfit: {
          name: outfitName,
          items
        }
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
