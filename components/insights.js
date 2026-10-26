import { playPop, playSparkle } from './audio.js';

export function renderInsights(container, state, navigateTo, openModal) {
  let activeTab = 'insights'; // 'insights' or 'style_vault'

  function renderView() {
    container.innerHTML = `
      <div class="h-full flex flex-col overflow-y-auto pb-24 bg-[#FAF7F2]">
        <!-- Sticky Header -->
        <div class="p-5 pb-3 sticky top-0 bg-[#FAF7F2]/90 backdrop-blur-md z-20 border-b border-pink-100/60 flex items-center justify-between">
          <div>
            <div class="text-[11px] font-semibold text-pink-600 uppercase tracking-wider">✨ Wardrobe Intelligence</div>
            <h1 class="font-serif text-2xl font-bold text-[#2D2522]">Closet Insights</h1>
          </div>

          <!-- Switcher -->
          <div class="flex rounded-2xl bg-white p-1 border border-pink-200 shadow-xs">
            <button id="ins-tab-analytics" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'insights' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs' : 'text-[#786C68]'}">
              📊 Analytics
            </button>
            <button id="ins-tab-vault" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'style_vault' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs' : 'text-[#786C68]'}">
              ❤️ Style Vault
            </button>
          </div>
        </div>

        <div class="p-5 space-y-5">
          ${activeTab === 'insights' ? renderAnalyticsView() : renderStyleVaultView()}
        </div>
      </div>
    `;

    setupInsightsEvents();
  }

  function renderAnalyticsView() {
    const totalItems = state.closetItems.length;
    const totalWears = state.closetItems.reduce((acc, i) => acc + (i.wearCount || 0), 0);
    const mostWornItem = [...state.closetItems].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))[0];

    return `
      <!-- Top Overview Stats -->
      <div class="grid grid-cols-3 gap-2.5">
        <div class="p-3.5 rounded-2xl bg-white border border-pink-100 text-center shadow-xs">
          <div class="text-xl font-bold text-[#2D2522]">${totalItems}</div>
          <div class="text-[10px] text-[#786C68] font-semibold">Total Pieces</div>
        </div>
        <div class="p-3.5 rounded-2xl bg-white border border-pink-100 text-center shadow-xs">
          <div class="text-xl font-bold text-pink-600">${totalWears}</div>
          <div class="text-[10px] text-[#786C68] font-semibold">Total Wears</div>
        </div>
        <div class="p-3.5 rounded-2xl bg-white border border-pink-100 text-center shadow-xs">
          <div class="text-xl font-bold text-purple-600">96%</div>
          <div class="text-[10px] text-[#786C68] font-semibold">Wardrobe Utilization</div>
        </div>
      </div>

      <!-- Color Palette Distribution -->
      <div class="glass-card rounded-3xl p-4 border border-pink-200 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-base font-bold text-[#2D2522]">🌈 Wardrobe Color Palette</h3>
          <span class="text-[10px] font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">Top Hues</span>
        </div>

        <div class="space-y-2">
          <div>
            <div class="flex justify-between text-xs font-semibold text-[#2D2522] mb-1">
              <span>Pastel Pink & Blush</span>
              <span>32%</span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
              <div class="h-full bg-pink-400 rounded-full" style="width: 32%;"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold text-[#2D2522] mb-1">
              <span>Silk Cream & Warm Beige</span>
              <span>28%</span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
              <div class="h-full bg-amber-300 rounded-full" style="width: 28%;"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold text-[#2D2522] mb-1">
              <span>Denim Indigo & Sky Blue</span>
              <span>22%</span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
              <div class="h-full bg-sky-400 rounded-full" style="width: 22%;"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold text-[#2D2522] mb-1">
              <span>Charcoal & Jet Black</span>
              <span>18%</span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
              <div class="h-full bg-neutral-800 rounded-full" style="width: 18%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Worn Hero Item -->
      ${mostWornItem ? `
        <div class="rounded-3xl p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200 shadow-xs flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${mostWornItem.image}" alt="${mostWornItem.name}" class="w-16 h-16 object-cover rounded-2xl border border-pink-200" />
            <div>
              <span class="text-[9px] font-bold text-pink-700 uppercase tracking-wider">👑 Most Loved Piece</span>
              <h4 class="text-xs font-bold text-[#2D2522]">${mostWornItem.name}</h4>
              <span class="text-[11px] text-[#786C68]">Worn <strong>${mostWornItem.wearCount} times</strong> • Cost/Wear: $2.10</span>
            </div>
          </div>
          <span class="text-2xl">✨</span>
        </div>
      ` : ''}

      <!-- Encouraging Rediscovery Banner -->
      <div class="p-4 rounded-3xl bg-white border border-purple-200 shadow-xs">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xl">♻️</span>
          <h4 class="font-serif text-sm font-bold text-[#2D2522]">Sustainable Styling Habit</h4>
        </div>
        <p class="text-xs text-[#786C68] leading-relaxed">
          By remixing your existing 24 pieces, you've unlocked <strong>140+ unique outfit combinations</strong> without buying new clothes!
        </p>
      </div>
    `;
  }

  function renderStyleVaultView() {
    const favoriteLooks = state.savedLooks;
    const favoritePieces = state.closetItems.filter(i => i.isFavorite);

    return `
      <!-- My Style Vault -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-serif text-lg font-bold text-[#2D2522]">My Style Vault ✨</h3>
          <span class="text-xs text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">${favoriteLooks.length} Saved Looks</span>
        </div>

        <!-- Saved Looks Grid -->
        <div class="space-y-3">
          ${favoriteLooks.map(look => {
            const pieces = (look.itemIds || []).map(id => state.closetItems.find(c => c.id === id)).filter(Boolean);

            return `
              <div class="rounded-3xl bg-white border border-pink-200 p-4 shadow-xs">
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h4 class="text-xs font-bold text-[#2D2522]">${look.name}</h4>
                    <span class="text-[10px] text-[#786C68]">${look.occasion} • ${look.vibe}</span>
                  </div>
                  <span class="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">✨ ${look.matchScore || 98}%</span>
                </div>

                <div class="grid grid-cols-4 gap-2 my-2.5">
                  ${pieces.slice(0, 4).map(p => `
                    <div class="aspect-square rounded-xl bg-[#FAF7F2] p-1 border border-pink-100 flex items-center justify-center">
                      <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover rounded-lg" />
                    </div>
                  `).join('')}
                </div>

                <div class="flex items-center justify-end gap-2 pt-2 border-t border-pink-50">
                  <button data-wear-vault-look="${look.id}" class="wear-vault-look-btn px-3 py-1.5 rounded-xl bg-pink-500 text-white text-[11px] font-bold shadow-xs hover:bg-pink-600">
                    👗 Wear Today
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Loved Wardrobe Essentials -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-serif text-sm font-bold text-[#2D2522]">Favorite Pieces ❤️</h4>
            <span class="text-xs text-[#786C68]">${favoritePieces.length} items</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            ${favoritePieces.map(piece => `
              <div class="p-2 rounded-2xl bg-white border border-pink-100 text-center">
                <img src="${piece.image}" alt="${piece.name}" class="w-full h-16 object-cover rounded-xl" />
                <span class="text-[10px] font-bold text-[#2D2522] truncate block mt-1">${piece.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function setupInsightsEvents() {
    const analyticsBtn = container.querySelector('#ins-tab-analytics');
    const vaultBtn = container.querySelector('#ins-tab-vault');

    if (analyticsBtn) {
      analyticsBtn.addEventListener('click', () => {
        playPop();
        activeTab = 'insights';
        renderView();
      });
    }

    if (vaultBtn) {
      vaultBtn.addEventListener('click', () => {
        playPop();
        activeTab = 'style_vault';
        renderView();
      });
    }

    container.querySelectorAll('.wear-vault-look-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSparkle();
        if (window.confetti) {
          window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
        }
        showToast('👗 Marked look as wearing today!');
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
