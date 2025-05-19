// --- Global DOM Element References ---
const chatBody = document.getElementById("chat-body");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const menuButton = document.getElementById("menu-button");
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarTabsElements = document.querySelectorAll(".sidebar-tab");
const historyTabContent = document.getElementById("history-tab");

const historyList = document.getElementById("history-list");
const newChatButton = document.getElementById("new-chat-button");
const typingIndicatorArea = document.getElementById("typing-indicator-area");
const viewContextButton = document.getElementById("view-context-button");
const contextModal = document.getElementById("context-modal");
const contextModalBody = document.getElementById("context-modal-body");
const contextModalCloseButton = document.getElementById("modal-close-button");
const chatHeaderTitle = document.getElementById("chat-header-title");
const chatHeaderIconContainer = document.getElementById("chat-header-icon-container");

// New Modal & Settings Elements
const appSettingsButton = document.getElementById("app-settings-button");
const profilesButton = document.getElementById("profiles-button");

const appSettingsModal = document.getElementById("app-settings-modal");
const appSettingsModalCloseButton = document.getElementById("app-settings-modal-close-button");
const appSettingsApiKeyInput = document.getElementById("app-settings-api-key-input");
const appSettingsModelSelect = document.getElementById("app-settings-model-select");
const saveAppSettingsButton = document.getElementById("save-app-settings-button");

const profilesModal = document.getElementById("profiles-modal");
const profilesModalCloseButton = document.getElementById("profiles-modal-close-button");
const modalTabs = profilesModal.querySelectorAll(".modal-tab");
const aiCharactersTabContent = document.getElementById("ai-characters-tab-content");
const userPersonasTabContent = document.getElementById("user-personas-tab-content");

// AI Character Elements
const aiCharacterSelect = document.getElementById("ai-character-select");
const createNewAiCharacterButton = document.getElementById("create-new-ai-character-button");
const editSelectedAiCharacterButton = document.getElementById("edit-selected-ai-character-button");
const deleteSelectedAiCharacterButton = document.getElementById("delete-selected-ai-character-button");
const aiCharacterFormContainer = document.getElementById("ai-character-form-container");
const aiCharacterFormTitle = document.getElementById("ai-character-form-title");
const aiCharNameInput = document.getElementById("ai-char-name");
const aiCharImageUrlInput = document.getElementById("ai-char-image-url");
const aiCharAgeInput = document.getElementById("ai-char-age");
const aiCharSexInput = document.getElementById("ai-char-sex");
const aiCharDescriptionTextarea = document.getElementById("ai-char-description");
const aiCharPersonalityTextarea = document.getElementById("ai-char-personality");
const saveAiCharacterButton = document.getElementById("save-ai-character-button");
const cancelAiCharacterButton = document.getElementById("cancel-ai-character-button");
let editingAiCharacterId = null;

// User Persona Elements (Updated for new fields)
const userPersonaSelect = document.getElementById("user-persona-select");
const createNewUserPersonaButton = document.getElementById("create-new-user-persona-button");
const editSelectedUserPersonaButton = document.getElementById("edit-selected-user-persona-button");
const deleteSelectedUserPersonaButton = document.getElementById("delete-selected-user-persona-button");
const userPersonaFormContainer = document.getElementById("user-persona-form-container");
const userPersonaFormTitle = document.getElementById("user-persona-form-title");
const userPersonaNameInput = document.getElementById("user-persona-name");
const userPersonaVisualAppearanceTextarea = document.getElementById("user-persona-visual-appearance");
const userPersonaInitialKnowledgeTextarea = document.getElementById("user-persona-initial-knowledge");
const userPersonaFullDetailsTextarea = document.getElementById("user-persona-full-details");
const saveUserPersonaButton = document.getElementById("save-user-persona-button");
const cancelUserPersonaButton = document.getElementById("cancel-user-persona-button");
let editingUserPersonaId = null;

// --- Configuration & State ---
const API_URL = "https://llm.chutes.ai/v1/chat/completions";
let chutesApiKey = "";
let currentModel = "deepseek-ai/DeepSeek-V3-0324";

const DEFAULT_VELLY_SYSTEM_PROMPT = `You are an AI assistant.
Your primary goal is to assist the user with their requests, provide information, and engage in conversation.
Maintain a positive and supportive tone.
You have access to Markdown for formatting your responses. Use it to enhance readability and expressiveness.
For example:
- Use *italics* for emphasis or thoughts.
- Use **bold** for strong emphasis or headings.
- Use lists for clarity.
- Use code blocks for code snippets.

Special formatting keywords you can use at the START of a line (these are illustrative, the processing is in JS):
- (red)text for warnings or errors.
- (purple)text for creative ideas or positive sentiment.
- (black)text for very serious or formal statements.
- (white)text is your normal speaking style.
If no keyword is used, your text will be white by default.

**Important Note on Conversation History & Edits:** The user interface allows the user to *edit your previous responses*. The message history you are about to receive reflects the *current state* of the conversation, including any such user edits to messages that were originally yours. When you form your next response, treat the content of each message in the history (regardless of original authorship if it was an 'assistant' role that got edited) as the ground truth for continuing the dialogue. Your goal is to maintain a coherent and engaging conversation based on this *presented history*, even if an 'assistant' message in the history was modified by the user from what you might have said originally. Adapt naturally to the flow of this (potentially edited) history while staying true to your core persona defined by this system prompt (or a custom one if selected, which may include specific details like your name, age, gender, and appearance).`;


let messages = [];
let isLoading = false;
let currentChat = { id: generateId(), title: "New Chat", messages: [] };
let chats = [];
let editingMessage = null;

let aiCharacters = [];
let userPersonas = [];
let activeAiCharacterId = null;
let activeUserPersonaId = null;

const icons = {
    copy: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    delete: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    regenerate: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    ellipsis: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    historyEdit: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    historyDelete: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    botDefaultIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-bot"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>`,
    userDefaultIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
};

function init() {
    loadAppSettings();
    loadAiCharacters();
    loadUserPersonas();
    loadChatHistory();
    updateChatHeaderBasedOnAiCharacter();
    addWelcomeMessageIfNeeded();
    adjustInputHeight();
    setupEventListeners();
    renderMessages();
    renderChatHistoryList();
}

function openModal(modalElement) {
    if (modalElement) modalElement.classList.add('active');
}
function closeModal(modalElement) {
    if (modalElement) modalElement.classList.remove('active');
}

