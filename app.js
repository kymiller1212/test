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
    rulerEnabled: false,
    syllableMode: true,
    settings: JSON.parse(localStorage.getItem("rb_settings") || "null") || {
      fontSize: 24,
      letterSpacing: 3,
      wordSpacing: 4,
      lineHeight: 22,
      speed: 8,
      bgColor: "#FFF8E7",
      rulerEnabled: false,
      syllableMode: true,
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
    helpInProgress: false,
    tappedWords: new Set()
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
    let statusEl = $(".header-status");

    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "header-status";
      $(".top-actions").prepend(statusEl);
    }

    const xpForNext = state.level * 50;
    const pct = Math.min(100, Math.round((state.xp / xpForNext) * 100));
    statusEl.innerHTML = `
      <span class="header-level">Lv ${state.level}</span>
      <span class="header-xp-bar"><span class="header-xp-fill" style="width:${pct}%"></span></span>
      <span class="header-xp-text">${state.xp}/${xpForNext}</span>
    `;
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
    TOPICS.forEach((topic, idx) => {
      const card = document.createElement("div");
      card.className = "topic-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", topic.label);
      card.style.setProperty("--card-color", topic.color || "var(--blue)");
      card.style.animationDelay = `${idx * 0.06}s`;

      const readCount = state.storiesRead.filter(
        (id) => id.startsWith(topic.id + ":")
      ).length;
      const totalForTopic = STORIES.filter(
        (s) => s.topic === topic.id
      ).length;
      const generatedForTopic = Object.keys(state.generatedStories).filter(
        (k) => k.startsWith(topic.id + ":")
      ).length;
      const totalStories = totalForTopic + generatedForTopic;

      card.innerHTML = `
        <div class="topic-icon-wrap">
          <span class="topic-icon">${topic.icon}</span>
        </div>
        <span class="topic-label">${topic.label}</span>
        <span class="topic-stories-count">${totalStories} ${totalStories === 1 ? "story" : "stories"}</span>
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

    // Set hero greeting based on time of day
    const hour = new Date().getHours();
    const greetEl = $("#hero-greeting");
    if (greetEl) {
      if (hour < 12) greetEl.textContent = "Good Morning!";
      else if (hour < 17) greetEl.textContent = "Good Afternoon!";
      else greetEl.textContent = "Good Evening!";
    }
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
      resetWordReview();
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

    // Generate story button at the top
    const genBtn = document.createElement("div");
    genBtn.className = "story-card story-card-generate";
    genBtn.innerHTML = `
      <span class="story-icon">✨</span>
      <div class="story-info">
        <div class="story-title">Make a New Story!</div>
        <div class="story-preview">Create a brand new story about ${topicLabel}</div>
      </div>
    `;
    genBtn.addEventListener("click", () => showGeneratePrompt(topicId, topicLabel, stories));
    list.appendChild(genBtn);

    // Separate stories by level (generated stories with a level go into that level)
    const level1 = stories.filter(s => (!s.level || s.level === 1));
    const level2 = stories.filter(s => s.level === 2);

    // Render Level 1 section
    if (level1.length > 0) {
      const l1Count = level1.filter(s => {
        const idx = stories.indexOf(s);
        const sid = s.id || `${s.topic}:${idx}`;
        return state.storiesRead.includes(sid);
      }).length;
      const l1Header = document.createElement("div");
      l1Header.className = "level-header";
      l1Header.innerHTML = `
        <div class="level-badge level-1-badge">Level 1</div>
        <div class="level-info">
          <div class="level-desc">2nd Grade</div>
          <div class="level-progress-text">${l1Count} / ${level1.length} complete</div>
        </div>
        <div class="level-progress-ring">
          <svg viewBox="0 0 36 36">
            <path class="level-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="level-ring-fill level-1-ring" stroke-dasharray="${level1.length > 0 ? Math.round((l1Count / level1.length) * 100) : 0}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          ${l1Count === level1.length && level1.length > 0 ? '<span class="level-check">✓</span>' : ''}
        </div>
      `;
      list.appendChild(l1Header);

      level1.forEach(story => {
        const idx = stories.indexOf(story);
        appendStoryCard(list, story, stories, idx);
      });
    }

    // Render Level 2 section
    if (level2.length > 0) {
      const l2Count = level2.filter(s => {
        const idx = stories.indexOf(s);
        const sid = s.id || `${s.topic}:${idx}`;
        return state.storiesRead.includes(sid);
      }).length;
      const l1AllRead = level1.every(s => {
        const idx = stories.indexOf(s);
        const sid = s.id || `${s.topic}:${idx}`;
        return state.storiesRead.includes(sid);
      });

      const l2Header = document.createElement("div");
      l2Header.className = "level-header";
      l2Header.innerHTML = `
        <div class="level-badge level-2-badge">Level 2</div>
        <div class="level-info">
          <div class="level-desc">3rd Grade</div>
          <div class="level-progress-text">${l2Count} / ${level2.length} complete</div>
        </div>
        <div class="level-progress-ring">
          <svg viewBox="0 0 36 36">
            <path class="level-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="level-ring-fill level-2-ring" stroke-dasharray="${level2.length > 0 ? Math.round((l2Count / level2.length) * 100) : 0}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          ${l2Count === level2.length && level2.length > 0 ? '<span class="level-check">✓</span>' : ''}
        </div>
      `;
      list.appendChild(l2Header);

      level2.forEach(story => {
        const idx = stories.indexOf(story);
        appendStoryCard(list, story, stories, idx);
      });
    }

    // No stories at all (custom topic with no generation yet)
    if (level1.length === 0 && level2.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText = "text-align:center;padding:24px 20px;color:var(--text-light);font-size:15px;";
      empty.textContent = "Tap the button above to create stories about this topic!";
      list.appendChild(empty);
    }
  }

  function appendStoryCard(list, story, allStories, idx) {
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
  }

  // --- Story Generation ---

  // Prompt modal for generating a single story within an existing topic
  function showGeneratePrompt(topicId, topicLabel, existingStories) {
    if (!hasAPIKey()) {
      showAPIKeyPrompt();
      return;
    }

    const existingTitles = existingStories.map(s => s.title).join(", ");

    const overlay = document.createElement("div");
    overlay.className = "level-up-overlay gen-prompt-overlay";
    overlay.innerHTML = `
      <div class="gen-prompt-card">
        <div class="gen-prompt-header">
          <span class="gen-prompt-icon">✨</span>
          <div class="gen-prompt-title">New Story</div>
          <div class="gen-prompt-subtitle">About ${topicLabel}</div>
        </div>

        <div class="gen-prompt-body">
          <label class="gen-prompt-label" for="gen-subtopic">What should this story focus on?</label>
          <input type="text" id="gen-subtopic" class="gen-prompt-input" placeholder="Leave blank for a surprise!" aria-label="Subtopic">
          <div class="gen-prompt-hint">e.g. "training routines" or "famous plays"</div>

          <label class="gen-prompt-label gen-prompt-label-level">Reading Level</label>
          <div class="gen-level-picker">
            <button class="gen-level-btn active" data-level="1">
              <span class="gen-level-num">Level 1</span>
              <span class="gen-level-grade">2nd Grade</span>
            </button>
            <button class="gen-level-btn" data-level="2">
              <span class="gen-level-num">Level 2</span>
              <span class="gen-level-grade">3rd Grade</span>
            </button>
          </div>
        </div>

        <div class="gen-prompt-actions">
          <button class="gen-prompt-cancel">Cancel</button>
          <button class="gen-prompt-go">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Create Story
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Level picker toggle
    let selectedLevel = 1;
    overlay.querySelectorAll(".gen-level-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        overlay.querySelectorAll(".gen-level-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedLevel = parseInt(btn.dataset.level);
      });
    });

    // Cancel
    overlay.querySelector(".gen-prompt-cancel").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    // Go
    overlay.querySelector(".gen-prompt-go").addEventListener("click", async () => {
      const subtopic = overlay.querySelector("#gen-subtopic").value.trim();
      overlay.remove();
      await generateSingleStory(topicId, topicLabel, selectedLevel, subtopic, existingTitles);
    });

    // Enter key in input
    overlay.querySelector("#gen-subtopic").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const subtopic = overlay.querySelector("#gen-subtopic").value.trim();
        overlay.remove();
        generateSingleStory(topicId, topicLabel, selectedLevel, subtopic, existingTitles);
      }
    });

    // Auto-focus the input
    setTimeout(() => overlay.querySelector("#gen-subtopic").focus(), 100);
  }

  async function generateSingleStory(topicId, topicLabel, level, subtopic, existingTitles) {
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "level-up-overlay";
    loadingOverlay.innerHTML = `
      <div class="level-up-card">
        <span class="level-star" style="animation: bounce-subtle 1s ease-in-out infinite;">✨</span>
        <div class="level-text" style="font-size:22px;">Writing your story...</div>
        <div class="level-sub">${subtopic ? `About: ${subtopic}` : `A new ${topicLabel} story`}</div>
        <div class="gen-progress-bar"><div class="gen-progress-fill" style="width:30%;animation:gen-pulse 1.5s ease-in-out infinite;"></div></div>
      </div>
    `;
    document.body.appendChild(loadingOverlay);

    try {
      const story = await callAISingle(topicLabel, level, subtopic, existingTitles);
      const topicIcon = TOPICS.find(t => t.id === topicId)?.icon || "✨";
      const storyKey = `${topicId}:gen-${Date.now()}`;
      story.topic = topicId;
      story.level = level;
      story.icon = topicIcon;
      story.id = storyKey;

      state.generatedStories[storyKey] = story;
      localStorage.setItem("rb_generated", JSON.stringify(state.generatedStories));

      loadingOverlay.remove();

      // Refresh and open the new story
      buildTopicGrid();
      selectTopic(topicId);
    } catch (err) {
      console.error("Story generation error:", err);
      const card = loadingOverlay.querySelector(".level-up-card");
      card.querySelector(".level-text").textContent = "Oops!";
      const statusEl = card.querySelector(".level-sub");
      statusEl.style.cssText = "font-size:14px;line-height:1.5;color:var(--red-dark);";
      statusEl.textContent = err.message || "Could not create the story. Check your API key in Settings.";
      const bar = card.querySelector(".gen-progress-bar");
      if (bar) bar.remove();
      const closeBtn = document.createElement("button");
      closeBtn.className = "primary-btn";
      closeBtn.textContent = "OK";
      closeBtn.style.marginTop = "16px";
      closeBtn.onclick = () => loadingOverlay.remove();
      card.appendChild(closeBtn);
    }
  }

  async function callAISingle(topicLabel, level, subtopic, existingTitles) {
    const provider = state.settings.apiProvider || "openai";
    const apiKey = state.settings.apiKey;

    let levelRules;
    if (level === 1) {
      levelRules = `LEVEL 1 — 2nd Grade Reading Level
- Target: approximately 90-100 words
- Use 4 paragraphs with 3 sentences each (about 12 sentences total)
- Average sentence length: 7-8 words. Keep ALL sentences under 12 words
- Use simple, common words a 2nd grader knows
- Short, punchy sentences with subject-verb-object structure`;
    } else {
      levelRules = `LEVEL 2 — 3rd Grade Reading Level
- Target: approximately 130-150 words
- Use 5 paragraphs with 2-3 sentences each (about 11-13 sentences total)
- Average sentence length: 11-13 words. Some sentences can reach 18 words
- Use grade-appropriate vocabulary with 3-4 challenging words
- Use compound sentences and descriptive language`;
    }

    const focusInstruction = subtopic
      ? `The story should specifically focus on: "${subtopic}" as it relates to ${topicLabel}.`
      : `Choose an interesting and unique angle about ${topicLabel} that is different from these existing stories: ${existingTitles || "none yet"}.`;

    const systemPrompt = `You are a children's reading content creator specializing in dyslexia-friendly materials. Create ONE reading passage about the given topic.

${levelRules}

${focusInstruction}

Rules:
- Make it fun, engaging, and age-appropriate
- Be factually accurate when discussing real people, places, or things
- CRITICAL: Hit the target word count. Do NOT write a shorter story.

Respond with ONLY this JSON:
{
  "title": "Story Title",
  "content": ["paragraph1", "paragraph2", "paragraph3"${level === 2 ? ', "paragraph4", "paragraph5"' : ', "paragraph4"'}],
  "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
  "quiz": [
    {"q": "Question?", "choices": ["A", "B", "C"], "answer": 0},
    {"q": "Question?", "choices": ["A", "B", "C"], "answer": 1},
    {"q": "Question?", "choices": ["A", "B", "C"], "answer": 2}
  ]
}`;

    const userPrompt = `Write a ${level === 1 ? "2nd grade (90-100 words)" : "3rd grade (130-150 words)"} reading passage about ${topicLabel}${subtopic ? `, focusing on: ${subtopic}` : ""}.`;

    let text;

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
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        let errMsg = `OpenAI API error (${response.status})`;
        try { const j = JSON.parse(errBody); if (j.error?.message) errMsg = j.error.message; } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      text = data.choices[0].message.content;
    } else if (provider === "anthropic") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        let errMsg = `Anthropic API error (${response.status})`;
        try { const j = JSON.parse(errBody); if (j.error?.message) errMsg = j.error.message; } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      text = data.content[0].text;
    }

    return parseStoryJSON(text);
  }

  // Bulk generation for new custom topics (generates 6 stories at once)
  async function generateStory(topicId, topicLabel) {
    if (!hasAPIKey()) {
      showAPIKeyPrompt();
      return;
    }

    // Show loading state
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "level-up-overlay";
    loadingOverlay.id = "gen-loading";
    loadingOverlay.innerHTML = `
      <div class="level-up-card">
        <span class="level-star" style="animation: bounce-subtle 1s ease-in-out infinite;">✨</span>
        <div class="level-text" style="font-size:22px;">Creating stories...</div>
        <div class="level-sub" id="gen-status">Generating Level 1 stories about ${topicLabel}</div>
        <div class="gen-progress-bar"><div class="gen-progress-fill" id="gen-fill"></div></div>
      </div>
    `;
    document.body.appendChild(loadingOverlay);

    try {
      const stories = [];
      const topicIcon = TOPICS.find(t => t.id === topicId)?.icon || "✨";

      // Generate 3 Level 1 stories (2nd grade)
      updateGenStatus("Generating Level 1 stories (2nd grade)...", 10);
      const l1Stories = await callAIBatch(topicLabel, 1);
      for (const s of l1Stories) {
        s.topic = topicId;
        s.level = 1;
        s.icon = topicIcon;
        stories.push(s);
      }
      updateGenStatus("Level 1 complete! Generating Level 2...", 50);

      // Generate 3 Level 2 stories (3rd grade)
      const l2Stories = await callAIBatch(topicLabel, 2);
      for (const s of l2Stories) {
        s.topic = topicId;
        s.level = 2;
        s.icon = topicIcon;
        stories.push(s);
      }
      updateGenStatus("All stories created!", 100);

      // Save all generated stories
      stories.forEach((story, i) => {
        const storyKey = `${topicId}:gen-${Date.now()}-${i}`;
        story.id = storyKey;
        state.generatedStories[storyKey] = story;
      });
      localStorage.setItem("rb_generated", JSON.stringify(state.generatedStories));

      // Small delay to show 100% progress
      await new Promise(r => setTimeout(r, 500));
      loadingOverlay.remove();

      // Refresh story list and topic grid (story count updated)
      buildTopicGrid();
      selectTopic(topicId);
    } catch (err) {
      console.error("Story generation error:", err);
      const card = loadingOverlay.querySelector(".level-up-card");
      card.querySelector(".level-text").textContent = "Oops!";
      const statusEl = card.querySelector(".level-sub");
      statusEl.style.cssText = "font-size:14px;line-height:1.5;color:var(--red-dark);";
      statusEl.textContent = err.message || "Could not create stories. Check your API key in Settings.";
      const bar = card.querySelector(".gen-progress-bar");
      if (bar) bar.remove();
      const closeBtn = document.createElement("button");
      closeBtn.className = "primary-btn";
      closeBtn.textContent = "OK";
      closeBtn.style.marginTop = "16px";
      closeBtn.onclick = () => loadingOverlay.remove();
      card.appendChild(closeBtn);
    }
  }

  function showAPIKeyPrompt() {
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
  }

  function updateGenStatus(msg, pct) {
    const el = document.getElementById("gen-status");
    const fill = document.getElementById("gen-fill");
    if (el) el.textContent = msg;
    if (fill) fill.style.width = pct + "%";
  }

  async function callAIBatch(topicLabel, level) {
    const provider = state.settings.apiProvider || "openai";
    const apiKey = state.settings.apiKey;

    let levelRules, exampleStory;

    if (level === 1) {
      levelRules = `LEVEL 1 — 2nd Grade Reading Level
- Target: approximately 90-100 words per story
- Use 4 paragraphs with 3 sentences each (about 12 sentences total)
- Average sentence length: 7-8 words. Keep ALL sentences under 12 words
- Use simple, common words a 2nd grader knows (e.g. "big" not "enormous")
- Avoid multi-syllable words when a shorter word works
- Each paragraph should be about 20-25 words
- Short, punchy sentences with subject-verb-object structure
- Use periods, not semicolons or complex punctuation`;

      exampleStory = `Here is an example of the RIGHT length and style for Level 1:
{
  "title": "How Football Works",
  "content": [
    "Football is a fun and exciting sport. Two teams play against each other. Each team has 11 players on the field at a time.",
    "The goal is to get the ball into the end zone. You can run with the ball or throw it. When you score, it is called a touchdown!",
    "A touchdown is worth six points. Then you can kick for one more point. A field goal is worth three points.",
    "Each game has four quarters. The team with the most points at the end wins. Football is a great game to watch and play!"
  ],
  "words": ["teams", "players", "end zone", "touchdown", "points", "field goal", "quarters", "score"],
  "quiz": [
    {"q": "How many players are on the field per team?", "choices": ["9", "11", "15"], "answer": 1},
    {"q": "How many points is a touchdown?", "choices": ["Three", "Six", "Ten"], "answer": 1},
    {"q": "How many quarters are in a game?", "choices": ["Two", "Three", "Four"], "answer": 2}
  ]
}`;
    } else {
      levelRules = `LEVEL 2 — 3rd Grade Reading Level
- Target: approximately 130-150 words per story
- Use 5 paragraphs with 2-3 sentences each (about 11-13 sentences total)
- Average sentence length: 11-13 words. Some sentences can reach 18 words
- Use grade-appropriate vocabulary: include 3-4 challenging words per story (e.g. "rivalry", "determination", "spectacular")
- Each paragraph should be about 25-30 words
- Use more complex sentence structures: compound sentences with "and", "but", "because", "while"
- Include more descriptive language and details than Level 1
- Vary sentence length for natural rhythm (mix short and longer sentences)`;

      exampleStory = `Here is an example of the RIGHT length and style for Level 2:
{
  "title": "Rivalry with Michigan",
  "content": [
    "Every year, Ohio State plays a huge game against Michigan. This rivalry is one of the oldest in college football history. It has been going on since 1897!",
    "The week before the game, Ohio State fans refuse to say the letter M. They call Michigan \\"That Team Up North\\" instead. Players put a big X over every M on campus.",
    "The game is always played on the last Saturday of November. Both teams save their best effort for this special day. The stadium is always completely packed with screaming fans.",
    "Whoever wins the rivalry game gets bragging rights for the whole year. Some of the most exciting moments in college football have happened during this classic matchup.",
    "Ohio State students and alumni look forward to this game more than any other. Families pass down their love for the Buckeyes from generation to generation."
  ],
  "words": ["rivalry", "refuse", "campus", "bragging rights", "alumni", "generation", "matchup", "tradition"],
  "quiz": [
    {"q": "When did the Ohio State vs Michigan rivalry start?", "choices": ["1950", "1897", "2001"], "answer": 1},
    {"q": "What do Ohio State fans refuse to say?", "choices": ["The letter M", "The word football", "Michigan's score"], "answer": 0},
    {"q": "When is the game always played?", "choices": ["First week of October", "Last Saturday of November", "New Year's Day"], "answer": 1}
  ]
}`;
    }

    const systemPrompt = `You are a children's reading content creator specializing in dyslexia-friendly materials. Create 3 different reading passages about the given topic.

${levelRules}

CRITICAL: Match the length and style of the example below. Each story MUST hit the target word count. Do NOT write shorter stories.

${exampleStory}

Additional rules:
- Each of the 3 stories must cover a DIFFERENT interesting aspect of the topic
- Make content fun, engaging, and age-appropriate
- Be factually accurate when discussing real people, places, or things
- Include 8 key vocabulary words from each passage in the "words" array
- Include 3 comprehension questions with 3 multiple-choice options each
- "answer" is the 0-based index of the correct choice

Respond with ONLY this JSON structure:
{
  "stories": [
    {
      "title": "...",
      "content": ["paragraph1", "paragraph2", "paragraph3", "paragraph4"],
      "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
      "quiz": [{"q": "...", "choices": ["A", "B", "C"], "answer": 0}, {"q": "...", "choices": ["A", "B", "C"], "answer": 1}, {"q": "...", "choices": ["A", "B", "C"], "answer": 2}]
    },
    { ... },
    { ... }
  ]
}`;

    const userPrompt = `Write 3 different ${level === 1 ? "2nd grade" : "3rd grade"} reading level passages about: ${topicLabel}. Remember: each story must be ${level === 1 ? "90-100" : "130-150"} words with ${level === 1 ? "4" : "5"} full paragraphs.`;

    let text;

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
          temperature: 0.7,
          max_tokens: 6000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("API response:", errBody);
        let errMsg = `OpenAI API error (${response.status})`;
        try {
          const errJson = JSON.parse(errBody);
          if (errJson.error?.message) errMsg = errJson.error.message;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      text = data.choices[0].message.content;
    } else if (provider === "anthropic") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 6000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("API response:", errBody);
        let errMsg = `Anthropic API error (${response.status})`;
        try {
          const errJson = JSON.parse(errBody);
          if (errJson.error?.message) errMsg = errJson.error.message;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      text = data.content[0].text;
    }

    return parseBatchJSON(text);
  }

  function parseBatchJSON(text) {
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) jsonStr = objMatch[0];

    const parsed = JSON.parse(jsonStr);
    if (parsed.stories && Array.isArray(parsed.stories)) {
      return parsed.stories.map(s => ({
        title: s.title,
        content: s.content,
        words: s.words,
        quiz: s.quiz,
      }));
    }
    // Fallback: if the AI returned a single story
    if (parsed.title) {
      return [{ title: parsed.title, content: parsed.content, words: parsed.words, quiz: parsed.quiz }];
    }
    throw new Error("Unexpected response format from AI");
  }

  // Keep old single-story parser for backwards compat
  function parseStoryJSON(text) {
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
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
    const topicId = topicName.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").trim();

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

    // Check for existing generated stories
    const generatedKeys = Object.keys(state.generatedStories).filter(
      (k) => k.startsWith(topicId + ":")
    );

    if (generatedKeys.length > 0) {
      // Already have stories, just show them
      selectTopic(topicId);
    } else if (hasAPIKey()) {
      // No stories yet, generate all 6
      state.currentTopic = topicId;
      generateStory(topicId, topicName);
    } else {
      // No API key, show the story list with just the generate button
      state.currentTopic = topicId;
      $("#stories-heading").textContent = `✨ ${topicName} Stories`;
      renderStoryList([], topicId, topicName);
      showScreen("stories");
    }
  }

  // --- Reader ---
  function openReader(story) {
    state.currentStory = story;
    state.tappedWords = new Set();
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

          // Syllable data (always add if syllable mode on, but hidden until tapped)
          if (state.syllableMode) {
            const syllDiv = document.createElement("span");
            syllDiv.className = "syllables";
            syllDiv.textContent = syllabify(w);
            span.appendChild(syllDiv);
          }

          // Click handler: two-tap behavior when syllable mode is on
          span.addEventListener("click", () => handleWordTap(span, w));
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

  // Two-tap word interaction: first tap shows syllables, second speaks + hides
  function handleWordTap(span, word) {
    // Track tap for XP penalty (once per unique word per story)
    const cleanWord = word.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
    if (cleanWord && !state.tappedWords.has(cleanWord)) {
      state.tappedWords.add(cleanWord);
      if (state.xp > 0) {
        state.xp = Math.max(0, state.xp - 1);
        localStorage.setItem("rb_xp", state.xp);
        updateXPDisplay();
      }
      markWordBankTapped(cleanWord);
    }
    // Mark span so it shows red when it becomes a "done" line
    if (cleanWord && state.tappedWords.has(cleanWord)) {
      span.classList.add("word-helped");
    }

    if (state.syllableMode) {
      const syllDiv = span.querySelector(".syllables");
      if (syllDiv) {
        if (span.classList.contains("syllable-shown")) {
          // Second tap: speak the word and hide syllables
          span.classList.remove("syllable-shown");
          speakWord(span, word);
        } else {
          // First tap: show syllables only (clear any other shown syllables first)
          $$(".word.syllable-shown").forEach((el) => el.classList.remove("syllable-shown"));
          span.classList.add("syllable-shown");
        }
        return;
      }
    }
    // No syllable mode or no syllable div: speak immediately
    speakWord(span, word);
  }

  function markWordBankTapped(tappedWord) {
    $$(".word-chip").forEach((chip) => {
      const chipWord = chip.textContent.toLowerCase().trim();
      // Check if any word in the chip matches
      if (chipWord === tappedWord || chipWord.split(/\s+/).some(w => w === tappedWord)) {
        chip.classList.add("word-tapped");
      }
    });
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

    addXP(xpEarned);

    // If there are tapped words, launch word review after a short delay
    if (state.tappedWords.size > 0) {
      setTimeout(() => startWordReview(), 1200);
    } else {
      $("#quiz-done-btn").classList.remove("hidden");
    }
  }

  // --- Word Review Flashcard Game ---
  function startWordReview() {
    const reviewWords = Array.from(state.tappedWords);
    // Shuffle the words
    for (let i = reviewWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reviewWords[i], reviewWords[j]] = [reviewWords[j], reviewWords[i]];
    }

    state.wordReview = {
      words: reviewWords,
      index: 0,
      gotIt: [],
      missed: [],
      tappedThisCard: false
    };

    // Hide quiz body and result, show word review
    $("#quiz-body").classList.add("hidden");
    $("#quiz-result").classList.add("hidden");
    const wr = $("#word-review");
    wr.classList.remove("hidden");
    $("#word-review-results").classList.add("hidden");

    // Setup counter
    $("#wr-total").textContent = reviewWords.length;
    updateWordReviewProgress();

    // Setup card
    showWordReviewCard();

    // Setup button listeners (remove old ones by cloning)
    setupWordReviewButtons();
  }

  function setupWordReviewButtons() {
    const gotBtn = $("#wr-got-btn");
    const missBtn = $("#wr-miss-btn");
    const speakBtn = $("#wr-card-speak");
    const card = $("#wr-card");

    // Replace to remove old listeners
    const newGot = gotBtn.cloneNode(true);
    const newMiss = missBtn.cloneNode(true);
    const newSpeak = speakBtn.cloneNode(true);
    gotBtn.parentNode.replaceChild(newGot, gotBtn);
    missBtn.parentNode.replaceChild(newMiss, missBtn);
    speakBtn.parentNode.replaceChild(newSpeak, speakBtn);

    newGot.addEventListener("click", () => handleWordReviewAnswer("got"));
    newMiss.addEventListener("click", () => handleWordReviewAnswer("miss"));
    newSpeak.addEventListener("click", () => {
      const review = state.wordReview;
      if (!review || review.index >= review.words.length) return;
      const word = review.words[review.index];

      // Auto-miss on tap (word was read aloud = needed help)
      if (!review.tappedThisCard) {
        review.tappedThisCard = true;
        // Show syllable breakdown too
        const syllables = $("#wr-card-syllables");
        syllables.textContent = syllabify(word);
        syllables.classList.remove("hidden");
      }
      speakText(word);
    });

    // Swipe gesture on card
    setupCardSwipe(card);
  }

  function setupCardSwipe(card) {
    let startX = 0, startY = 0, currentX = 0, isDragging = false;

    const onStart = (x, y) => {
      startX = x;
      startY = y;
      currentX = 0;
      isDragging = true;
      card.style.transition = "none";
    };

    const onMove = (x) => {
      if (!isDragging) return;
      currentX = x - startX;
      const rotate = currentX * 0.08;
      card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

      // Show stamp overlays based on direction
      const stampGot = $("#wr-stamp-got");
      const stampMiss = $("#wr-stamp-miss");
      const threshold = 40;
      if (currentX > threshold) {
        stampGot.style.opacity = Math.min((currentX - threshold) / 80, 1);
        stampMiss.style.opacity = 0;
      } else if (currentX < -threshold) {
        stampMiss.style.opacity = Math.min((-currentX - threshold) / 80, 1);
        stampGot.style.opacity = 0;
      } else {
        stampGot.style.opacity = 0;
        stampMiss.style.opacity = 0;
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const swipeThreshold = 80;

      if (currentX > swipeThreshold) {
        handleWordReviewAnswer("got");
      } else if (currentX < -swipeThreshold) {
        handleWordReviewAnswer("miss");
      } else {
        // Snap back
        card.style.transition = "transform 0.3s cubic-bezier(0.2, 0, 0, 1)";
        card.style.transform = "";
        $("#wr-stamp-got").style.opacity = 0;
        $("#wr-stamp-miss").style.opacity = 0;
      }
    };

    card.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    }, { passive: true });
    card.addEventListener("touchmove", (e) => {
      onMove(e.touches[0].clientX);
    }, { passive: true });
    card.addEventListener("touchend", onEnd);

    card.addEventListener("mousedown", (e) => {
      onStart(e.clientX, e.clientY);
      const mousemove = (ev) => onMove(ev.clientX);
      const mouseup = () => {
        onEnd();
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      };
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    });
  }

  function showWordReviewCard() {
    const review = state.wordReview;
    const card = $("#wr-card");
    const wordEl = $("#wr-card-word");
    const syllEl = $("#wr-card-syllables");

    if (review.index >= review.words.length) {
      finishWordReview();
      return;
    }

    review.tappedThisCard = false;

    const word = review.words[review.index];
    wordEl.textContent = word;
    syllEl.classList.add("hidden");
    syllEl.textContent = "";

    // Reset card position with entrance animation
    card.style.transition = "none";
    card.style.transform = "scale(0.8) translateY(30px)";
    card.style.opacity = "0";
    $("#wr-stamp-got").style.opacity = 0;
    $("#wr-stamp-miss").style.opacity = 0;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease";
        card.style.transform = "";
        card.style.opacity = "1";
      });
    });

    updateWordReviewProgress();
  }

  function handleWordReviewAnswer(type) {
    const review = state.wordReview;
    if (!review || review.index >= review.words.length) return;

    const card = $("#wr-card");
    const word = review.words[review.index];

    // If tapped (heard/syllable shown), force miss
    const actualType = review.tappedThisCard ? "miss" : type;

    if (actualType === "got") {
      review.gotIt.push(word);
    } else {
      review.missed.push(word);
    }

    // Animate card exit
    const direction = actualType === "got" ? 1 : -1;
    const stampEl = actualType === "got" ? "#wr-stamp-got" : "#wr-stamp-miss";
    $(stampEl).style.opacity = 1;

    card.style.transition = "transform 0.4s cubic-bezier(0.5, 0, 0.7, 0.2), opacity 0.3s ease";
    card.style.transform = `translateX(${direction * 350}px) rotate(${direction * 25}deg)`;
    card.style.opacity = "0";

    // Flash button for feedback
    const feedbackBtn = actualType === "got" ? $(".wr-btn-got") : $(".wr-btn-miss");
    feedbackBtn.classList.add("wr-btn-flash");
    setTimeout(() => feedbackBtn.classList.remove("wr-btn-flash"), 400);

    setTimeout(() => {
      review.index++;
      showWordReviewCard();
    }, 400);
  }

  function updateWordReviewProgress() {
    const review = state.wordReview;
    const total = review.words.length;
    const done = review.index;
    const pct = total > 0 ? (done / total) * 100 : 0;

    $("#wr-current").textContent = Math.min(done + 1, total);
    $(".wr-progress-fill").style.width = pct + "%";
  }

  function finishWordReview() {
    const review = state.wordReview;
    const gotCount = review.gotIt.length;
    const missCount = review.missed.length;
    const total = review.words.length;
    const pct = total > 0 ? gotCount / total : 0;

    // Fill progress to 100%
    $(".wr-progress-fill").style.width = "100%";

    // Award XP for words they got
    const xpEarned = gotCount * 3;
    if (xpEarned > 0) addXP(xpEarned);

    // Build results
    let icon, message, cls;
    if (pct === 1) {
      icon = "🌟";
      message = "You know all the words!";
      cls = "great";
      launchConfetti();
    } else if (pct >= 0.5) {
      icon = "💪";
      message = `You got ${gotCount} out of ${total} words!`;
      cls = "good";
    } else {
      icon = "📖";
      message = `Keep practicing! You got ${gotCount} out of ${total}.`;
      cls = "try-again";
    }

    const resultsEl = $("#word-review-results");
    let html = `
      <div class="wr-results-card ${cls}">
        <div class="wr-results-icon">${icon}</div>
        <div class="wr-results-message">${message}</div>
        <div class="wr-results-xp">+${xpEarned} XP</div>
        <div class="wr-results-breakdown">`;

    if (gotCount > 0) {
      html += `<div class="wr-results-section wr-results-got">
        <div class="wr-results-label">Got It</div>
        <div class="wr-results-words">${review.gotIt.map(w => `<span class="wr-word-chip wr-got">${w}</span>`).join("")}</div>
      </div>`;
    }
    if (missCount > 0) {
      html += `<div class="wr-results-section wr-results-missed">
        <div class="wr-results-label">Keep Practicing</div>
        <div class="wr-results-words">${review.missed.map(w => `<span class="wr-word-chip wr-missed">${w}</span>`).join("")}</div>
      </div>`;
    }

    html += `</div></div>`;
    resultsEl.innerHTML = html;
    resultsEl.classList.remove("hidden");

    // Hide card area, show done button
    $(".wr-card-area").style.display = "none";
    $(".wr-actions").style.display = "none";
    $(".wr-header .wr-subtitle").textContent = "Review Complete!";
    $("#quiz-done-btn").classList.remove("hidden");
  }

  function resetWordReview() {
    state.wordReview = null;
    const wr = $("#word-review");
    if (wr) {
      wr.classList.add("hidden");
      // Reset display properties that might have been set to 'none'
      const cardArea = wr.querySelector(".wr-card-area");
      const actions = wr.querySelector(".wr-actions");
      if (cardArea) cardArea.style.display = "";
      if (actions) actions.style.display = "";
    }
    const wrResults = $("#word-review-results");
    if (wrResults) {
      wrResults.classList.add("hidden");
      wrResults.innerHTML = "";
    }
    // Re-show quiz body for next quiz
    $("#quiz-body").classList.remove("hidden");
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

  // --- Syllable Breakdown (morphological + phonetic) ---
  const SYLLABLE_MAP = {
    // Compound words from our stories
    buckeye: "buck · eye", buckeyes: "buck · eyes",
    football: "foot · ball", footballs: "foot · balls",
    touchdown: "touch · down", touchdowns: "touch · downs",
    quarterback: "quar · ter · back", quarterbacks: "quar · ter · backs",
    horseshoe: "horse · shoe", horseshoes: "horse · shoes",
    halftime: "half · time",
    everyone: "ev · ry · one", everything: "ev · ry · thing",
    something: "some · thing", sometimes: "some · times",
    someone: "some · one", somewhere: "some · where",
    lightsaber: "light · sa · ber", lightsabers: "light · sa · bers",
    bodybuilder: "bod · y · build · er",
    teammates: "team · mates", teammate: "team · mate",
    teamwork: "team · work",
    kickoff: "kick · off", kickoffs: "kick · offs",
    sideline: "side · line", sidelines: "side · lines",
    comeback: "come · back", comebacks: "come · backs",
    overtime: "o · ver · time",
    scoreboard: "score · board",
    endzone: "end · zone",
    inside: "in · side", outside: "out · side",
    without: "with · out", within: "with · in",
    into: "in · to",
    together: "to · geth · er",
    himself: "him · self", herself: "her · self",
    itself: "it · self", myself: "my · self", yourself: "your · self",
    everybody: "ev · ry · bod · y",
    anybody: "an · y · bod · y",
    nobody: "no · bod · y",
    anything: "an · y · thing", nothing: "noth · ing",
    cockpit: "cock · pit",
    downfield: "down · field", backfield: "back · field",
    midfield: "mid · field",
    playground: "play · ground", backyard: "back · yard",
    popcorn: "pop · corn", classroom: "class · room",
    lineman: "line · man", linemen: "line · men",
    linebacker: "line · back · er", linebackers: "line · back · ers",
    offensive: "of · fen · sive", defensive: "de · fen · sive",
    contagious: "con · ta · gious",
    scrimmage: "scrim · mage",
    millennium: "mil · len · ni · um",
    chewbacca: "chew · bac · ca",
    immaculate: "im · mac · u · late",
    buccaneers: "buc · ca · neers",
    nashville: "nash · ville",
    equanimeous: "eq · ua · nim · e · ous",
    stormtrooper: "storm · troop · er", stormtroopers: "storm · troop · ers",
    compartment: "com · part · ment", compartments: "com · part · ments",
    adventure: "ad · ven · ture", adventures: "ad · ven · tures",
    character: "char · ac · ter", characters: "char · ac · ters",
    exciting: "ex · ci · ting", amazing: "a · ma · zing",
    believing: "be · liev · ing",
    catching: "catch · ing", throwing: "throw · ing",
    fighting: "fight · ing", watching: "watch · ing",
    marching: "march · ing", practicing: "prac · ti · cing",
    wrestling: "wres · tling",
    celebrate: "cel · e · brate", celebrates: "cel · e · brates",
    dangerous: "dan · ger · ous",
    columbus: "co · lum · bus",
    tradition: "tra · di · tion", traditions: "tra · di · tions",
    champion: "cham · pi · on", champions: "cham · pi · ons",
    championship: "cham · pi · on · ship",
    reception: "re · cep · tion",
    receiver: "re · ceiv · er", receivers: "re · ceiv · ers",
    lateral: "lat · er · al",
    miracle: "mir · a · cle",
    popular: "pop · u · lar",
    stadium: "sta · di · um", stadiums: "sta · di · ums",
    wonderful: "won · der · ful", beautiful: "beau · ti · ful",
    athletic: "ath · let · ic",
    different: "dif · fer · ent",
    beginning: "be · gin · ning",
    important: "im · por · tant",
    remember: "re · mem · ber",
    invented: "in · ven · ted",
    destroyed: "de · stroyed",
    millions: "mil · lions",
    favorite: "fa · vor · ite",
    celebrate: "cel · e · brate",
    excited: "ex · ci · ted"
  };

  function syllabify(word) {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (clean.length <= 3) return clean;

    // Check dictionary first
    if (SYLLABLE_MAP[clean]) return SYLLABLE_MAP[clean];

    // Phonetic syllabification
    return syllabifyPhonetic(clean);
  }

  function syllabifyPhonetic(word) {
    const vowels = "aeiouy";
    const isV = (ch) => vowels.includes(ch);

    // Vowel pairs that form one sound
    const vPairs = new Set(["ai","ay","ea","ee","ei","ey","oa","oo","ou","ow","ue","au","aw","oi","oy","ew","ie"]);

    // Valid syllable-starting consonant pairs
    const onsets2 = new Set(["bl","br","ch","cl","cr","dr","dw","fl","fr","gl","gn","gr","kn","ph","pl","pr","qu","sc","sh","sk","sl","sm","sn","sp","st","sw","th","tr","tw","wh","wr"]);

    // Valid syllable-starting consonant triples
    const onsets3 = new Set(["scr","shr","spl","spr","squ","str","thr"]);

    // Find vowel nuclei
    const nuclei = [];
    let i = 0;
    while (i < word.length) {
      if (isV(word[i])) {
        let end = i + 1;
        if (i + 1 < word.length && vPairs.has(word[i] + word[i + 1])) {
          end = i + 2;
        }
        nuclei.push({ s: i, e: end });
        i = end;
      } else {
        i++;
      }
    }

    // Handle silent final e (but not -Cle patterns like ta-ble)
    if (nuclei.length > 1) {
      const last = nuclei[nuclei.length - 1];
      if (last.s === word.length - 1 && word[last.s] === "e" && last.s >= 1 && !isV(word[last.s - 1])) {
        const isCLE = last.s >= 2 && word[last.s - 1] === "l" && !isV(word[last.s - 2]);
        if (!isCLE) nuclei.pop();
      }
    }

    if (nuclei.length <= 1) return word;

    // Build syllables using Maximal Onset Principle
    const syls = [];
    let start = 0;

    for (let n = 0; n < nuclei.length - 1; n++) {
      const cStart = nuclei[n].e;
      const cEnd = nuclei[n + 1].s;
      const cluster = word.slice(cStart, cEnd);
      const cLen = cluster.length;
      let splitAt = 0;

      if (cLen >= 1) {
        // Find longest valid onset from the right
        if (cLen >= 3 && onsets3.has(cluster.slice(cLen - 3))) {
          splitAt = cLen - 3;
        } else if (cLen >= 2 && onsets2.has(cluster.slice(cLen - 2))) {
          splitAt = cLen - 2;
        } else {
          splitAt = cLen - 1;
        }

        // Don't break ck, ng, nk digraphs
        if (splitAt > 0 && splitAt < cLen) {
          const left = cluster[splitAt - 1];
          const right = cluster[splitAt];
          if ((left === "c" && right === "k") ||
              (left === "n" && right === "g") ||
              (left === "n" && right === "k") ||
              (left === "g" && right === "h")) {
            splitAt++;
          }
        }
      }

      syls.push(word.slice(start, cStart + splitAt));
      start = cStart + splitAt;
    }
    syls.push(word.slice(start));

    // Merge syllables without vowels into neighbors
    const result = [];
    for (let j = 0; j < syls.length; j++) {
      if (!syls[j]) continue;
      if (result.length > 0 && !/[aeiouy]/.test(syls[j])) {
        result[result.length - 1] += syls[j];
      } else {
        result.push(syls[j]);
      }
    }

    // Fix -Cle endings: move consonant from prev syllable to "le"
    if (result.length >= 2) {
      const last = result[result.length - 1];
      const prev = result[result.length - 2];
      if (last === "le" && prev.length > 1 && !isV(prev[prev.length - 1])) {
        result[result.length - 1] = prev[prev.length - 1] + "le";
        result[result.length - 2] = prev.slice(0, -1);
      }
    }

    return result.length > 1 ? result.join(" · ") : word;
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

    // Always remove bottom-fixed first
    practiceStatus.classList.remove("bottom-fixed");

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
      practiceStatus.classList.add("bottom-fixed");
      wordBank.classList.add("hidden");
      readerBody.classList.add("mode-word");
      initWordMode();
    } else if (mode === "line") {
      stopSpeaking();
      readAloudBtn.classList.add("hidden");
      stopBtn.classList.add("hidden");
      practiceProgress.classList.remove("hidden");
      practiceStatus.classList.remove("hidden");
      practiceStatus.classList.add("bottom-fixed");
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
          span.addEventListener("click", () => handleWordTap(span, w));
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

    // Reset mic button and position
    const micBtn = $("#practice-mic-btn");
    if (micBtn) micBtn.classList.remove("recording");
    const status = $("#practice-status");
    if (status) status.classList.remove("bottom-fixed");
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

    state.lineIndex++;
    state.practiceAttempts = 0;
    state.helpInProgress = false;

    updatePracticeProgress(state.lineIndex, state.practiceLines.length);

    if (state.lineIndex < state.practiceLines.length) {
      highlightVisualLine(state.lineIndex);
      updatePracticePrompt();
    } else {
      highlightVisualLine(state.lineIndex);
      practiceComplete();
    }
  }

  // --- Line-by-Line Mode (visual lines) ---
  function initLineMode() {
    const body = $("#reader-body");
    const story = state.currentStory;
    body.innerHTML = "";

    // Render all text normally
    const allWordSpans = [];
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
          span.addEventListener("click", () => handleWordTap(span, w));
          pEl.appendChild(span);
          allWordSpans.push({ span, word: w });
        }
      });
      body.appendChild(pEl);
    });

    // After layout, detect visual lines by Y-position of each word
    requestAnimationFrame(() => {
      const visualLines = [];
      let currentLineTop = null;
      let currentLine = null;

      allWordSpans.forEach(({ span, word }) => {
        const top = span.getBoundingClientRect().top;
        if (currentLineTop === null || Math.abs(top - currentLineTop) > 5) {
          if (currentLine) visualLines.push(currentLine);
          currentLine = { words: [word], spans: [span] };
          currentLineTop = top;
        } else {
          currentLine.words.push(word);
          currentLine.spans.push(span);
        }
      });
      if (currentLine && currentLine.spans.length > 0) {
        visualLines.push(currentLine);
      }

      state.practiceLines = visualLines;
      state.lineIndex = 0;
      state.practiceAttempts = 0;

      // Fade all words, then highlight first line
      allWordSpans.forEach(({ span }) => span.classList.add("vline-faded"));
      if (visualLines.length > 0) {
        highlightVisualLine(0);
      }

      updatePracticeProgress(0, visualLines.length);
      updatePracticePrompt();
      setupPracticeMic();
      setupPracticeHearBtn();
      setupPracticeNextBtn();
    });
  }

  function highlightVisualLine(index) {
    const lines = state.practiceLines;
    const body = $("#reader-body");

    lines.forEach((line, i) => {
      line.spans.forEach((span) => {
        span.classList.remove("vline-active", "vline-done", "vline-faded");
        if (i < index) {
          span.classList.add("vline-done");
        } else if (i === index) {
          span.classList.add("vline-active");
        } else {
          span.classList.add("vline-faded");
        }
      });
    });

    // Position floating highlight bar
    let bar = body.querySelector(".line-highlight-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "line-highlight-bar";
      body.appendChild(bar);
    }

    if (index < lines.length && lines[index].spans.length > 0) {
      const firstSpan = lines[index].spans[0];
      const lastSpan = lines[index].spans[lines[index].spans.length - 1];
      const bodyRect = body.getBoundingClientRect();
      const firstRect = firstSpan.getBoundingClientRect();
      const lastRect = lastSpan.getBoundingClientRect();

      bar.style.top = (firstRect.top - bodyRect.top - 6) + "px";
      bar.style.left = (firstRect.left - bodyRect.left - 10) + "px";
      bar.style.width = (lastRect.right - firstRect.left + 20) + "px";
      bar.style.height = (firstRect.height + 12) + "px";
      bar.style.display = "block";

      firstSpan.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      bar.style.display = "none";
    }
  }

  function handleLineResult(transcript) {
    const lines = state.practiceLines;
    if (state.lineIndex >= lines.length) return;

    const currentLine = lines[state.lineIndex];

    if (fuzzyLineMatch(transcript, currentLine.words)) {
      lineCorrect(currentLine);
    } else {
      state.practiceAttempts++;
      currentLine.spans.forEach((s) => s.classList.add("vline-wrong-flash"));
      setTimeout(() => currentLine.spans.forEach((s) => s.classList.remove("vline-wrong-flash")), 500);

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
    // Flash correct on current line's word spans
    line.spans.forEach((s) => s.classList.add("vline-correct-flash"));

    const t = setTimeout(() => {
      if (state.readingMode !== "line") return;
      line.spans.forEach((s) => s.classList.remove("vline-correct-flash"));
      state.lineIndex++;
      state.practiceAttempts = 0;

      updatePracticeProgress(state.lineIndex, state.practiceLines.length);

      if (state.lineIndex < state.practiceLines.length) {
        highlightVisualLine(state.lineIndex);
        updatePracticePrompt();
      } else {
        highlightVisualLine(state.lineIndex);
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
        state.lineIndex++;
        state.practiceAttempts = 0;

        updatePracticeProgress(state.lineIndex, state.practiceLines.length);

        if (state.lineIndex < state.practiceLines.length) {
          highlightVisualLine(state.lineIndex);
          updatePracticePrompt();
        } else {
          highlightVisualLine(state.lineIndex);
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
