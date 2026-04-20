(function () {
  "use strict";

  /* ---- Theme toggle ---- */
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = prefersDark ? "dark" : "light";
  root.setAttribute("data-theme", theme);
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    root.setAttribute("data-theme", theme);
  });

  /* ---- Scroll reveals ---- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
        { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
      )
    : null;

  document.querySelectorAll(".reveal").forEach((el) => io ? io.observe(el) : el.classList.add("visible"));

  const hero = document.querySelector(".hero");
  requestAnimationFrame(() => {
    hero?.classList.add("loaded");
    hero?.querySelectorAll(".reveal").forEach((el) => { el.classList.add("visible"); io?.unobserve(el); });
  });

  /* ---- Animated counters ---- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);

  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const isFloat = !Number.isInteger(target);
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min(1, (now - t0) / 1800);
      const v = target * easeOut(p);
      el.textContent = isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString("ro-RO");
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString("ro-RO");
    })(t0);
  }

  const cntIO = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); cntIO.unobserve(e.target); } }),
        { threshold: 0.5 }
      )
    : null;

  document.querySelectorAll("[data-count]").forEach((el) => cntIO ? cntIO.observe(el) : runCounter(el));

  /* ---- Form reference number ---- */
  const refNumEl = document.getElementById("form-ref-num");
  const newRef = () => String(Math.floor(Math.random() * 900000) + 100000);
  if (refNumEl) refNumEl.textContent = newRef();

  /* ---- Waitlist form ---- */
  const form = document.getElementById("waitlist-form");
  const statusEl = form?.querySelector(".form__status");

  const setStatus = (msg, type) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form__status" + (type ? " " + type : "");
  };

  const fieldErr = (name, msg) => {
    const input = form?.querySelector(`[name="${name}"]`);
    const errEl = input?.closest(".field")?.querySelector(".field__err");
    if (errEl) errEl.textContent = msg;
    input?.focus();
  };

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.querySelectorAll(".field__err").forEach((el) => (el.textContent = ""));
    setStatus("");
    const d = new FormData(form);
    const name   = (d.get("name")   || "").toString().trim();
    const email  = (d.get("email")  || "").toString().trim();
    const volume = (d.get("volume") || "").toString().trim();

    if (name.length < 2)                              { fieldErr("name",   "Introduceți minimum 2 caractere."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))   { fieldErr("email",  "Adresă email invalidă."); return; }
    if (!volume)                                       { fieldErr("volume", "Selectați volumul estimat."); return; }

    const btn = form.querySelector("button[type=submit]");
    if (btn) btn.disabled = true;
    setStatus("Se procesează cererea...");
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setStatus(`Cererea nr. ${refNumEl?.textContent ?? "—"} a fost înregistrată. Vă contactăm în 48 ore.`, "success");
      form.reset();
      if (refNumEl) refNumEl.textContent = newRef();
    } catch {
      setStatus("Eroare de rețea. Vă rugăm reîncercați.", "error");
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  /* ---- Easter egg ---- */
  const dialog   = document.getElementById("easter-dialog");
  const openEgg  = () => { dialog?.showModal(); console.log("%cEXCUZIO™ — NECONF-SEV3 generat.", "font-family:IBM Plex Mono,monospace;color:#B8902A;font-size:13px;font-weight:600"); };
  const closeEgg = () => dialog?.close();

  document.getElementById("easter-close")?.addEventListener("click", closeEgg);
  document.getElementById("secret-btn")?.addEventListener("click", openEgg);
  dialog?.addEventListener("click", (e) => { if (e.target === dialog) closeEgg(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeEgg(); });

  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let ki = 0;
  document.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ki = k === KONAMI[ki] ? ki + 1 : (k === KONAMI[0] ? 1 : 0);
    if (ki === KONAMI.length) { openEgg(); ki = 0; }
  });

  console.log(
    "%cEXCUZIO™ · ISO 99012:2024\n%c↑↑↓↓←→←→ B A  —  un certificat vă așteaptă.",
    "font-family:IBM Plex Mono,monospace;font-size:14px;color:#1A3A6E;font-weight:600",
    "font-family:IBM Plex Mono,monospace;font-size:11px;color:#B8902A"
  );
})();
