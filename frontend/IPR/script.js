const form = document.getElementById('patentForm');
const tableBody = document.querySelector('#patentTable tbody');
const overviewContent = document.getElementById('overviewContent');

let records = [];

function updateTable() {
  tableBody.innerHTML = '';
  records.forEach((rec, i) => {
    const row = `<tr>
      <td>${rec.title}</td>
      <td>${rec.applicant}</td>
      <td>${rec.department}</td>
      <td>${rec.filingDate}</td>
      <td>${rec.status}</td>
      <td>${rec.type}</td>
      <td>
        <button onclick="editRecord(${i})">Edit</button>
        <button onclick="deleteRecord(${i})">Delete</button>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });
  updateOverview();
}

function updateOverview() {
  const departmentStats = {};
  records.forEach(rec => {
    if (!departmentStats[rec.department]) {
      departmentStats[rec.department] = { Draft: 0, Filed: 0, Approved: 0, Rejected: 0 };
    }
    departmentStats[rec.department][rec.status]++;
  });
  overviewContent.innerHTML = Object.entries(departmentStats)
    .map(([dept, statusMap]) => {
      return `<div class="status-block">
        <strong>${dept}</strong>:
        Draft: ${statusMap.Draft}, Filed: ${statusMap.Filed}, Approved: ${statusMap.Approved}, Rejected: ${statusMap.Rejected}
      </div>`;
    }).join('');
}

function editRecord(index) {
  const rec = records[index];
  document.getElementById('title').value = rec.title;
  document.getElementById('applicant').value = rec.applicant;
  document.getElementById('department').value = rec.department;
  document.getElementById('filingDate').value = rec.filingDate;
  document.getElementById('status').value = rec.status;
  document.getElementById('type').value = rec.type;
  deleteRecord(index);
}

function deleteRecord(index) {
  records.splice(index, 1);
  updateTable();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const record = {
    title: document.getElementById('title').value,
    applicant: document.getElementById('applicant').value,
    department: document.getElementById('department').value,
    filingDate: document.getElementById('filingDate').value,
    status: document.getElementById('status').value,
    type: document.getElementById('type').value
  };
  records.push(record);
  form.reset();
  updateTable();
});