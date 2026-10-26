import { playPop, playSparkle, playSuccess } from './audio.js';
import { DEFAULT_CLOSET_ITEMS } from '../data/defaultCloset.js';

export function renderUploadFlow(container, state, onComplete) {
  let uploadedItems = [...state.closetItems];
  let currentScanningItem = null;
  let isIsolatedBg = true;

  function renderMain() {
    container.innerHTML = `
      <div class="h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF0F5] animate-sheet-up overflow-y-auto">
        <!-- Top Section -->
        <div class="pt-2">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-md shadow-pink-200">
              👗
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[#2D2522]">
              Let's Build Your Closet 👗✨
            </h2>
            <p class="text-xs text-[#786C68] mt-1">
              "Show us what you've got!"
            </p>
          </div>

          <!-- Quick Action Cards -->
          <div class="grid grid-cols-2 gap-3 mt-5">
            <label class="btn-press cursor-pointer p-4 rounded-2xl bg-white border border-pink-200 shadow-sm flex flex-col items-center justify-center text-center hover:bg-pink-50/50 transition-all">
              <input type="file" id="file-upload-input" accept="image/*" class="hidden" />
              <div class="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center text-2xl mb-2 text-pink-600">
                📷
              </div>
              <span class="text-xs font-bold text-[#2D2522]">Take Photo</span>
              <span class="text-[10px] text-[#786C68] mt-0.5">Snap clothing item</span>
            </label>

            <label class="btn-press cursor-pointer p-4 rounded-2xl bg-white border border-pink-200 shadow-sm flex flex-col items-center justify-center text-center hover:bg-pink-50/50 transition-all">
              <input type="file" id="gallery-upload-input" accept="image/*" class="hidden" />
              <div class="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-2xl mb-2 text-purple-600">
                🖼️
              </div>
              <span class="text-xs font-bold text-[#2D2522]">From Gallery</span>
              <span class="text-[10px] text-[#786C68] mt-0.5">Pick from photos</span>
            </label>
          </div>

          <!-- 1-Click Fast Track -->
          <div class="mt-3">
            <button id="load-curated-btn" class="btn-press w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-pink-50 to-rose-50 border border-pink-200 flex items-center justify-between text-left shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center text-lg">
                  ✨
                </div>
                <div>
                  <div class="text-xs font-bold text-[#2D2522]">Pre-load Curated Capsule Wardrobe</div>
                  <div class="text-[10px] text-[#786C68]">24 high-fashion tops, dresses, shoes & accessories</div>
                </div>
              </div>
              <span class="text-xs font-bold text-pink-600 bg-white px-2.5 py-1 rounded-full shadow-xs">Load All</span>
            </button>
          </div>

          <!-- Wardrobe Preview Grid -->
          <div class="mt-5">
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs font-bold text-[#2D2522] flex items-center gap-1.5">
                <span>Your Uploaded Items</span>
                <span class="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">${uploadedItems.length}</span>
              </div>
              <span class="text-[11px] text-[#786C68]">AI Auto-Categorized</span>
            </div>

            ${uploadedItems.length === 0 ? `
              <div class="p-8 rounded-2xl border-2 border-dashed border-pink-200 bg-white/50 text-center">
                <div class="text-3xl mb-1">🧺</div>
                <div class="text-xs font-bold text-[#2D2522]">Your closet is waiting!</div>
                <p class="text-[11px] text-[#786C68] mt-0.5">Upload your favorite clothes or load curated items to start</p>
              </div>
            ` : `
              <div class="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                ${uploadedItems.map(item => `
                  <div class="relative rounded-xl overflow-hidden bg-white border border-pink-100 shadow-xs group aspect-square">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1 text-center">
                      <span class="text-[9px] font-semibold text-white truncate block">${item.name.split(' ')[0]}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Finish / Next Button -->
        <div class="w-full max-w-xs mx-auto pt-4 pb-2">
          <button id="finish-upload-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-semibold text-base shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 ${uploadedItems.length === 0 ? 'opacity-70' : ''}">
            <span>Open Magical Wardrobe (${uploadedItems.length} items)</span>
            <span class="text-lg">✨</span>
          </button>
        </div>
      </div>
    `;

    // Event Listeners
    const fileInput = container.querySelector('#file-upload-input');
    const galleryInput = container.querySelector('#gallery-upload-input');
    const loadCuratedBtn = container.querySelector('#load-curated-btn');
    const finishBtn = container.querySelector('#finish-upload-btn');

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          simulateAIScan(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener('change', handleFileUpload);
    galleryInput.addEventListener('change', handleFileUpload);

    loadCuratedBtn.addEventListener('click', () => {
      playSparkle();
      uploadedItems = [...DEFAULT_CLOSET_ITEMS];
      state.closetItems = uploadedItems;
      if (window.confetti) {
        window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
      }
      renderMain();
    });

    finishBtn.addEventListener('click', () => {
      if (uploadedItems.length === 0) {
        // Fallback default
        uploadedItems = [...DEFAULT_CLOSET_ITEMS];
        state.closetItems = uploadedItems;
      }
      playSparkle();
      onComplete();
    });
  }

  // Simulated AI Clothing Detection Scanner Modal
  function simulateAIScan(imageUrl) {
    playSparkle();
    
    // Pick a smart detection preset
    const detectionPresets = [
      {
        name: 'White Oversized Linen Shirt',
        category: 'tops',
        subcategory: 'Shirts',
        color: 'Ivory White',
        colorHex: '#FAF9F6',
        pattern: 'Solid',
        material: '100% Breathable Linen',
        season: ['Spring', 'Summer', 'Fall'],
        style: ['Clean & Minimal', 'Casual Cool', 'Professional'],
        occasion: ['Work', 'Brunch', 'College', 'Everyday']
      },
      {
        name: 'Pastel Lavender Floral Slip Dress',
        category: 'dresses',
        subcategory: 'Dresses',
        color: 'Soft Lavender',
        colorHex: '#E9D5FF',
        pattern: 'Ditsy Flora',
        material: 'Mulberry Silk Satin',
        season: ['Spring', 'Summer'],
        style: ['Romantic', 'Cute & Girly', 'Soft Girl'],
        occasion: ['Brunch', 'Date Night', 'Picnic']
      },
      {
        name: 'High-Waist Vintage Denim Jeans',
        category: 'bottoms',
        subcategory: 'Jeans',
        color: 'Classic Denim Blue',
        colorHex: '#60A5FA',
        pattern: 'Washed Denim',
        material: 'Rigid Cotton Denim',
        season: ['All Season'],
        style: ['Casual Cool', 'Clean & Minimal', 'Comfortable'],
        occasion: ['College', 'Everyday', 'Travel']
      }
    ];

    const detected = detectionPresets[Math.floor(Math.random() * detectionPresets.length)];

    container.innerHTML = `
      <div class="h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF0F5] animate-sheet-up overflow-y-auto">
        <!-- AI Scanner Card -->
        <div class="pt-2">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full flex items-center gap-1">
              <span>✨ Smart AI Clothing Detector</span>
            </span>
            <button id="cancel-scan-btn" class="text-xs text-[#786C68] font-semibold hover:text-[#2D2522]">Cancel</button>
          </div>

          <!-- Image Preview with Scanning Laser -->
          <div class="relative w-full h-56 rounded-3xl overflow-hidden bg-black/5 border-2 border-pink-200 shadow-md flex items-center justify-center ${isIsolatedBg ? 'bg-cutout-preview' : ''}">
            <img src="${imageUrl}" class="w-full h-full object-cover ${isIsolatedBg ? 'object-contain p-2 drop-shadow-lg' : ''}" alt="Scanned item" />
            <div class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-scan-laser shadow-lg shadow-pink-500"></div>

            <!-- Background Isolation Toggle -->
            <button id="bg-isolate-toggle" class="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 text-[11px] font-bold text-[#2D2522] shadow-sm flex items-center gap-1.5">
              <span>✨ Isolated Cutout:</span>
              <span class="text-pink-600">${isIsolatedBg ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <!-- Detected Metadata Form -->
          <div class="mt-4 space-y-2.5">
            <div>
              <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Item Title</label>
              <input id="scan-name" type="text" value="${detected.name}" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-sm font-semibold text-[#2D2522] focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Category</label>
                <select id="scan-category" class="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#2D2522]">
                  <option value="tops" ${detected.category === 'tops' ? 'selected' : ''}>👕 Tops</option>
                  <option value="bottoms" ${detected.category === 'bottoms' ? 'selected' : ''}>👖 Bottoms</option>
                  <option value="dresses" ${detected.category === 'dresses' ? 'selected' : ''}>👗 Dresses</option>
                  <option value="outerwear" ${detected.category === 'outerwear' ? 'selected' : ''}>🧥 Outerwear</option>
                  <option value="shoes" ${detected.category === 'shoes' ? 'selected' : ''}>👟 Footwear</option>
                  <option value="bags" ${detected.category === 'bags' ? 'selected' : ''}>👜 Bags</option>
                  <option value="accessories" ${detected.category === 'accessories' ? 'selected' : ''}>💍 Accessories</option>
                  <option value="traditional" ${detected.category === 'traditional' ? 'selected' : ''}>🪷 Traditional</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">Color</label>
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-pink-200">
                  <div class="w-4 h-4 rounded-full border border-black/10" style="background-color: ${detected.colorHex}"></div>
                  <span class="text-xs font-semibold text-[#2D2522] truncate">${detected.color}</span>
                </div>
              </div>
            </div>

            <!-- Style Tags Detected -->
            <div>
              <label class="block text-[11px] font-bold text-[#786C68] uppercase tracking-wider mb-1">AI Detected Vibes & Occasions</label>
              <div class="flex flex-wrap gap-1.5">
                ${detected.style.map(s => `
                  <span class="px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-semibold">✨ ${s}</span>
                `).join('')}
                ${detected.occasion.map(o => `
                  <span class="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">📍 ${o}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Add Button -->
        <div class="w-full max-w-xs mx-auto pt-3 pb-2">
          <button id="confirm-scan-add-btn" class="btn-press w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2">
            <span>Add to My Closet ✨</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#cancel-scan-btn').addEventListener('click', () => {
      playPop();
      renderMain();
    });

    container.querySelector('#bg-isolate-toggle').addEventListener('click', () => {
      playPop();
      isIsolatedBg = !isIsolatedBg;
      simulateAIScan(imageUrl);
    });

    container.querySelector('#confirm-scan-add-btn').addEventListener('click', () => {
      playSuccess();
      const newItem = {
        id: 'item-' + Date.now(),
        name: container.querySelector('#scan-name').value || detected.name,
        category: container.querySelector('#scan-category').value || detected.category,
        subcategory: detected.subcategory,
        color: detected.color,
        colorHex: detected.colorHex,
        pattern: detected.pattern,
        material: detected.material,
        season: detected.season,
        style: detected.style,
        occasion: detected.occasion,
        status: 'available',
        wearCount: 0,
        lastWorn: null,
        isFavorite: false,
        image: imageUrl,
        dateAdded: new Date().toISOString().split('T')[0],
        laundryDays: 0
      };

      uploadedItems.unshift(newItem);
      state.closetItems = uploadedItems;
      renderMain();
    });
  }

  renderMain();
}
