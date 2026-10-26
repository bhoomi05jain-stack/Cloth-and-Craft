import { playPop, playSparkle, playSuccess } from './audio.js';

export function renderCloset(container, state, navigateTo, openModal) {
  let activeTab = 'outfits'; // 'outfits' or 'items' (Matching Inspiration Image 1)
  let activeCategory = 'all';
  let searchQuery = state.searchQuery || '';
  let viewMode = 'grid'; // 'grid' or 'list'

  const categories = [
    { id: 'all', name: 'All Pieces', emoji: '✨' },
    { id: 'tops', name: 'Tops', emoji: '👕' },
    { id: 'bottoms', name: 'Bottoms', emoji: '👖' },
    { id: 'dresses', name: 'Dresses', emoji: '👗' },
    { id: 'outerwear', name: 'Outerwear', emoji: '🧥' },
    { id: 'shoes', name: 'Shoes', emoji: '👟' },
    { id: 'bags', name: 'Bags', emoji: '👜' },
    { id: 'accessories', name: 'Jewelry & Acc', emoji: '💍' },
    { id: 'traditional', name: 'Traditional', emoji: '🪷' }
  ];

  function getFilteredItems() {
    return state.closetItems.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchColor = item.color.toLowerCase().includes(q);
        const matchStyle = item.style.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchColor && !matchStyle) return false;
      }
      return true;
    });
  }

  function renderView() {
    const filteredItems = getFilteredItems();
    const looks = state.savedLooks;

    container.innerHTML = `
      <div class="h-full flex flex-col overflow-y-auto pb-28 bg-[#FAF8F5]">
        <!-- Top Editorial Minimal Bar (Inspired by Image 1) -->
        <div class="px-5 pt-3 pb-2 sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md z-20 border-b border-[#EBE5DF]/60">
          <div class="flex items-center justify-between mb-2">
            <!-- Brand Logo Glyphs -->
            <div class="flex items-center gap-1.5 cursor-pointer" id="closet-logo-btn">
              <span class="font-serif text-2xl font-bold tracking-tighter text-[#1C1917]">g.</span>
              <span class="text-[10px] font-semibold text-[#78716C] uppercase tracking-widest ml-1">Closet Craft</span>
            </div>

            <div class="flex items-center gap-2">
              <button id="closet-search-toggle" class="w-8 h-8 rounded-full bg-white border border-[#EBE5DF] flex items-center justify-center text-xs text-[#1C1917] shadow-xs">
                🔍
              </button>
              <button id="closet-menu-btn" class="w-8 h-8 rounded-full bg-white border border-[#EBE5DF] flex items-center justify-center text-xs text-[#1C1917] shadow-xs">
                ☰
              </button>
            </div>
          </div>

          <!-- Segmented Control: Items vs Outfits (Exact match to Image 1) -->
          <div class="segmented-control mt-2">
            <button id="seg-items-btn" class="segmented-btn ${activeTab === 'items' ? 'active' : ''}">
              Items (${state.closetItems.length})
            </button>
            <button id="seg-outfits-btn" class="segmented-btn ${activeTab === 'outfits' ? 'active' : ''}">
              Outfits (${looks.length})
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-5 pt-3">
          <!-- Subheader Bar (Matching Image 1: "Closet includes 4 outfit" + grid icons) -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold text-[#1C1917] tracking-tight">
              ${activeTab === 'outfits' ? `Closet includes ${looks.length} outfits` : `Closet includes ${filteredItems.length} items`}
            </span>

            <div class="flex items-center gap-2 text-[#78716C]">
              <button class="w-6 h-6 flex items-center justify-center text-xs hover:text-[#1C1917]">
                ⊞
              </button>
              <button class="w-6 h-6 flex items-center justify-center text-xs hover:text-[#1C1917]">
                ☰
              </button>
              <button id="open-filter-drawer" class="w-6 h-6 flex items-center justify-center text-xs hover:text-[#1C1917]">
                ⚙️
              </button>
            </div>
          </div>

          ${activeTab === 'outfits' ? renderOutfitsFlatlayGrid(looks) : renderItemsCatalogGrid(filteredItems)}
        </div>
      </div>
    `;

    setupClosetEvents();
  }

  // 2x2 Flat-Lay Outfit Cards (Exact aesthetic from Image 1)
  function renderOutfitsFlatlayGrid(looks) {
    return `
      <div class="grid grid-cols-2 gap-3.5">
        ${looks.map(look => {
          const pieces = (look.itemIds || []).map(id => state.closetItems.find(c => c.id === id)).filter(Boolean);
          
          return `
            <div data-look-id="${look.id}" class="flatlay-card cursor-pointer group p-3 flex flex-col justify-between aspect-[1/1.25]">
              <!-- Flat-Lay Composition Canvas -->
              <div class="flatlay-canvas relative w-full h-full rounded-2xl flex items-center justify-center overflow-hidden">
                <!-- Arrangement of flat-lay clothing pieces -->
                ${renderFlatlayCollagePieces(pieces)}

                <!-- Top Right Heart -->
                <button data-fav-look="${look.id}" class="fav-look-btn absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[10px] shadow-xs text-rose-500">
                  ${look.isFavorite ? '❤️' : '🤍'}
                </button>
              </div>

              <!-- Look Meta Info -->
              <div class="mt-2.5 flex items-center justify-between">
                <div>
                  <h4 class="text-[11px] font-bold text-[#1C1917] truncate leading-tight">${look.name}</h4>
                  <span class="text-[9px] text-[#78716C] font-semibold">${look.occasion} • ${pieces.length} pieces</span>
                </div>
                <span class="text-[10px] font-bold text-pink-600">✨</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderFlatlayCollagePieces(pieces) {
    const top = pieces.find(p => p.category === 'tops' || p.category === 'dresses') || pieces[0];
    const bottom = pieces.find(p => p.category === 'bottoms') || null;
    const outer = pieces.find(p => p.category === 'outerwear') || null;
    const shoe = pieces.find(p => p.category === 'shoes') || null;
    const bag = pieces.find(p => p.category === 'bags') || null;

    return `
      <!-- Top / Outerwear (Left/Top) -->
      ${outer ? `
        <img src="${outer.image}" class="flatlay-piece w-18 h-24 top-2 left-2 object-contain group-hover:scale-105" alt="Outerwear" />
      ` : ''}

      ${top ? `
        <img src="${top.image}" class="flatlay-piece ${outer ? 'w-16 h-20 top-2 right-2' : 'w-22 h-26 top-2 left-3'} object-contain group-hover:scale-105" alt="Top" />
      ` : ''}

      <!-- Bottoms (Center/Right) -->
      ${bottom ? `
        <img src="${bottom.image}" class="flatlay-piece w-16 h-24 bottom-6 right-2 object-contain group-hover:scale-105" alt="Bottom" />
      ` : ''}

      <!-- Shoes & Bag (Bottom/Left) -->
      ${shoe ? `
        <img src="${shoe.image}" class="flatlay-piece w-12 h-12 bottom-2 left-3 object-contain" alt="Shoes" />
      ` : ''}

      ${bag ? `
        <img src="${bag.image}" class="flatlay-piece w-11 h-11 bottom-3 right-8 object-contain" alt="Bag" />
      ` : ''}
    `;
  }

  // Items Catalog View
  function renderItemsCatalogGrid(items) {
    return `
      <div>
        <!-- Category Filter Chips -->
        <div class="flex gap-1.5 overflow-x-auto pb-3 no-scrollbar mb-2">
          ${categories.map(cat => `
            <button data-cat-id="${cat.id}" class="category-chip-btn px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-[#78716C] border border-[#EBE5DF] hover:bg-stone-50'}">
              ${cat.name}
            </button>
          `).join('')}
        </div>

        <!-- 2-Column Clean Items Grid -->
        <div class="grid grid-cols-2 gap-3.5">
          ${items.map(item => `
            <div data-item-id="${item.id}" class="item-card cursor-pointer rounded-2xl bg-white border border-[#EBE5DF] p-2.5 shadow-xs hover:border-[#1C1917] transition-all flex flex-col justify-between group">
              <div class="relative w-full aspect-square rounded-xl bg-[#F6F4F1] p-2 flex items-center justify-center overflow-hidden">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
                
                ${item.status === 'in_laundry' ? `
                  <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">🧺 Wash</span>
                ` : ''}
              </div>

              <div class="mt-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-bold text-[#1C1917] truncate">${item.name}</h4>
                </div>
                <div class="flex items-center justify-between mt-1 text-[10px] text-[#78716C]">
                  <span>${item.color} • ${item.subcategory || item.category}</span>
                  <span class="font-bold text-[#1C1917]">${item.wearCount || 0}w</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function setupClosetEvents() {
    // Segmented Buttons
    container.querySelector('#seg-items-btn').addEventListener('click', () => {
      playPop();
      activeTab = 'items';
      renderView();
    });

    container.querySelector('#seg-outfits-btn').addEventListener('click', () => {
      playPop();
      activeTab = 'outfits';
      renderView();
    });

    // Category Chips
    container.querySelectorAll('.category-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        activeCategory = btn.getAttribute('data-cat-id');
        renderView();
      });
    });

    // Item Card Click
    container.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => {
        playPop();
        const id = card.getAttribute('data-item-id');
        const item = state.closetItems.find(i => i.id === id);
        if (item) {
          openModal('item_detail', { item, onUpdate: () => renderView() });
        }
      });
    });

    // Outfit Card Click
    container.querySelectorAll('.flatlay-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.fav-look-btn')) return;
        playPop();
        const id = card.getAttribute('data-look-id');
        const look = state.savedLooks.find(l => l.id === id);
        if (look) {
          const pieces = (look.itemIds || []).map(iid => state.closetItems.find(c => c.id === iid)).filter(Boolean);
          openModal('schedule', { lookId: look.id, outfit: { name: look.name, items: pieces } });
        }
      });
    });

    // Fav Look Toggle
    container.querySelectorAll('.fav-look-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSparkle();
        const id = btn.getAttribute('data-fav-look');
        const look = state.savedLooks.find(l => l.id === id);
        if (look) {
          look.isFavorite = !look.isFavorite;
          renderView();
        }
      });
    });

    // Filter drawer trigger
    const filterBtn = container.querySelector('#open-filter-drawer');
    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        playPop();
        openModal('edit_preferences');
      });
    }
  }

  renderView();
}
