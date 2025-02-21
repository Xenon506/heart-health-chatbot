const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your Gemini API key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function getBotResponse(input) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

    // Custom prompt to include spacing after points
    const predefinedPrompt = `
    You are an AI medical assistant specializing in heart health.  
    - Provide **medications and medical tests** based on symptoms.  
    - **Do NOT** suggest a doctor visit unless the condition is severe.  
    - Use **extra spacing** after key points to improve readability.  

    User's Question: ${input}
    `;

    const requestData = {
        contents: [{ parts: [{ text: predefinedPrompt }] }]
    };

    try {
        let response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        let data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            return formatResponse(data.candidates[0].content.parts[0].text);
        } else {
            return "I'm sorry, I couldn't fetch a response.";
        }
    } catch (error) {
        console.error("API Error:", error);
        return "Error connecting to AI service. Please check your API key or network connection.";
    }
}

// Function to format response with extra spacing after points
function formatResponse(text) {
    return text.replace(/(\.|\?|\!)/g, "$1   "); // Adds spaces after every sentence-ending punctuation
}

// Function to send a message
async function sendMessage() {
    const userText = userInput.value.trim();
    if (userText === "") return;

    // Display user message
    chatBox.innerHTML += `<div class="user-message">${userText}</div>`;
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom

    // Get bot response
    const botResponse = await getBotResponse(userText);

    // Display bot response
    setTimeout(() => {
        chatBox.innerHTML += `<div class="bot-message">${botResponse}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}
