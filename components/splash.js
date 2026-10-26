import { playSparkle, playDoorOpen } from './audio.js';

export function renderSplash(container, onComplete) {
  container.innerHTML = 
    <div class="h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#FFF5F5] via-[#FAF7F2] to-[#FCE7F3] text-center relative overflow-hidden">
      <!-- Floating Sparkles Background -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-12 left-10 text-2xl animate-sparkle-float" style="animation-delay: 0.2s;">✨</div>
        <div class="absolute top-28 right-8 text-xl animate-sparkle-float" style="animation-delay: 0.8s;">💖</div>
        <div class="absolute bottom-36 left-12 text-2xl animate-sparkle-float" style="animation-delay: 1.4s;">🎀</div>
        <div class="absolute top-1/2 right-12 text-xl animate-sparkle-float" style="animation-delay: 0.5s;">⭐</div>
        <div class="absolute bottom-20 right-14 text-2xl animate-sparkle-float" style="animation-delay: 1.1s;">🌸</div>
      </div>

      <!-- Top Header Branding -->
      <div class="mt-8 z-10">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-sm border border-pink-200">
          <span>✨ Personal AI Stylist</span>
        </div>
        <h1 class="font-serif text-4xl sm:text-5xl font-extrabold text-[#2D2522] tracking-tight">
          Closet Craft
        </h1>
        <p class="font-sans text-sm text-[#786C68] mt-2 font-medium">
          Your closet, beautifully crafted.
        </p>
      </div>

      <!-- Interactive 3D Mini Wardrobe Illustration -->
      <div class="my-auto z-10 flex flex-col items-center">
        <div class="closet-3d-scene my-4">
          <div id="splash-wardrobe" class="closet-wardrobe cursor-pointer group">
            <!-- Back Interior with Clothes -->
            <div class="closet-interior-back p-4">
              <div class="w-full flex items-center justify-center border-b-2 border-dashed border-pink-200 pb-2 mb-3">
                <span class="text-xs font-semibold text-pink-400 uppercase tracking-wider">✨ Dream Wardrobe</span>
              </div>
              <div class="grid grid-cols-2 gap-2 w-full">
                <div class="h-24 bg-pink-100 rounded-xl flex flex-col items-center justify-center p-1 border border-pink-200 shadow-sm">
                  <span class="text-2xl">👗</span>
                  <span class="text-[10px] font-semibold text-pink-700 mt-1">Satin Dress</span>
                </div>
                <div class="h-24 bg-amber-100 rounded-xl flex flex-col items-center justify-center p-1 border border-amber-200 shadow-sm">
                  <span class="text-2xl">🧥</span>
                  <span class="text-[10px] font-semibold text-amber-800 mt-1">Wool Coat</span>
                </div>
                <div class="h-20 bg-sky-100 rounded-xl flex flex-col items-center justify-center p-1 border border-sky-200 shadow-sm">
                  <span class="text-2xl">👖</span>
                  <span class="text-[10px] font-semibold text-sky-700 mt-1">Denim Jeans</span>
                </div>
                <div class="h-20 bg-rose-100 rounded-xl flex flex-col items-center justify-center p-1 border border-rose-200 shadow-sm">
                  <span class="text-2xl">👠</span>
                  <span class="text-[10px] font-semibold text-rose-700 mt-1">Gold Heels</span>
                </div>
              </div>
            </div>

            <!-- Left Door -->
            <div class="closet-door closet-door-left flex items-center justify-end pr-2">
              <div class="w-3 h-10 rounded-full bg-gradient-to-b from-[#F3C594] via-[#D4A373] to-[#9C6D3B] shadow-md border border-[#FBE3B8]"></div>
            </div>

            <!-- Right Door -->
            <div class="closet-door closet-door-right flex items-center justify-start pl-2">
              <div class="w-3 h-10 rounded-full bg-gradient-to-b from-[#F3C594] via-[#D4A373] to-[#9C6D3B] shadow-md border border-[#FBE3B8]"></div>
            </div>
          </div>
        </div>
        <p class="text-xs text-pink-600 font-medium animate-pulse flex items-center gap-1 mt-1">
          <span>Tap doors to unlock magic</span> <span>✨</span>
        </p>
      </div>

      <!-- Action Button -->
      <div class="w-full max-w-xs mb-4 z-10">
        <button id="splash-start-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-semibold text-base shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 hover:opacity-95 transition-all">
          <span>Open My Closet</span>
          <span class="text-lg">✨</span>
        </button>
        <p class="text-[11px] text-[#A89F91] mt-3">Style what you already own • AI Powered</p>
      </div>
    </div>
  ;

  const wardrobe = container.querySelector('#splash-wardrobe');
  const startBtn = container.querySelector('#splash-start-btn');

  function triggerDoorOpen() {
    playDoorOpen();
    wardrobe.classList.add('doors-open');
    if (window.confetti) {
      window.confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#FB7185', '#FBBF24', '#C084FC']
      });
    }
    setTimeout(() => {
      onComplete();
    }, 1200);
  }

  wardrobe.addEventListener('click', () => {
    triggerDoorOpen();
  });

  startBtn.addEventListener('click', () => {
    triggerDoorOpen();
  });
}
