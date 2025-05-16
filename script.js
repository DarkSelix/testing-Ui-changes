// --- Global DOM Element References ---
const chatBody = document.getElementById("chat-body");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const menuButton = document.getElementById("menu-button");
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarTabs = document.querySelectorAll(".sidebar-tab");
const historyTab = document.getElementById("history-tab");
const settingsTabContent = document.getElementById("settings-tab");
const appearanceTabContent = document.getElementById("appearance-tab");
const apiKeyInput = document.getElementById("api-key-input");
const modelSelect = document.getElementById("model-select");
const aiPersonaInput = document.getElementById("ai-persona-input");
const userPersonaInput = document.getElementById("user-persona-input");
const saveSettingsBtn = document.getElementById("save-settings");
const historyList = document.getElementById("history-list");
const newChatButton = document.getElementById("new-chat-button");
const thinkingIndicatorArea = document.getElementById("thinking-indicator-area");
const viewContextButton = document.getElementById("view-context-button");
const contextModal = document.getElementById("context-modal");
const contextModalBody = document.getElementById("context-modal-body");
const modalCloseButton = document.getElementById("modal-close-button");
const chatHeaderTitle = document.getElementById("chat-header-title");
const headerAiIcon = document.getElementById("header-ai-icon");
const attachFileBtn = document.getElementById("attach-file-btn");
const fileUploadInput = document.getElementById("file-upload-input");
const customizeButton = document.getElementById("customize-button");

const bgImageUrlInput = document.getElementById("bg-image-url-input");
const botAvatarUrlInput = document.getElementById("bot-avatar-url-input");
const userAvatarUrlInput = document.getElementById("user-avatar-url-input");
const saveAppearanceBtn = document.getElementById("save-appearance-settings");

const temperatureSlider = document.getElementById("temperature-slider");
const temperatureValueSpan = document.getElementById("temperature-value");
const topPSlider = document.getElementById("top-p-slider");
const topPValueSpan = document.getElementById("top-p-value");
const repetitionPenaltySlider = document.getElementById("repetition-penalty-slider");
const repetitionPenaltyValueSpan = document.getElementById("repetition-penalty-value");

const userBubbleBgColorInput = document.getElementById("user-bubble-bg-color");
const userBubbleTextColorInput = document.getElementById("user-bubble-text-color");
const botBubbleBgColorInput = document.getElementById("bot-bubble-bg-color");
const botBubbleTextColorInput = document.getElementById("bot-bubble-text-color");

// --- Configuration & State ---
const API_URL = "https://llm.chutes.ai/v1/chat/completions";
let chutesApiKey = "";
let currentModel = "deepseek-ai/DeepSeek-V3-0324";
const DEFAULT_SYSTEM_MESSAGE_CONTENT = `Hello! I'm Velly, your helpful AI assistant. I'm here to chat and assist you with your tasks.
I have special text formatting abilities:
- *text like this* means I'm thinking or emphasizing something softly (italic).
- # TEXT LIKE THIS means I'm very enthusiastic or shouting (uppercase, bold, specific color).
- (color)word for quick single-word highlights (e.g., (red)important).
- (-color:Text to color-) for multi-word colored phrases (e.g., (-purple:This whole phrase is purple.-)).
- (-rgb(R,G,B):Text to color-) for custom RGB colors (e.g., (-rgb(255,165,0):This is orange.-)).
Available named colors for phrases include: red, purple, black, white, primary-color, secondary-color, danger-color, success-color, text-primary, text-secondary, text-tertiary.
I'll try my best to use these to make our chats more expressive and clear! If you edit my messages, I'll adapt to the changes. Let's begin!`;
const HISTORY_HANDLING_INSTRUCTION = "\n\n**Important Note on Conversation History & Edits:** The user interface allows the user to *edit your previous responses*. The message history you are about to receive reflects the *current state* of the conversation, including any such user edits to messages that were originally yours. When you form your next response, treat the content of each message in the history (regardless of original authorship if it was an 'assistant' role that got edited) as the ground truth for continuing the dialogue. Your goal is to maintain a coherent and engaging conversation based on this *presented history*, even if an 'assistant' message in the history was modified by the user from what you might have said originally. Adapt naturally to the flow of this (potentially edited) history while staying true to your core persona described above (if one is set).";
let messages = [];
let isLoading = false;
let currentChat = { id: generateId(), title: "New Chat", messages: [] };
let chats = [];
let editingMessage = null;
let customAiPersona = "";
let currentUserPersona = "";

let customBgImageUrl = "";
let customBotAvatarUrl = "";
let customUserAvatarUrl = "";
let customTemperature = 0.75; 
let customTopP = 0.9;        
let customRepetitionPenalty = 1.1; 
let customUserBubbleBg = "#8b5cf6"; 
let customUserBubbleText = "#FFFFFF";
let customBotBubbleBg = "#1F2937";   
let customBotBubbleText = "#F9FAFB";  


const icons = {
    copy: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    delete: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    regenerate: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    ellipsis: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    historyEdit: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    historyDelete: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
};

function updateChatHeaderTitle(title) {
    if (chatHeaderTitle) chatHeaderTitle.textContent = title || "Chat";
}

function init() {
    loadSettings();
    loadChatHistory();
    if (messages.length === 0 && currentChat.messages.length === 0 && !isLoading) {
        addWelcomeMessage();
    }
    updateChatHeaderTitle(currentChat.title);
    applyAppearanceSettings();
    adjustInputHeight();
    setupEventListeners();
    renderMessages();
}

