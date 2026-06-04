/**
 * skipper-stories.js
 * Tab switching, modal, submission POST, client-side story load from R2.
 */

// ---------------------------------------------------------------------------
// Prompt registry — built from inline data embedded by the page
// ---------------------------------------------------------------------------
const SS_PROMPTS = {};

(function buildPromptRegistry() {
  // Walk the DOM to capture prompt text for each prompt-id
  document.querySelectorAll('.ss-prompt-card').forEach(card => {
    const id   = card.id.replace('prompt-', '');
    const text = card.querySelector('.ss-prompt-text')?.textContent?.trim() || '';
    const tabPanel = card.closest('.ss-panel');
    const tabId    = tabPanel ? tabPanel.id.replace('ss-panel-', '') : '';
    const tabLabel = tabPanel ? document.getElementById('ss-tab-' + tabId)?.textContent?.trim() : '';
    SS_PROMPTS[id] = { id, text, tabId, tabLabel };
  });
})();

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------
function ssSelectTab(tabId) {
  document.querySelectorAll('.ss-tab').forEach(t => {
    const active = t.id === 'ss-tab-' + tabId;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.ss-panel').forEach(p => {
    const active = p.id === 'ss-panel-' + tabId;
    p.classList.toggle('active', active);
    if (active) {
      p.removeAttribute('hidden');
      ssLoadStoriesForTab(tabId);
    } else {
      p.setAttribute('hidden', '');
    }
  });
}

// ---------------------------------------------------------------------------
// Modal state
// ---------------------------------------------------------------------------
let ssCurrentPromptId = null;

function ssOpenModal(promptId, _index) {
  const prompt = SS_PROMPTS[promptId];
  if (!prompt) return;

  ssCurrentPromptId = promptId;

  document.getElementById('ssModalEyebrow').textContent =
    prompt.tabLabel ? `${prompt.tabLabel}` : 'Skipper Stories';
  document.getElementById('ssModalPromptDisplay').textContent = prompt.text;

  // Reset form and states
  document.getElementById('ssForm').reset();
  document.getElementById('ssForm').style.display = 'block';
  document.getElementById('ssSuccess').style.display = 'none';
  document.getElementById('ssError').style.display = 'none';
  document.getElementById('ssSubmitBtn').disabled = false;
  document.getElementById('ssSubmitBtn').textContent = 'Share this story';

  // Show overlay
  document.getElementById('ssModalOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Focus first field
  setTimeout(() => document.getElementById('ssName')?.focus(), 50);
}

function ssCloseModal() {
  document.getElementById('ssModalOverlay').style.display = 'none';
  document.body.style.overflow = '';
  ssCurrentPromptId = null;
}

function ssCloseModalOnOverlay(e) {
  if (e.target === document.getElementById('ssModalOverlay')) ssCloseModal();
}

// Sync anonymous checkbox → publication radio
function ssSyncAnon(checkbox) {
  if (checkbox.checked) {
    document.getElementById('ssPubAnon').checked = true;
  }
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('ssModalOverlay').style.display !== 'none') {
    ssCloseModal();
  }
});

