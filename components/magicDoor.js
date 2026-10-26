import { playDoorOpen, playSparkle, playSuccess } from './audio.js';

export function renderMagicDoor(container, state, onComplete) {
  const nickname = state.user?.nickname?.split(' ')[0] || 'Fashion Fairy';
  const itemCount = state.closetItems?.length || 24;

  container.innerHTML = `
    <div class="h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#FFF5F5] via-[#FAF7F2] to-[#FCE7F3] text-center relative overflow-hidden">
      <!-- Ambient Sparkles -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-10 left-8 text-3xl animate-sparkle-float" style="animation-delay: 0.1s;">✨</div>
        <div class="absolute top-24 right-10 text-2xl animate-sparkle-float" style="animation-delay: 0.7s;">💖</div>
        <div class="absolute bottom-32 left-10 text-3xl animate-sparkle-float" style="animation-delay: 1.3s;">🌸</div>
        <div class="absolute top-1/2 left-6 text-2xl animate-sparkle-float" style="animation-delay: 0.4s;">⭐</div>
        <div class="absolute bottom-20 right-8 text-3xl animate-sparkle-float" style="animation-delay: 0.9s;">✨</div>
      </div>

      <!-- Top Title -->
      <div class="pt-6 z-10">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/90 text-pink-700 text-xs font-semibold mb-2 shadow-xs border border-pink-200">
          <span>✨ ${itemCount} Wardrobe Essentials Ready</span>
        </div>
        <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D2522] tracking-tight">
          Welcome to your Closet ✨
        </h1>
        <p class="text-xs sm:text-sm text-[#786C68] mt-1.5 font-medium">
          Ready for you, ${nickname} 💖
        </p>
      </div>

      <!-- 3D Magical Wardrobe Centerpiece -->
      <div class="my-auto z-10 flex flex-col items-center w-full">
        <div class="closet-3d-scene my-2">
          <div id="magic-wardrobe-box" class="closet-wardrobe cursor-pointer">
            <!-- Wardrobe Interior -->
            <div class="closet-interior-back p-4">
              <!-- Golden Glowing Aura -->
              <div class="absolute inset-0 bg-gradient-to-t from-pink-300/40 via-amber-200/30 to-transparent rounded-2xl animate-glow-pulse pointer-events-none"></div>

              <!-- Hanger Rod -->
              <div class="w-full flex items-center justify-between border-b-4 border-[#D4A373] pb-1.5 mb-2 relative z-10">
                <span class="text-[10px] font-bold text-pink-700 uppercase tracking-widest">✨ Digital Capsule</span>
                <span class="text-xs">👗🪷🧥</span>
              </div>

              <!-- Interior Clothing Mini Rack -->
              <div class="grid grid-cols-2 gap-2 w-full z-10">
                <div class="h-28 rounded-2xl bg-white/90 p-1.5 border border-pink-200 shadow-sm flex flex-col items-center justify-center">
                  <div class="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-2xl mb-1">
                    👗
                  </div>
                  <span class="text-[10px] font-bold text-[#2D2522]">Silk Slip Dress</span>
                  <span class="text-[9px] text-pink-600 font-semibold">Emerald Green</span>
                </div>

                <div class="h-28 rounded-2xl bg-white/90 p-1.5 border border-amber-200 shadow-sm flex flex-col items-center justify-center">
                  <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl mb-1">
                    🧥
                  </div>
                  <span class="text-[10px] font-bold text-[#2D2522]">Wool Trench</span>
                  <span class="text-[9px] text-amber-700 font-semibold">Camel Tan</span>
                </div>

                <div class="h-20 rounded-xl bg-white/90 p-1 border border-sky-200 shadow-sm flex flex-col items-center justify-center">
                  <span class="text-xl">👖</span>
                  <span class="text-[9px] font-bold text-[#2D2522] mt-0.5">Wide Jeans</span>
                </div>

                <div class="h-20 rounded-xl bg-white/90 p-1 border border-purple-200 shadow-sm flex flex-col items-center justify-center">
                  <span class="text-xl">👠</span>
                  <span class="text-[9px] font-bold text-[#2D2522] mt-0.5">Block Heels</span>
                </div>
              </div>
            </div>

            <!-- Left Door -->
            <div class="closet-door closet-door-left flex items-center justify-end pr-2.5">
              <div class="w-3.5 h-12 rounded-full bg-gradient-to-b from-[#FDE3B8] via-[#D4A373] to-[#8C5D2F] shadow-lg border border-[#FFF0D4] flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white/80"></div>
              </div>
            </div>

            <!-- Right Door -->
            <div class="closet-door closet-door-right flex items-center justify-start pl-2.5">
              <div class="w-3.5 h-12 rounded-full bg-gradient-to-b from-[#FDE3B8] via-[#D4A373] to-[#8C5D2F] shadow-lg border border-[#FFF0D4] flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white/80"></div>
              </div>
            </div>
          </div>
        </div>
        <p id="magic-door-hint" class="text-xs text-pink-600 font-semibold mt-3 animate-pulse">
          ✨ Tap the doors to open your magical wardrobe ✨
        </p>
      </div>

      <!-- Action Button -->
      <div class="w-full max-w-xs mx-auto pb-4 z-10">
        <button id="step-inside-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-semibold text-base shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2">
          <span>Step Inside Digital Closet</span>
          <span class="text-lg">→</span>
        </button>
      </div>
    </div>
  `;

  const wardrobe = container.querySelector('#magic-wardrobe-box');
  const stepInsideBtn = container.querySelector('#step-inside-btn');
  const hint = container.querySelector('#magic-door-hint');
  let isOpened = false;

  function openDoors() {
    if (isOpened) return;
    isOpened = true;
    playDoorOpen();
    playSparkle();
    wardrobe.classList.add('doors-open');
    hint.textContent = '🎉 Your wardrobe is unlocked!';
    
    if (window.confetti) {
      window.confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F472B6', '#FB7185', '#FBBF24', '#C084FC', '#38BDF8']
      });
    }
  }

  wardrobe.addEventListener('click', openDoors);

  // Auto-open doors after 800ms for dramatic entrance if user doesn't tap immediately
  setTimeout(() => {
    openDoors();
  }, 900);

  stepInsideBtn.addEventListener('click', () => {
    playSuccess();
    onComplete();
  });
}
