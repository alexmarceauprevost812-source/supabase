// ========== Supabase Client ==========
let supabase = null;

function initSupabase(url, key) {
  supabase = window.supabase.createClient(url, key);
}

// Charger config sauvegardée
function loadConfig() {
  const url = localStorage.getItem("supabaseUrl");
  const key = localStorage.getItem("supabaseKey");
  if (url && key) {
    document.getElementById("supabaseUrl").value = url;
    document.getElementById("supabaseKey").value = key;
    initSupabase(url, key);
    document.getElementById("connectionStatus").textContent = "Connecté";
    document.getElementById("connectionStatus").style.color = "#28c840";
  }
}

// Sauvegarder config
async function saveConfig() {
  const url = document.getElementById("supabaseUrl").value.trim();
  const key = document.getElementById("supabaseKey").value.trim();
  const status = document.getElementById("connectionStatus");

  if (!url || !key) {
    status.textContent = "Veuillez remplir les deux champs.";
    status.style.color = "#ff5f57";
    return;
  }

  localStorage.setItem("supabaseUrl", url);
  localStorage.setItem("supabaseKey", key);
  initSupabase(url, key);

  // Test de connexion
  try {
    const { error } = await supabase.from("messages").select("id").limit(1);
    if (error) throw error;
    status.textContent = "Connecté avec succès !";
    status.style.color = "#28c840";
  } catch (e) {
    status.textContent = "Connecté (table 'messages' à créer si besoin)";
    status.style.color = "#ffbd2e";
  }
}

// ========== Chat ==========
function addMessage(text, role) {
  const container = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.className = "message " + role;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  // Afficher message utilisateur
  addMessage(text, "user");
  input.value = "";

  // Sauvegarder dans Supabase
  if (supabase) {
    await supabase.from("messages").insert([
      { content: text, role: "user" }
    ]);
  }

  // Réponse IA (placeholder — remplacer par votre API IA)
  const reply = generateReply(text);

  // Petit délai pour effet naturel
  setTimeout(async () => {
    addMessage(reply, "bot");

    if (supabase) {
      await supabase.from("messages").insert([
        { content: reply, role: "bot" }
      ]);
    }
  }, 500);
}

function generateReply(text) {
  // Réponses simples — remplacer par un appel API (OpenAI, Claude, etc.)
  const lower = text.toLowerCase();
  if (lower.includes("bonjour") || lower.includes("salut")) {
    return "Bonjour ! Comment puis-je vous aider ?";
  }
  if (lower.includes("heure")) {
    return "Il est " + new Date().toLocaleTimeString("fr-FR") + ".";
  }
  if (lower.includes("supabase")) {
    return "Supabase est une alternative open-source à Firebase avec PostgreSQL, auth, stockage et realtime.";
  }
  return "Message reçu ! (Connectez une API IA pour des réponses intelligentes)";
}

// Charger historique depuis Supabase
async function loadMessages() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("content, role")
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) throw error;
    if (data) {
      data.forEach((msg) => addMessage(msg.content, msg.role));
    }
  } catch (e) {
    console.log("Pas de messages existants ou table non créée.");
  }
}

// ========== Gestion des fenêtres ==========
let activeWindow = null;
let dragState = null;

function openWindow(id) {
  const win = document.getElementById(id);
  // Fermer les autres fenêtres actives au même niveau
  if (activeWindow && activeWindow !== win) {
    activeWindow.style.zIndex = 10;
  }
  win.classList.add("active");
  win.style.zIndex = 20;
  activeWindow = win;
}

function closeWindow(id) {
  const win = document.getElementById(id);
  win.classList.remove("active", "maximized");
}

function minimizeWindow(id) {
  closeWindow(id);
}

function maximizeWindow(id) {
  const win = document.getElementById(id);
  win.classList.toggle("maximized");
}

function toggleChatFromBubble() {
  const win = document.getElementById("chatWindow");
  if (win.classList.contains("active")) {
    closeWindow("chatWindow");
  } else {
    openWindow("chatWindow");
  }
}

// ========== Drag & Drop fenêtres ==========
function startDrag(e, id) {
  const win = document.getElementById(id);
  if (win.classList.contains("maximized")) return;

  // Focus la fenêtre
  openWindow(id);

  dragState = {
    el: win,
    offsetX: e.clientX - win.offsetLeft,
    offsetY: e.clientY - win.offsetTop,
  };

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function onDrag(e) {
  if (!dragState) return;
  const { el, offsetX, offsetY } = dragState;
  el.style.left = (e.clientX - offsetX) + "px";
  el.style.top = (e.clientY - offsetY) + "px";
}

function stopDrag() {
  dragState = null;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

// ========== Horloge ==========
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ========== Init ==========
document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  loadMessages();
  updateClock();
  setInterval(updateClock, 30000);
});