function loadSettings() {
    try {
        const settings = localStorage.getItem("vellyAI_settings_v3");
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            currentModel = parsedSettings.model || "deepseek-ai/DeepSeek-V3-0324";
            customAiPersona = parsedSettings.aiPersona || "";
            currentUserPersona = parsedSettings.userPersona || "";
            chutesApiKey = parsedSettings.apiKey || "";
            customBgImageUrl = parsedSettings.bgImageUrl || "";
            customBotAvatarUrl = parsedSettings.botAvatarUrl || "";
            customUserAvatarUrl = parsedSettings.userAvatarUrl || "";
            customTemperature = parseFloat(parsedSettings.temperature) || 0.75;
            customTopP = parseFloat(parsedSettings.topP) || 0.9;
            customRepetitionPenalty = parseFloat(parsedSettings.repetitionPenalty) || 1.1;
            customUserBubbleBg = parsedSettings.userBubbleBg || "#8b5cf6";
            customUserBubbleText = parsedSettings.userBubbleText || "#FFFFFF";
            customBotBubbleBg = parsedSettings.botBubbleBg || "#1F2937";
            customBotBubbleText = parsedSettings.botBubbleText || "#F9FAFB";

            if (modelSelect) modelSelect.value = currentModel;
            if (aiPersonaInput) aiPersonaInput.value = customAiPersona;
            if (userPersonaInput) userPersonaInput.value = currentUserPersona;
            if (apiKeyInput) apiKeyInput.value = chutesApiKey;
            if (bgImageUrlInput) bgImageUrlInput.value = customBgImageUrl;
            if (botAvatarUrlInput) botAvatarUrlInput.value = customBotAvatarUrl;
            if (userAvatarUrlInput) userAvatarUrlInput.value = customUserAvatarUrl;
            if (temperatureSlider) temperatureSlider.value = customTemperature;
            if (temperatureValueSpan) temperatureValueSpan.textContent = customTemperature.toFixed(2);
            if (topPSlider) topPSlider.value = customTopP;
            if (topPValueSpan) topPValueSpan.textContent = customTopP.toFixed(2);
            if (repetitionPenaltySlider) repetitionPenaltySlider.value = customRepetitionPenalty;
            if (repetitionPenaltyValueSpan) repetitionPenaltyValueSpan.textContent = customRepetitionPenalty.toFixed(2);
            if (userBubbleBgColorInput) userBubbleBgColorInput.value = customUserBubbleBg;
            if (userBubbleTextColorInput) userBubbleTextColorInput.value = customUserBubbleText;
            if (botBubbleBgColorInput) botBubbleBgColorInput.value = customBotBubbleBg;
            if (botBubbleTextColorInput) botBubbleTextColorInput.value = customBotBubbleText;
        }
    } catch (error) { console.error("Error loading settings:", error); }
}

function saveSettingsToStorage() {
    try {
        localStorage.setItem("vellyAI_settings_v3", JSON.stringify({
            model: currentModel, aiPersona: customAiPersona, userPersona: currentUserPersona,
            apiKey: chutesApiKey, bgImageUrl: customBgImageUrl, botAvatarUrl: customBotAvatarUrl,
            userAvatarUrl: customUserAvatarUrl, temperature: customTemperature, topP: customTopP,
            repetitionPenalty: customRepetitionPenalty, userBubbleBg: customUserBubbleBg,
            userBubbleText: customUserBubbleText, botBubbleBg: customBotBubbleBg,
            botBubbleText: customBotBubbleText
        }));
    } catch (error) { console.error("Error saving settings:", error); }
}

function applyAppearanceSettings() {
    document.documentElement.style.setProperty('--custom-bg-image', customBgImageUrl ? `url('${customBgImageUrl}')` : 'none');
    document.documentElement.style.setProperty('--custom-bot-avatar-image', customBotAvatarUrl ? `url('${customBotAvatarUrl}')` : 'none');
    document.documentElement.style.setProperty('--custom-user-avatar-image', customUserAvatarUrl ? `url('${customUserAvatarUrl}')` : 'none');
    document.documentElement.style.setProperty('--custom-user-bubble-bg', customUserBubbleBg);
    document.documentElement.style.setProperty('--custom-user-bubble-text', customUserBubbleText);
    document.documentElement.style.setProperty('--custom-bot-bubble-bg', customBotBubbleBg);
    document.documentElement.style.setProperty('--custom-bot-bubble-text', customBotBubbleText);
    if (headerAiIcon) {
        headerAiIcon.style.backgroundImage = customBotAvatarUrl ? `url('${customBotAvatarUrl}')` : '';
    }
    renderMessages();
}

function loadChatHistory() {
    try {
        const storedChats = localStorage.getItem("vellyAI_chats_v2");
        if (storedChats) {
            chats = JSON.parse(storedChats);
            if (chats.length === 0) chats = [createNewChat()];
            const lastActiveChatId = localStorage.getItem("vellyAI_lastActiveChatId_v2");
            currentChat = chats.find(chat => chat.id === lastActiveChatId) || chats[0] || createNewChat();
        } else {
            currentChat = createNewChat(); chats = [currentChat];
        }
        messages = [...(currentChat.messages || [])]; // Ensure messages is an array
    } catch (error) {
        console.error("Error loading chat history:", error);
        currentChat = createNewChat(); chats = [currentChat]; messages = [];
    }
    renderChatHistoryList();
}

function saveChatHistory() {
    try {
        currentChat.messages = [...messages];
        let chatIndex = chats.findIndex(chat => chat.id === currentChat.id);

        if (chatIndex !== -1) {
            if ((chats[chatIndex].title === "New Chat" || !chats[chatIndex].title) && messages.length > 0) {
                const firstUserMessage = messages.find(m => m.role === 'user');
                if (firstUserMessage && firstUserMessage.raw) {
                    const plainText = firstUserMessage.raw.trim();
                    const title = plainText.substring(0, 35) + (plainText.length > 35 ? "..." : "");
                    chats[chatIndex].title = title || "Chat"; currentChat.title = title || "Chat";
                } else if (messages.length > 0 && messages[0].role === 'assistant' && messages[0].isWelcome) {
                    chats[chatIndex].title = "Welcome Chat"; currentChat.title = "Welcome Chat";
                }
            } else if (messages.length === 0 && chats[chatIndex].title !== "New Chat" && chats[chatIndex].title !== "Welcome Chat") {
                chats[chatIndex].title = "New Chat"; currentChat.title = "New Chat";
            } else {
                chats[chatIndex].title = currentChat.title;
            }
            chats[chatIndex].messages = [...currentChat.messages];
        } else {
            chats.unshift({ ...currentChat }); 
        }
        updateChatHeaderTitle(currentChat.title);
        localStorage.setItem("vellyAI_chats_v2", JSON.stringify(chats));
        localStorage.setItem("vellyAI_lastActiveChatId_v2", currentChat.id);
        renderChatHistoryList();
    } catch (error) { console.error("Error saving chat history:", error); }
}

