function openAppWindow(appName, contentHTML) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.left = "60px";
  win.style.top = "60px";

  // HEADER
  const header = document.createElement("div");
  header.className = "window-header";

  const title = document.createElement("div");
  title.className = "window-title";
  title.textContent = appName;

  const controls = document.createElement("div");
  controls.className = "window-controls";

  // RED — CLOSE
  const closeBtn = document.createElement("div");
  closeBtn.className = "control-dot red";
  closeBtn.onclick = () => win.remove();

  // YELLOW — MINIMIZE
  const minBtn = document.createElement("div");
  minBtn.className = "control-dot yellow";
  minBtn.onclick = () => {
    win.dataset.minimized = win.style.display === "none" ? "false" : "true";
    win.style.display = win.style.display === "none" ? "block" : "none";
  };

  // GREEN — MAXIMIZE
  const maxBtn = document.createElement("div");
  maxBtn.className = "control-dot green";
  maxBtn.onclick = () => {
    if (!win.dataset.maximized || win.dataset.maximized === "false") {
      win.dataset.maximized = "true";
      win.dataset.oldLeft = win.style.left;
      win.dataset.oldTop = win.style.top;
      win.dataset.oldWidth = win.style.width;
      win.dataset.oldHeight = win.style.height;

      win.style.left = "0px";
      win.style.top = "40px";
      win.style.width = "100%";
      win.style.height = "calc(100% - 40px)";
    } else {
      win.dataset.maximized = "false";
      win.style.left = win.dataset.oldLeft;
      win.style.top = win.dataset.oldTop;
      win.style.width = win.dataset.oldWidth;
      win.style.height = win.dataset.oldHeight;
    }
  };

  controls.appendChild(closeBtn);
  controls.appendChild(minBtn);
  controls.appendChild(maxBtn);

  header.appendChild(title);
  header.appendChild(controls);

  // BODY
  const body = document.createElement("div");
  body.className = "window-body";
  body.innerHTML = contentHTML;

  win.appendChild(header);
  win.appendChild(body);
  document.body.appendChild(win);

  makeWindowDraggable(win, header);
}

// DRAGGING
function makeWindowDraggable(win, handle) {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  handle.addEventListener("mousedown", (e) => {
    if (win.dataset.maximized === "true") return; // can't drag fullscreen
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  function onMove(e) {
    if (!dragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
  }

  function onUp() {
    dragging = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }
}
function openBrowser() {
  openAppWindow("Solara Browser", `
    <div class="browser">
      <div class="browser-urlbar">
        <input id="browser-url" type="text" placeholder="Search or enter a URL">
        <button id="browser-go">Go</button>
      </div>

      <div class="browser-home">
        <h1 class="browser-title">Solara</h1>
        <p class="browser-sub">your OS to the web</p>

        <div class="browser-search">
          <input id="browser-ddg" type="text" placeholder="Search DuckDuckGo">
          <button id="browser-ddg-btn">Search</button>
        </div>
      </div>

      <iframe id="browser-frame" class="browser-frame" src="" style="display:none;"></iframe>
    </div>
  `);

  // URL bar navigation
  document.getElementById("browser-go").onclick = () => {
    const url = document.getElementById("browser-url").value.trim();
    loadBrowserURL(url);
  };

  // DuckDuckGo search
  document.getElementById("browser-ddg-btn").onclick = () => {
    const q = document.getElementById("browser-ddg").value.trim();
    if (q.length > 0) {
      loadBrowserURL("https://duckduckgo.com/?q=" + encodeURIComponent(q));
    }
  };
}

function loadBrowserURL(url) {
  const frame = document.getElementById("browser-frame");
  const home = document.querySelector(".browser-home");

  // If user types only text, treat it as a search
  if (!url.includes(".")) {
    url = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
  }

  // Add https:// if missing
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  frame.src = url;
  frame.style.display = "block";
  home.style.display = "none";
}
