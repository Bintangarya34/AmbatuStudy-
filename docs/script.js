// Interaktif kecil: search yang menyorot kata pada konten
document.getElementById('searchBtn').addEventListener('click', function(){
  const q = document.getElementById('q').value.trim();
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

// Dark mode toggle
document.getElementById('toggleMode').addEventListener('click', function(){
  document.body.classList.toggle('dark');
  this.textContent = document.body.classList.contains('dark') ? '☀' : '🌙';
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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

  // Handle ChatGPT response using API
  async function handleChatGPTResponse(userMessage) {
    try {
      const response = await callChatGPTAPI(userMessage);
      addMessage(response, 'bot');
    } catch (error) {
      console.error('API Error:', error);
      addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.', 'bot');
    }
  }
});

// ChatGPT API Integration (you'll need to add your API key)
async function callChatGPTAPI(message) {
  // ⚠️ WARNING: API key exposed in frontend! For testing ONLY.
  // For production, MUST move to backend to protect API key from public access
  
  const API_KEY = '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';
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


// This duplicate function is removed since we already have it inside the DOMContentLoaded event listener above