import { DEFAULT_CLOSET_ITEMS, INITIAL_SAVED_LOOKS, INITIAL_CALENDAR_EVENTS, AVATAR_OPTIONS } from './data/defaultCloset.js';
import { renderSplash } from './components/splash.js';
import { renderOnboarding } from './components/onboarding.js';
import { renderUploadFlow } from './components/uploadFlow.js';
import { renderMagicDoor } from './components/magicDoor.js';
import { renderHome } from './components/home.js';
import { renderCloset } from './components/closet.js';
import { renderStudio } from './components/studio.js';
import { renderLaundry } from './components/laundry.js';
import { renderPlanner } from './components/planner.js';
import { renderCrafty } from './components/crafty.js';
import { renderInsights } from './components/insights.js';
import { renderProfile } from './components/profile.js';
import { openModalManager } from './components/modals.js';
import { playPop } from './components/audio.js';

const STATE_STORAGE_KEY = 'closet_craft_app_state_v2';

function loadState() {
  const saved = localStorage.getItem(STATE_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }
  }

  return {
    flowStage: 'splash', // 'splash', 'onboarding', 'upload', 'magic_door', 'main'
    activeTab: 'closet', // default to closet to showcase flat-lay outfits
    user: {
      nickname: 'Fashion Fairy ✨',
      avatar: AVATAR_OPTIONS[0],
      authMethod: 'phone',
      authIdentifier: '+91 98765 43210',
      isVerified: true
    },
    closetItems: [...DEFAULT_CLOSET_ITEMS],
    savedLooks: [...INITIAL_SAVED_LOOKS],
    calendarEvents: [...INITIAL_CALENDAR_EVENTS],
    selectedVibes: ['clean-minimal'],
    currentWeather: { icon: '☀️', text: 'Sunny 22°C', type: 'sunny' },
    craftyMessages: null
  };
}

const state = loadState();

function saveState() {
  localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
}

const appContainer = document.getElementById('app-screen');
const navBar = document.getElementById('bottom-nav');

function navigateToTab(tabName) {
  playPop();
  state.activeTab = tabName;
  saveState();
  renderApp();
}

function openModal(type, props = {}) {
  openModalManager(type, props, state, () => {
    saveState();
    renderApp();
  });
}

function restartApp() {
  state.flowStage = 'splash';
  state.activeTab = 'closet';
  saveState();
  renderApp();
}

export function renderApp() {
  saveState();

  // Initial Flows
  if (state.flowStage === 'splash') {
    navBar.classList.add('hidden');
    renderSplash(appContainer, () => {
      state.flowStage = 'onboarding';
      renderApp();
    });
    return;
  }

  if (state.flowStage === 'onboarding') {
    navBar.classList.add('hidden');
    renderOnboarding(appContainer, state, () => {
      state.flowStage = 'upload';
      renderApp();
    });
    return;
  }

  if (state.flowStage === 'upload') {
    navBar.classList.add('hidden');
    renderUploadFlow(appContainer, state, () => {
      state.flowStage = 'magic_door';
      renderApp();
    });
    return;
  }

  if (state.flowStage === 'magic_door') {
    navBar.classList.add('hidden');
    renderMagicDoor(appContainer, state, () => {
      state.flowStage = 'main';
      state.activeTab = 'closet';
      renderApp();
    });
    return;
  }

  // Main Nav Shell
  navBar.classList.remove('hidden');
  updateNavBarUI();

  if (state.activeTab === 'home') {
    renderHome(appContainer, state, navigateToTab, openModal);
  } else if (state.activeTab === 'closet') {
    renderCloset(appContainer, state, navigateToTab, openModal);
  } else if (state.activeTab === 'studio') {
    renderStudio(appContainer, state, navigateToTab, openModal);
  } else if (state.activeTab === 'laundry') {
    renderLaundry(appContainer, state, navigateToTab, openModal);
  } else if (state.activeTab === 'planner') {
    renderPlanner(appContainer, state, navigateToTab, openModal);
  } else if (state.activeTab === 'crafty') {
    renderCrafty(appContainer, state, navigateToTab, openModal);
  } else if (state.activeTab === 'insights') {
    renderInsights(appContainer, state, navigateToTab, openModal);
  } else if (state.activeTab === 'profile') {
    renderProfile(appContainer, state, navigateToTab, openModal, restartApp);
  }
}

// Minimalist Editorial Floating Dock (Exact match to Image 1 & 3)
function updateNavBarUI() {
  const isCloset = state.activeTab === 'closet';
  const isCrafty = state.activeTab === 'crafty';
  const isPlanner = state.activeTab === 'planner';
  const isProfile = state.activeTab === 'profile' || state.activeTab === 'home';

  navBar.innerHTML = `
    <div class="floating-dock max-w-[340px] mx-auto px-5 py-2.5 flex items-center justify-between shadow-xl">
      <!-- 1. Closet (Hanger Icon) -->
      <button data-nav-tab="closet" class="nav-tab-btn flex flex-col items-center justify-center transition-all ${isCloset ? 'text-[#1C1917] font-bold' : 'text-[#A89F91] hover:text-[#1C1917]'}">
        <span class="text-lg">👗</span>
        <span class="text-[9px] tracking-tight mt-0.5">Closet</span>
      </button>

      <!-- 2. AI Outfits / Crafty -->
      <button data-nav-tab="crafty" class="nav-tab-btn flex flex-col items-center justify-center transition-all ${isCrafty ? 'text-[#1C1917] font-bold' : 'text-[#A89F91] hover:text-[#1C1917]'}">
        <span class="text-lg">✨</span>
        <span class="text-[9px] tracking-tight mt-0.5">AI Outfits</span>
      </button>

      <!-- 3. Central Elevated Circular Black + FAB (Matching Image 1 & 3) -->
      <button data-nav-tab="studio" class="center-fab-btn btn-press shadow-md">
        <span class="text-2xl font-light leading-none mb-0.5">＋</span>
      </button>

      <!-- 4. Calendar (Calendar Icon) -->
      <button data-nav-tab="planner" class="nav-tab-btn flex flex-col items-center justify-center transition-all ${isPlanner ? 'text-[#1C1917] font-bold' : 'text-[#A89F91] hover:text-[#1C1917]'}">
        <span class="text-lg">📅</span>
        <span class="text-[9px] tracking-tight mt-0.5">Calendar</span>
      </button>

      <!-- 5. Profile / Home -->
      <button data-nav-tab="profile" class="nav-tab-btn flex flex-col items-center justify-center transition-all ${isProfile ? 'text-[#1C1917] font-bold' : 'text-[#A89F91] hover:text-[#1C1917]'}">
        <span class="text-lg">👤</span>
        <span class="text-[9px] tracking-tight mt-0.5">Home</span>
      </button>
    </div>
  `;

  navBar.querySelectorAll('.nav-tab-btn, .center-fab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-nav-tab');
      navigateToTab(tab);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
