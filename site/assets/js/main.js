// ── ACCOUNT SURVEY MODAL ──────────────────────────
(function () {
  // State
  var _config      = null;
  var _platoon     = null;
  var _sections    = [];
  var _sectionIdx  = 0;
  var _answers     = {};   // { questionId: value }
  var _skipped     = {};   // { sectionId: reason }
  var _respondent  = {};   // { first_name, last_name, contact }

  // ── Open / close ──────────────────────────────
  window.surveyOpen = function () {
    _config = window.SURVEY_CONFIG;
    if (!_config) return;
    _platoon    = null;
    _sections   = [];
    _sectionIdx = 0;
    _answers    = {};
    _skipped    = {};
    _respondent = {};
    _renderIntro();
    document.getElementById('survey-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.surveyClose = function () {
    document.getElementById('survey-modal').classList.remove('open');
    document.body.style.overflow = '';
  };

  // ── Intro card (name + platoon) ───────────────
  function _renderIntro() {
    var c = _config;
    var platoonOpts = c.platoons.map(function (p) {
      return '<label class="sv-radio-label"><input type="radio" name="sv-platoon" value="' + p.id + '"> ' + p.label + '</label>';
    }).join('');

    _setCard(
      'Your information',
      null,
      '<div class="sv-intro-text">' + (c.intro_shared || '') + '</div>' +
      '<div class="sv-field-group">' +
        '<label class="sv-label">First name</label>' +
        '<input class="sv-input" id="sv-fname" type="text" autocomplete="given-name">' +
      '</div>' +
      '<div class="sv-field-group">' +
        '<label class="sv-label">Last name</label>' +
        '<input class="sv-input" id="sv-lname" type="text" autocomplete="family-name" oninput="document.getElementById(\'sv-lname-err\').textContent=\'\'">' +
        '<div class="sv-field-error" id="sv-lname-err"></div>' +
      '</div>' +
      '<div class="sv-field-group">' +
        '<label class="sv-label">Contact (email or phone) <span class="sv-optional">optional</span></label>' +
        '<input class="sv-input" id="sv-contact" type="text" autocomplete="email">' +
        '<div class="sv-privacy-note">Your contact information is kept private and will never be published.</div>' +
      '</div>' +
      '<div class="sv-field-group">' +
        '<label class="sv-label">Have you shared this account before — in writing, in an interview, or with another archive?</label>' +
        '<div class="sv-radio-group">' +
          '<label class="sv-radio-label"><input type="radio" name="sv-shared" value="yes"> Yes</label>' +
          '<label class="sv-radio-label"><input type="radio" name="sv-shared" value="no"> No</label>' +
          '<label class="sv-radio-label"><input type="radio" name="sv-shared" value="partially"> Partially</label>' +
        '</div>' +
        '<div id="sv-shared-detail-wrap" style="display:none;margin-top:8px;">' +
          '<input class="sv-input" id="sv-shared-detail" type="text" placeholder="Where or with whom, if you\'re comfortable sharing that">' +
        '</div>' +
      '</div>' +
      '<div class="sv-field-group">' +
        '<label class="sv-label">Which platoon were you with?</label>' +
        '<div class="sv-radio-group">' + platoonOpts + '</div>' +
      '</div>',
      null,
      '<button class="sv-btn-primary" onclick="surveyIntroNext()">Next</button>'
    );

    // Wire shared-before detail toggle
    setTimeout(function () {
      document.querySelectorAll('input[name="sv-shared"]').forEach(function (r) {
        r.addEventListener('change', function () {
          var wrap = document.getElementById('sv-shared-detail-wrap');
          if (wrap) wrap.style.display = this.value === 'yes' || this.value === 'partially' ? 'block' : 'none';
        });
      });
    }, 0);
  }

  window.surveyIntroNext = function () {
    var fname   = (document.getElementById('sv-fname')   || {}).value || '';
    var lname   = (document.getElementById('sv-lname')   || {}).value || '';
    var contact = (document.getElementById('sv-contact') || {}).value || '';
    var sharedEl = document.querySelector('input[name="sv-shared"]:checked');
    var sharedDetailEl = document.getElementById('sv-shared-detail');

    if (!lname.trim()) {
      var lnErr = document.getElementById('sv-lname-err');
      if (lnErr) { lnErr.textContent = 'Please enter your last name.'; lnErr.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }

    var platoonEl = document.querySelector('input[name="sv-platoon"]:checked');
    if (!platoonEl) { _showError('Please select your platoon.'); return; }

    _respondent = {
      first_name: fname.trim(),
      last_name:  lname.trim(),
      contact:    contact.trim(),
      shared_before: sharedEl ? sharedEl.value : null,
      shared_before_detail: (sharedDetailEl && sharedDetailEl.value) ? sharedDetailEl.value.trim() : null
    };
    _platoon = platoonEl.value;

    // Build section list for this platoon
    _sections = _config.sections.filter(function (s) {
      return s.platoons.indexOf(_platoon) !== -1;
    });
    _sectionIdx = 0;

    // Show platoon-specific intro if present
    var platoonIntro = (_config.intro_by_platoon || {})[_platoon];
    if (platoonIntro) {
      _setCard(
        null,
        null,
        '<div class="sv-intro-text">' + platoonIntro + '</div>',
        null,
        '<button class="sv-btn-primary" onclick="surveyRenderSection()">Continue</button>'
      );
    } else {
      surveyRenderSection();
    }
  };

  // ── Section rendering ─────────────────────────
  window.surveyRenderSection = function () {
    if (_sectionIdx >= _sections.length) {
      _renderClosing();
      return;
    }
    var section = _sections[_sectionIdx];
    var questionsHtml = _renderQuestions(section.questions);
    var progress = 'Section ' + (_sectionIdx + 1) + ' of ' + _sections.length;

    _setCard(
      section.title,
      progress,
      questionsHtml,
      _buildSkipBar(section.id),
      '<button class="sv-btn-primary" onclick="surveyNextSection(\'' + section.id + '\')">Next</button>'
    );

    _wireConditionals();
  };

  function _renderQuestions(questions) {
    return questions.map(function (q) {
      return '<div class="sv-question" id="sv-qwrap-' + q.id + '" data-qid="' + q.id + '">' +
               _renderQuestion(q) +
             '</div>';
    }).join('');
  }

  function _renderQuestion(q) {
    var html = '<div class="sv-question-text">' + q.text + '</div>';
    if (q.helper) html += '<div class="sv-helper">' + q.helper + '</div>';

    switch (q.type) {
      case 'short-text':
        html += '<input class="sv-input" id="sv-ans-' + q.id + '" type="text">';
        break;
      case 'textarea':
        html += '<textarea class="sv-textarea" id="sv-ans-' + q.id + '" rows="4"></textarea>';
        break;
      case 'radio':
        html += '<div class="sv-radio-group">' +
          (q.options || []).map(function (opt) {
            return '<label class="sv-radio-label"><input type="radio" name="sv-' + q.id + '" value="' + _esc(opt) + '" onchange="surveyAnswerChanged(\'' + q.id + '\',this.value)"> ' + opt + '</label>';
          }).join('') +
          (q.other ? '<label class="sv-radio-label"><input type="radio" name="sv-' + q.id + '" value="__other__" onchange="surveyAnswerChanged(\'' + q.id + '\',\'__other__\')"> Other</label><input class="sv-input sv-other-input" id="sv-other-' + q.id + '" type="text" placeholder="Please specify" style="display:none;">' : '') +
        '</div>';
        if (q.conditional_detail) {
          html += '<div id="sv-cdet-' + q.id + '" style="display:none;margin-top:8px;">' +
            '<input class="sv-input" id="sv-ans-' + q.conditional_detail.id + '" type="text" placeholder="' + q.conditional_detail.text + '">' +
          '</div>';
        }
        break;
      case 'checkbox':
        html += '<div class="sv-checkbox-group">' +
          (q.options || []).map(function (opt) {
            return '<label class="sv-check-label"><input type="checkbox" name="sv-' + q.id + '" value="' + _esc(opt) + '" onchange="surveyAnswerChanged(\'' + q.id + '\',null)"> ' + opt + '</label>';
          }).join('') +
          (q.other ? '<label class="sv-check-label"><input type="checkbox" name="sv-' + q.id + '" value="__other__" onchange="surveyAnswerChanged(\'' + q.id + '\',\'__other__\')"> Other</label><input class="sv-input sv-other-input" id="sv-other-' + q.id + '" type="text" placeholder="Please specify" style="display:none;">' : '') +
        '</div>';
        break;
      case 'yes-no':
        html += '<div class="sv-radio-group">' +
          (q.options || ['Yes', 'No']).map(function (opt) {
            return '<label class="sv-radio-label"><input type="radio" name="sv-' + q.id + '" value="' + _esc(opt) + '" onchange="surveyAnswerChanged(\'' + q.id + '\',this.value)"> ' + opt + '</label>';
          }).join('') +
        '</div>';
        if (q.follow_up) {
          html += '<div id="sv-fu-' + q.id + '" style="display:none;margin-top:12px;">' +
            '<div class="sv-helper sv-follow-up-label">' + q.follow_up.text + '</div>' +
            '<textarea class="sv-textarea" id="sv-ans-' + q.follow_up.id + '" rows="3"></textarea>' +
          '</div>';
        }
        break;
    }
    return html;
  }

  // ── Answer change handler ─────────────────────
  window.surveyAnswerChanged = function (qid, val) {
    _answers[qid] = val;

    // Toggle yes-no follow-up
    var fuWrap = document.getElementById('sv-fu-' + qid);
    if (fuWrap) {
      var q = _findQuestion(qid);
      fuWrap.style.display = (q && q.follow_up && val === q.follow_up.if_value) ? 'block' : 'none';
    }

    // Toggle radio other input
    var otherInput = document.getElementById('sv-other-' + qid);
    if (otherInput) otherInput.style.display = (val === '__other__') ? 'block' : 'none';

    // Toggle conditional_detail
    var cdetWrap = document.getElementById('sv-cdet-' + qid);
    if (cdetWrap) {
      var q2 = _findQuestion(qid);
      cdetWrap.style.display = (q2 && q2.conditional_detail && val === q2.conditional_detail.if_value) ? 'block' : 'none';
    }

    // Update skip button label
    _updateSkipLabel(_currentSectionId());
  };

  // ── Conditionals (condition: { if, eq }) ──────
  function _wireConditionals() {
    var section = _sections[_sectionIdx];
    if (!section) return;
    section.questions.forEach(function (q) {
      if (q.condition) {
        _applyCondition(q);
      }
    });
  }

  function _applyCondition(q) {
    var parentVal = _answers[q.condition.if];
    var wrap = document.getElementById('sv-qwrap-' + q.id);
    if (!wrap) return;
    wrap.style.display = (parentVal === q.condition.eq) ? 'block' : 'none';
  }

  // ── Skip logic ────────────────────────────────
  function _buildSkipBar(sectionId) {
    var reasons = (_config.skip_reasons || []).map(function (r, i) {
      return '<label class="sv-check-label"><input type="checkbox" name="sv-skip-reason" value="' + _esc(r) + '"> ' + r + '</label>';
    }).join('');

    return '<div class="sv-skip-bar" id="sv-skip-bar-' + sectionId + '">' +
      '<button class="sv-btn-skip" id="sv-skip-btn-' + sectionId + '" onclick="surveyToggleSkip(\'' + sectionId + '\')">' +
        'Skip this section' +
      '</button>' +
      '<div class="sv-skip-reasons" id="sv-skip-reasons-' + sectionId + '" style="display:none;">' +
        '<div class="sv-skip-reasons-label">I\'d rather not answer these questions because:</div>' +
        reasons +
        '<div style="margin-top:12px;">' +
          '<button class="sv-btn-skip-confirm" onclick="surveyConfirmSkip(\'' + sectionId + '\')">Confirm and continue</button>' +
          '<button class="sv-btn-skip-cancel" onclick="surveyToggleSkip(\'' + sectionId + '\')">Cancel</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  window.surveyToggleSkip = function (sectionId) {
    var el = document.getElementById('sv-skip-reasons-' + sectionId);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  };

  window.surveyConfirmSkip = function (sectionId) {
    var checked = document.querySelectorAll('input[name="sv-skip-reason"]:checked');
    var reasons = Array.from(checked).map(function (c) { return c.value; });
    _skipped[sectionId] = reasons.length ? reasons : ['(no reason given)'];
    _sectionIdx++;
    surveyRenderSection();
  };

  function _updateSkipLabel (sectionId) {
    var btn = document.getElementById('sv-skip-btn-' + sectionId);
    if (!btn) return;
    var hasAnswers = _sectionHasAnswers(_sections[_sectionIdx]);
    btn.textContent = hasAnswers ? 'Skip remaining questions' : 'Skip this section';
  }

  function _sectionHasAnswers (section) {
    if (!section) return false;
    return section.questions.some(function (q) {
      var el = document.getElementById('sv-ans-' + q.id);
      if (el && el.value && el.value.trim()) return true;
      var radios = document.querySelectorAll('input[name="sv-' + q.id + '"]:checked');
      if (radios.length) return true;
      return false;
    });
  }

  function _currentSectionId () {
    return _sections[_sectionIdx] ? _sections[_sectionIdx].id : null;
  }

  // ── Next section ──────────────────────────────
  window.surveyNextSection = function (sectionId) {
    _collectSectionAnswers(_sections[_sectionIdx]);
    _sectionIdx++;
    surveyRenderSection();
  };

  function _collectSectionAnswers (section) {
    if (!section) return;
    section.questions.forEach(function (q) {
      switch (q.type) {
        case 'short-text':
        case 'textarea': {
          var el = document.getElementById('sv-ans-' + q.id);
          if (el) _answers[q.id] = el.value.trim();
          break;
        }
        case 'radio':
        case 'yes-no': {
          var checked = document.querySelector('input[name="sv-' + q.id + '"]:checked');
          if (checked) {
            var v = checked.value === '__other__'
              ? ((document.getElementById('sv-other-' + q.id) || {}).value || '').trim()
              : checked.value;
            _answers[q.id] = v;
          }
          // Collect conditional_detail
          if (q.conditional_detail) {
            var cdet = document.getElementById('sv-ans-' + q.conditional_detail.id);
            if (cdet && cdet.value.trim()) _answers[q.conditional_detail.id] = cdet.value.trim();
          }
          // Collect follow_up
          if (q.follow_up) {
            var fu = document.getElementById('sv-ans-' + q.follow_up.id);
            if (fu && fu.value.trim()) _answers[q.follow_up.id] = fu.value.trim();
          }
          break;
        }
        case 'checkbox': {
          var allChecked = document.querySelectorAll('input[name="sv-' + q.id + '"]:checked');
          var vals = Array.from(allChecked).map(function (c) {
            return c.value === '__other__'
              ? ((document.getElementById('sv-other-' + q.id) || {}).value || '').trim()
              : c.value;
          }).filter(Boolean);
          if (vals.length) _answers[q.id] = vals;
          break;
        }
      }
    });
  }

  // ── Closing card ──────────────────────────────
  function _renderClosing () {
    var closingQs = (_config.closing_questions || []);
    var html = closingQs.map(function (q) {
      return '<div class="sv-question" id="sv-qwrap-' + q.id + '">' + _renderQuestion(q) + '</div>';
    }).join('');

    // Hidden contact field — revealed by validation if follow-up is requested
    var contactField =
      '<div id="sv-contact-needed" class="sv-field-group sv-contact-needed" style="display:none;">' +
        '<label class="sv-label">Contact email or phone <span class="sv-required">required for follow-up</span></label>' +
        '<input class="sv-input" id="sv-contact-closing" type="text" autocomplete="email" placeholder="Email or phone number">' +
        '<div class="sv-privacy-note">Your contact information is kept private and will never be published.</div>' +
      '</div>';

    _setCard(
      'Final questions',
      null,
      html + contactField,
      null,
      '<button class="sv-btn-primary" onclick="surveySubmit()">Submit your account</button>'
    );
  }

  // ── Submission ────────────────────────────────
  window.surveySubmit = function () {
    // Collect closing answers
    (_config.closing_questions || []).forEach(function (q) {
      switch (q.type) {
        case 'short-text':
        case 'textarea': {
          var el = document.getElementById('sv-ans-' + q.id);
          if (el) _answers[q.id] = el.value.trim();
          break;
        }
        case 'yes-no': {
          var checked = document.querySelector('input[name="sv-' + q.id + '"]:checked');
          if (checked) _answers[q.id] = checked.value;
          if (q.follow_up) {
            var fu = document.getElementById('sv-ans-' + q.follow_up.id);
            if (fu && fu.value.trim()) _answers[q.follow_up.id] = fu.value.trim();
          }
          break;
        }
      }
    });

    var payload = Object.assign({}, _respondent, {
      event_slug:    _config.event_slug,
      event_title:   _config.event_title,
      platoon:       _platoon,
      answers:       _answers,
      skipped:       _skipped,
      page_url:      window.location.href,
    });

    // Pick up contact from closing field if it was filled in after validation
    var closingContactEl = document.getElementById('sv-contact-closing');
    if (closingContactEl && closingContactEl.value.trim()) {
      _respondent.contact = closingContactEl.value.trim();
    }

    // Validate: follow-up conversation requested but no contact provided
    var permissionAnswer = _answers['closing-permission'] || '';
    var needsContact = permissionAnswer.indexOf('discuss') !== -1;
    if (needsContact && !(_respondent.contact && _respondent.contact.trim())) {
      var contactNeededEl = document.getElementById('sv-contact-needed');
      if (contactNeededEl) {
        contactNeededEl.style.display = 'block';
        var ci = document.getElementById('sv-contact-closing');
        if (ci) { ci.focus(); ci.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
      _showError('You\'ve requested a follow-up conversation. Please add a contact email or phone number above.');
      return;
    }

    var btn = document.querySelector('.sv-btn-primary');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

    fetch('/submit/account', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.ok) {
        _setCard(
          'Thank you',
          null,
          '<div class="sv-thanks">' +
            '<p>Your account has been received and will be reviewed by the archive.</p>' +
            '<p>If you provided contact information, we may reach out with follow-up questions.</p>' +
          '</div>',
          null,
          '<button class="sv-btn-primary" onclick="surveyClose()">Close</button>'
        );
      } else {
        if (btn) { btn.disabled = false; btn.textContent = 'Submit your account'; }
        _showError('Something went wrong. Please try again or contact us directly.');
      }
    })
    .catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Submit your account'; }
      _showError('Could not reach the server. Please check your connection and try again.');
    });
  };

  // ── Card renderer ─────────────────────────────
  function _setCard (title, meta, body, skipBar, footer) {
    var el = document.getElementById('survey-card');
    if (!el) return;
    el.innerHTML =
      (title ? '<div class="sv-card-title">' + title + '</div>' : '') +
      (meta  ? '<div class="sv-card-meta">'  + meta  + '</div>' : '') +
      '<div class="sv-card-body">' + (body || '') + '</div>' +
      (skipBar ? skipBar : '') +
      '<div class="sv-card-footer">' + (footer || '') + '</div>';
  }

  function _showError (msg) {
    var existing = document.getElementById('sv-error');
    if (existing) existing.remove();
    var err = document.createElement('div');
    err.id = 'sv-error';
    err.className = 'sv-error';
    err.textContent = msg;
    var footer = document.querySelector('.sv-card-footer');
    if (footer) footer.insertAdjacentElement('beforebegin', err);
  }

  // ── Helpers ───────────────────────────────────
  function _findQuestion (qid) {
    var all = (_config.sections || []).reduce(function (acc, s) {
      return acc.concat(s.questions || []);
    }, []).concat(_config.closing_questions || []);
    return all.find(function (q) { return q.id === qid; }) || null;
  }

  function _esc (str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

})();

// ── SLIDESHOW LIGHTBOX ────────────────────────────
let _slides = [];
let _slideIdx = 0;

function lbOpen(idx, slides) {
  _slides = slides;
  _slideIdx = idx;
  _lbRender();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _lbRender() {
  const s = _slides[_slideIdx];
  document.getElementById('lb-img').src = s.src;
  document.getElementById('lb-cap-p').textContent = s.caption || '';
  document.getElementById('lb-cap-s').textContent = s.credit || '';
  document.getElementById('lb-cap-date').textContent = s.date || '';
  document.getElementById('lb-counter').textContent =
    _slides.length > 1 ? `${_slideIdx + 1} of ${_slides.length}` : '';
  document.getElementById('lb-prev').style.display = _slides.length > 1 ? '' : 'none';
  document.getElementById('lb-next').style.display = _slides.length > 1 ? '' : 'none';
}

function lbNext() {
  _slideIdx = (_slideIdx + 1) % _slides.length;
  _lbRender();
}

function lbPrev() {
  _slideIdx = (_slideIdx - 1 + _slides.length) % _slides.length;
  _lbRender();
}

function lbClose(e) {
  if (!e || e.target === document.getElementById('lightbox') ||
      (e.target && e.target.classList.contains('lb-close'))) {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
    _slides = [];
  }
}

function lbOpenSingle(src, caption) {
  _slides = [{ src: src, caption: caption }];
  _slideIdx = 0;
  _lbRender();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') lbClose({ target: document.getElementById('lightbox') });
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'ArrowLeft') lbPrev();
});
// ── TOAST ─────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toastEl');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

// ── FORM MATERIAL TOGGLES ─────────────────────────
function toggleMat(card) {
  const cb = card.querySelector('input[type="checkbox"]');
  cb.checked = !cb.checked;
  card.classList.toggle('on', cb.checked);
}

// ── TIMELINE SCROLL REVEAL ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tl-entry').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
    obs.observe(el);
  });
});

// ── NETLIFY IDENTITY (for /admin login) ───────────
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}
// Hamburger nav toggle
const hamburger = document.getElementById('nav-hamburger');
const drawer = document.getElementById('nav-drawer');
const overlay = document.getElementById('nav-overlay');

if (hamburger && drawer) {
  hamburger.addEventListener('click', function () {
    const open = drawer.classList.toggle('open');
    overlay.classList.toggle('open', open);
    this.setAttribute('aria-expanded', open);
  });
  overlay.addEventListener('click', function () {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
}