// ---------------------------------------------------------------------------
// Submission
// ---------------------------------------------------------------------------
async function ssSubmit(e) {
  e.preventDefault();
  if (!ssCurrentPromptId) return;

  const btn = document.getElementById('ssSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const form = e.target;
  const fd   = new FormData(form);

  const prompt = SS_PROMPTS[ssCurrentPromptId];

  const payload = {
    prompt_id:    ssCurrentPromptId,
    prompt_text:  prompt?.text  || '',
    tab_id:       prompt?.tabId || '',
    tab_label:    prompt?.tabLabel || '',
    name:         fd.get('name')        || '',
    email:        fd.get('email')       || '',
    phone:        fd.get('phone')       || '',
    platoon:      fd.get('platoon')     || '',
    years:        fd.get('years')       || '',
    response:     fd.get('response')    || '',
    publication:  fd.get('publication') || '',
    page_url:     window.location.href,
    referrer_url: document.referrer || null,
  };

  try {
    const res = await fetch('/submit/skipper-story', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Server error ' + res.status);

    const json = await res.json();
    const storyId = json.story_id || '';

    // Show success
    document.getElementById('ssForm').style.display = 'none';
    document.getElementById('ssError').style.display = 'none';

    const removalEl = document.getElementById('ssSuccessRemoval');
    if (storyId) {
      removalEl.innerHTML = `<a class="ss-removal-link" href="/request/?type=removal&story=${encodeURIComponent(storyId)}">Need to remove this later?</a> Save that link — it pre-fills the removal form.`;
    } else {
      removalEl.textContent = '';
    }

    document.getElementById('ssSuccess').style.display = 'block';

  } catch (err) {
    document.getElementById('ssErrorMsg').textContent =
      'Something went wrong. Please try again, or email admin@angryskipperarchive.org directly.';
    document.getElementById('ssError').style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Share this story';
  }
}

function ssRetry() {
  document.getElementById('ssError').style.display = 'none';
  document.getElementById('ssSubmitBtn').disabled = false;
  document.getElementById('ssSubmitBtn').textContent = 'Share this story';
}

// ---------------------------------------------------------------------------
// Client-side story loading from R2
// ---------------------------------------------------------------------------
const SS_STORIES_LOADED = {};

async function ssLoadStoriesForTab(tabId) {
  if (SS_STORIES_LOADED[tabId]) return;  // already loaded
  SS_STORIES_LOADED[tabId] = true;

  try {
    const res = await fetch(`/api/skipper-stories/published?tab=${encodeURIComponent(tabId)}`);
    if (!res.ok) return;

    const { stories } = await res.json();
    if (!stories || !stories.length) return;

    const section = document.getElementById('ss-stories-' + tabId);
    const list    = document.getElementById('ss-stories-list-' + tabId);
    if (!section || !list) return;

    // Group by prompt_id
    const grouped = {};
    for (const story of stories) {
      const pid = story.prompt_id || 'unknown';
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(story);
    }

    let html = '';
    for (const [pid, group] of Object.entries(grouped)) {
      const promptText = SS_PROMPTS[pid]?.text || group[0]?.prompt_text || '';
      html += `<div class="ss-story-group">`;
      if (promptText) {
        html += `<div class="ss-story-group-prompt">${escHtml(promptText)}</div>`;
      }
      for (const story of group) {
        html += renderStoryCard(story);
      }
      html += `</div>`;
    }

    list.innerHTML = html;
    section.style.display = 'block';

  } catch (err) {
    // Fail silently — stories section just stays hidden
  }
}

function renderStoryCard(story) {
  const displayName = story.publication === 'anonymous'
    ? 'Anonymous'
    : escHtml(story.name || 'Anonymous');

  const meta = [
    story.platoon ? escHtml(story.platoon + ' Platoon') : null,
    story.years   ? escHtml(story.years) : null,
  ].filter(Boolean).join(' · ');

  const storyId   = story.story_id || '';
  const removalHref = storyId
    ? `/request/?type=removal&story=${encodeURIComponent(storyId)}`
    : '/request/?type=removal';

  return `
    <div class="ss-story-card" id="story-${escHtml(storyId)}">
      <div class="ss-story-response">${escHtml(story.response || '')}</div>
      <div class="ss-story-meta">
        <span class="ss-story-name">${displayName}</span>
        ${meta ? `<span class="ss-story-detail">${meta}</span>` : ''}
      </div>
      <div class="ss-story-footer">
        <button class="ss-share-version-btn"
          onclick="ssOpenModal('${escHtml(story.prompt_id || '')}', 0)"
        >Share your version</button>
        <a class="ss-story-removal" href="${removalHref}">Request removal</a>
      </div>
    </div>
  `;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// Pre-select prompt from query string (e.g. from "Share your version" deep link)
// ---------------------------------------------------------------------------
(function () {
  const params   = new URLSearchParams(window.location.search);
  const promptId = params.get('prompt');
  const tabId    = params.get('tab');

  if (tabId) ssSelectTab(tabId);
  if (promptId) {
    setTimeout(() => {
      const card = document.getElementById('prompt-' + promptId);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ssOpenModal(promptId, 0);
    }, 200);
  }

  // Load stories for the initially active tab
  const firstActivePanel = document.querySelector('.ss-panel.active');
  if (firstActivePanel) {
    const firstTabId = firstActivePanel.id.replace('ss-panel-', '');
    ssLoadStoriesForTab(firstTabId);
  }
})();