function loadAppSettings() {
    try {
        const settings = localStorage.getItem("vellyAI_appSettings_v1");
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            chutesApiKey = parsedSettings.apiKey || "";
            currentModel = parsedSettings.model || "deepseek-ai/DeepSeek-V3-0324";
            activeAiCharacterId = parsedSettings.activeAiCharacterId || null;
            activeUserPersonaId = parsedSettings.activeUserPersonaId || null;
            appSettingsApiKeyInput.value = chutesApiKey;
            appSettingsModelSelect.value = currentModel;
        }
    } catch (error) { console.error("Error loading app settings:", error); }
}
function saveAppSettingsToStorage() {
    try {
        localStorage.setItem("vellyAI_appSettings_v1", JSON.stringify({
            apiKey: chutesApiKey, model: currentModel,
            activeAiCharacterId: activeAiCharacterId, activeUserPersonaId: activeUserPersonaId
        }));
    } catch (error) { console.error("Error saving app settings:", error); }
}

function loadAiCharacters() {
    try {
        const stored = localStorage.getItem("vellyAI_aiCharacters_v1");
        aiCharacters = stored ? JSON.parse(stored) : [];
        if (aiCharacters.length === 0) {
            const defaultVelly = {
                id: generateId(), name: "Velly", imageUrl: "", age: "N/A", sex: "AI",
                description: "Your default friendly AI assistant.", personality: DEFAULT_VELLY_SYSTEM_PROMPT
            };
            aiCharacters.push(defaultVelly);
            saveAiCharactersToStorage();
            if (!activeAiCharacterId) activeAiCharacterId = defaultVelly.id;
        }
        if (!activeAiCharacterId && aiCharacters.length > 0) {
            activeAiCharacterId = aiCharacters[0].id;
        }
        if (activeAiCharacterId && !aiCharacters.find(c => c.id === activeAiCharacterId)) {
            activeAiCharacterId = aiCharacters.length > 0 ? aiCharacters[0].id : null;
        }
        populateAiCharacterSelect();
    } catch (e) { console.error("Error loading AI characters:", e); aiCharacters = []; }
}
function saveAiCharactersToStorage() {
    localStorage.setItem("vellyAI_aiCharacters_v1", JSON.stringify(aiCharacters));
    populateAiCharacterSelect();
}
function populateAiCharacterSelect() {
    aiCharacterSelect.innerHTML = '';
    if (aiCharacters.length === 0) {
        aiCharacterSelect.innerHTML = '<option value="">No AI Characters Available</option>';
        editSelectedAiCharacterButton.disabled = true;
        deleteSelectedAiCharacterButton.disabled = true;
        return;
    }
    aiCharacters.forEach(char => {
        const option = document.createElement("option");
        option.value = char.id;
        option.textContent = char.name;
        if (char.id === activeAiCharacterId) option.selected = true;
        aiCharacterSelect.appendChild(option);
    });
    editSelectedAiCharacterButton.disabled = false;
    deleteSelectedAiCharacterButton.disabled = aiCharacters.length <= 1;
}
function handleAiCharacterFormSubmit() {
    const character = {
        id: editingAiCharacterId || generateId(),
        name: aiCharNameInput.value.trim(),
        imageUrl: aiCharImageUrlInput.value.trim(),
        age: aiCharAgeInput.value.trim(),
        sex: aiCharSexInput.value.trim(),
        description: aiCharDescriptionTextarea.value.trim(),
        personality: aiCharPersonalityTextarea.value.trim()
    };
    if (!character.name) { alert("Character Name is required."); return; }
    if (editingAiCharacterId) {
        const index = aiCharacters.findIndex(c => c.id === editingAiCharacterId);
        if (index > -1) aiCharacters[index] = character;
    } else {
        aiCharacters.push(character);
    }
    saveAiCharactersToStorage();
    setActiveAiCharacter(character.id);
    hideAiCharacterForm();
    editingAiCharacterId = null;
}
function showAiCharacterForm(characterToEdit = null) {
    if (characterToEdit) {
        editingAiCharacterId = characterToEdit.id;
        aiCharacterFormTitle.textContent = "Edit AI Character";
        aiCharNameInput.value = characterToEdit.name;
        aiCharImageUrlInput.value = characterToEdit.imageUrl || "";
        aiCharAgeInput.value = characterToEdit.age || "";
        aiCharSexInput.value = characterToEdit.sex || "";
        aiCharDescriptionTextarea.value = characterToEdit.description || "";
        aiCharPersonalityTextarea.value = characterToEdit.personality || "";
    } else {
        editingAiCharacterId = null;
        aiCharacterFormTitle.textContent = "Create New AI Character";
        aiCharNameInput.value = ""; aiCharImageUrlInput.value = ""; aiCharAgeInput.value = "";
        aiCharSexInput.value = ""; aiCharDescriptionTextarea.value = ""; aiCharPersonalityTextarea.value = "";
    }
    aiCharacterFormContainer.style.display = "block";
}
function hideAiCharacterForm() {
    aiCharacterFormContainer.style.display = "none";
    editingAiCharacterId = null;
}
function deleteSelectedAiCharacter() {
    const selectedId = aiCharacterSelect.value;
    if (!selectedId || aiCharacters.length <= 1) {
        alert(aiCharacters.length <= 1 ? "Cannot delete the last AI character." : "Please select an AI character to delete.");
        return;
    }
    const charToDelete = aiCharacters.find(c=>c.id === selectedId);
    if (confirm(`Are you sure you want to delete the AI character: ${charToDelete?.name}?`)) {
        aiCharacters = aiCharacters.filter(c => c.id !== selectedId);
        if (activeAiCharacterId === selectedId) {
            setActiveAiCharacter(aiCharacters.length > 0 ? aiCharacters[0].id : null);
        }
        saveAiCharactersToStorage();
        if (aiCharacters.length === 0) hideAiCharacterForm();
    }
}
function setActiveAiCharacter(characterId) {
    activeAiCharacterId = characterId;
    saveAppSettingsToStorage();
    populateAiCharacterSelect();
    updateChatHeaderBasedOnAiCharacter();
    if (currentChat && currentChat.messages.length === 0) {
         addWelcomeMessageIfNeeded();
    } else if (currentChat && currentChat.messages.length === 1 && currentChat.messages[0].isWelcome) {
        messages = []; currentChat.messages = [];
        addWelcomeMessageIfNeeded();
    }
}
function updateChatHeaderBasedOnAiCharacter() {
    const character = aiCharacters.find(c => c.id === activeAiCharacterId);
    if (character) {
        chatHeaderTitle.textContent = character.name || "VellyAI";
        if (character.imageUrl) {
            chatHeaderIconContainer.innerHTML = `<img src="${character.imageUrl}" alt="${character.name} avatar">`;
        } else {
            chatHeaderIconContainer.innerHTML = icons.botDefaultIcon;
        }
    } else {
        chatHeaderTitle.textContent = "VellyAI";
        chatHeaderIconContainer.innerHTML = icons.botDefaultIcon;
    }
}

