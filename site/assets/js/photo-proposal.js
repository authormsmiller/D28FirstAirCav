/* ─────────────────────────────────────────────────────────────────────────
 * photo-proposal.js
 * Public "Suggest a correction" modal, opened from the photo lightbox.
 *
 * Reads the active lightbox slide (globals _slides / _slideIdx from main.js)
 * to capture the target photo: soldier_slug + subfolder + filename. Those
 * three values let the admin tool locate the exact index.md entry to edit.
 *
 * Submits JSON to POST /submit/photo-proposal. Nothing changes on the site —
 * proposals are held for manual review.
 * ───────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var STATE = {
    target: null,        // { soldier_slug, subfolder, filename }
    blocks: {},          // { who:bool, caption:bool, date:bool, notes:bool }
    people: [],          // [{ label, slug }]  (slug null = freetext)
    roster: null,        // cached /search-index.json soldiers
  };

  var EL = {};
  function $(id) { return document.getElementById(id); }

  document.addEventListener("DOMContentLoaded", function () {
    EL.overlay   = $("pidpOverlay");
    EL.thumb     = $("pidpThumb");
    EL.ctxCap    = $("pidpCtxCap");
    EL.people    = $("pidpPeople");
    EL.personIn  = $("pidpPersonInput");
    EL.taResults = $("pidpTaResults");
    EL.curCap    = $("pidpCurrentCap");
    EL.curDate   = $("pidpCurrentDate");
    EL.caption   = $("pidpCaption");
    EL.date      = $("pidpDate");
    EL.approx    = $("pidpDateApprox");
    EL.notes     = $("pidpNotes");
    EL.source    = $("pidpSource");
    EL.name      = $("pidpName");
    EL.contact   = $("pidpContact");
    EL.hp        = $("pidpHp");
    EL.submit    = $("pidpSubmit");
    EL.footNote  = $("pidpFootNote");

    if (!EL.overlay) return;

    // Chip toggles
    Array.prototype.forEach.call(document.querySelectorAll(".pidp-chip"), function (chip) {
      chip.addEventListener("click", function () {
        var key = chip.dataset.block;
        var on = !chip.classList.contains("on");
        chip.classList.toggle("on", on);
        STATE.blocks[key] = on;
        var block = $("pidpBlock-" + key);
        if (block) block.hidden = !on;
      });
    });

    // Typeahead
    if (EL.personIn) {
      EL.personIn.addEventListener("input", pidpTypeahead);
      EL.personIn.addEventListener("focus", pidpTypeahead);
      document.addEventListener("click", function (e) {
        if (e.target !== EL.personIn && !EL.taResults.contains(e.target)) {
          EL.taResults.hidden = true;
        }
      });
    }

    // Esc closes
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && EL.overlay.classList.contains("open")) pidpClose();
    });

    // Prefill identity from a prior submission
    try {
      var saved = JSON.parse(localStorage.getItem("pidp_submitter") || "{}");
      if (saved.name) EL.name.value = saved.name;
      if (saved.contact) EL.contact.value = saved.contact;
    } catch (e) {}
  });

  // ── Open from the lightbox ────────────────────────────────────────────────
  window.pidpOpenFromLightbox = function () {
    var slide = null;
    try {
      if (typeof _slides !== "undefined" && typeof _slideIdx !== "undefined") {
        slide = _slides[_slideIdx];
      }
    } catch (e) {}
    if (!slide || !slide.soldier_slug || !slide.filename) {
      // Identity not present on this slide — fail gracefully.
      alert("Sorry — this photo can't take suggestions yet.");
      return;
    }
    pidpReset();
    STATE.target = {
      soldier_slug: slide.soldier_slug,
      subfolder:    slide.subfolder,
      filename:     slide.filename,
    };
    EL.thumb.src = slide.src || "";
    EL.ctxCap.textContent = (slide.caption || slide.filename);
    EL.curCap.innerHTML = '<span class="pidp-cv-label">Currently reads</span><em>' +
      pidpEsc(slide.caption || "(no caption yet)") + "</em>";
    EL.curDate.innerHTML = '<span class="pidp-cv-label">Currently</span><em>' +
      pidpEsc(slide.date || "(no date)") + "</em>";

    EL.overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  window.pidpClose = function (e) {
    if (e && e.target !== EL.overlay && !(e.target && e.target.classList.contains("pidp-close"))) return;
    EL.overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  function pidpReset() {
    STATE.blocks = {};
    STATE.people = [];
    Array.prototype.forEach.call(document.querySelectorAll(".pidp-chip"), function (chip) {
      chip.classList.remove("on");
      var block = $("pidpBlock-" + chip.dataset.block);
      if (block) block.hidden = true;
    });
    EL.caption.value = "";
    EL.date.value = "";
    EL.approx.checked = true;
    EL.notes.value = "";
    EL.source.value = "";
    EL.personIn.value = "";
    EL.taResults.hidden = true;
    EL.people.innerHTML = "";
    EL.hp.value = "";
    EL.submit.disabled = false;
    EL.submit.textContent = "Submit for Review →";
    EL.footNote.textContent = "Nothing changes on the site right away — every suggestion is reviewed first.";
  }

  // ── Roster typeahead ──────────────────────────────────────────────────────
  function pidpTypeahead() {
    var q = EL.personIn.value.trim().toLowerCase();
    if (!STATE.roster) {
      fetch("/search-index.json")
        .then(function (r) { return r.json(); })
        .then(function (list) {
          STATE.roster = (list || []).filter(function (x) { return x.type === "soldier"; });
          pidpTypeahead();
        })
        .catch(function () { STATE.roster = []; });
      return;
    }
    var results = [];
    if (q.length >= 1) {
      results = STATE.roster.filter(function (s) {
        var hay = (s.name + " " + s.first_name + " " + s.last_name + " " + s.nickname).toLowerCase();
        return hay.indexOf(q) !== -1;
      }).slice(0, 6);
    }
    var html = results.map(function (s) {
      var sub = [s.rank, s.platoon].filter(Boolean).join(" · ");
      return '<div class="pidp-ta-result" data-slug="' + pidpEsc(s.slug) + '" data-label="' +
        pidpEsc(s.name) + '">' + pidpEsc(s.name) +
        (sub ? '<div class="pidp-ta-sub">' + pidpEsc(sub) + "</div>" : "") + "</div>";
    }).join("");
    if (q.length >= 2) {
      html += '<div class="pidp-ta-result pidp-ta-add" data-freetext="1">+ Add "' +
        pidpEsc(EL.personIn.value.trim()) + '" (not in roster)</div>';
    }
    EL.taResults.innerHTML = html;
    EL.taResults.hidden = !html;

    Array.prototype.forEach.call(EL.taResults.querySelectorAll(".pidp-ta-result"), function (row) {
      row.addEventListener("click", function () {
        if (row.dataset.freetext) {
          pidpAddPerson(EL.personIn.value.trim(), null);
        } else {
          pidpAddPerson(row.dataset.label, row.dataset.slug);
        }
        EL.personIn.value = "";
        EL.taResults.hidden = true;
      });
    });
  }

  function pidpAddPerson(label, slug) {
    if (!label) return;
    if (STATE.people.some(function (p) { return p.label === label && p.slug === slug; })) return;
    STATE.people.push({ label: label, slug: slug });
    pidpRenderPeople();
  }

  function pidpRenderPeople() {
    EL.people.innerHTML = STATE.people.map(function (p, i) {
      return '<span class="pidp-person' + (p.slug ? "" : " freetext") + '">' +
        pidpEsc(p.label) + (p.slug ? "" : ' <em>(new)</em>') +
        ' <span class="pidp-person-x" data-i="' + i + '">✕</span></span>';
    }).join("");
    Array.prototype.forEach.call(EL.people.querySelectorAll(".pidp-person-x"), function (x) {
      x.addEventListener("click", function () {
        STATE.people.splice(parseInt(x.dataset.i, 10), 1);
        pidpRenderPeople();
      });
    });
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  window.pidpSubmit = function () {
    if (!STATE.target) return;

    var changes = {};
    if (STATE.blocks.who) {
      var slugs = STATE.people.filter(function (p) { return p.slug; }).map(function (p) { return p.slug; });
      var free  = STATE.people.filter(function (p) { return !p.slug; }).map(function (p) { return p.label; });
      if (slugs.length) changes.contains_add = slugs;
      if (free.length)  changes.contains_add_freetext = free;
    }
    if (STATE.blocks.caption && EL.caption.value.trim()) changes.caption = EL.caption.value.trim();
    if (STATE.blocks.date && EL.date.value.trim()) {
      changes.date = EL.date.value.trim();
      changes.date_approximate = !!EL.approx.checked;
    }
    if (STATE.blocks.notes && EL.notes.value.trim()) changes.notes = EL.notes.value.trim();

    if (!Object.keys(changes).length) {
      EL.footNote.textContent = "Add at least one detail above before submitting.";
      return;
    }

    var payload = {
      target: STATE.target,
      changes: changes,
      source: EL.source.value.trim(),
      submitter_name: EL.name.value.trim(),
      submitter_contact: EL.contact.value.trim(),
      page_url: location.href,
      hp: EL.hp.value,
    };

    try {
      localStorage.setItem("pidp_submitter", JSON.stringify({
        name: payload.submitter_name, contact: payload.submitter_contact,
      }));
    } catch (e) {}

    EL.submit.disabled = true;
    EL.submit.textContent = "Sending…";

    fetch("/submit/photo-proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j && res.j.ok) {
          pidpThankYou();
        } else {
          throw new Error((res.j && res.j.error) || "Submission failed");
        }
      })
      .catch(function (err) {
        EL.submit.disabled = false;
        EL.submit.textContent = "Submit for Review →";
        EL.footNote.textContent = "Something went wrong — please try again. (" + err.message + ")";
      });
  };

  function pidpThankYou() {
    var modal = EL.overlay.querySelector(".pidp-modal");
    modal.innerHTML =
      '<div class="pidp-header"><div class="pidp-title">Thank You</div>' +
      '<button type="button" class="pidp-close" onclick="pidpClose()" aria-label="Close">✕</button></div>' +
      '<div class="pidp-body" style="text-align:center;padding:36px 28px;">' +
      '<div style="font-size:40px;margin-bottom:12px;">✓</div>' +
      '<div class="pidp-title" style="color:var(--ink,#14120C);margin-bottom:8px;">Suggestion Received</div>' +
      '<p style="font-family:Crimson Pro,serif;font-size:16px;line-height:1.55;max-width:380px;margin:0 auto;">' +
      "Thank you — every detail helps us get the record right. We review each suggestion by hand, and may " +
      "reach out if you left a way to contact you. You won't see the change until it's confirmed.</p></div>" +
      '<div class="pidp-footer"><button type="button" class="pidp-submit" onclick="pidpClose()">Close</button></div>';
  }

  function pidpEsc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
