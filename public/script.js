// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Dark mode toggle
  const toggleBtn = document.getElementById('toggleMode');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(){
      document.body.classList.toggle('dark');
      this.textContent = document.body.classList.contains('dark') ? '☀' : '🌙';
    });
  }

  // Search functionality
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('q');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function(){
      const q = searchInput.value.trim();
      if(!q) return alert('Ketik kata kunci.');
      // cari dan scroll ke bagian yang cocok
      const content = document.querySelector('main');
      const el = Array.from(content.querySelectorAll('h3, p, li'))
        .find(n => n.textContent.toLowerCase().includes(q.toLowerCase()));
      if(el){
        el.scrollIntoView({behavior:'smooth', block:'center'});
        el.style.transition = 'background 0.6s';
        const orig = el.style.background;
        el.style.background = 'linear-gradient(90deg,#fffbeb,#fff7ed)';
        setTimeout(()=> el.style.background = orig, 1600);
      } else {
        alert('Tidak ditemukan di catatan singkat. Coba kursus atau tanya tutor.');
      }
    });
  }
  // Chatbox functionality
  const chatModal = document.getElementById('chatModal');
  const chatBtn = document.getElementById('chatBtn');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatMessages = document.getElementById('chatMessages');

  // Check if elements exist
  if (!chatBtn || !chatModal || !closeChatBtn || !chatInput || !sendChatBtn || !chatMessages) {
    console.error('Chat elements not found in DOM');
    return;
  }

  // Open chatbox
  chatBtn.addEventListener('click', function() {
    console.log('Chat button clicked'); // Debug log
    chatModal.classList.add('show');
    chatInput.focus();
  });

  // Close chatbox
  closeChatBtn.addEventListener('click', function() {
    chatModal.classList.remove('show');
  });

  // Close chatbox when clicking outside
  chatModal.addEventListener('click', function(e) {
    if (e.target === chatModal) {
      chatModal.classList.remove('show');
    }
  });

  // Event listeners for sending messages
  sendChatBtn.addEventListener('click', sendMessage);

  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Enable/disable send button based on input
  chatInput.addEventListener('input', function() {
    sendChatBtn.disabled = !this.value.trim();
  });

  // Send message functionality
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to ChatGPT API (simulated for now)
    setTimeout(() => {
      hideTypingIndicator();
      handleChatGPTResponse(message);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  }

function loadPage(page) {
  fetch(page)
    .then(response => response.text())
    .then(data => {
      document.getElementById("app").innerHTML = data;
    })
    .catch(err => {
      document.getElementById("app").innerHTML = "<h2>Page not found</h2>";
    });
}

function router() {
  let hash = window.location.hash.substring(1); // hapus tanda #
  if (hash === "") {
    loadPage("index.html");
  } else if (hash.toLowerCase() === "notes") {
    loadPage("Notes.html");
  } else if (hash.toLowerCase() === "videos") {
    loadPage("Videos.html");
  } else {
    document.getElementById("app").innerHTML = "<h2>404 - Not Found</h2>";
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);


  
  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = sender === 'user' ? 'U' : 'MA';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = 'MA';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-text';
    typingContent.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    contentDiv.appendChild(typingContent);
    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Handle ChatGPT response (placeholder - will be replaced with actual API call)
  function handleChatGPTResponse(userMessage) {
    // Simulated responses from "Mas Amba"
    const responses = [
      "Pertanyaan yang bagus! Untuk masalah matematika seperti ini, mari kita breakdown step by step.",
      "Saya Mas Amba siap membantu! Bisa tolong jelaskan lebih detail soal yang ingin dipecahkan?",
      "Dari pengalaman mengajar, konsep ini sering bikin bingung. Mari saya jelaskan dengan cara yang mudah dipahami.",
      "Oke, untuk soal persamaan kuadrat seperti ini, kita mulai dengan mencari diskriminannya dulu ya.",
      "Bagus! Ini topik favorit saya. Ada beberapa cara untuk menyelesaikan ini, mau yang mana?",
      "Hmm, kalau untuk materi ini, saya sarankan pahami konsep dasarnya dulu. Mau saya jelaskan?",
      "Wah, ini soal yang menarik! Di AmbatuStudy kita punya metode khusus untuk menyelesaikan ini."
    ];
    
    // Simple keyword-based responses
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    if (userMessage.toLowerCase().includes('persamaan kuadrat')) {
      response = "Persamaan kuadrat ya! Ingat rumus ABC: x = (-b ± √(b²-4ac)) / 2a. Diskriminan (b²-4ac) menentukan jenis akarnya. Mau saya bantu dengan contoh soal?";
    } else if (userMessage.toLowerCase().includes('matematika') || userMessage.toLowerCase().includes('math')) {
      response = "Matematika memang menantang, tapi jangan khawatir! Saya Mas Amba akan bantu sampai paham. Topik mana yang ingin dipelajari?";
    } else if (userMessage.toLowerCase().includes('halo') || userMessage.toLowerCase().includes('hai')) {
      response = "Halo juga! Saya Mas Amba, asisten AI AmbatuStudy. Siap membantu belajar matematika. Ada soal yang mau ditanyakan?";
    } else if (userMessage.toLowerCase().includes('terima kasih') || userMessage.toLowerCase().includes('thanks')) {
      response = "Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi kalau ada yang belum jelas ya! 😊";
    }
    
    addMessage(response, 'bot');
  }
});

// ChatGPT API Integration (you'll need to add your API key)
async function callChatGPTAPI(message) {
  // Note: For production, you should implement this on the backend for security
  // This is a frontend example - move to backend in real implementation
  
  const API_KEY = 'your-openai-api-key-here'; // Replace with your actual API key
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah "Mas Amba", asisten AI untuk platform pembelajaran AmbatuStudy. Kamu ahli dalam matematika dan selalu membantu dengan cara yang ramah dan mudah dipahami. Gunakan bahasa Indonesia yang santai tapi tetap informatif. Fokus pada pembelajaran matematika, terutama topik seperti persamaan kuadrat, aljabar, geometri, dan kalkulus.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return 'Maaf, saya sedang mengalami gangguan. Coba lagi dalam beberapa saat ya!';
  }
}

  // Replace the handleChatGPTResponse function to use actual API
  // Uncomment this when you have your API key ready:
  /*
  async function handleChatGPTResponse(userMessage) {
    try {
      const response = await callChatGPTAPI(userMessage);
      addMessage(response, 'bot');
    } catch (error) {
      addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.', 'bot');
    }
  }
  */

}); // End of DOMContentLoaded
