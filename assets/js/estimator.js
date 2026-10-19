(function () {
  "use strict";

  // Published list prices (USD), checked October 2026. Update here when providers change them.
  //   Gemini: https://ai.google.dev/gemini-api/docs/pricing
  //   Groq:   https://console.groq.com/docs/models
  var PRICING = {
    geminiLive: { audioInPer1M: 3.0, textOutPer1M: 4.5 },     // gemini-3.1-flash-live-preview
    geminiStyle: { inPer1M: 0.3, outPer1M: 2.5 },             // gemini-3.5-flash-lite
    groqWhisperPerHour: 0.111,                                // whisper-large-v3
    groqStyle: { inPer1M: 0.075, outPer1M: 0.3 }              // openai/gpt-oss-20b
  };

  // https://ai.google.dev/gemini-api/docs/tokens : audio is 32 tokens per second.
  var AUDIO_TOKENS_PER_SECOND = 32;
  // 100 tokens is roughly 60-80 English words.
  var TOKENS_PER_WORD_LOW = 100 / 80;
  var TOKENS_PER_WORD_HIGH = 100 / 60;

  function $(id) { return document.getElementById(id); }
  function checked(name, fallback) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : fallback;
  }
  function clamp(value, min, max, fallback) {
    var n = Number(value);
    if (!isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }
  function num(n) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n); }
  function usd(v) {
    var digits = v >= 0.01 ? 2 : 4;
    if (v === 0) return "$0.00";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits === 4 ? 4 : 2 }).format(v);
  }
  function range(low, high) {
    if (Math.abs(high - low) < 0.00005) return usd(low);
    return usd(low) + " – " + usd(high);
  }

  function readState() {
    return {
      tier: checked("tier", "paid"),
      speech: checked("speech", "android"),
      styles: checked("styles", "groq"),
      minutes: clamp($("minutes").value, 0, 180, 10),
      days: clamp($("days").value, 1, 31, 30),
      wpm: clamp($("wpm").value, 80, 250, 150),
      stylePct: clamp($("stylePct").value, 0, 100, 100),
      ratio: clamp($("ratio").value, 0.7, 1.3, 1.0)
    };
  }

  function estimate(s) {
    var paid = s.tier === "paid";
    var seconds = s.minutes * 60 * s.days;
    var words = s.minutes * s.days * s.wpm;
    var cover = s.stylePct / 100;

    var out = { audioTokens: Math.round(seconds * AUDIO_TOKENS_PER_SECOND), hours: seconds / 3600 };
    ["Low", "High"].forEach(function (k) {
      var tpw = k === "Low" ? TOKENS_PER_WORD_LOW : TOKENS_PER_WORD_HIGH;
      var transcript = Math.round(words * tpw);
      var styleIn = Math.round(transcript * cover);
      var styleOut = Math.round(styleIn * s.ratio);
      out["transcript" + k] = transcript;
      out["styleIn" + k] = styleIn;
      out["styleOut" + k] = styleOut;

      var speech = 0;
      if (paid && s.speech === "groq") speech = out.hours * PRICING.groqWhisperPerHour;
      if (paid && s.speech === "gemini") {
        speech = (out.audioTokens / 1e6) * PRICING.geminiLive.audioInPer1M + (transcript / 1e6) * PRICING.geminiLive.textOutPer1M;
      }
      var style = 0;
      if (paid && s.styles === "gemini") style = (styleIn / 1e6) * PRICING.geminiStyle.inPer1M + (styleOut / 1e6) * PRICING.geminiStyle.outPer1M;
      if (paid && s.styles === "groq") style = (styleIn / 1e6) * PRICING.groqStyle.inPer1M + (styleOut / 1e6) * PRICING.groqStyle.outPer1M;

      out["speech" + k] = speech;
      out["style" + k] = style;
      out["total" + k] = speech + style;
    });
    return out;
  }

  function render() {
    var s = readState();
    var e = estimate(s);
    $("total").textContent = range(e.totalLow, e.totalHigh);
    $("speechCost").textContent = range(e.speechLow, e.speechHigh);
    $("styleCost").textContent = range(e.styleLow, e.styleHigh);

    var usesGeminiAudio = s.speech === "gemini";
    var usesTextModel = s.styles === "gemini" || s.styles === "groq";
    $("tokTranscript").textContent = num(e.transcriptLow) + " – " + num(e.transcriptHigh);
    $("tokAudio").textContent = usesGeminiAudio ? num(e.audioTokens) : "n/a";
    $("tokStyleIn").textContent = usesTextModel ? num(e.styleInLow) + " – " + num(e.styleInHigh) : "n/a";
    $("tokStyleOut").textContent = usesTextModel ? num(e.styleOutLow) + " – " + num(e.styleOutHigh) : "n/a";

    $("freeNote").hidden = s.tier !== "free";

    var rows = $("examples");
    rows.textContent = "";
    [5, 10, 15, 60].forEach(function (m) {
      var combos = [
        { speech: "android", styles: "groq" },
        { speech: "groq", styles: "groq" },
        { speech: "gemini", styles: "gemini" }
      ];
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      th.scope = "row";
      th.textContent = m + " min";
      tr.appendChild(th);
      combos.forEach(function (c) {
        var r = estimate(Object.assign({}, s, { tier: "paid", minutes: m, speech: c.speech, styles: c.styles }));
        var td = document.createElement("td");
        td.textContent = range(r.totalLow, r.totalHigh);
        tr.appendChild(td);
      });
      rows.appendChild(tr);
    });

    $("stylePctOut").textContent = s.stylePct + "%";
    $("ratioOut").textContent = s.ratio.toFixed(1) + "×";
    $("minutesOut").textContent = s.minutes + " min/day";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = $("est-form");
    form.addEventListener("input", render);
    form.addEventListener("change", render);
    form.addEventListener("submit", function (ev) { ev.preventDefault(); });
    render();
  });
})();
