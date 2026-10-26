import { playPop, playSparkle, playSuccess } from './audio.js';
import { VIBES_LIST, OCCASION_FILTERS } from '../data/defaultCloset.js';

export function renderHome(container, state, navigateTo, openModal) {
  const nickname = state.user?.nickname?.split(' ')[0] || 'Fashion Fairy';
  let currentWeather = state.currentWeather || { icon: '☀️', text: 'Sunny 22°C', type: 'sunny' };
  let selectedVibes = state.selectedVibes || ['clean-minimal'];
  let activeOccasion = 'Casual';

  let currentOutfit = generateDailyOutfit(state, selectedVibes, currentWeather);

  function renderView() {
    container.innerHTML = `
      <div class="h-full flex flex-col overflow-y-auto pb-28 bg-[#FAF8F5]">
        <!-- Top Editorial Minimal Bar (Inspired by Image 1) -->
        <div class="px-5 pt-3 pb-2 sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md z-20 border-b border-[#EBE5DF]/60">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5 cursor-pointer" id="home-logo-btn">
              <span class="font-serif text-2xl font-bold tracking-tighter text-[#1C1917]">g.</span>
              <span class="text-[10px] font-semibold text-[#78716C] uppercase tracking-widest ml-1">Daily Stylist</span>
            </div>

            <!-- Weather Pill -->
            <button id="weather-toggle-btn" class="btn-press flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EBE5DF] text-xs font-semibold text-[#1C1917] shadow-xs">
              <span>${currentWeather.icon}</span>
              <span>${currentWeather.text}</span>
            </button>
          </div>

          <!-- Occasion Chips Bar (Matching Image 1 right screen) -->
          <div class="flex gap-2 overflow-x-auto py-1.5 no-scrollbar">
            ${OCCASION_FILTERS.map(occ => `
              <button data-occ-name="${occ}" class="occ-chip px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeOccasion === occ ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#78716C] border border-[#EBE5DF]'}">
                ${occ}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="p-5 space-y-5">
          <!-- TODAY'S FLAT-LAY OUTFIT HERO CARD (Matching Image 1 & 3) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-pink-600">✨ AI Capsule Recommendation</span>
                <h2 class="font-serif text-2xl font-bold text-[#1C1917]">Today's Look</h2>
              </div>
              <span class="text-xs font-bold text-[#1C1917] bg-white border border-[#EBE5DF] px-2.5 py-1 rounded-full shadow-xs">
                ${currentOutfit.matchScore}% Match
              </span>
            </div>

            <!-- Main Flat-Lay Card -->
            <div class="flatlay-card p-4 shadow-sm">
              <div class="flatlay-canvas rounded-2xl relative mb-3 bg-[#F6F4F1]">
                ${renderFlatlayItems(currentOutfit.items)}
                
                <button id="outfit-favorite-btn" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-xs shadow-xs ${currentOutfit.isFavorite ? 'text-rose-500' : 'text-stone-400'}">
                  ${currentOutfit.isFavorite ? '❤️' : '🤍'}
                </button>
              </div>

              <!-- Meta & Actions -->
              <div class="flex items-center justify-between pt-1">
                <div>
                  <h4 class="text-xs font-bold text-[#1C1917]">${currentOutfit.name}</h4>
                  <span class="text-[10px] text-[#78716C] font-semibold">${currentOutfit.occasion} • ${currentOutfit.items.length} pieces</span>
                </div>

                <div class="flex items-center gap-1.5">
                  <button id="outfit-try-btn" class="btn-press px-3 py-1.5 rounded-xl bg-white border border-[#EBE5DF] text-xs font-bold text-[#1C1917] hover:bg-stone-50">
                    🔄 Try
                  </button>
                  <button id="outfit-wear-btn" class="btn-press px-3.5 py-1.5 rounded-xl bg-[#1C1917] text-white text-xs font-bold shadow-xs">
                    👗 Wear Today
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- VIBE SELECTOR -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-serif text-lg font-bold text-[#1C1917]">What's your vibe today? ✨</h3>
            </div>

            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              ${VIBES_LIST.map(vibe => {
                const isSel = selectedVibes.includes(vibe.id);
                return `
                  <button data-vibe-id="${vibe.id}" class="vibe-btn btn-press p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between h-20 shadow-xs ${isSel ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-[#1C1917] border-[#EBE5DF]'}">
                    <span class="text-xl">${vibe.emoji}</span>
                    <span class="text-[10px] font-bold leading-tight">${vibe.name}</span>
                    <span class="text-[8px] opacity-75">${vibe.desc}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Sustainable Discovery Banner -->
          <div class="p-4 rounded-3xl bg-[#F6F4F1] border border-[#EBE5DF] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🌿</span>
              <div>
                <h4 class="text-xs font-bold text-[#1C1917]">Wardrobe Discovery</h4>
                <p class="text-[10px] text-[#78716C]">Remix your clothes and discover new outfits every day.</p>
              </div>
            </div>
            <button id="explore-vault-btn" class="btn-press px-3 py-1.5 rounded-xl bg-white border border-[#EBE5DF] text-xs font-bold text-[#1C1917]">
              View All
            </button>
          </div>
        </div>
      </div>
    `;

    setupHomeEvents();
  }

  function renderFlatlayItems(pieces) {
    const top = pieces.find(p => p.category === 'tops' || p.category === 'dresses') || pieces[0];
    const bottom = pieces.find(p => p.category === 'bottoms') || null;
    const outer = pieces.find(p => p.category === 'outerwear') || null;
    const shoe = pieces.find(p => p.category === 'shoes') || null;
    const bag = pieces.find(p => p.category === 'bags') || null;

    return `
      ${outer ? `<img src="${outer.image}" class="flatlay-piece w-24 h-32 top-3 left-4 object-contain" alt="Outerwear" />` : ''}
      ${top ? `<img src="${top.image}" class="flatlay-piece ${outer ? 'w-20 h-24 top-4 right-6' : 'w-28 h-36 top-3 left-8'} object-contain" alt="Top" />` : ''}
      ${bottom ? `<img src="${bottom.image}" class="flatlay-piece w-22 h-32 bottom-8 right-6 object-contain" alt="Bottom" />` : ''}
      ${shoe ? `<img src="${shoe.image}" class="flatlay-piece w-16 h-16 bottom-3 left-6 object-contain" alt="Shoes" />` : ''}
      ${bag ? `<img src="${bag.image}" class="flatlay-piece w-14 h-14 bottom-4 right-20 object-contain" alt="Bag" />` : ''}
    `;
  }

  function setupHomeEvents() {
    container.querySelector('#weather-toggle-btn').addEventListener('click', () => {
      playPop();
      openModal('weather', {
        currentWeather,
        onSelect: (w) => {
          currentWeather = w;
          state.currentWeather = w;
          currentOutfit = generateDailyOutfit(state, selectedVibes, currentWeather);
          renderView();
        }
      });
    });

    container.querySelectorAll('.occ-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        playPop();
        activeOccasion = chip.getAttribute('data-occ-name');
        currentOutfit = generateDailyOutfit(state, selectedVibes, currentWeather, true);
        renderView();
      });
    });

    container.querySelector('#outfit-try-btn').addEventListener('click', () => {
      playSparkle();
      currentOutfit = generateDailyOutfit(state, selectedVibes, currentWeather, true);
      renderView();
    });

    container.querySelector('#outfit-wear-btn').addEventListener('click', () => {
      playSuccess();
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
      }
      showToast('👗 Marked as wearing today!');
    });

    container.querySelector('#outfit-favorite-btn').addEventListener('click', () => {
      playSparkle();
      currentOutfit.isFavorite = !currentOutfit.isFavorite;
      showToast(currentOutfit.isFavorite ? '❤️ Saved to Favorites' : 'Removed from Favorites');
      renderView();
    });

    container.querySelectorAll('.vibe-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        const id = btn.getAttribute('data-vibe-id');
        selectedVibes = [id];
        state.selectedVibes = selectedVibes;
        currentOutfit = generateDailyOutfit(state, selectedVibes, currentWeather);
        renderView();
      });
    });

    const exploreBtn = container.querySelector('#explore-vault-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        playPop();
        navigateTo('closet');
      });
    }
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1C1917] text-white text-xs font-bold shadow-xl animate-toast-in flex items-center gap-2 border border-white/20';
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  renderView();
}

function generateDailyOutfit(state, vibes, weather, randomize = false) {
  const available = state.closetItems.filter(i => i.status !== 'in_laundry');
  const tops = available.filter(i => i.category === 'tops');
  const bottoms = available.filter(i => i.category === 'bottoms');
  const outer = available.filter(i => i.category === 'outerwear');
  const shoes = available.filter(i => i.category === 'shoes');
  const bags = available.filter(i => i.category === 'bags');

  const items = [
    tops[Math.floor(Math.random() * tops.length)] || available[0],
    bottoms[Math.floor(Math.random() * bottoms.length)] || available[1],
    outer[0] || null,
    shoes[0] || null,
    bags[0] || null
  ].filter(Boolean);

  return {
    id: 'outfit-' + Date.now(),
    name: 'Curated Flat-Lay Look ✨',
    occasion: 'Casual & Everyday',
    matchScore: 98,
    items,
    isFavorite: false
  };
}