function createNewChat() {
    return { id: generateId(), title: "New Chat", messages: [] };
}

function renderChatHistoryList() {
    if (!historyList) return;
    historyList.innerHTML = '';
    chats.forEach(chat => {
        const item = document.createElement('li');
        item.className = 'history-item';
        item.dataset.id = chat.id;
        if (chat.id === currentChat.id) item.classList.add('active-chat');

        const titleSpan = document.createElement('span');
        titleSpan.className = 'history-item-title';
        titleSpan.textContent = chat.title || 'Chat';
        titleSpan.title = chat.title || 'Chat';
        titleSpan.onclick = () => { loadChat(chat.id); closeSidebarAndCleanup(); };

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'history-item-actions';
        const renameButton = document.createElement('button');
        renameButton.className = 'history-action-btn';
        renameButton.title = 'Rename Chat';
        renameButton.innerHTML = icons.historyEdit;
        renameButton.onclick = (e) => { e.stopPropagation(); renameChatInHistory(chat.id); };
        const deleteButton = document.createElement('button');
        deleteButton.className = 'history-action-btn';
        deleteButton.title = 'Delete Chat';
        deleteButton.innerHTML = icons.historyDelete;
        deleteButton.onclick = (e) => { e.stopPropagation(); deleteChatFromHistory(chat.id); };
        actionsDiv.append(renameButton, deleteButton);
        item.append(titleSpan, actionsDiv);
        historyList.appendChild(item);
    });
}

function renameChatInHistory(chatId) {
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return;
    const newTitle = prompt("Enter new chat title:", chats[chatIndex].title === "New Chat" ? "" : chats[chatIndex].title);
    if (newTitle !== null && newTitle.trim() !== "") {
        chats[chatIndex].title = newTitle.trim();
        if (currentChat.id === chatId) { currentChat.title = newTitle.trim(); updateChatHeaderTitle(currentChat.title); }
        saveChatHistory();
    }
}

function deleteChatFromHistory(chatId) {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return;
    chats.splice(chatIndex, 1);
    if (currentChat.id === chatId) {
        if (chats.length > 0) loadChat(chats[0].id);
        else startNewChat();
    } else { // If deleted chat was not active, just save and re-render list
        saveChatHistory();
    }
}

function startNewChat() {
    currentChat = createNewChat();
    chats.unshift({ ...currentChat });
    messages = [];
    addWelcomeMessage(); 
    saveChatHistory(); 
    renderMessages();
    updateChatHeaderTitle(currentChat.title);
    if (messageInput) messageInput.focus();
}

function loadChat(id) {
    const chatToLoad = chats.find(chat => chat.id === id);
    if (chatToLoad) {
        currentChat = { ...chatToLoad };
        messages = [...(chatToLoad.messages || [])];
        localStorage.setItem("vellyAI_lastActiveChatId_v2", currentChat.id);
        renderMessages();
        renderChatHistoryList();
        updateChatHeaderTitle(currentChat.title);
        if (messages.length === 0 && !isLoading) addWelcomeMessage();
    }
}

function addWelcomeMessage() {
    if (messages.length === 0) {
        const welcomeMsg = {
            id: generateId(), role: "assistant",
            content: processText("Hello! (purple)I'm Velly.(white) How can I help you today?").text,
            raw: "Hello! (purple)I'm Velly.(white) How can I help you today?",
            timestamp: new Date().toISOString(), isWelcome: true
        };
        messages.push(welcomeMsg);
    }
}