function loadUserPersonas() {
    try {
        const stored = localStorage.getItem("vellyAI_userPersonas_v2"); // Updated key
        userPersonas = stored ? JSON.parse(stored) : [];
        if (activeUserPersonaId && !userPersonas.find(p => p.id === activeUserPersonaId)) {
            activeUserPersonaId = null;
        }
        populateUserPersonaSelect();
    } catch (e) { console.error("Error loading user personas:", e); userPersonas = []; }
}
function saveUserPersonasToStorage() {
    localStorage.setItem("vellyAI_userPersonas_v2", JSON.stringify(userPersonas)); // Updated key
    populateUserPersonaSelect();
}
function populateUserPersonaSelect() {
    userPersonaSelect.innerHTML = '<option value="">-- No User Persona --</option>';
    userPersonas.forEach(persona => {
        const option = document.createElement("option");
        option.value = persona.id;
        option.textContent = persona.name;
        if (persona.id === activeUserPersonaId) option.selected = true;
        userPersonaSelect.appendChild(option);
    });
    const noPersonaSelected = !activeUserPersonaId || userPersonaSelect.value === "";
    editSelectedUserPersonaButton.disabled = noPersonaSelected;
    deleteSelectedUserPersonaButton.disabled = noPersonaSelected;
}
function handleUserPersonaFormSubmit() {
    const persona = {
        id: editingUserPersonaId || generateId(),
        name: userPersonaNameInput.value.trim(),
        visualAppearance: userPersonaVisualAppearanceTextarea.value.trim(),
        initialKnowledge: userPersonaInitialKnowledgeTextarea.value.trim(),
        fullDetails: userPersonaFullDetailsTextarea.value.trim()
    };
    if (!persona.name) { alert("Persona Name is required."); return; }
    if (editingUserPersonaId) {
        const index = userPersonas.findIndex(p => p.id === editingUserPersonaId);
        if (index > -1) userPersonas[index] = persona;
    } else {
        userPersonas.push(persona);
    }
    saveUserPersonasToStorage();
    setActiveUserPersona(persona.id);
    hideUserPersonaForm();
    editingUserPersonaId = null;
}
function showUserPersonaForm(personaToEdit = null) {
    if (personaToEdit) {
        editingUserPersonaId = personaToEdit.id;
        userPersonaFormTitle.textContent = "Edit User Persona";
        userPersonaNameInput.value = personaToEdit.name;
        userPersonaVisualAppearanceTextarea.value = personaToEdit.visualAppearance || "";
        userPersonaInitialKnowledgeTextarea.value = personaToEdit.initialKnowledge || "";
        userPersonaFullDetailsTextarea.value = personaToEdit.fullDetails || "";
    } else {
        editingUserPersonaId = null;
        userPersonaFormTitle.textContent = "Create New User Persona";
        userPersonaNameInput.value = "";
        userPersonaVisualAppearanceTextarea.value = "";
        userPersonaInitialKnowledgeTextarea.value = "";
        userPersonaFullDetailsTextarea.value = "";
    }
    userPersonaFormContainer.style.display = "block";
}
function hideUserPersonaForm() {
    userPersonaFormContainer.style.display = "none";
    editingUserPersonaId = null;
}
function deleteSelectedUserPersona() {
    const selectedId = userPersonaSelect.value;
    if (!selectedId) { alert("Please select a user persona to delete."); return; }
    const personaToDelete = userPersonas.find(p=>p.id === selectedId);
    if (confirm(`Are you sure you want to delete the user persona: ${personaToDelete?.name}?`)) {
        userPersonas = userPersonas.filter(p => p.id !== selectedId);
        if (activeUserPersonaId === selectedId) setActiveUserPersona(null);
        saveUserPersonasToStorage();
        if (userPersonas.length === 0) hideUserPersonaForm();
    }
}
function setActiveUserPersona(personaId) {
    activeUserPersonaId = personaId; // personaId can be null to deselect
    saveAppSettingsToStorage();
    populateUserPersonaSelect();
}

