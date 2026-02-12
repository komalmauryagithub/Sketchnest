document.addEventListener("DOMContentLoaded", () => {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotModal = document.getElementById("chatbot-modal");
  const closeBtn = document.getElementById("close-btn");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // 🎨 15 Predefined Q&A
  const qaPairs = {
    
    "how to start learning sketching": "Start with basic shapes like circles, squares, and triangles. Practice control and proportion first. Then move to sketching simple objects in the Phase 1 section of SketchNest’s Learn tab. ✏️",
    "which tools are best for sketching": "For beginners, start with HB, 2B, and 4B pencils, a good eraser, and plain paper. As you advance, use blending stumps, charcoal pencils, and kneaded erasers for smooth shading. 🧰",
    "what is sketchnest": "SketchNest is an art learning platform that helps you learn, practice, and upload sketches. You can explore lessons, get AI feedback, and improve step-by-step. 🎨",
    "how to upload my sketch": "To upload, go to the Challenge or Gallery tab → click Upload Sketch → choose your image → and submit. Your sketch will appear in the Gallery once uploaded. 🖼️",
    "what is the learn section": "The Learn section is where you’ll find step-by-step sketching lessons divided into three phases — from basic shapes to advanced portraits. 📘",
    "how does the rating system work": "After you upload your sketch in the Learn section, SketchNest’s AI compares it with the reference image and gives a rating out of 10. If you score 5 or more, you unlock the next step! ⭐",
    "what is the sketch dictionary": "The Sketch Dictionary contains sketching terms, tools, and mini tips. It’s great for beginners who want to understand common sketching words and materials. 📖",
    "what is the practice pad used for": "The Practice Pad is a digital drawing canvas where you can freely sketch online using your mouse or stylus. It helps you practice strokes and shading directly. 🧑‍🎨",
    "how to participate in sketch challenges": "Visit the Challenge tab to see the latest sketch tasks. Draw the reference image, upload your sketch, and see how others performed in the Gallery! 🏆",
    "how can i view other users' sketches": "Open the Gallery tab to explore all uploaded sketches. You can view, rate, and get inspired by others’ artwork! 🖌️",
    "what are sketch phases": "SketchNest divides learning into three phases: Phase 1 – Basics & Shapes, Phase 2 – Object Drawing, Phase 3 – Portraits & Realism. Each phase builds your skills step-by-step. 📈",
    "what pencils are good for shading": "For shading, use soft pencils like 4B, 6B, and 8B. They create darker tones and smoother gradients. Blend using tissue or blending stumps for a soft effect. 🪶",
    "how to improve sketch accuracy": "Use grid lines and light guidelines to maintain proportion. Compare your sketch with the reference frequently. SketchNest’s rating helps you identify areas to improve! 🔍",
    "can i get feedback on my sketches": "Yes! The AI rating in the Learn section gives instant feedback. You can also ask SketchBot for drawing tips or share your sketch in the Gallery for peer feedback. 💡",
    "how can i contact or ask doubts": "You can click the Ask AI button at the end of the Learn section or chat with SketchBot anytime to clear your sketching doubts. 🤖",
    "default": "Sorry, I didn’t understand that. Try asking about learning, tools, uploading, or the rating system. 😊"
  };

  // 🟣 Toggle chatbot modal
  chatbotIcon.addEventListener("click", () => {
    chatbotModal.style.display =
      chatbotModal.style.display === "flex" ? "none" : "flex";
    chatbotModal.style.flexDirection = "column";
  });

  closeBtn.addEventListener("click", () => {
    chatbotModal.style.display = "none";
  });

  // 🟣 Send Message Function
  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.classList.add("user-message");
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    userInput.value = "";

    // Bot reply
    const key = message.toLowerCase();
    const reply = qaPairs[key] || "🤖 Sorry, I don’t know that yet. Try another sketching question!";
    setTimeout(() => {
      const botMsg = document.createElement("div");
      botMsg.classList.add("bot-message");
      botMsg.textContent = reply;
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 400);
  }

  // 🟣 Event Listeners
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