function generateId() { return 'msg-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9); }

function processText(rawText = "") {
    let text = String(rawText);
    let bubbleColor = null;

    if (text.match(/^-(B|P|R)\s/)) {
        const prefix = text.substring(0, 2);
        if (prefix === "-B") bubbleColor = "black";
        else if (prefix === "-P") bubbleColor = "purple";
        else if (prefix === "-R") bubbleColor = "red";
        text = text.substring(3);
    }

    function processInnerMd(str) {
        let tempText = str.replace(/\*(.*?)\*/g, '<em class="thinking">$1</em>')
                          .replace(/^#\s?(.*)/gm, '<strong class="scream">$1</strong>');
        tempText = marked.parse(tempText.replace(/<p>\s*<\/p>/gi, ''));
        return tempText;
    }
    
    text = text.replace(/\(-\s*rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\):\s*([\s\S]*?)\s*-\)/g, (match, r, g, b, innerText) => {
        return `<span style="color: rgb(${r},${g},${b});">${processInnerMd(innerText.trim())}</span>`;
    });
    text = text.replace(/\(-\s*([\w#-]+):\s*([\s\S]*?)\s*-\)/g, (match, colorName, innerText) => {
        const safeColorName = colorName.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (['primary-color', 'secondary-color', 'danger-color', 'success-color', 'text-primary', 'text-secondary', 'text-tertiary'].includes(safeColorName)) {
            return `<span class="text-${safeColorName}">${processInnerMd(innerText.trim())}</span>`;
        }
        return `<span style="color: ${safeColorName};">${processInnerMd(innerText.trim())}</span>`;
    });

    text = text.replace(/\*(.*?)\*/g, '<em class="thinking">$1</em>');
    text = text.replace(/^#\s?(.*)/gm, '<strong class="scream">$1</strong>');
    text = text.replace(/\((red|purple|black|white)\)([\w'*#.,?!()]+)/g, (match, color, word) => {
        return `<span class="text-${color}">${word}</span>`;
    });

    marked.setOptions({
        highlight: (code, lang) => hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value : hljs.highlightAuto(code).value,
        gfm: true, breaks: true, sanitize: false
    });
    text = marked.parse(text);
    text = text.replace(/<p>\s*<\/p>/gi, '');
    return { text: text.trim(), bubbleColor: bubbleColor };
}

function updateMessageInDOM(messageId, newContent, newRawContent) {
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    messages[msgIndex].content = newContent;
    messages[msgIndex].raw = newRawContent;

    const messageElement = chatBody.querySelector(`.message[data-message-id="${messageId}"]`);
    if (messageElement) {
        const bubbleDiv = messageElement.querySelector('.message-bubble');
        if (bubbleDiv) {
            bubbleDiv.innerHTML = newContent;
            if (newContent.includes('<pre') && newContent.includes('<code')) {
                setTimeout(() => initCodeBlocksInChat(bubbleDiv), 0);
            }
        }
        scrollToBottom();
    }
}

function renderMessages() {
    if (!chatBody) return;
    const existingElementsMap = new Map();
    chatBody.querySelectorAll('.message[data-message-id]').forEach(el => {
        existingElementsMap.set(el.dataset.messageId, el);
    });
    const fragment = document.createDocumentFragment();

    messages.forEach((msg, index) => {
        if (!msg || !msg.id) { console.warn("Render: Invalid msg object", msg); return; }
        let messageElement = existingElementsMap.get(msg.id);
        if (messageElement) {
            const bubbleDiv = messageElement.querySelector('.message-bubble');
            if (bubbleDiv && bubbleDiv.innerHTML !== msg.content) {
                bubbleDiv.innerHTML = msg.content;
                if (msg.content.includes('<pre') && msg.content.includes('<code')) {
                    setTimeout(() => initCodeBlocksInChat(bubbleDiv), 0);
                }
            }
            messageElement.dataset.index = index;
            existingElementsMap.delete(msg.id);
        } else {
            messageElement = createMessageElement(msg, index);
            fragment.appendChild(messageElement);
        }
    });
    existingElementsMap.forEach(el => el.remove());
    if (fragment.childNodes.length > 0) {
        chatBody.appendChild(fragment);
    } else if (messages.length === 0 && chatBody.childNodes.length > 0) {
        chatBody.innerHTML = '';
    }
    scrollToBottom();
    if (typeof hljs !== 'undefined') initCodeBlocksInChat(chatBody);
}

function createMessageElement(msg, index) {
    const isUser = msg.role === 'user';
    const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.dataset.index = index; messageDiv.dataset.messageId = msg.id;
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`;
    if (isUser && customUserAvatarUrl) avatarDiv.style.backgroundImage = `url('${customUserAvatarUrl}')`;
    else if (!isUser && customBotAvatarUrl) avatarDiv.style.backgroundImage = `url('${customBotAvatarUrl}')`;
    avatarDiv.innerHTML = isUser ? icons.historyEdit.replace('14','24').replace('14','24') /* Temp user icon */ : icons.ellipsis.replace('18','24'); /* Temp bot icon */
    // Quick fix for avatar SVG visibility based on custom image presence.
    const svgEl = avatarDiv.querySelector('svg');
    if (svgEl) {
        if ((isUser && customUserAvatarUrl) || (!isUser && customBotAvatarUrl)) {
            svgEl.style.display = 'none';
        } else {
            // Replace temp icons with actual ones if no custom image
            avatarDiv.innerHTML = isUser ?
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` :
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
        }
    }


    messageDiv.appendChild(avatarDiv);
    const contentDiv = document.createElement('div'); contentDiv.className = 'message-content';
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;
    if (msg.bubbleColor && isUser) bubbleDiv.classList.add(`text-${msg.bubbleColor}`);
    bubbleDiv.innerHTML = msg.content;
    const msgInfoDiv = document.createElement('div'); msgInfoDiv.className = 'message-info';
    const timeDiv = document.createElement('div'); timeDiv.className = 'message-time'; timeDiv.textContent = timestamp;
    msgInfoDiv.appendChild(timeDiv); contentDiv.append(bubbleDiv, msgInfoDiv);
    if (!msg.isStreamingPlaceholder) {
        const actionsTrigger = document.createElement('button'); actionsTrigger.className = 'message-actions-trigger';
        actionsTrigger.innerHTML = icons.ellipsis; actionsTrigger.setAttribute('aria-label', 'Message actions');
        actionsTrigger.onclick = (e) => { e.stopPropagation(); toggleActionsMenu(msg.id); };
        const actionsMenu = document.createElement('div'); actionsMenu.className = 'message-actions-menu'; actionsMenu.id = `actions-menu-${msg.id}`;
        actionsMenu.append(
            createActionButton(icons.edit + ' Edit', () => editMessage(msg.id)),
            createActionButton(icons.copy + ' Copy Text', () => copyToClipboard(getRawTextFromHtml(msg.content), actionsMenu.children[1]))
        );
        if (!isUser) actionsMenu.appendChild(createActionButton(icons.regenerate + ' Regenerate', () => regenerateResponse(msg.id)));
        actionsMenu.appendChild(createActionButton(icons.delete + ' Delete', () => deleteMessage(msg.id), 'delete'));
        contentDiv.append(actionsTrigger, actionsMenu);
    }
    messageDiv.appendChild(contentDiv);
    return messageDiv;
}

function createActionButton(innerHTML, onClick, additionalClass = '') {
    const button = document.createElement('button');
    button.className = 'action-button'; if (additionalClass) button.classList.add(additionalClass);
    button.innerHTML = innerHTML; button.onclick = (e) => { e.stopPropagation(); onClick(); closeAllActionMenus(); };
    return button;
}

function toggleActionsMenu(messageId) {
    const menu = document.getElementById(`actions-menu-${messageId}`); if (!menu) return;
    const isActive = menu.classList.contains('active'); closeAllActionMenus();
    if (!isActive) menu.classList.add('active');
}
function closeAllActionMenus() { document.querySelectorAll('.message-actions-menu.active').forEach(m => m.classList.remove('active')); }
document.addEventListener('click', (e) => {
    if (!e.target.closest('.message-actions-trigger') && !e.target.closest('.message-actions-menu')) closeAllActionMenus();
});

function getRawTextFromHtml(htmlContent = "") {
    const tempDiv = document.createElement('div'); tempDiv.innerHTML = String(htmlContent);
    function r(el) { let raw = ""; el.childNodes.forEach(n => { if (n.nodeType === 3) raw += n.textContent; else if (n.nodeType === 1) { if (n.classList?.contains('thinking')) raw += `*${r(n)}*`; else if (n.classList?.contains('scream')) raw += `# ${r(n)}`; else if (n.tagName === 'SPAN' && n.style.color) { const rgbM = n.style.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/); if (rgbM) raw += `(-rgb(${rgbM[1]},${rgbM[2]},${rgbM[3]}):${r(n)}-)`; else raw += `(-${n.style.color}:${r(n)}-)`; } else if (n.tagName === 'SPAN' && n.className.startsWith('text-')) { const ccm = n.className.match(/text-([\w-]+)/); if (ccm) { const cn = ccm[1], cnt = r(n); if (cnt.includes(' ') || cnt.length > 15 || !cnt.match(/^[\w'*#.,?!]+$/) && cnt.length > 0) raw += `(-${cn}:${cnt}-)`; else raw += `(${cn})${cnt}`; } else raw += r(n); } else if (n.classList?.contains('code-block')) { const p = n.querySelector('pre > code'), l = n.querySelector('.code-language')?.textContent.toLowerCase() || p?.className.match(/language-(\w+)/)?.[1] || ''; raw += "```" + l + "\n" + (p?.textContent || '') + "\n```"; } else if (n.tagName === 'CODE' && !n.closest('pre')) raw += `\`${n.textContent}\``; else if (n.tagName === 'UL' || n.tagName === 'OL') Array.from(n.children).forEach((li, i) => { raw += (n.tagName === 'UL' ? '- ' : `${i+1}. `) + r(li).trim() + '\n'; }); else if (n.tagName === 'BLOCKQUOTE') raw += '> ' + r(n).trim().replace(/\n/g, '\n> ') + '\n'; else if (n.tagName === 'P') raw += r(n) + '\n\n'; else if (n.tagName === 'BR') raw += '\n'; else raw += r(n); } }); return raw; }
    return r(tempDiv).replace(/\n{3,}/g, '\n\n').trim();
}

function editMessage(messageId) {
    const msgIndex = messages.findIndex(m => m.id === messageId); if (msgIndex === -1) return;
    if (editingMessage?.id === messageId) return; if (editingMessage) cancelEdit();
    const msgData = messages[msgIndex], msgEl = document.querySelector(`.message[data-message-id="${messageId}"]`);
    if (!msgData || !msgEl) return;
    const bubbleEl = msgEl.querySelector('.message-bubble');
    editingMessage = { id: messageId, originalBubbleHTML: bubbleEl.innerHTML }; bubbleEl.style.display = 'none';
    const editTextArea = document.createElement('textarea'); editTextArea.className = 'edit-area'; editTextArea.value = getRawTextFromHtml(msgData.content);
    const editControls = document.createElement('div'); editControls.className = 'edit-controls';
    const saveBtn = createActionButton('Save', () => saveEditedMessage(messageId, editTextArea.value), 'edit-button');
    const cancelBtn = createActionButton('Cancel', cancelEdit, 'cancel-button');
    editControls.append(cancelBtn, saveBtn); bubbleEl.insertAdjacentElement('afterend', editControls); bubbleEl.insertAdjacentElement('afterend', editTextArea);
    editTextArea.focus(); editTextArea.style.height = 'auto'; editTextArea.style.height = Math.max(60, editTextArea.scrollHeight) + 'px';
    editTextArea.oninput = () => { editTextArea.style.height = 'auto'; editTextArea.style.height = Math.max(60, editTextArea.scrollHeight) + 'px'; };
}
function saveEditedMessage(messageId, newRawContent) {
    const msgIndex = messages.findIndex(m => m.id === messageId); if (msgIndex === -1) return;
    const oMsg = messages[msgIndex], { text: pCont, bubbleColor: bC } = processText(newRawContent);
    messages[msgIndex] = { ...oMsg, content: pCont, raw: newRawContent, bubbleColor: (oMsg.role === 'user' ? (bC || oMsg.bubbleColor) : oMsg.bubbleColor), ts: new Date().toISOString(), edited: true };
    cancelEditCleanup(); editingMessage = null; saveChatHistory(); renderMessages();
}
function cancelEdit() { if (!editingMessage) return; const mE = document.querySelector(`.message[data-message-id="${editingMessage.id}"]`); if (mE) { const bE = mE.querySelector('.message-bubble'); if (bE) { bE.innerHTML = editingMessage.originalBubbleHTML; bE.style.display = ''; } cancelEditCleanup(); } editingMessage = null; }
function cancelEditCleanup() { if (!editingMessage) return; const mE = document.querySelector(`.message[data-message-id="${editingMessage.id}"]`); if (mE) { mE.querySelector('.edit-area')?.remove(); mE.querySelector('.edit-controls')?.remove(); const bE = mE.querySelector('.message-bubble'); if (bE) bE.style.display = ''; } }

function deleteMessage(messageId) {
    const msgIndex = messages.findIndex(m => m.id === messageId); if (msgIndex === -1) return;
    const msgEl = document.querySelector(`.message[data-message-id="${messageId}"]`);
    if (msgEl) { msgEl.classList.add('delete-animation'); setTimeout(() => { messages.splice(msgIndex, 1); saveChatHistory(); renderMessages(); }, 300); }
    else { messages.splice(msgIndex, 1); saveChatHistory(); renderMessages(); }
}
function regenerateResponse(botMessageId) {
    if (isLoading) return;
    const botMsgIdx = messages.findIndex(m => m.id === botMessageId);
    if (botMsgIdx === -1 || messages[botMsgIdx].role !== 'assistant' || (botMsgIdx === 0 && messages[botMsgIdx].isWelcome)) return;
    const userMsgIdx = botMsgIdx - 1; if (userMsgIdx < 0 || messages[userMsgIdx].role !== 'user') return;
    messages.splice(botMsgIdx, 1); saveChatHistory(); renderMessages();
    const userMsg = messages[userMsgIdx]; sendMessage(userMsg.raw || getRawTextFromHtml(userMsg.content), userMsg.bubbleColor, false);
}

function initCodeBlocksInChat(parentElement = document) {
    if (typeof hljs === 'undefined') return;
    parentElement.querySelectorAll('.message-bubble pre > code:not([data-highlighted="true"])').forEach(cE => {
        const pE = cE.parentElement; if (pE.parentElement.classList.contains('code-block')) { try { hljs.highlightElement(cE); cE.dataset.highlighted = "true"; } catch (e) {} return; }
        const lC = Array.from(cE.classList).find(c => c.startsWith('language-')), lang = lC ? lC.substring(9) : (pE.className.match(/language-(\w+)/)?.[1] || 'plaintext'), code = cE.textContent || '';
        const cBD = document.createElement('div'); cBD.className = 'code-block'; const h = document.createElement('div'); h.className = 'code-header'; const lS = document.createElement('span'); lS.className = 'code-language'; lS.textContent = lang; const aD = document.createElement('div'); aD.className = 'code-actions';
        const cB = createActionButton(icons.copy + ' Copy', () => copyCode(code, cB), 'code-action-button'); const dB = createActionButton(icons.download + ' Download', () => downloadCode(code, lang, dB), 'code-action-button');
        aD.append(cB, dB); h.append(lS, aD); cBD.append(h); pE.parentNode.insertBefore(cBD, pE); cBD.appendChild(pE); try { hljs.highlightElement(cE); cE.dataset.highlighted = "true"; } catch (e) {}
    });
}
function copyCode(code, btn) { navigator.clipboard.writeText(code).then(() => { const oH = btn.innerHTML; btn.innerHTML = icons.check + ' Copied!'; btn.classList.add('code-action-success'); setTimeout(() => { btn.innerHTML = oH; btn.classList.remove('code-action-success'); }, 1500); }).catch(() => { btn.textContent = 'Error'; setTimeout(() => { btn.innerHTML = icons.copy + ' Copy'; }, 1500); }); }
function downloadCode(code, lang, btn) { const fn = `code.${lang || 'txt'}`, blob = new Blob([code], { type: 'text/plain;charset=utf-8' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(a.href); if (btn) { const oH = btn.innerHTML; btn.innerHTML = icons.check + ' Downloaded!'; btn.classList.add('code-action-success'); setTimeout(() => { btn.innerHTML = oH; btn.classList.remove('code-action-success'); }, 2000); } }

async function handleFileUpload(event) {
    const file = event.target.files[0]; if (!file) return; if (file.size > 2097152) { alert("File too large (max 2MB)."); return; }
    const allowed = ['.txt','.md','.js','.py','.html','.css','.json','.log','.csv','.xml','.yaml','.ini','.sh','.bat','.c','.cpp','.cs','.java','.rb','.php','.swift','.kt','.ts','.sql']; const ext = `.${file.name.split('.').pop().toLowerCase()}`;
    if (!allowed.includes(ext) && !file.type.startsWith('text/')) { alert("Unsupported file type."); return; }
    const reader = new FileReader(); reader.onload = (e) => { const lang = file.name.split('.').pop() || 'text', raw = `Uploaded: **${file.name}**\n\`\`\`${lang}\n${e.target.result}\n\`\`\``, { text: p, bubbleColor:bC } = processText(raw); messages.push({ id: generateId(), role: "user", content: p, raw, ts: new Date().toISOString(), bC }); saveChatHistory(); renderMessages(); scrollToBottom(); adjustInputHeight(); }; reader.onerror = () => alert("Error reading file."); reader.readAsText(file); if(fileUploadInput) fileUploadInput.value = '';
}
function adjustInputHeight() { if (!messageInput) return; messageInput.style.height = 'auto'; const sH = messageInput.scrollHeight, mH = parseInt(window.getComputedStyle(messageInput).maxHeight,10)||200, minH = parseInt(window.getComputedStyle(messageInput).minHeight,10)||60; if (sH > mH) { messageInput.style.height = mH + 'px'; messageInput.style.overflowY = 'auto'; } else { messageInput.style.height = Math.max(minH, sH) + 'px'; messageInput.style.overflowY = 'hidden'; } if (sendButton) sendButton.disabled = messageInput.value.trim() === '' || isLoading; }

function showThinkingIndicator() { hideThinkingIndicator(); const avS = customBotAvatarUrl ? `style="background-image: url('${customBotAvatarUrl}')"` : '', iH = `<div class="message bot-message thinking-indicator" id="bot-thinking-indicator"><div class="avatar bot-avatar" ${avS}>${customBotAvatarUrl ? '' : icons.ellipsis.replace('18','24')}</div><div class="message-content"><div class="message-bubble bot-bubble thinking-text">Velly is thinking<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div></div>`; if (thinkingIndicatorArea) thinkingIndicatorArea.innerHTML = iH; scrollToBottom(); }
function hideThinkingIndicator() { if (thinkingIndicatorArea) thinkingIndicatorArea.innerHTML = ''; }
function scrollToBottom() { setTimeout(() => { if (chatBody) chatBody.scrollTop = chatBody.scrollHeight; }, 50); }

function copyToClipboard(text, btn) { navigator.clipboard.writeText(text).then(() => { if (btn) { const oH = btn.innerHTML; btn.innerHTML = icons.check + ' Copied!'; btn.classList.add('action-button-success'); setTimeout(() => { btn.innerHTML = oH; btn.classList.remove('action-button-success'); }, 1500); } }).catch(() => { if (btn) { const oH=btn.innerHTML; btn.innerHTML = 'Error'; setTimeout(() => {btn.innerHTML=oH;},1500);}}); }

function showContextModal() { const sM = (customAiPersona || DEFAULT_SYSTEM_MESSAGE_CONTENT + HISTORY_HANDLING_INSTRUCTION), aM = [{role:"system",content:sM}]; messages.slice(-15).forEach(m => { let c = m.raw||getRawTextFromHtml(m.content); if(m.role==='user'&&currentUserPersona&&c)c=`[User Persona: ${currentUserPersona}]\n\n${c}`; aM.push({role:m.role,content:c.trim()});}); if(contextModalBody)contextModalBody.innerHTML=''; aM.forEach(m=>{const eD=document.createElement('div');eD.className='context-entry'; const rD=document.createElement('div');rD.className='context-role';rD.textContent=m.role; const tD=document.createElement('div');tD.className='context-text';tD.textContent=m.content; eD.append(rD,tD); if(contextModalBody)contextModalBody.appendChild(eD);}); if(contextModal)contextModal.classList.add('active');}

function openSidebar() { if(sidebar&&!sidebar.classList.contains('open')){sidebar.classList.add('open');if(window.innerWidth<=768)document.body.style.overflow='hidden';setTimeout(()=>document.addEventListener('click',handleClickOutsideSidebar,true),0);}}
function closeSidebarAndCleanup(){if(sidebar&&sidebar.classList.contains('open')){sidebar.classList.remove('open');if(window.innerWidth<=768)document.body.style.overflow='';document.removeEventListener('click',handleClickOutsideSidebar,true);}}
function handleClickOutsideSidebar(e){if(sidebar?.classList.contains('open')&&!sidebar.contains(e.target)&&(!menuButton||!menuButton.contains(e.target))&&(!customizeButton||!customizeButton.contains(e.target)))closeSidebarAndCleanup();}

async function sendMessage(userRawInput, userBubbleColor, addUserMessageToList = true) {
    const trimmedInput = userRawInput ? String(userRawInput).trim() : "";
    if (!trimmedInput && addUserMessageToList) return; if (isLoading) return;
    if (!chutesApiKey) { alert("API Key needed in Settings."); openSidebar(); switchSidebarTab('settings'); apiKeyInput?.focus(); return; }
    isLoading = true; if (sendButton) sendButton.disabled = true; if (messageInput) messageInput.disabled = true;
    let userMsgId;
    if (addUserMessageToList) {
        const { text: pH, bubbleColor: dBC } = processText(trimmedInput); userMsgId = generateId();
        const uM = { id: userMsgId, role: "user", content: pH, raw: trimmedInput, timestamp: new Date().toISOString(), bubbleColor: userBubbleColor || dBC };
        messages.push(uM); const uME = createMessageElement(uM, messages.length - 1); if (chatBody) chatBody.appendChild(uME); scrollToBottom();
        if (typeof hljs !== 'undefined' && uM.content.includes('<pre')) initCodeBlocksInChat(uME.querySelector('.message-bubble'));
    }
    showThinkingIndicator(); saveChatHistory();
    const sysP = customAiPersona || DEFAULT_SYSTEM_MESSAGE_CONTENT + HISTORY_HANDLING_INSTRUCTION;
    const apiHist = [{ role: "system", content: sysP }];
    let histCtx = [...messages]; if (addUserMessageToList && userMsgId) histCtx = histCtx.filter(m => m.id !== userMsgId);
    histCtx.slice(-105).forEach(m => { let c = m.raw || getRawTextFromHtml(m.content); if (m.role === 'user' && currentUserPersona && c) c = `[User Persona: ${currentUserPersona}]\n\n${c}`; apiHist.push({ role: m.role, content: c.trim() }); });
    let finalUCForApi = trimmedInput; if (currentUserPersona && trimmedInput) finalUCForApi = `[User Persona: ${currentUserPersona}]\n\n${trimmedInput}`;
    if (trimmedInput) apiHist.push({ role: "user", content: finalUCForApi });
    
    const apiReqBody = { model: currentModel, messages: apiHist, stream: true, max_tokens: 2000 };
    if (customTemperature !== 0.75) apiReqBody.temperature = customTemperature;
    if (customTopP !== 0.9) apiReqBody.top_p = customTopP;
    if (customRepetitionPenalty !== 1.1) apiReqBody.repetition_penalty = customRepetitionPenalty;

    const botMsgId = generateId(); let accRawResp = ""; let placeholderCreated = false; let streamDone = false;
    try {
        const resp = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${chutesApiKey}` }, body: JSON.stringify(apiReqBody) });
        if (!resp.ok) { const eD = await resp.json().catch(() => ({})); throw new Error(eD.detail || eD.error?.message || `API Error (${resp.status})`); }
        hideThinkingIndicator(); const reader = resp.body.getReader(); const decoder = new TextDecoder();
        chunkLoop: while (true) {
            const { done, value } = await reader.read(); if (done) break chunkLoop;
            const chunk = decoder.decode(value, { stream: true }); const lines = chunk.split('\n').filter(lT => lT.trim() !== '');
            for (const cL of lines) {
                if (cL.startsWith("data: ")) {
                    const jD = cL.substring(6); if (jD === "[DONE]") { streamDone = true; const fMI = messages.findIndex(m => m.id === botMsgId); if (fMI !== -1) { messages[fMI].isStreamingPlaceholder = false; const { text: fH } = processText(accRawResp); updateMessageInDOM(botMsgId, fH, accRawResp); const bME = chatBody.querySelector(`.message[data-message-id="${botMsgId}"] .message-bubble`); if (bME && typeof hljs!=='undefined' && accRawResp.includes('<pre')) initCodeBlocksInChat(bME); } saveChatHistory(); break chunkLoop; }
                    try { const p = JSON.parse(jD); if (p.choices?.[0]?.delta?.content) { const cD = p.choices[0].delta.content; accRawResp += cD; if (!placeholderCreated) { messages.push({ id: botMsgId, role: "assistant", content: "▋", raw: "", ts: new Date().toISOString(), isStreamingPlaceholder: true }); renderMessages(); placeholderCreated = true; } const { text: pHtml } = processText(accRawResp + "▋"); updateMessageInDOM(botMsgId, pHtml, accRawResp); } } catch (e) { console.warn("Stream parse error:", e, "Data:", jD); }
                }
            }
        }
    } catch (e) { console.error("sendMessage fetch/stream error:", e); hideThinkingIndicator(); const { text: pE } = processText(`(red)Error: ${e.message}`); const exBMI = messages.findIndex(m => m.id === botMsgId); if (exBMI !== -1) { messages[exBMI].content = pE; messages[exBMI].raw = `(red)Error: ${e.message}`; messages[exBMI].isStreamingPlaceholder = false; updateMessageInDOM(botMsgId, pE, `(red)Error: ${e.message}`); } else { messages.push({ id: botMsgId, role: "assistant", content: pE, raw: `(red)Error: ${e.message}`, ts: new Date().toISOString() }); renderMessages(); }
    } finally {
        isLoading = false; if (messageInput) { if (addUserMessageToList) messageInput.value = ''; adjustInputHeight(); messageInput.disabled = false; if (sendButton) sendButton.disabled = messageInput.value.trim() === ''; messageInput.focus(); }
        const fBM = messages.find(m => m.id === botMsgId); if (fBM) { if (fBM.isStreamingPlaceholder || !streamDone) { fBM.isStreamingPlaceholder = false; const { text: fH } = processText(accRawResp || fBM.raw); updateMessageInDOM(botMsgId, fH, accRawResp || fBM.raw); const bME = chatBody.querySelector(`.message[data-message-id="${botMsgId}"] .message-bubble`); if (bME && typeof hljs!=='undefined' && (accRawResp||fBM.raw).includes('<pre')) initCodeBlocksInChat(bME); } } saveChatHistory();
    }
}

function setupEventListeners() {
    if (messageInput) { messageInput.oninput = adjustInputHeight; messageInput.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey && !sendButton?.disabled) { e.preventDefault(); sendMessage(messageInput.value, processText(messageInput.value).bubbleColor, true); } }; }
    if (sendButton) sendButton.onclick = () => { if (!sendButton.disabled && messageInput) sendMessage(messageInput.value, processText(messageInput.value).bubbleColor, true); };
    if (menuButton) menuButton.onclick = (e) => { e.stopPropagation(); openSidebar(); switchSidebarTab('history'); };
    if (customizeButton) customizeButton.onclick = (e) => { e.stopPropagation(); openSidebar(); switchSidebarTab('appearance'); };
    if (sidebarClose) sidebarClose.onclick = closeSidebarAndCleanup;
    if (newChatButton) newChatButton.onclick = () => { startNewChat(); closeSidebarAndCleanup(); };
    sidebarTabs.forEach(tab => tab.onclick = () => switchSidebarTab(tab.dataset.tab));
    if (saveSettingsBtn) saveSettingsBtn.onclick = () => { if(modelSelect)currentModel=modelSelect.value; if(aiPersonaInput)customAiPersona=aiPersonaInput.value.trim(); if(userPersonaInput)currentUserPersona=userPersonaInput.value.trim(); if(apiKeyInput)chutesApiKey=apiKeyInput.value.trim(); saveSettingsToStorage(); alert('Core settings saved!'); closeSidebarAndCleanup(); };
    if (saveAppearanceBtn) saveAppearanceBtn.onclick = () => { if(bgImageUrlInput)customBgImageUrl=bgImageUrlInput.value.trim(); if(botAvatarUrlInput)customBotAvatarUrl=botAvatarUrlInput.value.trim(); if(userAvatarUrlInput)customUserAvatarUrl=userAvatarUrlInput.value.trim(); if(temperatureSlider)customTemperature=parseFloat(temperatureSlider.value); if(topPSlider)customTopP=parseFloat(topPSlider.value); if(repetitionPenaltySlider)customRepetitionPenalty=parseFloat(repetitionPenaltySlider.value); if(userBubbleBgColorInput)customUserBubbleBg=userBubbleBgColorInput.value; if(userBubbleTextColorInput)customUserBubbleText=userBubbleTextColorInput.value; if(botBubbleBgColorInput)customBotBubbleBg=botBubbleBgColorInput.value; if(botBubbleTextColorInput)customBotBubbleText=botBubbleTextColorInput.value; saveSettingsToStorage(); applyAppearanceSettings(); alert('Appearance & AI parameters saved!'); closeSidebarAndCleanup(); };
    if (temperatureSlider && temperatureValueSpan) temperatureSlider.oninput = () => { temperatureValueSpan.textContent = parseFloat(temperatureSlider.value).toFixed(2); };
    if (topPSlider && topPValueSpan) topPSlider.oninput = () => { topPValueSpan.textContent = parseFloat(topPSlider.value).toFixed(2); };
    if (repetitionPenaltySlider && repetitionPenaltyValueSpan) repetitionPenaltySlider.oninput = () => { repetitionPenaltyValueSpan.textContent = parseFloat(repetitionPenaltySlider.value).toFixed(2); };
    if (viewContextButton) viewContextButton.onclick = showContextModal;
    if (modalCloseButton) modalCloseButton.onclick = () => contextModal?.classList.remove('active');
    if (contextModal) contextModal.onclick = (e) => { if (e.target === contextModal) contextModal.classList.remove('active'); };
    if (attachFileBtn) attachFileBtn.onclick = () => fileUploadInput?.click();
    if (fileUploadInput) fileUploadInput.onchange = handleFileUpload;
}

function switchSidebarTab(tabName) {
    sidebarTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.sidebar-tab[data-tab="${tabName}"]`)?.classList.add('active');
    if(historyTab) historyTab.style.display = tabName === 'history' ? 'block' : 'none';
    if(settingsTabContent) settingsTabContent.style.display = tabName === 'settings' ? 'block' : 'none';
    if(appearanceTabContent) appearanceTabContent.style.display = tabName === 'appearance' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', init);