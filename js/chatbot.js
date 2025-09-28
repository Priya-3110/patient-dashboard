// Knowledge base for the chatbot
const knowledgeBase = {
  "Hello": "👋 Namaste! I’m your Ayurvedic diet assistant. How can I help?",
  "My Dosha": "Based on your profile, you have Pitta dominance. This means you benefit from warm, light foods and regular exercise. Would you like specific dietary recommendations?",
  "Diet Plan": "For your Pitta constitution, I recommend: warm spices like ginger and turmeric, light grains like quinoa and millet, steamed vegetables, and herbal teas. Avoid cold, heavy, and oily foods. Your current diet plan is perfectly aligned with these principles!",
  "Nutrition Info": "Your daily nutrition targets are: 1440 calories, 82g protein, 180g carbs, and 48g healthy fats. You're currently achieving 89% compliance - excellent progress! Focus on completing your evening meals to reach 100%.",
  "Water Intake": "You should aim for 2-2.5L of warm water daily. I see you're at 1.2L today - try adding herbal teas like ginger or CCF (cumin, coriander, fennel) tea to increase intake while supporting digestion.",
  "Herbs": "Based on your current plan: Triphala (digestion), Ashwagandha (energy), Turmeric (inflammation). Always take as prescribed by your dietitian. Would you like tips on when to take them?",
  "Recipes": "I can suggest Ayurvedic recipes from your personalized library! Try the Quinoa Khichdi for dinner - it's perfect for Kapha balance. Would you like the complete recipe with nutritional info?",
  "My Progress": "Your progress is excellent! You've lost 1.4kg this month with 89% meal compliance. Your dosha balance has improved significantly. Keep focusing on regular meal timing and warm foods.",
  "Exercise Tips": "For Pitta dosha, aim for vigorous exercise 45-60 minutes daily. Walking after meals aids digestion. Your current activity level is good - try adding some energizing yoga poses in the morning.",
  "What can you do?": "I'm your Ayurvedic diet assistant! I can help with nutrition tracking, recipe suggestions, meal planning, dosha balance, and progress monitoring. What would you like to know about your diet plan?"
};

// This function runs once the HTML document is fully loaded
function initChatbot() {
  const chatbotHTML = `
    <div id="chatbot-container">
      <div id="chatbot-header">
        💬 AyurChat <span id="close-chat">×</span>
      </div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-options"></div>
    </div>
    <button id="chatbot-toggle">💬</button>
  `;
  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  // Get references to the new chatbot elements
  const container = document.getElementById("chatbot-container");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("close-chat");
  const messages = document.getElementById("chatbot-messages");
  const optionsDiv = document.getElementById("chatbot-options");

  // Event listeners for opening and closing the chat
  toggleBtn.onclick = () => container.style.display = "flex";
  closeBtn.onclick = () => container.style.display = "none";

  // Function to add a message to the chat window
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = sender === "user" ? "message chatbot-user" : "message chatbot-bot";
    msg.innerText = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // Add the initial welcome message from the bot
  addMessage("bot", knowledgeBase["Hello"]);

  // Dynamically create and add the option buttons
  for (let question in knowledgeBase) {
      if (question === "Hello") continue; // Don't make a button for the greeting
    const btn = document.createElement("button");
    btn.innerText = question;
    btn.onclick = () => {
      addMessage("user", question);
      // Simulate a bot thinking delay
      setTimeout(() => addMessage("bot", knowledgeBase[question]), 400);
    };
    optionsDiv.appendChild(btn);
  }
}

// Wait for the DOM to be fully loaded before initializing the chatbot
document.addEventListener("DOMContentLoaded", initChatbot);