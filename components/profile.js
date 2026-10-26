import { playPop, playSparkle, setSoundEnabled, isSoundEnabled } from './audio.js';
import { AVATAR_OPTIONS } from '../data/defaultCloset.js';

export function renderProfile(container, state, navigateTo, openModal, restartApp) {
  const user = state.user || {};
  let soundOn = isSoundEnabled();

  function renderView() {
    container.innerHTML = `
      <div class="h-full flex flex-col overflow-y-auto pb-24 bg-[#FAF7F2]">
        <!-- Top Profile Card -->
        <div class="p-6 bg-gradient-to-b from-pink-100/90 via-rose-50 to-[#FAF7F2] border-b border-pink-100 text-center relative">
          <div class="w-20 h-20 mx-auto mb-3 rounded-3xl bg-white p-1 border-2 border-pink-300 shadow-md flex items-center justify-center text-4xl relative">
            ${user.avatar?.emoji || '🧚‍♀️'}
            <button id="edit-avatar-btn" class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-xs">
              ✏️
            </button>
          </div>

          <h2 class="font-serif text-2xl font-bold text-[#2D2522] flex items-center justify-center gap-1.5">
            <span>${user.nickname || 'Fashion Fairy ✨'}</span>
          </h2>
          <p class="text-xs text-[#786C68] mt-0.5">
            ${user.authIdentifier || '+91 98765 43210'} • Verified ✨
          </p>

          <!-- Wardrobe Quick Metric Badges -->
          <div class="grid grid-cols-3 gap-2 mt-4 max-w-xs mx-auto">
            <div class="p-2.5 rounded-2xl bg-white/90 border border-pink-200 text-center shadow-xs">
              <div class="text-base font-bold text-[#2D2522]">${state.closetItems.length}</div>
              <div class="text-[9px] text-[#786C68] font-semibold">Wardrobe</div>
            </div>
            <div class="p-2.5 rounded-2xl bg-white/90 border border-pink-200 text-center shadow-xs">
              <div class="text-base font-bold text-pink-600">${state.savedLooks.length}</div>
              <div class="text-[9px] text-[#786C68] font-semibold">Style Looks</div>
            </div>
            <div class="p-2.5 rounded-2xl bg-white/90 border border-pink-200 text-center shadow-xs">
              <div class="text-base font-bold text-amber-700">${state.closetItems.filter(i => i.status === 'in_laundry').length}</div>
              <div class="text-[9px] text-[#786C68] font-semibold">In Laundry</div>
            </div>
          </div>
        </div>

        <!-- Settings & Preferences Section -->
        <div class="p-5 space-y-4">
          <!-- Style Preferences -->
          <div class="rounded-3xl bg-white border border-pink-100 p-4 shadow-xs">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xl">👗</span>
                <h3 class="font-serif text-sm font-bold text-[#2D2522]">My Style Preferences</h3>
              </div>
              <button id="edit-preferences-btn" class="text-xs font-bold text-pink-600 hover:underline">Edit ✏️</button>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span class="px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-semibold">💗 Cute & Girly</span>
              <span class="px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-700 text-[10px] font-semibold">🤍 Clean & Minimal</span>
              <span class="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-semibold">👑 Silk & Blazers</span>
              <span class="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">🌸 Floral Sundresses</span>
            </div>
          </div>

          <!-- Notification Reminders Simulator -->
          <div class="rounded-3xl bg-white border border-pink-100 p-4 shadow-xs space-y-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">🔔</span>
              <h3 class="font-serif text-sm font-bold text-[#2D2522]">Smart Notifications</h3>
            </div>

            <div class="flex items-center justify-between text-xs">
              <div>
                <div class="font-bold text-[#2D2522]">☀️ Morning Outfit Alert</div>
                <div class="text-[10px] text-[#786C68]">"Good morning! Your outfit is ready ✨"</div>
              </div>
              <input type="checkbox" checked class="w-4 h-4 accent-pink-500 rounded" />
            </div>

            <div class="flex items-center justify-between text-xs pt-2 border-t border-pink-50">
              <div>
                <div class="font-bold text-[#2D2522]">🧺 Laundry Check Reminders</div>
                <div class="text-[10px] text-[#786C68]">"Quick check: are clothes ready to return?"</div>
              </div>
              <input type="checkbox" checked class="w-4 h-4 accent-pink-500 rounded" />
            </div>

            <div class="flex items-center justify-between text-xs pt-2 border-t border-pink-50">
              <div>
                <div class="font-bold text-[#2D2522]">📅 Scheduled Look Reminders</div>
                <div class="text-[10px] text-[#786C68]">"Don't forget tomorrow's scheduled look!"</div>
              </div>
              <input type="checkbox" checked class="w-4 h-4 accent-pink-500 rounded" />
            </div>
          </div>

          <!-- Sound Effects Toggle -->
          <div class="rounded-3xl bg-white border border-pink-100 p-4 shadow-xs flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-xl">🎶</span>
              <div>
                <div class="font-bold text-[#2D2522]">Magical Sound Effects & Chimes</div>
                <div class="text-[10px] text-[#786C68]">Synthesizer sparkles and door opening FX</div>
              </div>
            </div>
            <button id="toggle-sound-btn" class="btn-press px-3 py-1.5 rounded-full text-xs font-bold ${soundOn ? 'bg-pink-500 text-white' : 'bg-stone-200 text-[#786C68]'}">
              ${soundOn ? 'ON 🔊' : 'OFF 🔇'}
            </button>
          </div>

          <!-- Device Mockup Viewport Switcher -->
          <div class="rounded-3xl bg-white border border-pink-100 p-4 shadow-xs flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-xl">📱</span>
              <div>
                <div class="font-bold text-[#2D2522]">Display Mode</div>
                <div class="text-[10px] text-[#786C68]">Switch Smartphone Mockup / Full Screen</div>
              </div>
            </div>
            <button id="toggle-frame-btn" class="btn-press px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">
              Toggle Frame
            </button>
          </div>

          <!-- Reset / Replay Onboarding Demo -->
          <div class="pt-2">
            <button id="replay-onboarding-btn" class="btn-press w-full py-3.5 px-4 rounded-2xl bg-white border border-pink-200 text-pink-600 font-bold text-xs shadow-xs hover:bg-pink-50/60 flex items-center justify-center gap-2">
              <span>✨ Replay Initial Onboarding & 3D Closet Experience</span>
            </button>
          </div>
        </div>
      </div>
    `;

    setupProfileEvents();
  }

  function setupProfileEvents() {
    // Edit Avatar / Nickname
    const editAvatarBtn = container.querySelector('#edit-avatar-btn');
    if (editAvatarBtn) {
      editAvatarBtn.addEventListener('click', () => {
        playPop();
        openModal('edit_profile', {
          user: state.user,
          onSave: (updated) => {
            state.user = { ...state.user, ...updated };
            renderView();
          }
        });
      });
    }

    // Edit Preferences
    const editPrefBtn = container.querySelector('#edit-preferences-btn');
    if (editPrefBtn) {
      editPrefBtn.addEventListener('click', () => {
        playPop();
        openModal('edit_preferences');
      });
    }

    // Sound toggle
    const toggleSoundBtn = container.querySelector('#toggle-sound-btn');
    if (toggleSoundBtn) {
      toggleSoundBtn.addEventListener('click', () => {
        soundOn = !soundOn;
        setSoundEnabled(soundOn);
        if (soundOn) playSparkle();
        renderView();
      });
    }

    // Toggle Frame
    const frameBtn = container.querySelector('#toggle-frame-btn');
    if (frameBtn) {
      frameBtn.addEventListener('click', () => {
        playPop();
        const frame = document.querySelector('.phone-frame');
        if (frame) {
          frame.classList.toggle('fullscreen-mode');
        }
      });
    }

    // Replay Onboarding
    const replayBtn = container.querySelector('#replay-onboarding-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        playSparkle();
        restartApp();
      });
    }
  }

  renderView();
}
