// ===================================================
// ReadBuddy - Main Application Logic
// ===================================================

(function () {
  "use strict";

  // --- State ---
  const state = {
    currentScreen: "topics",
    currentTopic: null,
    currentStory: null,
    xp: parseInt(localStorage.getItem("rb_xp") || "0"),
    level: parseInt(localStorage.getItem("rb_level") || "1"),
    storiesRead: JSON.parse(localStorage.getItem("rb_read") || "[]"),
    quizAnswered: 0,
    quizCorrect: 0,
    isSpeaking: false,
    speechUtterance: null,
    recognition: null,
    rulerEnabled: true,
    syllableMode: false,
    settings: JSON.parse(localStorage.getItem("rb_settings") || "null") || {
      fontSize: 24,
      letterSpacing: 3,
      wordSpacing: 4,
      lineHeight: 22,
      speed: 8,
      bgColor: "#FFF8E7",
      rulerEnabled: true,
      syllableMode: false,
      apiKey: (typeof READBUDDY_CONFIG !== "undefined" && READBUDDY_CONFIG.apiKey) || "",
      apiProvider: (typeof READBUDDY_CONFIG !== "undefined" && READBUDDY_CONFIG.apiProvider) || "openai"
    },
    generatedStories: JSON.parse(localStorage.getItem("rb_generated") || "{}"),
    readingMode: "normal",
    practiceRecognition: null,
    practiceListening: false,
    practiceWords: [],
    practiceLines: [],
    wordIndex: 0,
    lineIndex: 0,
    practiceAttempts: 0,
    practiceTimers: [],
    helpInProgress: false
  };

  // --- DOM Refs ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const screens = {
    topics: $("#screen-topics"),
    stories: $("#screen-stories"),
    reader: $("#screen-reader"),
    quiz: $("#screen-quiz"),
  };

  // --- Init ---
  function init() {
    buildTopicGrid();
    setupNavigation();
    setupSettings();
    setupVoice();
    setupRuler();
    applySettings();
    updateXPDisplay();
    addAPISettingsUI();
    setupModeSelector();
  }

  // --- XP & Gamification ---
  function addXP(amount) {
    state.xp += amount;
    const xpForNext = state.level * 50;
    if (state.xp >= xpForNext) {
      state.xp -= xpForNext;
      state.level++;
      showLevelUp();
    }
    localStorage.setItem("rb_xp", state.xp);
    localStorage.setItem("rb_level", state.level);
    updateXPDisplay();
    showXPPopup(amount);
  }

  function updateXPDisplay() {
    let xpEl = $(".xp-display");
    let streakEl = $(".streak-display");

    if (!xpEl) {
      xpEl = document.createElement("div");
      xpEl.className = "xp-display";
      $(".top-actions").prepend(xpEl);
    }
    if (!streakEl) {
      streakEl = document.createElement("div");
      streakEl.className = "streak-display";
      $(".top-actions").prepend(streakEl);
    }

    const xpForNext = state.level * 50;
    xpEl.innerHTML = `<span class="xp-icon">⚡</span> ${state.xp}/${xpForNext} XP`;
    streakEl.innerHTML = `⭐ Level ${state.level}`;
  }

  function showXPPopup(amount) {
    const popup = document.createElement("div");
    popup.className = "xp-popup";
    popup.textContent = `+${amount} XP`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1600);
  }

  function showLevelUp() {
    const overlay = document.createElement("div");
    overlay.className = "level-up-overlay";
    overlay.innerHTML = `
      <div class="level-up-card">
        <span class="level-star">🌟</span>
        <div class="level-text">Level ${state.level}!</div>
        <div class="level-sub">You are an amazing reader!</div>
        <button class="primary-btn" onclick="this.closest('.level-up-overlay').remove()">Keep Going!</button>
      </div>
    `;
    document.body.appendChild(overlay);
    launchConfetti();
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 6000);
  }

  function launchConfetti() {
    const container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);

    const colors = ["#58CC02", "#1CB0F6", "#FF9600", "#FF4B4B", "#CE82FF", "#FFC800"];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 1.5 + "s";
      piece.style.animationDuration = (2 + Math.random() * 2) + "s";
      const shapes = ["50%", "0%", "4px"];
      piece.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
      piece.style.width = (8 + Math.random() * 10) + "px";
      piece.style.height = (8 + Math.random() * 10) + "px";
      container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 4000);
  }

  // --- Topic Grid ---
  function buildTopicGrid() {
    const grid = $("#topic-grid");
    grid.innerHTML = "";
    TOPICS.forEach((topic) => {
      const card = document.createElement("div");
      card.className = "topic-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", topic.label);

      const readCount = state.storiesRead.filter(
        (id) => id.startsWith(topic.id + ":")
      ).length;
      const totalForTopic = STORIES.filter(
        (s) => s.topic === topic.id
      ).length;
      const generatedForTopic = Object.keys(state.generatedStories).filter(
        (k) => k.startsWith(topic.id + ":")
      ).length;

      card.innerHTML = `
        <span class="topic-icon">${topic.icon}</span>
        <span class="topic-label">${topic.label}</span>
        ${readCount > 0 ? `<span class="topic-badge">${readCount}</span>` : ""}
      `;

      card.addEventListener("click", () => selectTopic(topic.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectTopic(topic.id);
        }
      });
      grid.appendChild(card);
    });
  }

  // --- Navigation ---
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
    state.currentScreen = name;
    window.scrollTo(0, 0);
  }

  function setupNavigation() {
    $("#back-to-topics").addEventListener("click", () => {
      stopSpeaking();
      cleanupPracticeMode();
      showScreen("topics");
    });
    $("#back-to-stories").addEventListener("click", () => {
      stopSpeaking();
      cleanupPracticeMode();
      showScreen("stories");
    });
    $("#quiz-done-btn").addEventListener("click", () => {
      showScreen("stories");
    });

    // Text input for topics
    const topicInput = $("#topic-input");
    const topicGoBtn = $("#topic-go-btn");

    const submitTopic = () => {
      const val = topicInput.value.trim();
      if (val) {
        handleVoiceTopic(val);
        topicInput.value = "";
      }
    };

    topicGoBtn.addEventListener("click", submitTopic);
    topicInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitTopic();
    });

    // Take quiz button in reader
    $("#take-quiz-btn").addEventListener("click", () => {
      if (state.currentStory && state.currentStory.quiz) {
        stopSpeaking();
        showQuiz(state.currentStory);
      }
    });
  }

  // --- Topic Selection ---
  function selectTopic(topicId) {
    state.currentTopic = topicId;
    const topicMeta = TOPICS.find((t) => t.id === topicId);
    const topicLabel = topicMeta ? topicMeta.label : topicId;
    $("#stories-heading").textContent = `${topicMeta ? topicMeta.icon : "📖"} ${topicLabel} Stories`;

    const stories = STORIES.filter((s) => s.topic === topicId);

    // Check for generated stories for this topic
    const generatedKeys = Object.keys(state.generatedStories).filter(
      (k) => k.startsWith(topicId + ":")
    );
    const generatedStories = generatedKeys.map((k) => state.generatedStories[k]);

    renderStoryList([...stories, ...generatedStories], topicId, topicLabel);
    showScreen("stories");
  }

  function renderStoryList(stories, topicId, topicLabel) {
    const list = $("#story-list");
    list.innerHTML = "";

    if (stories.length === 0 && !hasAPIKey()) {
      // No pre-built stories and no API key
      list.innerHTML = `
        <div style="text-align:center;padding:40px 20px;">
          <p style="font-size:20px;margin-bottom:16px;font-weight:600;">No stories yet for "${topicLabel}"</p>
          <p style="font-size:16px;color:var(--text-light);margin-bottom:24px;">
            Add an AI key in Settings to create stories about anything!
          </p>
          <button class="primary-btn" onclick="document.getElementById('open-settings').click()">Open Settings</button>
        </div>
      `;
    }

    stories.forEach((story, idx) => {
      const storyId = story.id || `${story.topic}:${idx}`;
      const isRead = state.storiesRead.includes(storyId);

      const card = document.createElement("div");
      card.className = "story-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.innerHTML = `
        <span class="story-icon">${story.icon || "📖"}</span>
        <div class="story-info">
          <div class="story-title">${story.title}</div>
          <div class="story-preview">${story.content[0]}</div>
        </div>
        <div class="story-status ${isRead ? "completed" : "unread"}">
          ${isRead ? "✓" : "▸"}
        </div>
      `;

      card.addEventListener("click", () => {
        story._id = storyId;
        openReader(story);
      });
      list.appendChild(card);
    });

    // Add "Generate New Story" button if API key is set or even as a prompt
    const genBtn = document.createElement("div");
    genBtn.className = "story-card";
    genBtn.style.borderStyle = "dashed";
    genBtn.style.justifyContent = "center";
    genBtn.innerHTML = `
      <span class="story-icon">✨</span>
      <div class="story-info">
        <div class="story-title">Make a New Story!</div>
        <div class="story-preview">Create a brand new story about ${topicLabel}</div>
      </div>
    `;
    genBtn.addEventListener("click", () => generateStory(topicId, topicLabel));
    list.appendChild(genBtn);
  }

  // --- Story Generation ---
  async function generateStory(topicId, topicLabel) {
    if (!hasAPIKey()) {
      // Show a prompt to add API key
      const overlay = document.createElement("div");
      overlay.className = "level-up-overlay";
      overlay.innerHTML = `
        <div class="level-up-card">
          <span class="level-star">🔑</span>
          <div class="level-text" style="font-size:22px;">Set Up Story Maker</div>
          <div class="level-sub" style="font-size:15px;line-height:1.5;">
            To create stories about anything, a parent needs to add an API key in Settings.<br><br>
            This uses OpenAI or Anthropic to write custom stories.
          </div>
          <button class="primary-btn" style="margin-right:8px;" onclick="document.getElementById('open-settings').click(); this.closest('.level-up-overlay').remove();">Open Settings</button>
          <button class="primary-btn" style="background:var(--border);color:var(--text);box-shadow:0 4px 0 #ccc;margin-top:8px;" onclick="this.closest('.level-up-overlay').remove();">Cancel</button>
        </div>
      `;
      document.body.appendChild(overlay);
      return;
    }

    // Show loading state
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "level-up-overlay";
    loadingOverlay.innerHTML = `
      <div class="level-up-card">
        <span class="level-star" style="animation: bounce-subtle 1s ease-in-out infinite;">✨</span>
        <div class="level-text" style="font-size:22px;">Writing your story...</div>
        <div class="level-sub">About ${topicLabel}</div>
      </div>
    `;
    document.body.appendChild(loadingOverlay);

    try {
      const story = await callAI(topicLabel);
      if (story) {
        const storyKey = `${topicId}:gen_${Date.now()}`;
        story.topic = topicId;
        story.id = storyKey;
        story.icon = TOPICS.find((t) => t.id === topicId)?.icon || "📖";

        state.generatedStories[storyKey] = story;
        localStorage.setItem("rb_generated", JSON.stringify(state.generatedStories));

        loadingOverlay.remove();

        // Refresh story list
        selectTopic(topicId);
        // Automatically open the new story
        story._id = storyKey;
        openReader(story);
      }
    } catch (err) {
      console.error("Story generation error:", err);
      loadingOverlay.querySelector(".level-text").textContent = "Oops!";
      loadingOverlay.querySelector(".level-sub").textContent =
        "Could not create the story. Check your API key in Settings.";
      const closeBtn = document.createElement("button");
      closeBtn.className = "primary-btn";
      closeBtn.textContent = "OK";
      closeBtn.style.marginTop = "16px";
      closeBtn.onclick = () => loadingOverlay.remove();
      loadingOverlay.querySelector(".level-up-card").appendChild(closeBtn);
    }
  }

  async function callAI(topicLabel) {
    const provider = state.settings.apiProvider || "openai";
    const apiKey = state.settings.apiKey;

    const systemPrompt = `You are a children's reading content creator specializing in materials for children with dyslexia. Create a short reading passage for a 3rd grader reading at a 2nd grade level.

Rules:
- Use simple, common words (2nd grade reading level)
- Keep sentences SHORT (5-10 words each)
- Use 4 short paragraphs (2-3 sentences each)
- Avoid complex or multi-syllable words when possible
- Make it fun, engaging, and age-appropriate
- Be factually accurate when discussing real people/things

Respond in this exact JSON format:
{
  "title": "Story Title Here",
  "content": ["Paragraph 1 text.", "Paragraph 2 text.", "Paragraph 3 text.", "Paragraph 4 text."],
  "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
  "quiz": [
    {"q": "Question 1?", "choices": ["A", "B", "C"], "answer": 0},
    {"q": "Question 2?", "choices": ["A", "B", "C"], "answer": 1},
    {"q": "Question 3?", "choices": ["A", "B", "C"], "answer": 2}
  ]
}

The "words" array should contain 8 key vocabulary words from the passage.
The "quiz" array should have 3 simple comprehension questions with 3 choices each. "answer" is the 0-based index of the correct choice.`;

    const userPrompt = `Write a fun reading passage about: ${topicLabel}`;

    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;
      return parseStoryJSON(text);
    } else if (provider === "anthropic") {
      // Anthropic API - using proxy approach since direct CORS isn't supported
      // Users would need to set up a simple proxy or use the API through a backend
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content[0].text;
      return parseStoryJSON(text);
    }
  }

  function parseStoryJSON(text) {
    // Extract JSON from the response (might be wrapped in markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    // Try to find JSON object
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      jsonStr = objMatch[0];
    }
    const parsed = JSON.parse(jsonStr);
    return {
      title: parsed.title,
      content: parsed.content,
      words: parsed.words,
      quiz: parsed.quiz,
    };
  }

  function hasAPIKey() {
    return state.settings.apiKey && state.settings.apiKey.trim().length > 0;
  }

  // --- Add API Settings UI ---
  function addAPISettingsUI() {
    const settingsBody = $(".settings-body");

    const divider = document.createElement("div");
    divider.style.cssText =
      "border-top:2px solid var(--border);padding-top:20px;margin-top:4px;";
    divider.innerHTML = `
      <div style="font-size:13px;font-weight:700;color:var(--text-light);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">
        🔑 Story Generator (Parent Setup)
      </div>
      <div class="setting-group">
        <label for="api-provider">AI Provider</label>
        <select id="api-provider" style="padding:10px;border-radius:8px;border:2px solid var(--border);font-family:inherit;font-size:15px;background:white;">
          <option value="openai" ${state.settings.apiProvider === "openai" ? "selected" : ""}>OpenAI</option>
          <option value="anthropic" ${state.settings.apiProvider === "anthropic" ? "selected" : ""}>Anthropic (Claude)</option>
        </select>
      </div>
      <div class="setting-group" style="margin-top:12px;">
        <label for="api-key-input">API Key</label>
        <input type="password" id="api-key-input" placeholder="Paste API key here"
          value="${state.settings.apiKey || ""}"
          style="padding:10px;border-radius:8px;border:2px solid var(--border);font-family:inherit;font-size:15px;width:100%;">
        <span style="font-size:12px;color:var(--text-light);line-height:1.4;">
          This lets your child create stories about any topic they want. Your key stays on this device only.
        </span>
      </div>
    `;

    settingsBody.appendChild(divider);

    // Event listeners for API settings
    setTimeout(() => {
      const providerEl = $("#api-provider");
      const keyEl = $("#api-key-input");

      if (providerEl) {
        providerEl.addEventListener("change", (e) => {
          state.settings.apiProvider = e.target.value;
          saveSettings();
        });
      }
      if (keyEl) {
        keyEl.addEventListener("input", (e) => {
          state.settings.apiKey = e.target.value;
          saveSettings();
        });
      }
    }, 0);
  }

  // --- Voice Input / Topic via Speech ---
  function setupVoice() {
    const voiceBtn = $("#voice-btn");
    const voiceStatus = $("#voice-status");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      voiceBtn.style.display = "none";
      voiceStatus.textContent = "Voice input not available in this browser.";
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    state.recognition = recognition;

    let isListening = false;

    voiceBtn.addEventListener("click", () => {
      if (isListening) {
        recognition.stop();
        return;
      }
      isListening = true;
      voiceBtn.classList.add("listening");
      voiceStatus.textContent = "";
      voiceStatus.classList.remove("heard");
      recognition.start();
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      voiceStatus.textContent = `"${transcript}"`;
      voiceStatus.classList.add("heard");

      if (event.results[0].isFinal) {
        handleVoiceTopic(transcript.trim());
      }
    };

    recognition.onend = () => {
      isListening = false;
      voiceBtn.classList.remove("listening");
    };

    recognition.onerror = (event) => {
      isListening = false;
      voiceBtn.classList.remove("listening");
      if (event.error === "no-speech") {
        voiceStatus.textContent = "I didn't hear anything. Try again!";
      } else if (event.error !== "aborted") {
        voiceStatus.textContent = "Could not hear you. Try again!";
      }
    };
  }

  function handleVoiceTopic(transcript) {
    const lower = transcript.toLowerCase();

    // Try to match a known topic
    const matchedTopic = TOPICS.find((t) => {
      const label = t.label.toLowerCase();
      const id = t.id.toLowerCase();
      return lower.includes(label) || lower.includes(id);
    });

    if (matchedTopic) {
      selectTopic(matchedTopic.id);
      return;
    }

    // If no match, create/use this as a custom topic
    handleCustomTopic(transcript);
  }

  function handleCustomTopic(topicName) {
    // Create a custom topic entry if it doesn't exist
    const topicId = topicName.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

    // Check if topic already exists in TOPICS
    if (!TOPICS.find((t) => t.id === topicId)) {
      TOPICS.push({
        id: topicId,
        label: topicName,
        icon: "✨",
        color: "#9C27B0",
      });
      buildTopicGrid();
    }

    // Select and try to generate
    state.currentTopic = topicId;
    const topicLabel = topicName;
    $("#stories-heading").textContent = `✨ ${topicLabel} Stories`;

    // Check for existing generated stories
    const generatedKeys = Object.keys(state.generatedStories).filter(
      (k) => k.startsWith(topicId + ":")
    );
    const generatedStories = generatedKeys.map(
      (k) => state.generatedStories[k]
    );

    renderStoryList(generatedStories, topicId, topicLabel);
    showScreen("stories");

    // Auto-generate if API key is present and no stories yet
    if (generatedStories.length === 0 && hasAPIKey()) {
      generateStory(topicId, topicLabel);
    }
  }

  // --- Reader ---
  function openReader(story) {
    state.currentStory = story;
    stopSpeaking();

    $("#reader-title").textContent = story.title;

    // Build reader body with word spans
    const body = $("#reader-body");
    body.innerHTML = "";

    story.content.forEach((para, pIdx) => {
      const pEl = document.createElement("div");
      pEl.className = "paragraph";
      pEl.dataset.pindex = pIdx;

      const words = para.split(/(\s+)/);
      words.forEach((w) => {
        if (/^\s+$/.test(w)) {
          pEl.appendChild(document.createTextNode(w));
        } else {
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = w;

          // Syllable data
          if (state.syllableMode) {
            const syllDiv = document.createElement("span");
            syllDiv.className = "syllables";
            syllDiv.textContent = syllabify(w);
            span.appendChild(syllDiv);
          }

          // Click to hear word
          span.addEventListener("click", () => speakWord(span, w));
          pEl.appendChild(span);
        }
      });

      body.appendChild(pEl);
    });

    // Word bank
    const bankList = $("#word-bank-list");
    bankList.innerHTML = "";
    (story.words || []).forEach((w) => {
      const chip = document.createElement("span");
      chip.className = "word-chip";
      chip.textContent = w;
      chip.addEventListener("click", () => {
        chip.classList.add("speaking");
        speakText(w, () => chip.classList.remove("speaking"));
      });
      bankList.appendChild(chip);
    });

    // Setup read aloud
    setupReadAloud(story);

    // Reset reading mode to normal
    resetMode();

    // Mark as read
    const storyId = story._id || `${story.topic}:0`;
    if (!state.storiesRead.includes(storyId)) {
      state.storiesRead.push(storyId);
      localStorage.setItem("rb_read", JSON.stringify(state.storiesRead));
      addXP(10);
      buildTopicGrid(); // refresh badges
    }

    showScreen("reader");
  }

  // --- Text-to-Speech ---
  function setupReadAloud(story) {
    const readBtn = $("#read-aloud-btn");
    const stopBtn = $("#stop-btn");

    // Remove old listeners
    const newReadBtn = readBtn.cloneNode(true);
    readBtn.parentNode.replaceChild(newReadBtn, readBtn);
    const newStopBtn = stopBtn.cloneNode(true);
    stopBtn.parentNode.replaceChild(newStopBtn, stopBtn);

    newReadBtn.addEventListener("click", () => {
      readStoryAloud(story);
      newReadBtn.classList.add("hidden");
      newStopBtn.classList.remove("hidden");
    });

    newStopBtn.addEventListener("click", () => {
      stopSpeaking();
      newStopBtn.classList.add("hidden");
      newReadBtn.classList.remove("hidden");
    });
  }

  function readStoryAloud(story) {
    if (state.isSpeaking) stopSpeaking();

    const fullText = story.content.join(" ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "en-US";

    // Map speed slider (5-15) to rate (0.6 - 1.2)
    const speedVal = state.settings.speed;
    utterance.rate = 0.4 + (speedVal - 5) * 0.08;
    utterance.pitch = 1.0;

    // Try to find a good voice
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Samantha") ||
          v.name.includes("Google") ||
          v.name.includes("Natural") ||
          v.name.includes("Female"))
    );
    if (preferred) utterance.voice = preferred;

    // Word boundary highlighting
    const allWords = $$("#reader-body .word");
    let wordIndex = 0;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        // Clear previous highlights
        allWords.forEach((w) => w.classList.remove("spoken"));

        // Find matching word
        if (wordIndex < allWords.length) {
          allWords[wordIndex].classList.add("spoken");

          // Highlight active paragraph
          const para = allWords[wordIndex].closest(".paragraph");
          $$(".paragraph").forEach((p) =>
            p.classList.remove("active-paragraph")
          );
          if (para) para.classList.add("active-paragraph");

          // Scroll into view
          allWords[wordIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          wordIndex++;
        }
      }
    };

    utterance.onend = () => {
      state.isSpeaking = false;
      allWords.forEach((w) => w.classList.remove("spoken"));
      $$(".paragraph").forEach((p) => p.classList.remove("active-paragraph"));

      const readBtn = $("#read-aloud-btn");
      const stopBtn = $("#stop-btn");
      if (stopBtn) stopBtn.classList.add("hidden");
      if (readBtn) readBtn.classList.remove("hidden");

      // After reading, show quiz (only in normal mode)
      if (story.quiz && story.quiz.length > 0 && state.readingMode === "normal") {
        setTimeout(() => showQuiz(story), 800);
      }
    };

    state.isSpeaking = true;
    state.speechUtterance = utterance;
    speechSynthesis.speak(utterance);
  }

  function speakWord(span, word) {
    const cleanWord = word.replace(/[^a-zA-Z'-]/g, "");
    if (!cleanWord) return;

    // Visual feedback
    span.classList.add("highlight");
    setTimeout(() => span.classList.remove("highlight"), 600);

    speakText(cleanWord);
  }

  function speakText(text, onEnd) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    if (onEnd) utterance.onend = onEnd;
    speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    speechSynthesis.cancel();
    state.isSpeaking = false;
    $$(".word").forEach((w) => {
      w.classList.remove("spoken");
      w.classList.remove("highlight");
    });
    $$(".paragraph").forEach((p) => p.classList.remove("active-paragraph"));
  }

  // --- Quiz ---
  function showQuiz(story) {
    if (!story.quiz || story.quiz.length === 0) return;

    state.quizAnswered = 0;
    state.quizCorrect = 0;

    const body = $("#quiz-body");
    body.innerHTML = "";

    story.quiz.forEach((q, idx) => {
      const qEl = document.createElement("div");
      qEl.className = "quiz-question";
      qEl.innerHTML = `
        <span class="q-number">${idx + 1}</span>
        <div class="q-text">${q.q}</div>
        <div class="quiz-choices">
          ${q.choices
            .map(
              (c, cIdx) => `
            <button class="quiz-choice" data-qidx="${idx}" data-cidx="${cIdx}">${c}</button>
          `
            )
            .join("")}
        </div>
      `;
      body.appendChild(qEl);
    });

    // Add click handlers
    $$(".quiz-choice").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const qIdx = parseInt(btn.dataset.qidx);
        const cIdx = parseInt(btn.dataset.cidx);
        handleQuizAnswer(story, qIdx, cIdx, btn);
      });
    });

    $("#quiz-result").classList.add("hidden");
    $("#quiz-done-btn").classList.add("hidden");
    showScreen("quiz");
  }

  function handleQuizAnswer(story, qIdx, cIdx, clickedBtn) {
    const question = story.quiz[qIdx];
    const allChoices = clickedBtn
      .closest(".quiz-choices")
      .querySelectorAll(".quiz-choice");

    // Disable all choices for this question
    allChoices.forEach((c) => c.classList.add("disabled"));

    if (cIdx === question.answer) {
      clickedBtn.classList.add("correct");
      state.quizCorrect++;
      // Fun feedback
      const feedback = document.createElement("div");
      feedback.className = "word-tap-feedback";
      feedback.textContent = "⭐";
      feedback.style.left = clickedBtn.getBoundingClientRect().right + "px";
      feedback.style.top = clickedBtn.getBoundingClientRect().top + "px";
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 900);
    } else {
      clickedBtn.classList.add("incorrect");
      // Show correct answer
      allChoices[question.answer].classList.add("correct");
    }

    state.quizAnswered++;

    // Check if all answered
    if (state.quizAnswered === story.quiz.length) {
      setTimeout(() => finishQuiz(story), 800);
    }
  }

  function finishQuiz(story) {
    const result = $("#quiz-result");
    const total = story.quiz.length;
    const correct = state.quizCorrect;
    const pct = correct / total;

    let xpEarned = correct * 5;
    let icon, message, cls;

    if (pct === 1) {
      icon = "🏆";
      message = "Perfect! You got them all right!";
      cls = "great";
      xpEarned += 10;
      launchConfetti();
    } else if (pct >= 0.5) {
      icon = "👍";
      message = `Great job! You got ${correct} out of ${total}!`;
      cls = "good";
    } else {
      icon = "💪";
      message = `You got ${correct} out of ${total}. Keep trying!`;
      cls = "try-again";
    }

    result.className = `quiz-result ${cls}`;
    result.innerHTML = `
      <span class="result-icon">${icon}</span>
      <div>${message}</div>
      <div class="result-xp">+${xpEarned} XP</div>
    `;
    result.classList.remove("hidden");
    $("#quiz-done-btn").classList.remove("hidden");

    addXP(xpEarned);
  }

  // --- Reading Ruler ---
  function setupRuler() {
    const ruler = $("#reading-ruler");

    document.addEventListener("mousemove", (e) => {
      if (state.settings.rulerEnabled && state.currentScreen === "reader") {
        ruler.classList.add("active");
        ruler.style.top = e.clientY - 30 + "px";
      } else {
        ruler.classList.remove("active");
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (state.settings.rulerEnabled && state.currentScreen === "reader") {
        const touch = e.touches[0];
        ruler.classList.add("active");
        ruler.style.top = touch.clientY - 30 + "px";
      }
    });

    // Hide ruler when leaving reader
    document.addEventListener("click", () => {
      if (state.currentScreen !== "reader") {
        ruler.classList.remove("active");
      }
    });
  }

  // --- Syllable Breakdown (simple heuristic) ---
  function syllabify(word) {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (clean.length <= 2) return clean;

    const vowels = "aeiouy";
    const syllables = [];
    let current = "";

    for (let i = 0; i < clean.length; i++) {
      current += clean[i];
      const isVowel = vowels.includes(clean[i]);
      const nextIsVowel =
        i + 1 < clean.length && vowels.includes(clean[i + 1]);
      const nextIsConsonant =
        i + 1 < clean.length && !vowels.includes(clean[i + 1]);

      if (isVowel && nextIsConsonant && i + 2 < clean.length) {
        // Check if we should break after the consonant
        const afterNext =
          i + 2 < clean.length && vowels.includes(clean[i + 2]);
        if (afterNext && current.length > 1) {
          syllables.push(current);
          current = "";
        }
      }
    }

    if (current) syllables.push(current);

    // If only one syllable found, return as-is
    if (syllables.length <= 1) return clean;

    return syllables.join(" · ");
  }

  // --- Settings ---
  function setupSettings() {
    const panel = $("#settings-panel");
    const overlay = $("#settings-overlay");
    const openBtn = $("#open-settings");
    const closeBtn = $("#close-settings");

    openBtn.addEventListener("click", () => {
      panel.classList.add("active");
      overlay.classList.add("active");
    });

    const closeSettings = () => {
      panel.classList.remove("active");
      overlay.classList.remove("active");
    };

    closeBtn.addEventListener("click", closeSettings);
    overlay.addEventListener("click", closeSettings);

    // Font size
    $("#font-size-slider").addEventListener("input", (e) => {
      state.settings.fontSize = parseInt(e.target.value);
      $("#font-size-value").textContent = e.target.value + "px";
      applySettings();
      saveSettings();
    });

    // Letter spacing
    $("#letter-spacing-slider").addEventListener("input", (e) => {
      state.settings.letterSpacing = parseInt(e.target.value);
      const em = (parseInt(e.target.value) * 0.04).toFixed(2);
      $("#letter-spacing-value").textContent = em + "em";
      applySettings();
      saveSettings();
    });

    // Word spacing
    $("#word-spacing-slider").addEventListener("input", (e) => {
      state.settings.wordSpacing = parseInt(e.target.value);
      const em = (parseInt(e.target.value) * 0.04).toFixed(2);
      $("#word-spacing-value").textContent = em + "em";
      applySettings();
      saveSettings();
    });

    // Line height
    $("#line-height-slider").addEventListener("input", (e) => {
      state.settings.lineHeight = parseInt(e.target.value);
      const val = (parseInt(e.target.value) / 10).toFixed(1);
      $("#line-height-value").textContent = val;
      applySettings();
      saveSettings();
    });

    // Speed
    $("#speed-slider").addEventListener("input", (e) => {
      state.settings.speed = parseInt(e.target.value);
      const labels = {
        5: "Very Slow",
        6: "Very Slow",
        7: "Slow",
        8: "Slow",
        9: "Normal",
        10: "Normal",
        11: "Normal",
        12: "Fast",
        13: "Fast",
        14: "Very Fast",
        15: "Very Fast",
      };
      $("#speed-value").textContent = labels[e.target.value] || "Normal";
      saveSettings();
    });

    // Background color
    $$(".color-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".color-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.settings.bgColor = btn.dataset.color;
        applySettings();
        saveSettings();
      });
    });

    // Ruler toggle
    $("#ruler-toggle").addEventListener("change", (e) => {
      state.settings.rulerEnabled = e.target.checked;
      if (!e.target.checked) {
        $("#reading-ruler").classList.remove("active");
      }
      saveSettings();
    });

    // Syllable toggle
    $("#syllable-toggle").addEventListener("change", (e) => {
      state.settings.syllableMode = e.target.checked;
      state.syllableMode = e.target.checked;
      if (e.target.checked) {
        document.body.classList.add("syllable-mode");
      } else {
        document.body.classList.remove("syllable-mode");
      }
      saveSettings();
    });

    // Restore saved settings to UI
    const s = state.settings;
    $("#font-size-slider").value = s.fontSize;
    $("#font-size-value").textContent = s.fontSize + "px";
    $("#letter-spacing-slider").value = s.letterSpacing;
    $("#letter-spacing-value").textContent =
      (s.letterSpacing * 0.04).toFixed(2) + "em";
    $("#word-spacing-slider").value = s.wordSpacing;
    $("#word-spacing-value").textContent =
      (s.wordSpacing * 0.04).toFixed(2) + "em";
    $("#line-height-slider").value = s.lineHeight;
    $("#line-height-value").textContent = (s.lineHeight / 10).toFixed(1);
    $("#speed-slider").value = s.speed;
    $("#ruler-toggle").checked = s.rulerEnabled;
    $("#syllable-toggle").checked = s.syllableMode;

    if (s.syllableMode) document.body.classList.add("syllable-mode");

    // Set active color
    $$(".color-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.color === s.bgColor);
    });
  }

  function applySettings() {
    const s = state.settings;
    const root = document.documentElement;

    root.style.setProperty("--font-size", s.fontSize + "px");
    root.style.setProperty(
      "--letter-spacing",
      (s.letterSpacing * 0.04).toFixed(2) + "em"
    );
    root.style.setProperty(
      "--word-spacing",
      (s.wordSpacing * 0.04).toFixed(2) + "em"
    );
    root.style.setProperty("--line-height", (s.lineHeight / 10).toFixed(1));
    root.style.setProperty("--bg", s.bgColor);
  }

  function saveSettings() {
    localStorage.setItem("rb_settings", JSON.stringify(state.settings));
  }

  // --- Fuzzy Pronunciation Matching ---
  function levenshteinDistance(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  function normalizeWord(w) {
    return w.replace(/[^a-z']/gi, "").toLowerCase();
  }

  function fuzzyWordMatch(spoken, target) {
    const s = normalizeWord(spoken);
    const t = normalizeWord(target);
    if (!s || !t) return false;
    if (s === t) return true;

    // Check similarity ratio
    const dist = levenshteinDistance(s, t);
    const maxLen = Math.max(s.length, t.length);
    const similarity = 1 - dist / maxLen;

    // Generous threshold for dyslexia
    const threshold = t.length <= 4 ? 0.55 : 0.5;
    if (similarity >= threshold) return true;

    // Common dyslexia letter swaps
    const dyslexiaSwaps = [
      [/b/g, "d"], [/d/g, "b"],
      [/p/g, "q"], [/q/g, "p"],
      [/m/g, "w"], [/w/g, "m"],
      [/n/g, "u"], [/u/g, "n"],
      [/th/g, "f"], [/f/g, "th"],
    ];

    for (const [from, to] of dyslexiaSwaps) {
      const swapped = s.replace(from, to);
      if (swapped === t) return true;
    }

    // Check if spoken words contain the target
    const spokenWords = spoken.toLowerCase().split(/\s+/);
    for (const sw of spokenWords) {
      const ns = normalizeWord(sw);
      if (ns === t) return true;
      const d = levenshteinDistance(ns, t);
      if (1 - d / Math.max(ns.length, t.length) >= 0.6) return true;
    }

    return false;
  }

  function fuzzyLineMatch(spoken, targetWords) {
    const spokenWords = spoken.toLowerCase().split(/\s+/).map(normalizeWord).filter(Boolean);
    const targets = targetWords.map(normalizeWord).filter(Boolean);

    if (targets.length === 0) return true;

    let matched = 0;
    const usedSpoken = new Set();

    for (const t of targets) {
      for (let i = 0; i < spokenWords.length; i++) {
        if (usedSpoken.has(i)) continue;
        if (fuzzyWordMatch(spokenWords[i], t)) {
          matched++;
          usedSpoken.add(i);
          break;
        }
      }
    }

    // 65% of target words matched is a pass
    return matched / targets.length >= 0.65;
  }

  // --- Mode Selector ---
  function setupModeSelector() {
    $$(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        switchMode(mode);
      });
    });
  }

  function switchMode(mode) {
    state.readingMode = mode;

    // Update UI buttons
    $$(".mode-btn").forEach((b) => b.classList.remove("active"));
    const activeBtn = $(`.mode-btn[data-mode="${mode}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    // Clean up previous mode
    cleanupPracticeMode();

    const readerBody = $("#reader-body");
    readerBody.classList.remove("mode-word", "mode-line");

    // Show/hide appropriate controls
    const readAloudBtn = $("#read-aloud-btn");
    const stopBtn = $("#stop-btn");
    const practiceProgress = $("#practice-progress");
    const practiceStatus = $("#practice-status");
    const wordBank = $("#word-bank");

    if (mode === "normal") {
      readAloudBtn.classList.remove("hidden");
      practiceProgress.classList.add("hidden");
      practiceStatus.classList.add("hidden");
      wordBank.classList.remove("hidden");
      if (state.currentStory) rebuildReaderBody(state.currentStory);
    } else if (mode === "word") {
      stopSpeaking();
      readAloudBtn.classList.add("hidden");
      stopBtn.classList.add("hidden");
      practiceProgress.classList.remove("hidden");
      practiceStatus.classList.remove("hidden");
      wordBank.classList.add("hidden");
      readerBody.classList.add("mode-word");
      initWordMode();
    } else if (mode === "line") {
      stopSpeaking();
      readAloudBtn.classList.add("hidden");
      stopBtn.classList.add("hidden");
      practiceProgress.classList.remove("hidden");
      practiceStatus.classList.remove("hidden");
      wordBank.classList.add("hidden");
      readerBody.classList.add("mode-line");
      initLineMode();
    }
  }

  function rebuildReaderBody(story) {
    const body = $("#reader-body");
    body.innerHTML = "";

    story.content.forEach((para, pIdx) => {
      const pEl = document.createElement("div");
      pEl.className = "paragraph";
      pEl.dataset.pindex = pIdx;

      const words = para.split(/(\s+)/);
      words.forEach((w) => {
        if (/^\s+$/.test(w)) {
          pEl.appendChild(document.createTextNode(w));
        } else {
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = w;
          if (state.syllableMode) {
            const syllDiv = document.createElement("span");
            syllDiv.className = "syllables";
            syllDiv.textContent = syllabify(w);
            span.appendChild(syllDiv);
          }
          span.addEventListener("click", () => speakWord(span, w));
          pEl.appendChild(span);
        }
      });

      body.appendChild(pEl);
    });
  }

  function cleanupPracticeMode() {
    if (state.practiceRecognition) {
      try { state.practiceRecognition.abort(); } catch (e) {}
      state.practiceRecognition = null;
    }
    state.practiceListening = false;
    state.helpInProgress = false;

    // Clear all pending practice timers
    state.practiceTimers.forEach((t) => clearTimeout(t));
    state.practiceTimers = [];

    // Remove complete banners
    $$(".practice-complete-banner").forEach((b) => b.remove());

    // Reset mic button
    const micBtn = $("#practice-mic-btn");
    if (micBtn) micBtn.classList.remove("recording");
  }

  // --- Word-by-Word Mode ---
  function initWordMode() {
    const allWords = Array.from($$("#reader-body .word"));
    state.practiceWords = allWords;
    state.wordIndex = 0;
    state.practiceAttempts = 0;

    allWords.forEach((w) => {
      w.classList.remove("word-current", "word-done", "word-correct-flash", "word-wrong-flash");
    });

    // Show only the paragraph containing the current word
    if (allWords.length > 0) {
      allWords[0].classList.add("word-current");
      showActiveWordParagraph(allWords[0]);
    }

    updatePracticeProgress(0, allWords.length);
    updatePracticePrompt();
    setupPracticeMic();
    setupPracticeHearBtn();
    setupPracticeNextBtn();
  }

  function showActiveWordParagraph(wordEl) {
    $$("#reader-body .paragraph").forEach((p) => p.classList.remove("active-word-para"));
    const para = wordEl.closest(".paragraph");
    if (para) para.classList.add("active-word-para");
  }

  function updatePracticeProgress(current, total) {
    const pct = total > 0 ? (current / total) * 100 : 0;
    $("#progress-bar-fill").style.width = pct + "%";
    $("#progress-label").textContent = `${current} / ${total}`;
  }

  function updatePracticePrompt() {
    const prompt = $("#practice-prompt");
    if (state.readingMode === "word") {
      const words = state.practiceWords;
      if (state.wordIndex < words.length) {
        prompt.textContent = "Read the word above!";
      } else {
        prompt.textContent = "All done!";
      }
    } else if (state.readingMode === "line") {
      const lines = state.practiceLines;
      if (state.lineIndex < lines.length) {
        prompt.textContent = "Read this line aloud!";
      } else {
        prompt.textContent = "All done!";
      }
    }
  }

  function setupPracticeMic() {
    const micBtn = $("#practice-mic-btn");
    const newMicBtn = micBtn.cloneNode(true);
    micBtn.parentNode.replaceChild(newMicBtn, micBtn);

    newMicBtn.addEventListener("click", () => {
      if (state.practiceListening) {
        stopPracticeListening();
        return;
      }
      startPracticeListening();
    });
  }

  function setupPracticeHearBtn() {
    const hearBtn = $("#practice-hear-btn");
    const newHearBtn = hearBtn.cloneNode(true);
    hearBtn.parentNode.replaceChild(newHearBtn, hearBtn);

    newHearBtn.addEventListener("click", () => {
      if (state.readingMode === "word") {
        helpWithWord();
      } else if (state.readingMode === "line") {
        helpWithLine();
      }
    });
  }

  function startPracticeListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showPracticeFeedback("Voice not available in this browser", "try-again");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    if (state.readingMode === "line") {
      recognition.continuous = true;
      recognition.interimResults = true;
    }

    state.practiceRecognition = recognition;
    state.practiceListening = true;

    const micBtn = $("#practice-mic-btn");
    micBtn.classList.add("recording");
    showPracticeFeedback("", "");

    let finalTranscript = "";
    let silenceTimer = null;
    let lineProcessed = false;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (state.readingMode === "word" && finalTranscript.trim()) {
        recognition.stop();
        handleWordResult(finalTranscript.trim());
        return;
      }

      if (state.readingMode === "line") {
        const display = finalTranscript + interim;
        if (display.trim()) {
          showPracticeFeedback(`"${display.trim()}"`, "");
        }
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          if ((finalTranscript.trim() || interim.trim()) && !lineProcessed) {
            lineProcessed = true;
            recognition.stop();
            handleLineResult((finalTranscript + interim).trim());
          }
        }, 2000);
      }
    };

    recognition.onend = () => {
      state.practiceListening = false;
      micBtn.classList.remove("recording");
      if (silenceTimer) clearTimeout(silenceTimer);

      if (state.readingMode === "line" && finalTranscript.trim() && !lineProcessed) {
        lineProcessed = true;
        handleLineResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      state.practiceListening = false;
      micBtn.classList.remove("recording");
      if (event.error === "no-speech") {
        showPracticeFeedback("I didn't hear anything. Try again!", "try-again");
      } else if (event.error !== "aborted") {
        showPracticeFeedback("Could not hear you. Try again!", "try-again");
      }
    };

    recognition.start();

    const timeout = state.readingMode === "line" ? 10000 : 5000;
    setTimeout(() => {
      if (state.practiceListening) {
        try { recognition.stop(); } catch (e) {}
      }
    }, timeout);
  }

  function stopPracticeListening() {
    if (state.practiceRecognition) {
      try { state.practiceRecognition.stop(); } catch (e) {}
    }
    state.practiceListening = false;
    $("#practice-mic-btn").classList.remove("recording");
  }

  function handleWordResult(transcript) {
    const words = state.practiceWords;
    if (state.wordIndex >= words.length) return;

    const currentWordEl = words[state.wordIndex];
    const targetWord = currentWordEl.textContent;

    if (fuzzyWordMatch(transcript, targetWord)) {
      wordCorrect(currentWordEl);
    } else {
      state.practiceAttempts++;
      currentWordEl.classList.add("word-wrong-flash");
      setTimeout(() => currentWordEl.classList.remove("word-wrong-flash"), 500);

      if (state.practiceAttempts >= 3 && !state.helpInProgress) {
        showPracticeFeedback("Let me help you with that one!", "helped");
        state.helpInProgress = true;
        const t = setTimeout(() => helpWithWord(), 500);
        state.practiceTimers.push(t);
      } else if (state.practiceAttempts < 3) {
        showPracticeFeedback("Almost! Try again!", "try-again");
      }
    }
  }

  function wordCorrect(wordEl) {
    showPracticeFeedback(getRandomPraise(), "correct");
    wordEl.classList.remove("word-current");
    wordEl.classList.add("word-correct-flash");

    const t = setTimeout(() => {
      if (state.readingMode !== "word") return;
      wordEl.classList.remove("word-correct-flash");
      wordEl.classList.add("word-done");
      state.wordIndex++;
      state.practiceAttempts = 0;

      updatePracticeProgress(state.wordIndex, state.practiceWords.length);

      if (state.wordIndex < state.practiceWords.length) {
        const nextWord = state.practiceWords[state.wordIndex];
        nextWord.classList.add("word-current");
        showActiveWordParagraph(nextWord);
        updatePracticePrompt();
      } else {
        practiceComplete();
      }
    }, 600);
    state.practiceTimers.push(t);
  }

  function helpWithWord() {
    const words = state.practiceWords;
    if (state.wordIndex >= words.length) return;
    if (state.readingMode !== "word") return;

    const savedIndex = state.wordIndex;
    const currentWordEl = words[state.wordIndex];
    const targetWord = currentWordEl.textContent.replace(/[.,!?;:]/g, "");

    showPracticeFeedback(`The word is "${targetWord}"`, "helped");
    speakText(targetWord, () => {
      const t = setTimeout(() => {
        if (state.readingMode !== "word" || state.wordIndex !== savedIndex) return;
        state.helpInProgress = false;
        currentWordEl.classList.remove("word-current");
        currentWordEl.classList.add("word-done");
        state.wordIndex++;
        state.practiceAttempts = 0;

        updatePracticeProgress(state.wordIndex, state.practiceWords.length);

        if (state.wordIndex < state.practiceWords.length) {
          const nextWord = state.practiceWords[state.wordIndex];
          nextWord.classList.add("word-current");
          showActiveWordParagraph(nextWord);
          updatePracticePrompt();
        } else {
          practiceComplete();
        }
      }, 800);
      state.practiceTimers.push(t);
    });
  }

  // --- Next Button ---
  function setupPracticeNextBtn() {
    const nextBtn = $("#practice-next-btn");
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    newNextBtn.addEventListener("click", () => {
      if (state.readingMode === "word") {
        advanceWordManually();
      } else if (state.readingMode === "line") {
        advanceLineManually();
      }
    });
  }

  function advanceWordManually() {
    const words = state.practiceWords;
    if (state.wordIndex >= words.length) return;

    const currentWordEl = words[state.wordIndex];
    currentWordEl.classList.remove("word-current");
    currentWordEl.classList.add("word-done");
    state.wordIndex++;
    state.practiceAttempts = 0;
    state.helpInProgress = false;

    updatePracticeProgress(state.wordIndex, state.practiceWords.length);

    if (state.wordIndex < state.practiceWords.length) {
      const nextWord = state.practiceWords[state.wordIndex];
      nextWord.classList.add("word-current");
      showActiveWordParagraph(nextWord);
      updatePracticePrompt();
    } else {
      practiceComplete();
    }
  }

  function advanceLineManually() {
    const lines = state.practiceLines;
    if (state.lineIndex >= lines.length) return;

    const currentLine = lines[state.lineIndex];
    currentLine.element.classList.remove("line-current");
    currentLine.element.classList.add("line-done");
    state.lineIndex++;
    state.practiceAttempts = 0;
    state.helpInProgress = false;

    updatePracticeProgress(state.lineIndex, state.practiceLines.length);

    if (state.lineIndex < state.practiceLines.length) {
      const nextLine = state.practiceLines[state.lineIndex];
      nextLine.element.classList.remove("line-hidden");
      nextLine.element.classList.add("line-current");
      nextLine.element.scrollIntoView({ behavior: "smooth", block: "center" });
      updatePracticePrompt();
    } else {
      practiceComplete();
    }
  }

  // --- Line-by-Line Mode ---
  function initLineMode() {
    const body = $("#reader-body");
    const story = state.currentStory;
    body.innerHTML = "";

    const allLines = [];

    story.content.forEach((para, pIdx) => {
      const pEl = document.createElement("div");
      pEl.className = "paragraph";
      pEl.dataset.pindex = pIdx;

      // Split into sentences (capture trailing text without punctuation too)
      const sentenceMatches = para.match(/[^.!?]+[.!?]+/g) || [];
      const matchedText = sentenceMatches.join("");
      const remainder = para.slice(matchedText.length).trim();
      const sentences = remainder ? [...sentenceMatches, remainder] : (sentenceMatches.length > 0 ? sentenceMatches : [para]);

      sentences.forEach((sentence) => {
        const lineGroup = document.createElement("div");
        lineGroup.className = "line-group line-hidden";
        lineGroup.dataset.lineIndex = allLines.length;

        const lineWords = [];
        const words = sentence.trim().split(/(\s+)/);
        words.forEach((w) => {
          if (/^\s+$/.test(w)) {
            lineGroup.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement("span");
            span.className = "word";
            span.textContent = w;
            span.addEventListener("click", () => speakWord(span, w));
            lineGroup.appendChild(span);
            lineWords.push(w);
          }
        });

        allLines.push({ element: lineGroup, words: lineWords });
        pEl.appendChild(lineGroup);
      });

      body.appendChild(pEl);
    });

    state.practiceLines = allLines;
    state.lineIndex = 0;
    state.practiceAttempts = 0;

    if (allLines.length > 0) {
      allLines[0].element.classList.remove("line-hidden");
      allLines[0].element.classList.add("line-current");
      allLines[0].element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    updatePracticeProgress(0, allLines.length);
    updatePracticePrompt();
    setupPracticeMic();
    setupPracticeHearBtn();
    setupPracticeNextBtn();
  }

  function handleLineResult(transcript) {
    const lines = state.practiceLines;
    if (state.lineIndex >= lines.length) return;

    const currentLine = lines[state.lineIndex];

    if (fuzzyLineMatch(transcript, currentLine.words)) {
      lineCorrect(currentLine);
    } else {
      state.practiceAttempts++;
      currentLine.element.classList.add("word-wrong-flash");
      setTimeout(() => currentLine.element.classList.remove("word-wrong-flash"), 500);

      if (state.practiceAttempts >= 3 && !state.helpInProgress) {
        showPracticeFeedback("Let me help you with that one!", "helped");
        state.helpInProgress = true;
        const t = setTimeout(() => helpWithLine(), 500);
        state.practiceTimers.push(t);
      } else if (state.practiceAttempts < 3) {
        showPracticeFeedback("Almost! Try reading it again!", "try-again");
      }
    }
  }

  function lineCorrect(line) {
    showPracticeFeedback(getRandomPraise(), "correct");
    line.element.classList.remove("line-current");
    line.element.classList.add("line-correct-flash");

    const t = setTimeout(() => {
      if (state.readingMode !== "line") return;
      line.element.classList.remove("line-correct-flash");
      line.element.classList.add("line-done");
      state.lineIndex++;
      state.practiceAttempts = 0;

      updatePracticeProgress(state.lineIndex, state.practiceLines.length);

      if (state.lineIndex < state.practiceLines.length) {
        const nextLine = state.practiceLines[state.lineIndex];
        nextLine.element.classList.remove("line-hidden");
        nextLine.element.classList.add("line-current");
        nextLine.element.scrollIntoView({ behavior: "smooth", block: "center" });
        updatePracticePrompt();
      } else {
        practiceComplete();
      }
    }, 600);
    state.practiceTimers.push(t);
  }

  function helpWithLine() {
    const lines = state.practiceLines;
    if (state.lineIndex >= lines.length) return;
    if (state.readingMode !== "line") return;

    const savedIndex = state.lineIndex;
    const currentLine = lines[state.lineIndex];
    const lineText = currentLine.words.join(" ").replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();

    showPracticeFeedback("Listen carefully...", "helped");
    speakText(lineText, () => {
      const t = setTimeout(() => {
        if (state.readingMode !== "line" || state.lineIndex !== savedIndex) return;
        state.helpInProgress = false;
        currentLine.element.classList.remove("line-current");
        currentLine.element.classList.add("line-done");
        state.lineIndex++;
        state.practiceAttempts = 0;

        updatePracticeProgress(state.lineIndex, state.practiceLines.length);

        if (state.lineIndex < state.practiceLines.length) {
          const nextLine = state.practiceLines[state.lineIndex];
          nextLine.element.classList.remove("line-hidden");
          nextLine.element.classList.add("line-current");
          nextLine.element.scrollIntoView({ behavior: "smooth", block: "center" });
          updatePracticePrompt();
        } else {
          practiceComplete();
        }
      }, 800);
      state.practiceTimers.push(t);
    });
  }

  // --- Practice Helpers ---
  function showPracticeFeedback(text, type) {
    const feedback = $("#practice-feedback");
    feedback.textContent = text;
    feedback.className = "practice-feedback";
    if (type) feedback.classList.add(type);
  }

  function getRandomPraise() {
    const phrases = [
      "Great job!", "Awesome!", "Perfect!",
      "You got it!", "Amazing!", "Super reader!",
      "Wonderful!", "Nailed it!", "Fantastic!",
      "Way to go!"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  function practiceComplete() {
    showPracticeFeedback("", "");
    $("#practice-prompt").textContent = "";

    const practiceStatus = $("#practice-status");
    practiceStatus.classList.add("hidden");

    // Show completion banner
    const banner = document.createElement("div");
    banner.className = "practice-complete-banner";
    banner.innerHTML = `
      <span class="banner-icon">🏆</span>
      <div class="banner-text">Amazing Job!</div>
      <div class="banner-sub">You read the whole story!</div>
    `;
    const readerBody = $("#reader-body");
    readerBody.parentNode.insertBefore(banner, readerBody.nextSibling);

    addXP(20);
    launchConfetti();
  }

  function resetMode() {
    cleanupPracticeMode();
    state.readingMode = "normal";
    state.wordIndex = 0;
    state.lineIndex = 0;
    state.practiceAttempts = 0;
    state.practiceWords = [];
    state.practiceLines = [];

    $$(".mode-btn").forEach((b) => b.classList.remove("active"));
    const normalBtn = $(".mode-btn[data-mode=\"normal\"]");
    if (normalBtn) normalBtn.classList.add("active");

    const readerBody = $("#reader-body");
    if (readerBody) readerBody.classList.remove("mode-word", "mode-line");

    const practiceProgress = $("#practice-progress");
    const practiceStatus = $("#practice-status");
    const readAloudBtn = $("#read-aloud-btn");
    const wordBank = $("#word-bank");

    if (practiceProgress) practiceProgress.classList.add("hidden");
    if (practiceStatus) practiceStatus.classList.add("hidden");
    if (readAloudBtn) readAloudBtn.classList.remove("hidden");
    if (wordBank) wordBank.classList.remove("hidden");
  }

  // --- Load voices (some browsers need this) ---
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {};
  }

  // --- Start App ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