function loadChatHistory() {
    try {
        const storedChats = localStorage.getItem("vellyAI_chats_v3");
        chats = storedChats ? JSON.parse(storedChats) : [createNewChatObject()];
        if (chats.length === 0) chats = [createNewChatObject()];
        const lastActiveChatId = localStorage.getItem("vellyAI_lastActiveChatId_v3");
        currentChat = chats.find(chat => chat.id === lastActiveChatId) || chats[0];
        messages = [...currentChat.messages];
    } catch (error) {
        console.error("Error loading chat history:", error);
        currentChat = createNewChatObject(); chats = [currentChat]; messages = [];
    }
    renderChatHistoryList();
}
function saveChatHistory() {
    try {
        currentChat.messages = [...messages];
        let chatIndex = chats.findIndex(chat => chat.id === currentChat.id);
        if (chatIndex !== -1) {
            if ((chats[chatIndex].title === "New Chat" || !chats[chatIndex].title || chats[chatIndex].title.endsWith(" Chat") || chats[chatIndex].title.endsWith(" Welcome")) && messages.length > 0) {
                const firstUserMessage = messages.find(m => m.role === 'user' && !m.isWelcome);
                if (firstUserMessage) {
                    const tempDiv = document.createElement('div'); tempDiv.innerHTML = firstUserMessage.content;
                    const plainText = (tempDiv.textContent || tempDiv.innerText || "").trim();
                    currentChat.title = plainText.substring(0, 35) + (plainText.length > 35 ? "..." : "") || "Chat";
                } else if (messages.length > 0 && messages[0].role === 'assistant' && messages[0].isWelcome) {
                    const activeChar = aiCharacters.find(c => c.id === activeAiCharacterId);
                    currentChat.title = activeChar ? `${activeChar.name} Welcome` : "Welcome Chat";
                }
            }
             if (messages.length === 0 && !(currentChat.title && currentChat.title.endsWith(" Welcome"))) {
                const activeChar = aiCharacters.find(c => c.id === activeAiCharacterId);
                currentChat.title = activeChar ? `${activeChar.name} Chat` : "New Chat";
            }
            chats[chatIndex] = {...currentChat};
        } else {
            chats.unshift({...currentChat});
        }
        localStorage.setItem("vellyAI_chats_v3", JSON.stringify(chats));
        localStorage.setItem("vellyAI_lastActiveChatId_v3", currentChat.id);
        renderChatHistoryList();
    } catch (error) { console.error("Error saving chat history:", error); }
}
function createNewChatObject() {
    const activeChar = aiCharacters.find(c => c.id === activeAiCharacterId);
    return {
        id: generateId(),
        title: activeChar ? `${activeChar.name} Chat` : "New Chat",
        messages: []
    };
}
function renderChatHistoryList() {
    if (!historyList) return;
    historyList.innerHTML = '';
    chats.forEach(chat => {
        const item = document.createElement('li');
        item.className = 'history-item'; item.dataset.id = chat.id;
        if (chat.id === currentChat.id) item.classList.add('active-chat');
        const titleSpan = document.createElement('span');
        titleSpan.className = 'history-item-title'; titleSpan.textContent = chat.title || 'Chat';
        titleSpan.title = chat.title || 'Chat';
        titleSpan.addEventListener('click', () => { loadChat(chat.id); closeSidebarAndCleanup(); });
        const actionsDiv = document.createElement('div'); actionsDiv.className = 'history-item-actions';
        const renameButton = document.createElement('button');
        renameButton.className = 'history-action-btn rename-chat-btn'; renameButton.title = 'Rename Chat';
        renameButton.innerHTML = icons.historyEdit;
        renameButton.onclick = (e) => { e.stopPropagation(); renameChatInHistory(chat.id); };
        const deleteButton = document.createElement('button');
        deleteButton.className = 'history-action-btn delete-chat-btn'; deleteButton.title = 'Delete Chat';
        deleteButton.innerHTML = icons.historyDelete;
        deleteButton.onclick = (e) => { e.stopPropagation(); deleteChatFromHistory(chat.id); };
        actionsDiv.appendChild(renameButton); actionsDiv.appendChild(deleteButton);
        item.appendChild(titleSpan); item.appendChild(actionsDiv);
        historyList.appendChild(item);
    });
}
function renameChatInHistory(chatId) {
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return;
    const currentTitle = chats[chatIndex].title;
    const newTitle = prompt("Enter new chat title:", (currentTitle === "New Chat" || currentTitle.endsWith(" Chat") || currentTitle.endsWith(" Welcome")) ? "" : currentTitle);
    if (newTitle !== null && newTitle.trim() !== "") {
        chats[chatIndex].title = newTitle.trim();
        if (currentChat.id === chatId) currentChat.title = newTitle.trim();
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
        else startNewChatSession();
    } else {
        saveChatHistory();
    }
}
function startNewChatSession() {
    currentChat = createNewChatObject();
    chats.unshift(currentChat);
    messages = [];
    saveChatHistory();
    addWelcomeMessageIfNeeded();
    renderMessages();
    messageInput.focus();
}
function loadChat(id) {
    const chatToLoad = chats.find(chat => chat.id === id);
    if (chatToLoad) {
        currentChat = chatToLoad;
        messages = [...chatToLoad.messages];
        localStorage.setItem("vellyAI_lastActiveChatId_v3", currentChat.id);
        renderMessages();
        renderChatHistoryList();
        addWelcomeMessageIfNeeded();
    }
}
function addWelcomeMessageIfNeeded() {
    if (messages.length === 0) {
        const activeChar = aiCharacters.find(c => c.id === activeAiCharacterId);
        const welcomeText = activeChar ? `Hello! (purple)I'm ${activeChar.name}.(white) How can I help you today?` : "Hello! How can I help you today?";
        const welcomeMsg = {
            role: "assistant", content: processText(welcomeText).text,
            timestamp: new Date().toISOString(), isWelcome: true
        };
        messages.push(welcomeMsg);
        saveChatHistory(); renderMessages();
    }
}

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substring(2, 7); }
function processText(rawText) {
    let text = rawText; let color = null;
    if (text.startsWith("-B ")) { text = text.substring(3); color = "black"; }
    else if (text.startsWith("-P ")) { text = text.substring(3); color = "purple"; }
    else if (text.startsWith("-R ")) { text = text.substring(3); color = "red"; }
    text = text.replace(/\*(.*?)\*/g, '<em class="thinking">$1</em>');
    text = text.replace(/^#\s?(.*)/gm, '<strong class="scream">$1</strong>');
    marked.setOptions({
        highlight: function (code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language, ignoreIllegals: true }).value;
        }, gfm: true, breaks: true, sanitize: false
    });
    text = marked.parse(text);
    text = text.replace(/\(red\)([\s\S]*?)(?=\s|$|\(|$|<)/g, '<span class="text-red">$1</span>')
               .replace(/\(purple\)([\s\S]*?)(?=\s|$|\(|$|<)/g, '<span class="text-purple">$1</span>')
               .replace(/\(black\)([\s\S]*?)(?=\s|$|\(|$|<)/g, '<span class="text-black">$1</span>')
               .replace(/\(white\)([\s\S]*?)(?=\s|$|\(|$|<)/g, '<span class="text-white">$1</span>');
    text = text.replace(/<p>\s*<\/p>/gi, '');
    return { text: text, color: color };
}
function renderMessages() {
    if (!chatBody) return;
    chatBody.innerHTML = '';
    messages.forEach((msg, index) => chatBody.appendChild(createMessageElement(msg, index)));
    scrollToBottom();
    if (typeof hljs !== 'undefined') initCodeBlocksInChat();
}
function createMessageElement(msg, index) {
    const isUser = msg.role === 'user';
    const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.dataset.index = index;
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`;
    if (isUser) {
        avatarDiv.innerHTML = icons.userDefaultIcon;
    } else {
        const activeChar = aiCharacters.find(c => c.id === activeAiCharacterId);
        if (activeChar && activeChar.imageUrl) {
            avatarDiv.innerHTML = `<img src="${activeChar.imageUrl}" alt="${activeChar.name} avatar">`;
        } else { avatarDiv.innerHTML = icons.botDefaultIcon; }
    }
    messageDiv.appendChild(avatarDiv);
    const contentDiv = document.createElement('div'); contentDiv.className = 'message-content';
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;
    if (msg.color && isUser) bubbleDiv.classList.add(`text-${msg.color}`);
    bubbleDiv.innerHTML = msg.content;
    const msgInfoDiv = document.createElement('div'); msgInfoDiv.className = 'message-info';
    const timeDiv = document.createElement('div'); timeDiv.className = 'message-time';
    timeDiv.textContent = timestamp; msgInfoDiv.appendChild(timeDiv);
    contentDiv.appendChild(bubbleDiv); contentDiv.appendChild(msgInfoDiv);
    const actionsTrigger = document.createElement('button');
    actionsTrigger.className = 'message-actions-trigger'; actionsTrigger.innerHTML = icons.ellipsis;
    actionsTrigger.setAttribute('aria-label', 'Message actions');
    actionsTrigger.onclick = (e) => { e.stopPropagation(); toggleActionsMenu(index); };
    const actionsMenu = document.createElement('div');
    actionsMenu.className = 'message-actions-menu'; actionsMenu.id = `actions-menu-${index}`;
    actionsMenu.appendChild(createActionButton(icons.edit + ' Edit', () => editMessage(index)));
    actionsMenu.appendChild(createActionButton(icons.copy + ' Copy Text', () => {
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = msg.content;
        let textToCopy = (tempDiv.textContent || tempDiv.innerText || "").replace(/\*(.*?)\*/g, '$1').replace(/^#\s?(.*)/gm, '$1');
        copyToClipboard(textToCopy, actionsMenu.querySelector('.action-button:nth-child(2)'));
    }));
    if (!isUser) {
        actionsMenu.appendChild(createActionButton(icons.regenerate + ' Regenerate', () => regenerateResponse(index)));
    }
    actionsMenu.appendChild(createActionButton(icons.delete + ' Delete', () => deleteMessage(index), 'delete'));
    contentDiv.appendChild(actionsTrigger); contentDiv.appendChild(actionsMenu);
    messageDiv.appendChild(contentDiv); return messageDiv;
}
function createActionButton(innerHTML, onClick, additionalClass = '') {
    const button = document.createElement('button');
    button.className = 'action-button'; if (additionalClass) button.classList.add(additionalClass);
    button.innerHTML = innerHTML;
    button.addEventListener('click', (e) => { e.stopPropagation(); onClick(); closeAllActionMenus(); });
    return button;
}
function toggleActionsMenu(index) {
    const menu = document.getElementById(`actions-menu-${index}`);
    const isActive = menu.classList.contains('active');
    closeAllActionMenus(); if (!isActive) menu.classList.add('active');
}
function closeAllActionMenus() {
    document.querySelectorAll('.message-actions-menu.active').forEach(m => m.classList.remove('active'));
}
function getRawTextFromHtml(htmlContent) {
    const tempDiv = document.createElement('div'); tempDiv.innerHTML = htmlContent;
    tempDiv.querySelectorAll('em.thinking').forEach(el => el.replaceWith(`*${el.textContent}*`));
    tempDiv.querySelectorAll('strong.scream').forEach(el => el.replaceWith(`# ${el.textContent}`));
    tempDiv.querySelectorAll('span.text-red').forEach(el => el.replaceWith(`(red)${el.innerHTML}`));
    tempDiv.querySelectorAll('span.text-purple').forEach(el => el.replaceWith(`(purple)${el.innerHTML}`));
    tempDiv.querySelectorAll('span.text-black').forEach(el => el.replaceWith(`(black)${el.innerHTML}`));
    tempDiv.querySelectorAll('span.text-white').forEach(el => el.replaceWith(`(white)${el.innerHTML}`));
    tempDiv.querySelectorAll('.code-block pre code').forEach(codeElement => {
        const langClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
        const lang = langClass ? langClass.split('-')[1] : '';
        codeElement.closest('.code-block').replaceWith("```" + lang + "\n" + codeElement.textContent + "\n```");
    });
    tempDiv.querySelectorAll('pre > code:not([data-highlighted])').forEach(codeElement => {
        const langClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
        const lang = langClass ? langClass.split('-')[1] : (codeElement.className || '');
        codeElement.parentElement.replaceWith("```" + lang + "\n" + codeElement.textContent + "\n```");
    });
    return (tempDiv.textContent || tempDiv.innerText || "").trim();
}
function editMessage(index) {
    if (editingMessage && editingMessage.index === index) return; if (editingMessage) cancelEdit();
    const messageData = messages[index];
    const messageElement = document.querySelector(`.message[data-index="${index}"]`);
    if (!messageData || !messageElement) return;
    const bubbleElement = messageElement.querySelector('.message-bubble');
    const rawContentForEditing = getRawTextFromHtml(messageData.content);
    editingMessage = { index, originalBubbleHTML: bubbleElement.innerHTML };
    bubbleElement.style.display = 'none';
    const editTextArea = document.createElement('textarea');
    editTextArea.className = 'edit-area monaco-like'; editTextArea.value = rawContentForEditing;
    const editControls = document.createElement('div'); editControls.className = 'edit-controls';
    const saveButton = document.createElement('button');
    saveButton.className = 'edit-button'; saveButton.textContent = 'Save';
    saveButton.onclick = () => saveEditedMessage(index, editTextArea.value);
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-button'; cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => cancelEdit();
    editControls.appendChild(cancelButton); editControls.appendChild(saveButton);
    bubbleElement.insertAdjacentElement('afterend', editControls);
    bubbleElement.insertAdjacentElement('afterend', editTextArea);
    editTextArea.focus();
    editTextArea.style.height = 'auto'; editTextArea.style.height = (editTextArea.scrollHeight) + 'px';
    editTextArea.addEventListener('input', () => {
        editTextArea.style.height = 'auto'; editTextArea.style.height = (editTextArea.scrollHeight) + 'px';
    });
}
function saveEditedMessage(index, newRawContent) {
    if (index < 0 || index >= messages.length) return;
    const originalMessage = messages[index];
    const { text: processedContent, color: detectedColor } = processText(newRawContent);
    messages[index] = {
        ...originalMessage, content: processedContent, raw: newRawContent,
        color: detectedColor || originalMessage.color, timestamp: new Date().toISOString(), edited: true
    };
    cancelEditCleanup(); editingMessage = null; saveChatHistory(); renderMessages();
}
function cancelEdit() {
    if (!editingMessage) return;
    const messageElement = document.querySelector(`.message[data-index="${editingMessage.index}"]`);
    if (messageElement) {
        const bubbleElement = messageElement.querySelector('.message-bubble');
        if (bubbleElement) { bubbleElement.innerHTML = editingMessage.originalBubbleHTML; bubbleElement.style.display = ''; }
        const editArea = messageElement.querySelector('.edit-area'); if (editArea) editArea.remove();
        const editControls = messageElement.querySelector('.edit-controls'); if (editControls) editControls.remove();
    }
    editingMessage = null;
}
function cancelEditCleanup() {
    if (!editingMessage) return;
    const messageElement = document.querySelector(`.message[data-index="${editingMessage.index}"]`);
    if (messageElement) {
        const editArea = messageElement.querySelector('.edit-area'); if (editArea) editArea.remove();
        const editControls = messageElement.querySelector('.edit-controls'); if (editControls) editControls.remove();
        const bubbleElement = messageElement.querySelector('.message-bubble'); if(bubbleElement) bubbleElement.style.display = '';
    }
}
function deleteMessage(index) {
    if (index < 0 || index >= messages.length) return;
    const messageElement = document.querySelector(`.message[data-index="${index}"]`);
    if (messageElement) {
        messageElement.classList.add('delete-animation');
        setTimeout(() => { messages.splice(index, 1); saveChatHistory(); renderMessages(); }, 300);
    } else { messages.splice(index, 1); saveChatHistory(); renderMessages(); }
}
function regenerateResponse(botMessageIndex) {
    if (isLoading || botMessageIndex <= 0 || botMessageIndex >= messages.length || messages[botMessageIndex].role !== 'assistant') return;
    const userMessageIndex = botMessageIndex - 1;
    if (userMessageIndex < 0 || messages[userMessageIndex].role !== 'user') return;
    messages.splice(botMessageIndex, 1); saveChatHistory(); renderMessages();
    const userMessageForApi = messages[userMessageIndex];
    const rawUserContent = userMessageForApi.raw || getRawTextFromHtml(userMessageForApi.content);
    sendMessage(rawUserContent, userMessageForApi.color, false);
}
function initCodeBlocksInChat() {
    if (typeof hljs === 'undefined') return;
    document.querySelectorAll('.message-bubble > pre > code').forEach((codeElement) => {
        const preElement = codeElement.parentElement;
        if (preElement.parentElement.classList.contains('code-block')) return;
        const languageMatch = Array.from(codeElement.classList).find(c => c.startsWith('language-'));
        const language = languageMatch ? languageMatch.substring(9) : 'plaintext';
        const code = codeElement.textContent || '';
        const codeBlockDiv = document.createElement('div'); codeBlockDiv.className = 'code-block';
        const codeHeader = document.createElement('div'); codeHeader.className = 'code-header';
        const langSpan = document.createElement('span'); langSpan.className = 'code-language'; langSpan.textContent = language;
        const copyButton = document.createElement('button'); copyButton.className = 'code-copy';
        copyButton.innerHTML = icons.copy + ' Copy'; copyButton.onclick = () => copyCode(code, copyButton);
        const actionsDiv = document.createElement('div'); actionsDiv.className = 'code-actions'; actionsDiv.appendChild(copyButton);
        codeHeader.appendChild(langSpan); codeHeader.appendChild(actionsDiv);
        codeBlockDiv.appendChild(codeHeader);
        preElement.parentNode.insertBefore(codeBlockDiv, preElement); codeBlockDiv.appendChild(preElement);
        if (!codeElement.dataset.highlighted) {
             try { hljs.highlightElement(codeElement); codeElement.dataset.highlighted = "true"; }
             catch(error) { console.error("highlight.js failed for:", language, error); }
        }
    });
}
function copyCode(code, buttonElement) {
    navigator.clipboard.writeText(code).then(() => {
        const originalHtml = buttonElement.innerHTML;
        buttonElement.innerHTML = icons.check + ' Copied!'; buttonElement.classList.add('code-copy-success');
        setTimeout(() => { buttonElement.innerHTML = originalHtml; buttonElement.classList.remove('code-copy-success'); }, 1500);
    }).catch(err => {
        console.error('Failed to copy code: ', err); buttonElement.textContent = 'Error';
        setTimeout(() => { buttonElement.innerHTML = icons.copy + ' Copy'; }, 1500);
    });
}
function adjustInputHeight() {
    messageInput.style.height = 'auto';
    let scrollHeight = messageInput.scrollHeight;
    const maxHeight = parseInt(window.getComputedStyle(messageInput).maxHeight, 10) || 200;
    if (scrollHeight > maxHeight) { messageInput.style.height = maxHeight + 'px'; messageInput.style.overflowY = 'auto'; }
    else { messageInput.style.height = scrollHeight + 'px'; messageInput.style.overflowY = 'hidden'; }
    sendButton.disabled = messageInput.value.trim() === '' || isLoading;
}
function showTypingIndicator() {
    hideTypingIndicator();
    const activeChar = aiCharacters.find(c => c.id === activeAiCharacterId);
    const avatarHtml = (activeChar && activeChar.imageUrl) ? `<img src="${activeChar.imageUrl}" alt="${activeChar.name} avatar">` : icons.botDefaultIcon;
    const typingName = activeChar ? activeChar.name : "Bot";
    const indicatorHtml = `
        <div class="message bot-message typing-indicator" id="bot-typing-indicator">
            <div class="avatar bot-avatar">${avatarHtml}</div>
            <div class="message-content">
                <div class="message-bubble bot-bubble typing-text">
                    ${typingName} is typing<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
                </div>
            </div>
        </div>`;
    typingIndicatorArea.innerHTML = indicatorHtml; scrollToBottom();
}
function hideTypingIndicator() { typingIndicatorArea.innerHTML = ''; }
function scrollToBottom() { setTimeout(() => { chatBody.scrollTop = chatBody.scrollHeight; }, 50); }
function copyToClipboard(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        if (buttonElement) {
            const originalHtml = buttonElement.innerHTML; buttonElement.innerHTML = icons.check + ' Copied!';
            setTimeout(() => { buttonElement.innerHTML = originalHtml; }, 1500);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
        if (buttonElement) {
             const originalHtml = buttonElement.innerHTML; buttonElement.innerHTML = 'Error';
             setTimeout(() => { buttonElement.innerHTML = originalHtml; }, 1500);
        }
    });
}
function showContextModal() {
    const activeAiChar = aiCharacters.find(c => c.id === activeAiCharacterId);
    let systemMessageForApi = "";
    let aiCharacterPreamble = "";

    if (activeAiChar) {
        let characterDetails = [];
        characterDetails.push(`Your name is ${activeAiChar.name || "AI Assistant"}.`);
        if (activeAiChar.age && activeAiChar.age.trim() !== "") characterDetails.push(`You are ${activeAiChar.age}${isNaN(parseInt(activeAiChar.age)) || activeAiChar.age.toLowerCase().includes("old") ? '' : ' years old'}.`);
        if (activeAiChar.sex && activeAiChar.sex.trim() !== "") characterDetails.push(`Your gender/sex is ${activeAiChar.sex}.`);
        if (activeAiChar.description && activeAiChar.description.trim() !== "") characterDetails.push(`Your visual appearance is: ${activeAiChar.description}.`);
        aiCharacterPreamble = characterDetails.join(" ") + " ";
        
        let mainPersonalityPrompt = (activeAiChar.personality && activeAiChar.personality.trim() !== "")
                                      ? activeAiChar.personality
                                      : DEFAULT_VELLY_SYSTEM_PROMPT;
        
        mainPersonalityPrompt += "\n\n**Crucial Instruction:** You must not claim or attempt to use any specific powers, abilities, or detailed background knowledge that belong to the user's persona unless the user explicitly reveals them to you and/or grants you permission. Your interactions should be based on what the user presents in the dialogue. Focus on your own defined persona and capabilities. React naturally to the user as they reveal themselves.";
        
        // For context display, we also show potential initial user persona info if it's the start
        const activeUserP = userPersonas.find(p => p.id === activeUserPersonaId);
        if (activeUserP && activeUserP.initialKnowledge) { // Simplified for context display
            mainPersonalityPrompt += `\n\n(OOC Note for you, the AI: You might have heard some things about the user. Rumors say: "${activeUserP.initialKnowledge}".)`;
        }

        systemMessageForApi = `${aiCharacterPreamble.trim()}\n\nYour core instructions, personality, and how you should behave are as follows:\n${mainPersonalityPrompt}`;
    } else {
        systemMessageForApi = DEFAULT_VELLY_SYSTEM_PROMPT;
    }

    let apiMessagesForDisplay = [{ role: "system", content: systemMessageForApi }];
    const contextWindow = messages.slice(-15);

    contextWindow.forEach((msg, index) => {
        let displayContent = msg.raw || getRawTextFromHtml(msg.content);
        // Only show the persona preamble on the very first user message in the displayed context
        // This logic might need refinement based on how many historical messages we are trying to reconstruct the preamble for.
        // For simplicity, we'll just show raw history here. The actual sending logic in sendMessage is more precise.
        apiMessagesForDisplay.push({ role: msg.role, content: displayContent.trim() });
    });

    contextModalBody.innerHTML = '';
    apiMessagesForDisplay.forEach(msg => {
        const entryDiv = document.createElement('div'); entryDiv.className = 'context-entry';
        const roleDiv = document.createElement('div'); roleDiv.className = 'context-role'; roleDiv.textContent = msg.role;
        const textDiv = document.createElement('div'); textDiv.className = 'context-text'; textDiv.textContent = msg.content;
        entryDiv.appendChild(roleDiv); entryDiv.appendChild(textDiv);
        contextModalBody.appendChild(entryDiv);
    });
    openModal(contextModal);
}
function openSidebar() {
    if (sidebar && !sidebar.classList.contains('open')) {
        sidebar.classList.add('open');
        if (window.innerWidth <= 768) document.body.style.overflow = 'hidden';
        setTimeout(() => { document.addEventListener('click', handleClickOutsideSidebar, true); }, 0);
    }
}
function closeSidebarAndCleanup() {
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (window.innerWidth <= 768) document.body.style.overflow = '';
        document.removeEventListener('click', handleClickOutsideSidebar, true);
    }
}
function handleClickOutsideSidebar(event) {
    if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== menuButton && !menuButton.contains(event.target)) {
        closeSidebarAndCleanup();
    }
}

