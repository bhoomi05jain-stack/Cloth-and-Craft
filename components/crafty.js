import { playPop, playSparkle, playSuccess } from './audio.js';
import { CRAFTY_SYSTEM_PROMPTS } from '../data/defaultCloset.js';

export function renderCrafty(container, state, navigateTo, openModal) {
  let messages = state.craftyMessages || [
    {
      id: 'msg-1',
      sender: 'crafty',
      text: "Hi there! I'm Crafty, your personal AI stylist ✨ Ask me anything about styling what you already own, or tap one of the ideas below!",
      time: 'Just now'
    }
  ];

  let isTyping = false;

  function renderView() {
    container.innerHTML = `
      <div class="h-full flex flex-col justify-between bg-[#FAF7F2]">
        <!-- Sticky Header -->
        <div class="p-4 bg-[#FAF7F2]/90 backdrop-blur-md z-20 border-b border-pink-100/60 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-400 via-pink-400 to-amber-300 text-white flex items-center justify-center text-xl shadow-sm">
              🧚‍♀️
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h1 class="font-serif text-lg font-bold text-[#2D2522]">Crafty ✨</h1>
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span class="text-[10px] text-pink-600 font-semibold">AI Stylist • Wardrobe Intelligence</span>
            </div>
          </div>

          <button id="crafty-clear-chat-btn" class="text-xs font-semibold text-[#786C68] hover:text-pink-600 px-2.5 py-1 rounded-xl bg-white border border-pink-200">
            Clear 🔄
          </button>
        </div>

        <!-- Chat Messages Scroll Container -->
        <div id="crafty-messages-box" class="flex-1 overflow-y-auto p-4 space-y-3.5">
          ${messages.map(msg => `
            <div class="flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}">
              <div class="max-w-[85%] rounded-3xl p-3.5 shadow-xs text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none' : 'bg-white border border-pink-100 text-[#2D2522] rounded-bl-none'}">
                ${msg.text}

                ${msg.outfitRecommendation ? `
                  <div class="mt-3 p-2.5 rounded-2xl bg-pink-50/80 border border-pink-200 text-[#2D2522]">
                    <div class="text-[11px] font-bold text-pink-700 mb-1.5 flex items-center gap-1">
                      <span>✨ Recommended Outfit</span>
                    </div>
                    <div class="grid grid-cols-3 gap-1.5 mb-2">
                      ${msg.outfitRecommendation.items.map(item => `
                        <div class="rounded-xl bg-white p-1 border border-pink-100 flex flex-col items-center text-center">
                          <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg" />
                          <span class="text-[8px] font-bold truncate w-full mt-0.5">${item.name}</span>
                        </div>
                      `).join('')}
                    </div>
                    <button data-wear-rec-id="${msg.outfitRecommendation.id}" class="wear-rec-btn w-full py-1.5 rounded-xl bg-pink-500 text-white text-[10px] font-bold hover:bg-pink-600">
                      👗 Wear This Look Today
                    </button>
                  </div>
                ` : ''}
              </div>
              <span class="text-[9px] text-[#A89F91] mt-1 px-1">${msg.time}</span>
            </div>
          `).join('')}

          ${isTyping ? `
            <div class="flex items-center gap-2 text-xs text-[#786C68] p-2">
              <div class="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs">🧚‍♀️</div>
              <div class="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-pink-100 shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style="animation-delay: 0s;"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style="animation-delay: 0.2s;"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style="animation-delay: 0.4s;"></span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Prompt Suggestions Chips & Input Bar -->
        <div class="p-3 bg-white/90 backdrop-blur-md border-t border-pink-100/80 mb-14">
          <!-- Suggestion Chips -->
          <div class="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            ${CRAFTY_SYSTEM_PROMPTS.map(prompt => `
              <button data-prompt-text="${prompt}" class="prompt-chip-btn px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[10px] font-semibold text-pink-700 hover:bg-pink-100 whitespace-nowrap">
                ${prompt}
              </button>
            `).join('')}
          </div>

          <!-- Input Row -->
          <form id="crafty-chat-form" class="flex items-center gap-2 mt-1">
            <input type="text" id="crafty-input" placeholder="Ask Crafty about your closet..." class="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-pink-200 text-xs font-semibold text-[#2D2522] focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <button type="submit" class="btn-press w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center text-sm shadow-md shadow-pink-500/20">
              ✨
            </button>
          </form>
        </div>
      </div>
    `;

    setupCraftyEvents();
    scrollChatBottom();
  }

  function scrollChatBottom() {
    const box = container.querySelector('#crafty-messages-box');
    if (box) box.scrollTop = box.scrollHeight;
  }

  function handleSendMessage(text) {
    if (!text.trim()) return;
    playPop();

    messages.push({
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      time: 'Now'
    });
    state.craftyMessages = messages;
    renderView();

    // AI Simulated Response
    isTyping = true;
    renderView();

    setTimeout(() => {
      isTyping = false;
      playSparkle();
      
      const reply = generateCraftyResponse(text, state);
      messages.push(reply);
      state.craftyMessages = messages;
      renderView();
    }, 900);
  }

  function generateCraftyResponse(query, state) {
    const q = query.toLowerCase();
    const available = state.closetItems.filter(i => i.status !== 'in_laundry');

    let matchedPieces = [];
    let textReply = "";

    if (q.includes('party') || q.includes('night') || q.includes('cocktail')) {
      const dress = available.find(i => i.category === 'dresses') || available[0];
      const heel = available.find(i => i.category === 'shoes' && i.subcategory === 'Heels') || available[0];
      const bag = available.find(i => i.category === 'bags') || available[0];
      matchedPieces = [dress, heel, bag].filter(Boolean);
      textReply = `For party night, I styled your stunning ${dress.name} paired with metallic heels and a chic bag! You'll look absolutely radiant ✨`;
    } else if (q.includes('college') || q.includes('presentation') || q.includes('class')) {
      const top = available.find(i => i.category === 'tops') || available[0];
      const bottom = available.find(i => i.category === 'bottoms') || available[1];
      const shoe = available.find(i => i.subcategory === 'Sneakers') || available[0];
      matchedPieces = [top, bottom, shoe].filter(Boolean);
      textReply = `For college, comfort and chic style is key! Here's a clean combo with your ${top.name}, wide-leg trousers/jeans, and sneakers 📚`;
    } else if (q.includes('jeans') || q.includes('denim')) {
      const jeans = available.find(i => i.subcategory === 'Jeans') || available[0];
      const top = available.find(i => i.category === 'tops' && i.color === 'Cream') || available[0];
      const bag = available.find(i => i.category === 'bags') || available[0];
      matchedPieces = [jeans, top, bag].filter(Boolean);
      textReply = `Your vintage wide-leg jeans pair wonderfully with the silk button-down shirt and a neutral leather tote 🌸`;
    } else if (q.includes('rainy') || q.includes('cold') || q.includes('cozy')) {
      const sweater = available.find(i => i.subcategory === 'Sweaters') || available[0];
      const coat = available.find(i => i.category === 'outerwear') || available[0];
      const boot = available.find(i => i.subcategory === 'Boots') || available[0];
      matchedPieces = [sweater, coat, boot].filter(Boolean);
      textReply = `Stay cozy and elegant in the rain! I recommend layering your cable knit sweater under the wool trench coat with chunky lug-sole boots 🌧️`;
    } else {
      // General cute look
      const top = available.find(i => i.category === 'tops') || available[0];
      const bottom = available.find(i => i.category === 'bottoms') || available[1];
      const acc = available.find(i => i.category === 'accessories') || available[0];
      matchedPieces = [top, bottom, acc].filter(Boolean);
      textReply = `I crafted this fresh combination using your favorite pieces! It has a balanced silhouette and matches today's weather beautifully 💖`;
    }

    return {
      id: 'msg-' + Date.now(),
      sender: 'crafty',
      text: textReply,
      time: 'Now',
      outfitRecommendation: {
        id: 'rec-' + Date.now(),
        items: matchedPieces
      }
    };
  }

  function setupCraftyEvents() {
    const form = container.querySelector('#crafty-chat-form');
    const input = container.querySelector('#crafty-input');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage(input.value);
      });
    }

    container.querySelectorAll('.prompt-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const txt = btn.getAttribute('data-prompt-text');
        handleSendMessage(txt);
      });
    });

    const clearBtn = container.querySelector('#crafty-clear-chat-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        playPop();
        messages = [
          {
            id: 'msg-1',
            sender: 'crafty',
            text: "Hi there! I'm Crafty, your personal AI stylist ✨ Ask me anything about styling what you already own, or tap one of the ideas below!",
            time: 'Just now'
          }
        ];
        state.craftyMessages = messages;
        renderView();
      });
    }

    // Wear recommendation
    container.querySelectorAll('.wear-rec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSuccess();
        if (window.confetti) {
          window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
        }
        showToast('👗 Wearing Crafty recommendation today!');
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
