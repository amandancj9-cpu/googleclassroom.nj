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
