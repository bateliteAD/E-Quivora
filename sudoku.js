// A standard beginner Sudoku. Zero means an empty square.
const puzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];
const solution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];
const grid = document.querySelector("#sudoku-grid");
const statusElement = document.querySelector("#sudoku-status");
const cells = [];

function buildSudoku() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.createElement("input");
      input.className = "sudoku-cell";
      input.type = "text";
      input.inputMode = "numeric";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);
      input.dataset.row = row;
      input.dataset.col = col;
      if (puzzle[row][col] !== 0) {
        input.value = puzzle[row][col];
        input.readOnly = true;
        input.classList.add("given");
        input.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}, fixed ${puzzle[row][col]}`);
      }
      input.addEventListener("input", () => {
        if (input.readOnly) return;
        input.value = input.value.replace(/[^1-9]/g, "").slice(-1);
        input.classList.remove("correct", "incorrect");
        statusElement.className = "status";
        statusElement.textContent = "Progress updated. Check your puzzle when you are ready.";
      });
      input.addEventListener("focus", () => highlightRelated(input));
      input.addEventListener("keydown", event => {
        const index = row * 9 + col;
        let next = null;
        if (event.key === "ArrowRight") next = cells[Math.min(80, index + 1)];
        if (event.key === "ArrowLeft") next = cells[Math.max(0, index - 1)];
        if (event.key === "ArrowDown") next = cells[Math.min(8, row + 1) * 9 + col];
        if (event.key === "ArrowUp") next = cells[Math.max(0, row - 1) * 9 + col];
        if (next) { event.preventDefault(); next.focus(); }
      });
      cells.push(input);
      grid.appendChild(input);
    }
  }
}
function highlightRelated(active) {
  const row = Number(active.dataset.row);
  const col = Number(active.dataset.col);
  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(col / 3);
  cells.forEach(cell => {
    cell.classList.remove("same-row", "same-col", "same-box");
    if (cell === active || cell.classList.contains("given")) return;
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    if (r === row) cell.classList.add("same-row");
    if (c === col) cell.classList.add("same-col");
    if (Math.floor(r / 3) === boxRow && Math.floor(c / 3) === boxCol) cell.classList.add("same-box");
  });
}
function checkSudoku() {
  let filled = true;
  let correct = true;
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    cell.classList.remove("correct", "incorrect");
    const value = cell.value;
    if (!value) {
      filled = false;
      correct = false;
    } else if (Number(value) === solution[row][col]) {
      if (!cell.classList.contains("given")) cell.classList.add("correct");
    } else {
      cell.classList.add("incorrect");
      correct = false;
    }
  });
  if (filled && correct) {
    statusElement.className = "status success";
    statusElement.textContent = "✓ Sudoku solved! Every number is correct. Brilliant logic!";
    cells.forEach(cell => cell.readOnly = true);
  } else {
    statusElement.className = "status error";
    statusElement.textContent = filled
      ? "Some numbers are incorrect. Red squares need another look."
      : "Keep going! Fill every empty square. Red squares are incorrect; green entries are correct.";
  }
}
function resetSudoku() {
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    cell.value = puzzle[row][col] === 0 ? "" : puzzle[row][col];
    cell.readOnly = puzzle[row][col] !== 0;
    cell.classList.remove("correct", "incorrect", "same-row", "same-col", "same-box");
    if (cell.readOnly) cell.classList.add("given");
    else cell.classList.remove("given");
  });
  statusElement.className = "status";
  statusElement.textContent = "Puzzle restarted. Fixed numbers cannot be changed.";
}
buildSudoku();
document.querySelector("#check-sudoku").addEventListener("click", checkSudoku);
document.querySelector("#reset-sudoku").addEventListener("click", resetSudoku);