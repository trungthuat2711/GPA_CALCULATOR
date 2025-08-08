const gradeMap = {
  A: 4,
  "B+": 3.5,
  B: 3,
  "C+": 2.5,
  C: 2,
  "D+": 1.5,
  D: 1,
  F: 0,
};

function addRow(subject = "", credit = 3, grade = "A") {
  const table = document
    .getElementById("subjectsTable")
    .getElementsByTagName("tbody")[0];
  const newRow = table.insertRow();
  newRow.innerHTML = `
    <td><input type="text" name="subject" required value="${subject}"></td>
    <td><input type="number" name="credit" min="1" value="${credit}" required></td>
    <td>
      <select name="grade" required>
        <option value="A" ${grade === "A" ? "selected" : ""}>A</option>
        <option value="B+" ${grade === "B+" ? "selected" : ""}>B+</option>
        <option value="B" ${grade === "B" ? "selected" : ""}>B</option>
        <option value="C+" ${grade === "C+" ? "selected" : ""}>C+</option>
        <option value="C" ${grade === "C" ? "selected" : ""}>C</option>
        <option value="D+" ${grade === "D+" ? "selected" : ""}>D+</option>
        <option value="D" ${grade === "D" ? "selected" : ""}>D</option>
        <option value="F" ${grade === "F" ? "selected" : ""}>F</option>
      </select>
    </td>
    <td><button type="button" onclick="removeRow(this)">X</button></td>
  `;
  
  for (const input of newRow.querySelectorAll("input,select")) {
    input.addEventListener("change", saveSubjectsToStorage);
  }
}

function removeRow(btn) {
  const row = btn.parentNode.parentNode;
  const table = row.parentNode;
  if (table.rows.length > 1) {
    table.removeChild(row);
    saveSubjectsToStorage();
  }
}

function calculateGPA() {
  const table = document
    .getElementById("subjectsTable")
    .getElementsByTagName("tbody")[0];
  let totalCredits = 0;
  let totalPoints = 0;
  let valid = true;
  for (let row of table.rows) {
    const credit = parseFloat(row.cells[1].children[0].value);
    const grade = row.cells[2].children[0].value;
    if (isNaN(credit) || !gradeMap.hasOwnProperty(grade)) {
      valid = false;
      break;
    }
    totalCredits += credit;
    totalPoints += credit * gradeMap[grade];
  }
  const resultDiv = document.getElementById("gpaResult");
  if (!valid || totalCredits === 0) {
    resultDiv.textContent = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }
  const gpa = (totalPoints / totalCredits).toFixed(2);
  resultDiv.textContent = `GPA của bạn là: ${gpa}`;
  saveSubjectsToStorage();
}

function saveSubjectsToStorage() {
  const table = document
    .getElementById("subjectsTable")
    .getElementsByTagName("tbody")[0];
  const subjects = [];
  for (let row of table.rows) {
    const subject = row.cells[0].children[0].value;
    const credit = row.cells[1].children[0].value;
    const grade = row.cells[2].children[0].value;
    subjects.push({ subject, credit, grade });
  }
  localStorage.setItem("gpa_subjects", JSON.stringify(subjects));
}

function loadSubjectsFromStorage() {
  const data = localStorage.getItem("gpa_subjects");
  if (data) {
    const subjects = JSON.parse(data);
    const table = document
      .getElementById("subjectsTable")
      .getElementsByTagName("tbody")[0];
    // Xóa các dòng hiện tại
    while (table.rows.length > 0) table.deleteRow(0);
    for (const s of subjects) {
      addRow(s.subject, s.credit, s.grade);
    }
  } else {
    addRow();
  }
}

window.addEventListener("DOMContentLoaded", loadSubjectsFromStorage);
