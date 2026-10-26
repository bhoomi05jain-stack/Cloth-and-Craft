import { playPop, playSparkle, playSuccess } from './audio.js';
import { AVATAR_OPTIONS, CUTE_NICKNAMES, DEFAULT_CLOSET_ITEMS } from '../data/defaultCloset.js';

export function openModalManager(modalType, props, state, onStateChange) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = '';
  modalRoot.classList.remove('hidden');

  const backdrop = document.createElement('div');
  backdrop.className = 'fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4';

  const sheet = document.createElement('div');
  sheet.className = 'w-full max-w-lg bg-[#FAF7F2] rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 animate-sheet-up p-5 text-[#2D2522]';

  function closeModal() {
    playPop();
    backdrop.remove();
    modalRoot.classList.add('hidden');
  }

  if (modalType === 'item_detail') {
    const item = props.item;
    let isIsolated = true;

    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full uppercase tracking-wider">
            ${item.category} • ${item.subcategory || ''}
          </span>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68] hover:text-[#2D2522]">✕</button>
        </div>

        <!-- High-res Image & Background Mode Toggle -->
        <div class="relative w-full h-64 rounded-3xl overflow-hidden bg-white border border-pink-200 shadow-sm flex items-center justify-center ${isIsolated ? 'bg-cutout-preview' : ''}">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover ${isIsolated ? 'object-contain p-3 drop-shadow-md' : ''}" />
          
          <button id="toggle-iso-btn" class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 text-[10px] font-bold text-[#2D2522] shadow-xs">
            ✨ Cutout: ${isIsolated ? 'ON' : 'OFF'}
          </button>
        </div>

        <!-- Item Title & Status Action -->
        <div class="mt-4">
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-xl font-bold text-[#2D2522]">${item.name}</h3>
            <button id="detail-fav-btn" class="text-xl ${item.isFavorite ? 'text-rose-500' : 'text-stone-300'}">
              ${item.isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div class="flex items-center gap-2 mt-1.5 text-xs text-[#786C68]">
            <div class="w-3 h-3 rounded-full border border-black/10" style="background-color: ${item.colorHex || '#FCE7F3'}"></div>
            <span>${item.color} • ${item.material || 'Premium Fabric'}</span>
          </div>
        </div>

        <!-- Wear Metrics -->
        <div class="grid grid-cols-3 gap-2 my-4">
          <div class="p-3 rounded-2xl bg-white border border-pink-100 text-center">
            <div class="text-base font-bold text-[#2D2522]">${item.wearCount || 0}x</div>
            <div class="text-[9px] text-[#786C68] font-semibold">Total Worn</div>
          </div>
          <div class="p-3 rounded-2xl bg-white border border-pink-100 text-center">
            <div class="text-xs font-bold text-pink-600 truncate">${item.lastWorn || 'Recently'}</div>
            <div class="text-[9px] text-[#786C68] font-semibold">Last Worn</div>
          </div>
          <div class="p-3 rounded-2xl bg-white border border-pink-100 text-center">
            <div class="text-xs font-bold ${item.status === 'in_laundry' ? 'text-amber-700' : 'text-emerald-700'} capitalize">
              ${item.status === 'in_laundry' ? 'In Wash 🧺' : 'Available ✅'}
            </div>
            <div class="text-[9px] text-[#786C68] font-semibold">Status</div>
          </div>
        </div>

        <!-- Tags & Style Vibes -->
        <div class="space-y-2 mb-4">
          <div class="text-[11px] font-bold text-[#786C68] uppercase tracking-wider">Style & Vibes</div>
          <div class="flex flex-wrap gap-1.5">
            ${(item.style || ['Casual Cool']).map(s => `
              <span class="px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-semibold">✨ ${s}</span>
            `).join('')}
            ${(item.occasion || ['Everyday']).map(o => `
              <span class="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">📍 ${o}</span>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-2 pt-3 border-t border-pink-100">
          ${item.status === 'in_laundry' ? `
            <button id="mark-clean-btn" class="btn-press py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1">
              <span>✅ Mark Clean</span>
            </button>
          ` : `
            <button id="send-wash-btn" class="btn-press py-3 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1">
              <span>🧺 Send to Laundry</span>
            </button>
          `}
          
          <button id="wear-this-piece-btn" class="btn-press py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1">
            <span>👗 Wear Today</span>
          </button>
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    sheet.querySelector('#toggle-iso-btn').addEventListener('click', () => {
      isIsolated = !isIsolated;
      openModalManager('item_detail', { item }, state, onStateChange);
    });

    sheet.querySelector('#detail-fav-btn').addEventListener('click', () => {
      playSparkle();
      item.isFavorite = !item.isFavorite;
      openModalManager('item_detail', { item }, state, onStateChange);
      if (props.onUpdate) props.onUpdate();
    });

    const markCleanBtn = sheet.querySelector('#mark-clean-btn');
    if (markCleanBtn) {
      markCleanBtn.addEventListener('click', () => {
        playSuccess();
        item.status = 'available';
        item.laundryDays = 0;
        closeModal();
        if (props.onUpdate) props.onUpdate();
      });
    }

    const sendWashBtn = sheet.querySelector('#send-wash-btn');
    if (sendWashBtn) {
      sendWashBtn.addEventListener('click', () => {
        playPop();
        item.status = 'in_laundry';
        item.laundryDays = 1;
        closeModal();
        if (props.onUpdate) props.onUpdate();
      });
    }

    sheet.querySelector('#wear-this-piece-btn').addEventListener('click', () => {
      playSuccess();
      item.wearCount = (item.wearCount || 0) + 1;
      item.status = 'wearing_today';
      item.lastWorn = new Date().toISOString().split('T')[0];
      closeModal();
      if (props.onUpdate) props.onUpdate();
    });
  }

  else if (modalType === 'add_item') {
    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522]">Add New Wardrobe Piece ✨</h3>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68]">✕</button>
        </div>

        <div class="space-y-3">
          <!-- Photo Options -->
          <div class="grid grid-cols-2 gap-2">
            <label class="btn-press cursor-pointer p-4 rounded-2xl bg-white border border-pink-200 text-center flex flex-col items-center justify-center hover:bg-pink-50">
              <input type="file" id="modal-file-upload" accept="image/*" class="hidden" />
              <span class="text-2xl mb-1">📷</span>
              <span class="text-xs font-bold text-[#2D2522]">Take Photo</span>
            </label>
            <button id="modal-sample-btn" class="btn-press p-4 rounded-2xl bg-white border border-pink-200 text-center flex flex-col items-center justify-center hover:bg-pink-50">
              <span class="text-2xl mb-1">⚡</span>
              <span class="text-xs font-bold text-[#2D2522]">Instant Fashion Pick</span>
            </button>
          </div>

          <!-- Form Fields -->
          <div>
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Item Name</label>
            <input type="text" id="new-item-name" value="Pastel Satin Blouse" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Category</label>
              <select id="new-item-cat" class="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]">
                <option value="tops">👕 Tops</option>
                <option value="bottoms">👖 Bottoms</option>
                <option value="dresses">👗 Dresses</option>
                <option value="outerwear">🧥 Outerwear</option>
                <option value="shoes">👟 Shoes</option>
                <option value="bags">👜 Bags</option>
                <option value="accessories">💍 Accessories</option>
                <option value="traditional">🪷 Traditional</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Color</label>
              <input type="text" id="new-item-color" value="Rose Pink" class="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]" />
            </div>
          </div>

          <button id="save-new-item-btn" class="btn-press w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-pink-500/25 mt-2">
            <span>Add to Closet ✨</span>
          </button>
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    const handleNewItem = (imgUrl) => {
      playSuccess();
      const newItem = {
        id: 'item-' + Date.now(),
        name: sheet.querySelector('#new-item-name').value || 'New Clothing Item',
        category: sheet.querySelector('#new-item-cat').value || 'tops',
        subcategory: 'Tops',
        color: sheet.querySelector('#new-item-color').value || 'Pastel',
        colorHex: '#F8BBD0',
        pattern: 'Solid',
        material: 'Silk Blend',
        season: ['Spring', 'Summer'],
        style: ['Cute & Girly', 'Romantic'],
        occasion: ['Brunch', 'Everyday'],
        status: 'available',
        wearCount: 0,
        lastWorn: null,
        isFavorite: true,
        image: imgUrl || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
        dateAdded: new Date().toISOString().split('T')[0],
        laundryDays: 0
      };

      if (props.onItemAdded) props.onItemAdded(newItem);
      closeModal();
    };

    sheet.querySelector('#modal-file-upload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => handleNewItem(evt.target.result);
        reader.readAsDataURL(file);
      }
    });

    sheet.querySelector('#modal-sample-btn').addEventListener('click', () => {
      handleNewItem('https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80');
    });

    sheet.querySelector('#save-new-item-btn').addEventListener('click', () => {
      handleNewItem();
    });
  }

  else if (modalType === 'pick_item_for_slot') {
    const category = props.category || 'tops';
    const candidateItems = state.closetItems.filter(i => {
      if (category === 'tops') return i.category === 'tops' || i.category === 'traditional';
      if (category === 'bottoms') return i.category === 'bottoms' || i.category === 'dresses';
      return i.category === category;
    });

    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522] capitalize">Choose ${category} ✨</h3>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68]">✕</button>
        </div>

        <div class="grid grid-cols-3 gap-2.5 max-h-96 overflow-y-auto p-1">
          ${candidateItems.map(item => `
            <div data-pick-id="${item.id}" class="pick-slot-item-btn cursor-pointer rounded-2xl bg-white border border-pink-100 p-2 text-center shadow-xs hover:border-pink-400 transition-all flex flex-col items-center justify-between">
              <img src="${item.image}" alt="${item.name}" class="w-full h-16 object-cover rounded-xl mb-1" />
              <span class="text-[10px] font-bold text-[#2D2522] truncate w-full">${item.name}</span>
              <span class="text-[9px] text-[#786C68]">${item.color}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    sheet.querySelectorAll('.pick-slot-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        const id = btn.getAttribute('data-pick-id');
        const item = state.closetItems.find(i => i.id === id);
        if (props.onSelect) props.onSelect(item);
        closeModal();
      });
    });
  }

  else if (modalType === 'schedule') {
    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522]">Schedule Outfit 📅</h3>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68]">✕</button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Date</label>
            <input type="date" id="sched-date" value="${props.date || '2026-09-04'}" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]" />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Event Name</label>
            <input type="text" id="sched-title" value="Riya's Birthday Party 🎂✨" placeholder="e.g. Sunday Brunch" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]" />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Occasion</label>
            <select id="sched-occasion" class="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]">
              <option value="Party Night">Party Night ✨</option>
              <option value="Brunch">Brunch 🌸</option>
              <option value="College">College 📚</option>
              <option value="Work">Work 💼</option>
              <option value="Family Function">Family Function 🪷</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Notes</label>
            <textarea id="sched-notes" rows="2" placeholder="Wear comfortable heels and gold jewelry..." class="w-full px-3.5 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#2D2522]"></textarea>
          </div>

          <button id="confirm-schedule-btn" class="btn-press w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-pink-500/25 mt-2">
            <span>Confirm Schedule ✨</span>
          </button>
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    sheet.querySelector('#confirm-schedule-btn').addEventListener('click', () => {
      playSuccess();
      const newEvent = {
        id: 'cal-' + Date.now(),
        date: sheet.querySelector('#sched-date').value,
        eventName: sheet.querySelector('#sched-title').value || 'Scheduled Look',
        occasion: sheet.querySelector('#sched-occasion').value,
        lookId: props.lookId || 'look-1',
        notes: sheet.querySelector('#sched-notes').value
      };

      state.calendarEvents.push(newEvent);
      if (props.onScheduled) props.onScheduled();
      closeModal();
    });
  }

  else if (modalType === 'weather') {
    const weatherOptions = [
      { icon: '☀️', text: 'Sunny 26°C', type: 'sunny', desc: 'Light cottons & sundresses' },
      { icon: '🌧️', text: 'Rainy 19°C', type: 'rainy', desc: 'Water-friendly boots & jackets' },
      { icon: '❄️', text: 'Chilly 12°C', type: 'chilly', desc: 'Cozy sweaters & layered coats' },
      { icon: '🍂', text: 'Autumn Breeze 21°C', type: 'autumn', desc: 'Blazers, denim & light knits' }
    ];

    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522]">Select Weather ☀️🌧️</h3>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68]">✕</button>
        </div>

        <div class="space-y-2">
          ${weatherOptions.map(opt => `
            <button data-weather-type="${opt.type}" class="weather-opt-btn btn-press w-full p-3.5 rounded-2xl bg-white border border-pink-200 flex items-center justify-between hover:bg-pink-50 text-left">
              <div class="flex items-center gap-3">
                <span class="text-2xl">${opt.icon}</span>
                <div>
                  <div class="text-xs font-bold text-[#2D2522]">${opt.text}</div>
                  <div class="text-[10px] text-[#786C68]">${opt.desc}</div>
                </div>
              </div>
              <span class="text-xs font-bold text-pink-600">Select →</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    sheet.querySelectorAll('.weather-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        const type = btn.getAttribute('data-weather-type');
        const selected = weatherOptions.find(w => w.type === type);
        if (props.onSelect) props.onSelect(selected);
        closeModal();
      });
    });
  }

  else if (modalType === 'send_to_wash') {
    const availableItems = state.closetItems.filter(i => i.status !== 'in_laundry');

    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522]">Send Items to Wash 🧺</h3>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68]">✕</button>
        </div>

        <p class="text-xs text-[#786C68] mb-3">Select clothes to move to your laundry queue:</p>

        <div class="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
          ${availableItems.map(item => `
            <div data-wash-item-id="${item.id}" class="wash-toggle-card cursor-pointer rounded-2xl bg-white border border-pink-100 p-2.5 flex items-center gap-2 hover:border-amber-300">
              <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-xl" />
              <div class="truncate">
                <span class="text-[11px] font-bold text-[#2D2522] truncate block">${item.name}</span>
                <span class="text-[9px] text-[#786C68]">${item.category}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    sheet.querySelectorAll('.wash-toggle-card').forEach(card => {
      card.addEventListener('click', () => {
        playPop();
        const id = card.getAttribute('data-wash-item-id');
        const item = state.closetItems.find(i => i.id === id);
        if (item) {
          item.status = 'in_laundry';
          item.laundryDays = 1;
        }
        if (props.onUpdated) props.onUpdated();
        closeModal();
      });
    });
  }

  else if (modalType === 'edit_profile') {
    let chosenAvatar = props.user?.avatar || AVATAR_OPTIONS[0];

    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522]">Edit Profile ✨</h3>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68]">✕</button>
        </div>

        <div class="space-y-4">
          <!-- Nickname -->
          <div>
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Your Cute Nickname</label>
            <input type="text" id="edit-nick-input" value="${props.user?.nickname || 'Fashion Fairy ✨'}" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-sm font-bold text-[#2D2522]" />
          </div>

          <!-- Avatar Grid -->
          <div>
            <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-2">Choose Avatar</label>
            <div class="flex items-center justify-center gap-3">
              ${AVATAR_OPTIONS.map(av => `
                <button data-avatar-id="${av.id}" class="modal-av-opt w-12 h-12 rounded-2xl ${av.bg} flex items-center justify-center text-2xl border-2 transition-all ${chosenAvatar.id === av.id ? 'border-pink-500 scale-110 shadow-sm' : 'border-transparent opacity-80'}">
                  ${av.emoji}
                </button>
              `).join('')}
            </div>
          </div>

          <button id="save-profile-btn" class="btn-press w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-pink-500/25 mt-2">
            <span>Save Profile Changes</span>
          </button>
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    sheet.querySelectorAll('.modal-av-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        const id = btn.getAttribute('data-avatar-id');
        chosenAvatar = AVATAR_OPTIONS.find(a => a.id === id);
        sheet.querySelectorAll('.modal-av-opt').forEach(b => b.classList.remove('border-pink-500', 'scale-110'));
        btn.classList.add('border-pink-500', 'scale-110');
      });
    });

    sheet.querySelector('#save-profile-btn').addEventListener('click', () => {
      playSuccess();
      const newNick = sheet.querySelector('#edit-nick-input').value;
      if (props.onSave) props.onSave({ nickname: newNick, avatar: chosenAvatar });
      closeModal();
    });
  }

  else if (modalType === 'edit_preferences') {
    sheet.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522]">Style Preferences ✨</h3>
          <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-sm font-bold text-[#786C68]">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-[#2D2522] mb-1.5">Favorite Colors</label>
            <div class="flex flex-wrap gap-1.5">
              <span class="px-2.5 py-1 rounded-full bg-pink-500 text-white font-bold">Pastel Pink</span>
              <span class="px-2.5 py-1 rounded-full bg-amber-400 text-white font-bold">Silk Cream</span>
              <span class="px-2.5 py-1 rounded-full bg-sky-400 text-white font-bold">Denim Blue</span>
              <span class="px-2.5 py-1 rounded-full bg-purple-400 text-white font-bold">Lavender</span>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2D2522] mb-1.5">Preferred Aesthetics</label>
            <div class="flex flex-wrap gap-1.5">
              <span class="px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 font-semibold">💗 Cute & Girly</span>
              <span class="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold">🤍 Clean & Minimal</span>
              <span class="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">👑 Elegant</span>
            </div>
          </div>

          <button id="save-pref-btn" class="btn-press w-full py-3 rounded-2xl bg-pink-500 text-white font-bold text-xs shadow-sm mt-3">
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    `;

    backdrop.appendChild(sheet);
    modalRoot.appendChild(backdrop);

    sheet.querySelector('#close-modal-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    sheet.querySelector('#save-pref-btn').addEventListener('click', () => {
      playSuccess();
      closeModal();
    });
  }
}
