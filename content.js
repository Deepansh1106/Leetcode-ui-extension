let lastHandledKey = null;

/* ------------------ PLAY SOUND ------------------ */
function playSound(path) {
  const audio = new Audio(chrome.runtime.getURL(path));
  audio.play().catch(() => {});
}

/* ------------------ GET DIFFICULTY ------------------ */
function getDifficulty() {
  const el = document.querySelector('div[class*="text-difficulty"]');
  if (!el) return "medium";

  const t = el.innerText.toLowerCase();
  if (t.includes("easy")) return "easy";
  if (t.includes("medium")) return "medium";
  if (t.includes("hard")) return "hard";

  return "medium";
}

/* ------------------ FIND TESTCASE COUNTS ------------------ */
function getTestcaseCounts() {
  const spans = document.querySelectorAll("div.text-xs span, span");

  for (const span of spans) {
    const text = span.innerText?.trim();
    if (!text) continue;

    // Match "number / number" anywhere in the string
    const match = text.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) continue;

    return {
      passed: Number(match[1]),
      total: Number(match[2])
    };
  }
  return null;
}


const observer = new MutationObserver(() => {
  setTimeout(() => {
    const result = getTestcaseCounts();
    if (!result) return;

    const { passed, total } = result;
    const key = `${passed}/${total}`;

   
    if (key === lastHandledKey) return;

    console.log("Testcases:", key);

    if (passed === total && passed!=0) {
      const difficulty = getDifficulty();
      playSound(`sounds/accepted_${difficulty}.mp3`);
    } else {
      playSound("sounds/rejected.mp3");
    }

    lastHandledKey = key;
  }, 200);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
