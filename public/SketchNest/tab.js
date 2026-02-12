function switchTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

function toggleChallengeUpload() {
  const section = document.getElementById('challenge-upload-section');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function previewImage(type) {
  const fileInput = document.getElementById(`${type}Upload`);
  const previewContainer = document.getElementById(`preview-${type}`);
  const previewImg = document.getElementById(`preview-img-${type}`);

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    previewContainer.style.display = 'none';
  }
}

function submitImage(type) {
  const fileInput = document.getElementById(`${type}Upload`);
  const status = document.getElementById(`status-${type}`);

  if (fileInput.files.length === 0) {
    alert("Please select a sketch to submit.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const imgSrc = e.target.result;

    // Add feedback rating (1-10)
    const rating = Math.floor(Math.random() * 10) + 1;

    // Add to gallery
    const gallery = document.getElementById('gallery-container');
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.innerHTML = `
      <img src="${imgSrc}" alt="Sketch">
      <p><strong>Source:</strong> Challenge Upload</p>
      <p><strong>Rating:</strong> ${rating}/10</p>
    `;
    gallery.appendChild(card);

    // Show success status
    status.style.color = "green";
    status.innerText = `✅ Sketch submitted successfully with rating: ${rating}/10`;

    // Reset input
    fileInput.value = '';
    document.getElementById(`preview-${type}`).style.display = 'none';
  };

  reader.readAsDataURL(file);
}


const challenges = [
  "Sketch a Dream City",
  "Draw Your Favorite Animal",
  "Design a Futuristic Vehicle",
  "Sketch a Magical Forest",
  "Create a Superhero Character"
];
let currentChallengeIndex = 0;

// --- Tab switcher ---
function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

// --- Toggle upload section ---
function toggleChallengeUpload() {
  const section = document.getElementById("challenge-upload-section");
  section.style.display = section.style.display === "none" ? "block" : "none";
}

// --- Preview image ---
function previewImage(type) {
  const fileInput = document.getElementById(`${type}Upload`);
  const previewContainer = document.getElementById(`preview-${type}`);
  const previewImg = document.getElementById(`preview-img-${type}`);
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

// --- Submit image ---
function submitImage(type) {
  const status = document.getElementById(`status-${type}`);
  const fileInput = document.getElementById(`${type}Upload`);
  if (!fileInput.files.length) {
    status.textContent = "⚠️ Please select an image before submitting.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = e => {
    const imageData = e.target.result;
    const rating = Math.floor(Math.random() * 6) + 5; // random 5–10

    addToGallery(imageData, rating, challenges[currentChallengeIndex]);
    status.textContent = `✅ Upload successful! You scored ${rating}/10`;

    // Auto next challenge
    setTimeout(() => {
      document.getElementById("challenge-upload-section").style.display = "none";
      document.getElementById("preview-challenge").style.display = "none";
      fileInput.value = "";

      currentChallengeIndex++;
      if (currentChallengeIndex < challenges.length) {
        const nextChallenge = challenges[currentChallengeIndex];
        document.getElementById("challenge-title").textContent = nextChallenge;
        status.textContent = `🎯 Next Challenge Unlocked: ${nextChallenge}`;
      } else {
        document.getElementById("challenge-title").textContent = "🏆 All Challenges Completed!";
        status.textContent = "🎉 You’ve completed all challenges! Well done!";
      }
    }, 2000);
  };

  reader.readAsDataURL(file);
}

// --- Add to gallery(challenge) ---
function addToGallery(imageData, rating, challengeName) {
  const galleryContainer = document.getElementById("gallery-container");

  const item = document.createElement("div");
  item.classList.add("gallery-item");

  const img = document.createElement("img");
  img.src = imageData;

  const caption = document.createElement("p");
  caption.textContent = `${challengeName} — ⭐ ${rating}/10`;

  item.appendChild(img);
  item.appendChild(caption);
  galleryContainer.appendChild(item);

  // Save to localStorage
  let savedGallery = JSON.parse(localStorage.getItem("galleryImages")) || [];
  savedGallery.push({ image: imageData, rating, challenge: challengeName });
  localStorage.setItem("galleryImages", JSON.stringify(savedGallery));
}

function submitGalleryImage() {
  const input = document.getElementById('galleryUpload');
  const file = input.files[0];
  const status = document.getElementById('gallery-status');

  if (!file) {
    alert("Please select a sketch to upload.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;

    // Get existing gallery or create new
    let gallery = JSON.parse(localStorage.getItem("sketchGallery")) || [];

    // Avoid duplicate entries by checking if image already exists
    if (!gallery.includes(imageData)) {
      gallery.push(imageData);
      localStorage.setItem("sketchGallery", JSON.stringify(gallery));
    }

    // Display the new image
    addImageToGallery(imageData);

    // Reset form and status
    input.value = '';
    document.getElementById('gallery-preview-container').style.display = 'none';
    status.style.color = "green";
    status.textContent = "✅ Sketch uploaded and saved!";
  };

  reader.readAsDataURL(file);
}

// ✅ Display saved gallery images once (on page load)
window.addEventListener('DOMContentLoaded', function () {
  const gallery = JSON.parse(localStorage.getItem("sketchGallery")) || [];
  const galleryDisplay = document.getElementById('gallery-display');
  // galleryDisplay.innerHTML = ""; // Clear before displaying
  gallery.forEach(imageData => addImageToGallery(imageData));
});

// ✅ Function to add image to the gallery display
function addImageToGallery(imageData) {
  const galleryDisplay = document.getElementById('gallery-display');
  const img = document.createElement('img');
  img.src = imageData;
  img.className = 'gallery-image';
  galleryDisplay.appendChild(img);
}

// ✅ Optional: Clear gallery button
function clearGallery() {
  localStorage.removeItem("sketchGallery");
  document.getElementById('gallery-display').innerHTML = "";
  alert("🧹 Gallery cleared!");
}


// ---------------------------------------floating sketchbot-------------------------------------------


// 15 fixed Q&A pairs for SketchNest
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

// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotModal = document.getElementById("chatbot-modal");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // Toggle chatbot modal
  function toggleChatbot() {
    chatbotModal.style.display =
      chatbotModal.style.display === "flex" ? "none" : "flex";
  }

  // Send message function
  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    const userMsgDiv = document.createElement("div");
    userMsgDiv.classList.add("user-message");
    userMsgDiv.textContent = message;
    chatMessages.appendChild(userMsgDiv);

    // Clear input
    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Bot reply
    setTimeout(() => {
      const botMsgDiv = document.createElement("div");
      botMsgDiv.classList.add("bot-message");
      const key = message.toLowerCase();
      botMsgDiv.textContent =
        qaPairs[key] || "🤖 Sorry, I don't know the answer. Try asking something else about SketchNest.";
      chatMessages.appendChild(botMsgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  }

  // Event listeners
  chatbotIcon.addEventListener("click", toggleChatbot);
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});



  // chatbotIcon.addEventListener("click", toggleChatbot);


  // ------------------------------challenge and gallerytab------------------------------------------


  function showSection(id) {
    document.getElementById('upload').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
    document.getElementById(id).style.display = 'block';
  }

  function uploadSketch() {
    const input = document.getElementById('sketchInput');
    const file = input.files[0];

    if (!file) {
      alert("Please select a sketch to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;

      // Show preview
      const preview = document.getElementById('previewContainer');
      preview.innerHTML = `<img src="${imageUrl}" alt="Sketch Preview"/>`;

      // Add to gallery
      const gallery = document.getElementById('galleryContainer');
      const img = document.createElement('img');
      img.src = imageUrl;
      gallery.appendChild(img);

      // Clear file input
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  // ------------------------------------------gallery tab---------------------------------------------

  document.addEventListener("DOMContentLoaded", () => {
    const galleryDisplay = document.getElementById("gallery-display");
    const fileInput = document.getElementById("galleryUpload");
    const previewContainer = document.getElementById("gallery-preview-container");
    const previewImg = document.getElementById("gallery-preview-img");
    const status = document.getElementById("gallery-status");

    // ---------- Function to Add Image to Gallery ----------
    function addImageToGallery(imageData) {
      const imgItem = document.createElement("div");
      imgItem.classList.add("gallery-item");

      const img = document.createElement("img");
      img.src = imageData;

      imgItem.appendChild(img);
      galleryDisplay.appendChild(imgItem);
    }

    // ---------- Load Images from localStorage ----------
    function loadGallery() {
      const savedImages = JSON.parse(localStorage.getItem("userGalleryImages")) || [];
      savedImages.forEach(imgData => addImageToGallery(imgData));
    }

    // ---------- Preview Selected Image ----------
    window.previewGalleryImage = function () {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        previewContainer.style.display = "block";
      };
      reader.readAsDataURL(file);
    };

    // ---------- Submit Image to Gallery ----------
    window.submitGalleryImage = function () {
      const file = fileInput.files[0];
      if (!file) {
        status.textContent = "⚠️ Please select an image to upload.";
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        const imageData = e.target.result;

        // Save image in localStorage
        let savedImages = JSON.parse(localStorage.getItem("userGalleryImages")) || [];
        savedImages.push(imageData);
        localStorage.setItem("userGalleryImages", JSON.stringify(savedImages));

        // Add image to gallery
        addImageToGallery(imageData);

        // Reset inputs and preview
        fileInput.value = "";
        previewContainer.style.display = "none";
        status.textContent = "✅ Image uploaded to gallery!";
      };
      reader.readAsDataURL(file);
    };

    // ---------- Clear Gallery ----------
    window.clearGallery = function () {
      if (confirm("Are you sure you want to clear the gallery?")) {
        localStorage.removeItem("userGalleryImages"); // Remove all saved images
        galleryDisplay.innerHTML = ""; // Clear gallery display
        status.textContent = "🧹 Gallery cleared successfully.";
      }
    };

    // ---------- Initialize Gallery on Page Load ----------
    loadGallery();
  });




  // -----------------------------------------sketch ref tab-----------------------------------------

  // ======= Reference Image Setup =======
  const referenceImages = [
  "image/ref_img1.jpeg",
  "image/ref_img2.jpeg",
  "image/ref_img3.jpeg",
  "image/ref_img4.jpeg",
  "image/ref_img5.jpeg",
  "image/ref_img6.jpeg",
  "image/ref_img7.jpeg",
  "image/ref_img8.jpeg",
  "image/ref_img9.jpeg",
  "image/ref_img10.jpeg",
];

let currentRefIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const referenceImg = document.getElementById("referenceImg");
  referenceImg.src = referenceImages[currentRefIndex];
});

function submitSketch() {
  const input = document.getElementById("userSketch");
  const file = input.files[0];
  const feedbackDiv = document.getElementById("feedbackSection");
  const previewImg = document.getElementById("previewImg");
  const previewContainer = document.getElementById("previewContainer");
  const referenceImg = document.getElementById("referenceImg");

  if (!file) {
    alert("Please select and upload your sketch first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewContainer.style.display = "block";

    // Simulated AI rating
    const size = file.size;
    let rating;
    if (size > 200000) rating = 8 + Math.random() * 2;
    else if (size > 100000) rating = 6 + Math.random() * 2;
    else rating = 4 + Math.random() * 3;
    rating = Math.round(rating * 10) / 10;

    // Feedback
    let feedback = "";
    if (rating >= 9)
      feedback =
        "🔥 Excellent! Clean lines, proper proportions, and good shading.";
    else if (rating >= 7)
      feedback =
        "✅ Good job! Improve line confidence and add more depth with shading.";
    else if (rating >= 5)
      feedback =
        "⚠️ Decent attempt. Focus on proportions and sketch accuracy.";
    else
      feedback =
        "❌ Needs improvement. Practice basic shapes and outlines first.";

    feedbackDiv.innerHTML = `
      <h3>🎯 AI Rating: ${rating}/10</h3>
      <p>${feedback}</p>
      <p><strong>Pro Tip:</strong> Zoom into the reference and compare angles, lines, and shadow placement!</p>
    `;

    // ✅ Change reference image with fade + cache-busting trick
    setTimeout(() => {
      currentRefIndex = (currentRefIndex + 1) % referenceImages.length;

      // Fade-out animation
      referenceImg.style.transition = "opacity 0.5s ease";
      referenceImg.style.opacity = "0";

      setTimeout(() => {
        // Add a random query string to prevent caching
        referenceImg.src =
          referenceImages[currentRefIndex] + "?v=" + new Date().getTime();

        referenceImg.onload = () => {
          referenceImg.style.opacity = "1";
        };
      }, 500);

      input.value = "";
    }, 2000);
  };

  reader.readAsDataURL(file);
}

  

  // -------------------floating chatbot-------------------------

  function toggleChatbot() {
    const modal = document.getElementById('chatbot-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    if (modal.style.display === 'flex') {
      modal.style.flexDirection = 'column';
    }
  }

  function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    appendMessage('user', message);
    input.value = '';
    simulateBotResponse(message);
  }

  function appendMessage(sender, text) {
    const chatBox = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function simulateBotResponse(userMsg) {
    const responses = [
      "Try sketching with light lines first.",
      "Use reference photos for better accuracy.",
      "Focus on basic shapes: circles, squares, lines.",
      "Sketch daily for faster improvement!",
      "Need help with anatomy or shading?"
    ];
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      appendMessage('bot', randomResponse);
    }, 1000);
  }



  //video tab

  function filterVideos(beginner) {
    // Hide all video cards
    const allVideos = document.querySelectorAll(".video-card");
    allVideos.forEach(video => {
      video.style.display = "none";
    });

    // Show only the selected level
    const selectedVideos = document.querySelectorAll(`.${beginner}`);
    selectedVideos.forEach(video => {
      video.style.display = "block";
    });

    // Highlight the active button
    const buttons = document.querySelectorAll(".tabs button");
    buttons.forEach(btn => btn.classList.remove("active"));

    // Add active class to the clicked button
    const activeButton = Array.from(buttons).find(btn =>
      btn.textContent.toLowerCase().includes(beginner)
    );
    if (activeButton) activeButton.classList.add("active");
  }


  // Wait until DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {

    const messagesContainer = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Fixed Q&A for SketchNest
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

    // Function to create a message row
    function createMessageRow(message, sender) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("message-row", sender);

      const avatar = document.createElement("img");
      avatar.classList.add("avatar");
      avatar.src = sender === "bot" ? "image/bott.png" : "image/user.jpg";
      avatar.alt = sender;

      const messageDiv = document.createElement("div");
      messageDiv.classList.add(sender === "bot" ? "bot-msg" : "user-msg");
      messageDiv.innerText = message;

      rowDiv.appendChild(avatar);
      rowDiv.appendChild(messageDiv);

      messagesContainer.appendChild(rowDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to get bot response
    function getBotResponse(userMsg) {
      userMsg = userMsg.toLowerCase().trim();
      return qaPairs[userMsg] || "Sorry, I don't have an answer for that. Try asking about sketching, tools, or SketchNest features.";
    }

    // Send message function
    window.sendMessage = function () {
      const userMsg = userInput.value.trim();
      if (userMsg === "") return;

      // Add user message
      createMessageRow(userMsg, "user");
      userInput.value = "";

      // Bot response after 500ms
      setTimeout(() => {
        const botReply = getBotResponse(userMsg);
        createMessageRow(botReply, "bot");
      }, 500);
    }

    // Enter key to send message
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

  });

  function goBack() {
    window.location.href = "sketchbot.html"; // Change this to your homepage URL
  }

  document.addEventListener("DOMContentLoaded", () => {
    const chatbotIcon = document.getElementById("chatbot-icon");
    const chatbotModal = document.getElementById("chatbot-modal");
    const closeBtn = document.getElementById("close-btn");
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");


    // Toggle chatbot modal
    chatbotIcon.addEventListener("click", () => {
      chatbotModal.style.display = chatbotModal.style.display === "flex" ? "none" : "flex";
      chatbotModal.style.flexDirection = "column";
    });
    closeBtn.addEventListener("click", () => chatbotModal.style.display = "none");
  });

    // Send message function
    function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;

      // Add user message
      const userMsgDiv = document.createElement("div");
      userMsgDiv.classList.add("user-message");
      userMsgDiv.textContent = message;
      chatMessages.appendChild(userMsgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      userInput.value = "";

      // Bot reply
      const key = message.toLowerCase();
      const reply = qaPairs[key] || "🤖 Sorry, I don't know the answer.";
      setTimeout(() => {
        const botMsgDiv = document.createElement("div");
        botMsgDiv.classList.add("bot-message");
        botMsgDiv.textContent = reply;
        chatMessages.appendChild(botMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 500);
    }

    // Event listeners
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