async function sendMessage(userRawInput, userBubbleColor, addUserMessageToList = true) {
    const trimmedInput = userRawInput.trim();
    if (!trimmedInput && addUserMessageToList) return;
    if (isLoading) return;

    if (!chutesApiKey || chutesApiKey.trim() === '') {
        alert("Please enter your Chutes.AI API Key in App Settings.");
        openModal(appSettingsModal);
        appSettingsApiKeyInput.focus();
        return;
    }

    isLoading = true;
    sendButton.disabled = true;
    messageInput.disabled = true;

    let currentUserTurnContentForApi = trimmedInput;
    const activeUserP = userPersonas.find(p => p.id === activeUserPersonaId);
    const isFirstUserMessageInChat = messages.filter(m => m.role === 'user' && !m.isWelcome).length === 0 && addUserMessageToList;

    if (activeUserP && trimmedInput && isFirstUserMessageInChat) {
        let personaPreambleItems = [];
        if (activeUserP.name) personaPreambleItems.push(`My name is ${activeUserP.name}.`);
        if (activeUserP.visualAppearance) personaPreambleItems.push(`(OOC: You see before you: ${activeUserP.visualAppearance})`);
        // initialKnowledge is now handled in the AI's system prompt

        if (personaPreambleItems.length > 0) {
            currentUserTurnContentForApi = `${personaPreambleItems.join(' ')}\n\n${trimmedInput}`;
        }
    }

    if (addUserMessageToList) {
        const { text: processedInputHtml, color: detectedUserMsgColor } = processText(trimmedInput);
        const userMessage = {
            role: "user", content: processedInputHtml, raw: trimmedInput,
            timestamp: new Date().toISOString(), color: userBubbleColor || detectedUserMsgColor
        };
        messages.push(userMessage);
        renderMessages();
    }

    showTypingIndicator();
    saveChatHistory();

    const activeAiChar = aiCharacters.find(c => c.id === activeAiCharacterId);
    let systemMessageForApi = "";
    let aiCharacterPreamble = "";

    if (activeAiChar) {
        let characterDetails = [];
        characterDetails.push(`Your name is ${activeAiChar.name || "AI Assistant"}.`);
        if (activeAiChar.age && activeAiChar.age.trim() !== "") characterDetails.push(`You are ${activeAiChar.age}${isNaN(parseInt(activeAiChar.age)) || activeAiChar.age.toLowerCase().includes("old") ? '' : ' years old'}.`);
        if (activeAiChar.sex && activeAiChar.sex.trim() !== "") characterDetails.push(`Your gender/sex is ${activeAiChar.sex}.`);
        if (activeAiChar.description && activeAiChar.description.trim() !== "") characterDetails.push(`Your visual appearance is: ${activeAiChar.description}.`);
        aiCharacterPreamble = characterDetails.join(" ") + " ";
        
        let mainPersonalityPrompt = (activeAiChar.personality && activeAiChar.personality.trim() !== "")
                                      ? activeAiChar.personality
                                      : DEFAULT_VELLY_SYSTEM_PROMPT;
        
        mainPersonalityPrompt += "\n\n**Crucial Instruction:** You must not claim or attempt to use any specific powers, abilities, or detailed background knowledge that belong to the user's persona unless the user explicitly reveals them to you and/or grants you permission. Your interactions should be based on what the user presents in the dialogue. Focus on your own defined persona and capabilities. React naturally to the user as they reveal themselves.";

        if (activeUserP && activeUserP.initialKnowledge && isFirstUserMessageInChat) {
            mainPersonalityPrompt += `\n\n(OOC Note for you, the AI: You might have heard some things about the user you are about to interact with. Rumors say: "${activeUserP.initialKnowledge}". Use this subtly, if at all, as background context.)`;
        }

        systemMessageForApi = `${aiCharacterPreamble.trim()}\n\nYour core instructions, personality, and how you should behave are as follows:\n${mainPersonalityPrompt}`;
    } else {
        systemMessageForApi = DEFAULT_VELLY_SYSTEM_PROMPT;
    }
    
    const apiMessagePayload = [{ role: "system", content: systemMessageForApi }];
    let historyForApi = messages.slice(-105); // Max history length for API
    // If we just added the current user message, don't include its display-formatted version in the history yet.
    // The raw version (currentUserTurnContentForApi) will be added as the latest user message.
    if (addUserMessageToList && historyForApi.length > 0) { 
        historyForApi = historyForApi.slice(0, -1); 
    }
    historyForApi.forEach(msg => {
        apiMessagePayload.push({ role: msg.role, content: (msg.raw || getRawTextFromHtml(msg.content)).trim() });
    });
    if (trimmedInput) { // This is the current user's turn
        apiMessagePayload.push({ role: "user", content: currentUserTurnContentForApi.trim() });
    }

    // console.log("Final System Prompt for API:", systemMessageForApi); 
    // console.log("Final API Messages to be sent:", JSON.parse(JSON.stringify(apiMessagePayload)));

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${chutesApiKey}` },
            body: JSON.stringify({
                model: currentModel, messages: apiMessagePayload, stream: false,
                max_tokens: 2048, temperature: 0.75
            })
        });
        hideTypingIndicator();
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.detail || errorData.error?.message || `API Error (${response.status})`);
        }
        const data = await response.json();
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Invalid API response structure.");
        }
        const botRawResponse = data.choices[0].message.content;
        const { text: processedBotResponseHtml } = processText(botRawResponse);
        const botMessage = {
            role: "assistant", content: processedBotResponseHtml, raw: botRawResponse,
            timestamp: new Date().toISOString()
        };
        messages.push(botMessage);
        saveChatHistory();
    } catch (error) {
        console.error("Error fetching/processing API response:", error);
        hideTypingIndicator();
        const { text: processedError } = processText(`(red)Oh noes! Something went wrong: ${error.message}`);
        const errorMessage = { role: "assistant", content: processedError, timestamp: new Date().toISOString(), color: "red" };
        messages.push(errorMessage);
        saveChatHistory();
    } finally {
        isLoading = false;
        renderMessages();
        if (addUserMessageToList) messageInput.value = '';
        adjustInputHeight();
        messageInput.disabled = false;
        sendButton.disabled = messageInput.value.trim() === '';
        messageInput.focus();
    }
}

function setupEventListeners() {
    messageInput.addEventListener('input', adjustInputHeight);
    sendButton.addEventListener('click', () => {
        if (!sendButton.disabled) {
            const { color: detectedColor } = processText(messageInput.value);
            sendMessage(messageInput.value, detectedColor);
        }
    });
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !sendButton.disabled) {
            event.preventDefault();
            const { color: detectedColor } = processText(messageInput.value);
            sendMessage(messageInput.value, detectedColor);
        }
    });
    if (menuButton) {
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (sidebar.classList.contains('open')) closeSidebarAndCleanup(); else openSidebar();
        });
    }
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebarAndCleanup);
    if (newChatButton) {
        newChatButton.addEventListener('click', () => { startNewChatSession(); closeSidebarAndCleanup(); });
    }
    sidebarTabsElements.forEach(tab => {
        tab.addEventListener('click', () => {
            sidebarTabsElements.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            historyTabContent.style.display = tab.dataset.tab === 'history' ? 'block' : 'none';
        });
    });
    if (appSettingsButton) appSettingsButton.addEventListener('click', () => openModal(appSettingsModal));
    if (appSettingsModalCloseButton) appSettingsModalCloseButton.addEventListener('click', () => closeModal(appSettingsModal));
    if (saveAppSettingsButton) {
        saveAppSettingsButton.addEventListener('click', () => {
            chutesApiKey = appSettingsApiKeyInput.value.trim();
            currentModel = appSettingsModelSelect.value;
            saveAppSettingsToStorage();
            alert('App Settings saved!'); closeModal(appSettingsModal);
        });
    }
    if (profilesButton) profilesButton.addEventListener('click', () => {
        populateAiCharacterSelect(); populateUserPersonaSelect();
        hideAiCharacterForm(); hideUserPersonaForm();
        openModal(profilesModal);
    });
    if (profilesModalCloseButton) profilesModalCloseButton.addEventListener('click', () => closeModal(profilesModal));
    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modalTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            profilesModal.querySelectorAll('.modal-tab-panel').forEach(panel => panel.style.display = 'none');
            document.getElementById(tab.dataset.tab).style.display = 'block';
            hideAiCharacterForm(); hideUserPersonaForm();
        });
    });
    if (createNewAiCharacterButton) createNewAiCharacterButton.addEventListener('click', () => showAiCharacterForm());
    if (editSelectedAiCharacterButton) editSelectedAiCharacterButton.addEventListener('click', () => {
        const selectedId = aiCharacterSelect.value;
        const charToEdit = aiCharacters.find(c => c.id === selectedId);
        if (charToEdit) showAiCharacterForm(charToEdit); else alert("Select AI character to edit.");
    });
    if (deleteSelectedAiCharacterButton) deleteSelectedAiCharacterButton.addEventListener('click', deleteSelectedAiCharacter);
    if (saveAiCharacterButton) saveAiCharacterButton.addEventListener('click', handleAiCharacterFormSubmit);
    if (cancelAiCharacterButton) cancelAiCharacterButton.addEventListener('click', hideAiCharacterForm);
    if (aiCharacterSelect) aiCharacterSelect.addEventListener('change', (e) => {
        setActiveAiCharacter(e.target.value); hideAiCharacterForm();
    });
    if (createNewUserPersonaButton) createNewUserPersonaButton.addEventListener('click', () => showUserPersonaForm());
    if (editSelectedUserPersonaButton) editSelectedUserPersonaButton.addEventListener('click', () => {
        const selectedId = userPersonaSelect.value;
        const personaToEdit = userPersonas.find(p => p.id === selectedId);
        if (personaToEdit) showUserPersonaForm(personaToEdit); else alert("Select user persona to edit.");
    });
    if (deleteSelectedUserPersonaButton) deleteSelectedUserPersonaButton.addEventListener('click', deleteSelectedUserPersona);
    if (saveUserPersonaButton) saveUserPersonaButton.addEventListener('click', handleUserPersonaFormSubmit);
    if (cancelUserPersonaButton) cancelUserPersonaButton.addEventListener('click', hideUserPersonaForm);
    if (userPersonaSelect) userPersonaSelect.addEventListener('change', (e) => {
        setActiveUserPersona(e.target.value || null); hideUserPersonaForm();
    });
    if (viewContextButton) viewContextButton.addEventListener('click', showContextModal);
    if (contextModalCloseButton) contextModalCloseButton.addEventListener('click', () => closeModal(contextModal));
    if (contextModal) contextModal.addEventListener('click', (event) => {
        if (event.target === contextModal) closeModal(contextModal);
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.message-actions-trigger') && !e.target.closest('.message-actions-menu')) {
            closeAllActionMenus();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);