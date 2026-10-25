(function () {
  var NS = "http://www.w3.org/2000/svg";

  /* ---- push buttons ---- */
  var tpl = document.getElementById("btn-tpl");
  document.querySelectorAll(".pushbtn .ph").forEach(function (ph) {
    ph.replaceWith(tpl.content.cloneNode(true));
  });

  /* ---- LCD: 14 x 2 characters ---- */
  var COLS = 14, ROWS = 2;
  var X0 = 443, PITCH = 205, CELL_W = 161, CELL_H = 252, ROW_Y = [570, 866];
  var cells = document.getElementById("cells");
  var chars = document.getElementById("chars");
  var cursor = document.getElementById("cursor");
  var grid = [];

  for (var r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (var c = 0; c < COLS; c++) {
      var x = X0 + PITCH * c, y = ROW_Y[r];
      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", x); rect.setAttribute("y", y);
      rect.setAttribute("width", CELL_W); rect.setAttribute("height", CELL_H);
      rect.setAttribute("fill", "#4565F8");
      cells.appendChild(rect);

      var t = document.createElementNS(NS, "text");
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("font-size", "165");
      t.setAttribute("transform", "translate(" + (x + CELL_W / 2 + 10) + "," + (y + 212) + ") scale(1,1.3)");
      chars.appendChild(t);
      grid[r][c] = t;
    }
  }

  function moveCursor(r, c) {
    if (c >= COLS) { c = COLS - 1; }
    cursor.setAttribute("x", X0 + PITCH * c);
    cursor.setAttribute("y", ROW_Y[r] + CELL_H - 42);
  }
  function clearAll() {
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) grid[r][c].textContent = "";
  }

  var MESSAGES = [
    ["Hi!", "I'm Jacob"],
    ["i make things", "& break them"],
    ["UI / UX design", "web & hardware"],
    ["ESP32 tinkerer", "Czech Republic"],
    ["Try SnapMath", "AI math tutor"],
    ["Let's build", "something!"]
  ];

  var sleep = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  function setAria(msg) {
    document.getElementById("lcd").setAttribute("aria-label", "LCD display: " + msg.join(" "));
  }

  async function typeMessage(msg) {
    setAria(msg);
    for (var r = 0; r < msg.length; r++) {
      var line = msg[r].slice(0, COLS);
      moveCursor(r, 0);
      for (var i = 0; i < line.length; i++) {
        grid[r][i].textContent = line[i];
        moveCursor(r, i + 1);
        await sleep(rnd(70, 140));
      }
      await sleep(260);
    }
  }
  async function eraseMessage(msg) {
    for (var r = msg.length - 1; r >= 0; r--) {
      var len = Math.min(msg[r].length, COLS);
      for (var i = len - 1; i >= 0; i--) {
        grid[r][i].textContent = "";
        moveCursor(r, i);
        await sleep(32);
      }
    }
    moveCursor(0, 0);
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function run() {
    if (document.fonts && document.fonts.load) {
      try { await document.fonts.load("20px 'Press Start 2P'"); } catch (e) {}
    }
    if (reduce) {
      var m = MESSAGES[0];
      for (var r = 0; r < m.length; r++) for (var i = 0; i < m[r].length; i++) grid[r][i].textContent = m[r][i];
      cursor.style.display = "none";
      return;
    }
    var n = 0;
    await sleep(500);
    while (true) {
      var msg = MESSAGES[n % MESSAGES.length];
      await typeMessage(msg);
      await sleep(2400);
      await eraseMessage(msg);
      await sleep(450);
      n++;
    }
  }

  clearAll();
  moveCursor(0, 0);
  run();
})();
