const API_URL = '/api/students';

let allStudents = [];

const tableBody = document.getElementById('table-body');
const spinner = document.getElementById('spinner');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const programFilter = document.getElementById('program-filter');
const yearFilter = document.getElementById('year-filter');

async function init() {
    await loadStudents();
    setupEventListeners();
}

async function loadStudents() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was hindi ok');
    
    allStudents = await response.json();
    
    populateProgramDropdown(allStudents);
    applyFilters(); 
    
  } catch (error) {
    console.error('Error fetching students:', error);
    spinner.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.innerHTML = '<h3>Failed to load</h3><p>Siguraduhin na ang .NET backend ay tumatakbo.</p>';
  }
}

function applyFilters() {
  const searchTerm  = searchInput.value.toLowerCase().trim();
  const selectedProg = programFilter.value;
  const selectedYear = yearFilter.value;

  const filteredData = allStudents.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm);

    const progName = student.program?.programName || '';
    const matchesProgram = selectedProg === "" || progName === selectedProg;

    const matchesYear = selectedYear === "" || student.year.toString() === selectedYear;

    return matchesSearch && matchesProgram && matchesYear;
  });

  renderTable(filteredData);
  updateStats(filteredData);
}

function renderTable(data) {
  spinner.style.display = 'none';
  tableBody.innerHTML = '';

  if (data.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  data.forEach(student => {
    const tr = document.createElement('tr');
    
    const fullName  = `${escapeHtml(student.firstName)} ${escapeHtml(student.lastName)}`;
    const progName  = student.program?.programName ? escapeHtml(student.program.programName) : 'N/A';
    
    const sectionData = student.studentSections && student.studentSections.length > 0 
      ? student.studentSections[0].section?.code 
      : 'Unassigned';

    let avgGrade = 0;
    let badgeClass = 'badge-none';
    let gradeDisplay = 'N/A';

    if (student.studentGrades && student.studentGrades.length > 0) {
      const sum = student.studentGrades.reduce((acc, curr) => acc + curr.grade, 0);
      avgGrade = Math.round(sum / student.studentGrades.length);
      gradeDisplay = `${avgGrade}%`;

      if (avgGrade >= 85) badgeClass = 'badge-green';
      else if (avgGrade >= 75) badgeClass = 'badge-amber';
      else badgeClass = 'badge-red';
    }
    tr.innerHTML = `
      <td data-label="Name"><strong>${fullName}</strong></td>
      <td data-label="Year">Year ${student.year}</td>
      <td data-label="Gender">${escapeHtml(student.gender || '-')}</td>
      <td data-label="Program">${progName}</td>
      <td data-label="Section">${escapeHtml(sectionData)}</td>
      <td data-label="Avg Grade"><span class="badge ${badgeClass}">${gradeDisplay}</span></td>
      <td data-label="Status">
        ${student.enrolled 
          ? '<span class="status-enrolled">Enrolled</span>' 
          : '<span style="color:var(--muted)">Inactive</span>'}
      </td>
    `;
    
    tableBody.appendChild(tr);
  });
}

function updateStats(data) {
    document.getElementById('stat-total').textContent = data.length;

    const enrolledCount = data.filter(s => s.enrolled).length;
    document.getElementById('stat-enrolled').textContent = enrolledCount;

    const uniquePrograms = new Set(
        data.map(s => s.program?.programName).filter(Boolean)
    ).size;
    document.getElementById('stat-programs').textContent = uniquePrograms;

    let totalValidGrades = 0;
    let sumOfAverages = 0;

    data.forEach(student => {
        if (student.studentGrades && student.studentGrades.length > 0) {
            const stuSum = student.studentGrades.reduce((acc, curr) => acc + curr.grade, 0);
            sumOfAverages += (stuSum / student.studentGrades.length);
            totalValidGrades++;
        }
    });

    const globalAvg = totalValidGrades > 0
        ? Math.round(sumOfAverages / totalValidGrades) + '%'
        : 'N/A';

    document.getElementById('stat-avg-grade').textContent = globalAvg;

}

function populateProgramDropdown(data) {
  const programs = [...new Set(data.map(s => s.program?.programName).filter(Boolean))].sort();
  
  programFilter.innerHTML = '<option value="">All Programs</option>' + 
    programs.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
}

function setupEventListeners() {
    searchInput.addEventListener('input', applyFilters);
    programFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
}

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

init();