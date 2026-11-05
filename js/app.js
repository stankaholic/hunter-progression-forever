/*
 * Horde Hunter Leveling Guide: optional enhancements.
 * - "My level" input in the header highlights the matching rows on every page.
 * - Checkboxes on the index checklist are saved in localStorage.
 * No network requests, so it works from file://.
 */
(function () {
  "use strict";

  var LEVEL_KEY = "hhg-level";
  var CHECK_KEY = "hhg-checks";

  document.documentElement.classList.add("js");

  function load(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable (private mode etc.): ignore */
    }
  }

  // ---------- level highlighting ----------
  // Elements carry data-lvl="N" (one level) or data-lvl="N-M" (a range).
  // Ranges are "current" when they contain your level.
  // In groups made only of single levels, the highest level <= yours is
  // "current" and lower levels are "past".
  function parseLvl(str) {
    var m = String(str).match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return null;
    var lo = parseInt(m[1], 10);
    var hi = m[2] ? parseInt(m[2], 10) : lo;
    return { lo: lo, hi: hi, range: !!m[2] };
  }

  function applyLevel(level) {
    var all = document.querySelectorAll("[data-lvl]");
    var groups = new Map();
    all.forEach(function (el) {
      el.classList.remove("is-current", "is-past");
      var group = el.closest("tbody, ul, ol") || document.body;
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(el);
    });
    if (!level) return;

    groups.forEach(function (els) {
      // Groups that use any ranges (pet/weapon tables) match every row exactly;
      // pure single-level groups (trainer table, checklist) use "latest reached".
      var mixed = els.some(function (el) {
        var r = parseLvl(el.getAttribute("data-lvl"));
        return r && r.range;
      });
      var best = -1;
      els.forEach(function (el) {
        var r = parseLvl(el.getAttribute("data-lvl"));
        if (r && !r.range && r.lo <= level && r.lo > best) best = r.lo;
      });
      els.forEach(function (el) {
        var r = parseLvl(el.getAttribute("data-lvl"));
        if (!r) return;
        if (r.range || mixed) {
          if (level >= r.lo && level <= r.hi) el.classList.add("is-current");
        } else if (r.lo === best) {
          el.classList.add("is-current");
        } else if (r.lo < best) {
          el.classList.add("is-past");
        }
      });
    });
  }

  var input = document.getElementById("my-level");
  var stored = load(LEVEL_KEY, "");
  if (input) {
    if (stored) input.value = stored;
    input.addEventListener("input", function () {
      setLevel(input.value);
    });
  }

  // Validate, store and apply a level. Returns the level, or 0 if invalid.
  function setLevel(raw) {
    var v = parseInt(raw, 10);
    if (isNaN(v) || v < 1 || v > 60) {
      save(LEVEL_KEY, "");
      applyLevel(0);
      return 0;
    }
    save(LEVEL_KEY, v);
    applyLevel(v);
    return v;
  }
  applyLevel(parseInt(stored, 10) || 0);

  // ---------- checklist persistence ----------
  var checks = load(CHECK_KEY, {});
  var boxes = document.querySelectorAll(".checklist input[type=checkbox][data-key]");
  boxes.forEach(function (box) {
    var key = box.getAttribute("data-key");
    box.checked = !!checks[key];
    box.addEventListener("change", function () {
      if (box.checked) checks[key] = true;
      else delete checks[key];
      save(CHECK_KEY, checks);
    });
  });

  var clearBtn = document.getElementById("clear-checks");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!window.confirm("Clear all checklist progress?")) return;
      checks = {};
      save(CHECK_KEY, checks);
      boxes.forEach(function (b) { b.checked = false; });
    });
  }

  var jumpBtn = document.getElementById("jump-level");
  if (jumpBtn) {
    jumpBtn.addEventListener("click", function () {
      var cur = document.querySelector(".checklist .is-current");
      if (!cur) {
        // No level set yet: ask for it instead of silently doing nothing.
        var answer = window.prompt("What level is your hunter? (1–60)", input ? input.value : "");
        if (answer === null) return;
        var lvl = setLevel(answer);
        if (!lvl) {
          window.alert("Please enter a level from 1 to 60.");
          return;
        }
        if (input) input.value = lvl;
        cur = document.querySelector(".checklist .is-current");
        if (!cur) return;
      }
      cur.scrollIntoView({ behavior: "smooth", block: "center" });
      // Flash the row so it's obvious where we landed.
      cur.classList.remove("flash");
      void cur.offsetWidth; // restart the animation
      cur.classList.add("flash");
    });
  }
})();
