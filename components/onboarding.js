import { playPop, playSparkle, playSuccess } from './audio.js';
import { CUTE_NICKNAMES, AVATAR_OPTIONS } from '../data/defaultCloset.js';

export function renderOnboarding(container, state, onComplete) {
  let currentStep = 1; // 1: Welcome, 2: Style Quiz & Color Spectrum, 3: Nickname, 4: Login/OTP
  let selectedNickname = state.user?.nickname || 'Fashion Fairy ✨';
  let selectedAvatar = state.user?.avatar || AVATAR_OPTIONS[0];
  let selectedSilhouette = 'tailored';
  let selectedHue = 340; // Pink hue default
  let authMethod = 'phone';
  let authIdentifier = '';
  let otpValues = ['', '', '', '', '', ''];
  let timerSeconds = 30;
  let timerInterval = null;

  function renderCurrentStep() {
    if (currentStep === 1) {
      renderWelcomeStep();
    } else if (currentStep === 2) {
      renderStyleQuizStep();
    } else if (currentStep === 3) {
      renderNicknameStep();
    } else if (currentStep === 4) {
      renderAuthOtpStep();
    }
  }

  // Step 1: Welcome (Editorial Luxury)
  function renderWelcomeStep() {
    container.innerHTML = `
      <div class="h-full flex flex-col justify-between p-6 bg-[#FAF8F5] text-center animate-sheet-up">
        <!-- Brand Glyph -->
        <div class="pt-6">
          <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-[#F6F4F1] border border-[#EBE5DF] flex items-center justify-center text-4xl shadow-xs">
            ✨
          </div>
          <span class="font-serif text-3xl font-bold tracking-tighter text-[#1C1917]">g.</span>
          <h2 class="font-serif text-3xl font-bold text-[#1C1917] mt-1">
            Closet Craft
          </h2>
          <p class="text-xs text-[#78716C] mt-2 max-w-xs mx-auto leading-relaxed italic">
            "Your personal wardrobe, stylist, and outfit planner—all in one place."
          </p>
        </div>

        <!-- Editorial Feature Rows -->
        <div class="space-y-2.5 my-6 text-left max-w-xs mx-auto w-full">
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs">
            <span class="text-xl">📸</span>
            <div>
              <div class="text-xs font-bold text-[#1C1917]">Smart AI Detection</div>
              <div class="text-[10px] text-[#78716C]">Auto-isolates & tags colors, styles & seasons</div>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs">
            <span class="text-xl">🪄</span>
            <div>
              <div class="text-xs font-bold text-[#1C1917]">Flat-Lay Collages</div>
              <div class="text-[10px] text-[#786C68]">Editorial outfit pairings from what you own</div>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs">
            <span class="text-xl">🧺</span>
            <div>
              <div class="text-xs font-bold text-[#1C1917]">Laundry Protection</div>
              <div class="text-[10px] text-[#78716C]">Never recommends clothes currently in wash</div>
            </div>
          </div>
        </div>

        <!-- Continue Button -->
        <div class="w-full max-w-xs mx-auto pb-4">
          <button id="welcome-next-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-[#1C1917] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
            <span>Let's Get Started</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#welcome-next-btn').addEventListener('click', () => {
      playPop();
      currentStep = 2;
      renderCurrentStep();
    });
  }

  // Step 2: Visual Style Quiz & Spectrum (Inspired by Image 2)
  function renderStyleQuizStep() {
    container.innerHTML = `
      <div class="h-full flex flex-col justify-between p-6 bg-[#FAF8F5] animate-sheet-up overflow-y-auto">
        <div class="pt-2">
          <!-- Step Indicator -->
          <div class="flex items-center justify-between mb-3">
            <button id="quiz-back-btn" class="w-8 h-8 rounded-full bg-white border border-[#EBE5DF] text-xs font-bold text-[#1C1917]">←</button>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">Style DNA Quiz</span>
            <div class="w-8"></div>
          </div>

          <div class="text-center mb-4">
            <h3 class="font-serif text-2xl font-bold text-[#1C1917]">Define Your Style Vibe ✨</h3>
            <p class="text-xs text-[#78716C] mt-0.5">Customize your AI recommendation algorithms</p>
          </div>

          <!-- Fit / Silhouette Cards -->
          <div class="mb-4">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-[#78716C] mb-2">Preferred Silhouette</label>
            <div class="grid grid-cols-2 gap-2">
              <button data-sil="relaxed" class="sil-opt-btn p-3 rounded-2xl border text-center transition-all ${selectedSilhouette === 'relaxed' ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-[#1C1917] border-[#EBE5DF]'}">
                <span class="text-xl mb-1 block">☁️</span>
                <span class="text-xs font-bold block">Relaxed & Oversized</span>
                <span class="text-[9px] opacity-80">Comfortable drape</span>
              </button>

              <button data-sil="tailored" class="sil-opt-btn p-3 rounded-2xl border text-center transition-all ${selectedSilhouette === 'tailored' ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-[#1C1917] border-[#EBE5DF]'}">
                <span class="text-xl mb-1 block">📐</span>
                <span class="text-xs font-bold block">Tailored & Clean</span>
                <span class="text-[9px] opacity-80">Structured lines</span>
              </button>
            </div>
          </div>

          <!-- Interactive Rainbow Spectrum Color Palette Slider (Matching Image 2) -->
          <div class="rounded-3xl bg-white border border-[#EBE5DF] p-4 shadow-xs mb-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-[#1C1917]">Preferred Color Tone</span>
              <div class="w-5 h-5 rounded-full border border-black/10 shadow-xs" id="spectrum-color-preview" style="background-color: hsl(${selectedHue}, 80%, 65%);"></div>
            </div>

            <!-- Rainbow Gradient Track Slider -->
            <div class="relative py-2">
              <input type="range" id="color-hue-slider" min="0" max="360" value="${selectedHue}" class="w-full h-3 rounded-full appearance-none cursor-pointer" style="background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);" />
            </div>
            
            <div class="flex items-center justify-between text-[10px] font-semibold text-[#78716C] mt-1">
              <span>Warm Blushes</span>
              <span>Pastels</span>
              <span>Rich Jewel</span>
            </div>
          </div>
        </div>

        <div class="w-full max-w-xs mx-auto pb-2">
          <button id="quiz-continue-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-[#1C1917] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
            <span>Continue</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#quiz-back-btn').addEventListener('click', () => {
      playPop();
      currentStep = 1;
      renderCurrentStep();
    });

    container.querySelectorAll('.sil-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        selectedSilhouette = btn.getAttribute('data-sil');
        renderStyleQuizStep();
      });
    });

    const hueSlider = container.querySelector('#color-hue-slider');
    const colorPreview = container.querySelector('#spectrum-color-preview');
    if (hueSlider) {
      hueSlider.addEventListener('input', (e) => {
        selectedHue = e.target.value;
        if (colorPreview) {
          colorPreview.style.backgroundColor = `hsl(${selectedHue}, 80%, 65%)`;
        }
      });
    }

    container.querySelector('#quiz-continue-btn').addEventListener('click', () => {
      playPop();
      currentStep = 3;
      renderCurrentStep();
    });
  }

  // Step 3: Nickname & Avatar
  function renderNicknameStep() {
    container.innerHTML = `
      <div class="h-full flex flex-col justify-between p-6 bg-[#FAF8F5] animate-sheet-up">
        <div class="pt-2">
          <div class="flex items-center justify-between mb-3">
            <button id="nick-back-btn" class="w-8 h-8 rounded-full bg-white border border-[#EBE5DF] text-xs font-bold text-[#1C1917]">←</button>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">Step 3 of 4</span>
            <div class="w-8"></div>
          </div>

          <div class="text-center mb-4">
            <h3 class="font-serif text-2xl font-bold text-[#1C1917]">What should we call you? 💖</h3>
            <p class="text-xs text-[#78716C] mt-0.5">Pick a nickname for your personal stylist</p>
          </div>

          <!-- Avatar Grid -->
          <div class="flex items-center justify-center gap-3 mb-5">
            ${AVATAR_OPTIONS.map(av => `
              <button data-avatar-id="${av.id}" class="avatar-option w-12 h-12 rounded-2xl ${av.bg} flex items-center justify-center text-2xl border-2 transition-all ${selectedAvatar.id === av.id ? 'border-[#1C1917] scale-110 shadow-sm' : 'border-transparent opacity-80'}">
                ${av.emoji}
              </button>
            `).join('')}
          </div>

          <!-- Input -->
          <div class="mb-4">
            <label class="block text-xs font-bold text-[#1C1917] mb-1.5 ml-1">Your Nickname</label>
            <input type="text" id="nickname-input" value="${selectedNickname}" class="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EBE5DF] text-[#1C1917] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1917]" />
          </div>

          <!-- Preset Chips -->
          <div class="flex flex-wrap gap-2">
            ${CUTE_NICKNAMES.map(name => `
              <button type="button" class="preset-name-chip px-3 py-1.5 rounded-full bg-white border border-[#EBE5DF] text-xs font-medium text-[#1C1917] hover:bg-stone-50 ${selectedNickname === name ? 'bg-[#1C1917] text-white border-[#1C1917]' : ''}">
                ${name}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="w-full max-w-xs mx-auto pb-2">
          <button id="nickname-continue-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-[#1C1917] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
            <span>Continue</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#nick-back-btn').addEventListener('click', () => {
      playPop();
      currentStep = 2;
      renderCurrentStep();
    });

    const nickInput = container.querySelector('#nickname-input');
    nickInput.addEventListener('input', (e) => {
      selectedNickname = e.target.value;
    });

    container.querySelectorAll('.avatar-option').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        const id = btn.getAttribute('data-avatar-id');
        selectedAvatar = AVATAR_OPTIONS.find(a => a.id === id);
        renderNicknameStep();
      });
    });

    container.querySelectorAll('.preset-name-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        playPop();
        selectedNickname = btn.innerText.trim();
        renderNicknameStep();
      });
    });

    container.querySelector('#nickname-continue-btn').addEventListener('click', () => {
      state.user = {
        ...state.user,
        nickname: selectedNickname,
        avatar: selectedAvatar
      };
      playPop();
      currentStep = 4;
      renderCurrentStep();
    });
  }

  // Step 4: OTP Verification
  function renderAuthOtpStep() {
    let isOtpSent = false;

    function renderAuthSubView() {
      container.innerHTML = `
        <div class="h-full flex flex-col justify-between p-6 bg-[#FAF8F5] animate-sheet-up">
          <div class="pt-2">
            <div class="flex items-center justify-between mb-3">
              <button id="auth-back-btn" class="w-8 h-8 rounded-full bg-white border border-[#EBE5DF] text-xs font-bold text-[#1C1917]">←</button>
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#786C68]">Step 4 of 4</span>
              <div class="w-8"></div>
            </div>

            ${!isOtpSent ? `
              <div class="text-center mb-5">
                <h3 class="font-serif text-2xl font-bold text-[#1C1917]">Welcome, ${selectedNickname.split(' ')[0]}! ✨</h3>
                <p class="text-xs text-[#786C68] mt-0.5">Verify your account to access your digital closet</p>
              </div>

              <div class="flex rounded-2xl bg-[#ECE8E1] p-1 mb-4 max-w-xs mx-auto">
                <button id="auth-tab-phone" class="flex-1 py-2 rounded-xl text-xs font-bold ${authMethod === 'phone' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-[#786C68]'}">
                  📱 Mobile
                </button>
                <button id="auth-tab-email" class="flex-1 py-2 rounded-xl text-xs font-bold ${authMethod === 'email' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-[#786C68]'}">
                  📧 Email
                </button>
              </div>

              <div class="mb-3">
                <label class="block text-xs font-bold text-[#1C1917] mb-1.5 ml-1">
                  ${authMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <input id="auth-input" type="text" value="${authIdentifier || (authMethod === 'phone' ? '+91 98765 43210' : 'fashionista@closetcraft.app')}" class="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EBE5DF] text-[#1C1917] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1917]" />
              </div>
            ` : `
              <div class="text-center mb-5">
                <h3 class="font-serif text-2xl font-bold text-[#1C1917]">Verify it's you ✨</h3>
                <p class="text-xs text-[#786C68] mt-0.5">Code sent to ${authIdentifier || '+91 98765 43210'}</p>
              </div>

              <div class="flex justify-center gap-2 mb-4">
                ${[0, 1, 2, 3, 4, 5].map(idx => `
                  <input type="text" maxlength="1" data-otp-index="${idx}" class="otp-box w-11 h-13 text-center text-xl font-bold text-[#1C1917] bg-white border-2 border-[#EBE5DF] rounded-2xl focus:border-[#1C1917] focus:outline-none shadow-xs" value="${otpValues[idx]}" />
                `).join('')}
              </div>

              <div class="text-center text-xs text-[#786C68]">
                Resend code in <strong class="text-[#1C1917]">00:${timerSeconds < 10 ? '0' + timerSeconds : timerSeconds}</strong>
              </div>
            `}
          </div>

          <div class="w-full max-w-xs mx-auto pb-2">
            ${!isOtpSent ? `
              <button id="send-otp-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-[#1C1917] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
                <span>Send Verification Code</span>
              </button>
            ` : `
              <button id="verify-otp-btn" class="btn-press w-full py-4 px-6 rounded-2xl bg-[#1C1917] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
                <span>Verify & Enter</span>
              </button>
            `}
          </div>
        </div>
      `;

      container.querySelector('#auth-back-btn').addEventListener('click', () => {
        playPop();
        if (isOtpSent) {
          isOtpSent = false;
          clearInterval(timerInterval);
          renderAuthSubView();
        } else {
          currentStep = 3;
          renderCurrentStep();
        }
      });

      if (!isOtpSent) {
        const phoneTab = container.querySelector('#auth-tab-phone');
        const emailTab = container.querySelector('#auth-tab-email');
        const input = container.querySelector('#auth-input');

        phoneTab.addEventListener('click', () => {
          playPop();
          authMethod = 'phone';
          authIdentifier = '';
          renderAuthSubView();
        });

        emailTab.addEventListener('click', () => {
          playPop();
          authMethod = 'email';
          authIdentifier = '';
          renderAuthSubView();
        });

        container.querySelector('#send-otp-btn').addEventListener('click', () => {
          authIdentifier = input.value.trim() || (authMethod === 'phone' ? '+91 98765 43210' : 'fashionista@closetcraft.app');
          playSparkle();
          isOtpSent = true;
          startOtpCountdown();
          renderAuthSubView();

          setTimeout(() => {
            otpValues = ['1', '2', '3', '4', '5', '6'];
            const boxes = container.querySelectorAll('.otp-box');
            boxes.forEach((b, i) => b.value = otpValues[i]);
          }, 500);
        });
      } else {
        const otpBoxes = container.querySelectorAll('.otp-box');
        otpBoxes.forEach((box, idx) => {
          box.addEventListener('input', (e) => {
            const val = e.target.value;
            otpValues[idx] = val;
            if (val.length === 1 && idx < 5) otpBoxes[idx + 1].focus();
          });
        });

        container.querySelector('#verify-otp-btn').addEventListener('click', () => {
          playSuccess();
          if (window.confetti) {
            window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          }
          state.user = {
            ...state.user,
            authMethod,
            authIdentifier,
            isVerified: true
          };
          setTimeout(() => {
            onComplete();
          }, 700);
        });
      }
    }

    function startOtpCountdown() {
      timerSeconds = 30;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds <= 0) clearInterval(timerInterval);
      }, 1000);
    }

    renderAuthSubView();
  }

  renderCurrentStep();
}
