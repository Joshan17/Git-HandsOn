// Search box: filters students by name as you type, and flies the globe
// to whichever one you pick (or press Enter on).
//
// Calls focusOnStudent(id), defined in js/globe.js, to do the actual
// camera move + profile panel open.

function initSearch(students) {
  const input = document.getElementById('search-input');
  const resultsBox = document.getElementById('search-results');

  function renderResults(matches) {
    if (matches.length === 0) {
      resultsBox.innerHTML = '<div class="search-empty">No students found.</div>';
      resultsBox.classList.add('open');
      return;
    }

    resultsBox.innerHTML = matches
      .map(
        (student) => `
          <div class="search-result" data-id="${student.id}">
            <span class="search-result-avatar" style="--avatar-color: ${colorForStudent(student.id)}">${icon('user', 'avatar-icon')}</span>
            <span class="search-result-text">
              <span class="search-result-name">${student.name}</span>
              <span class="search-result-place">${student.city}, ${student.state}</span>
            </span>
          </div>
        `
      )
      .join('');
    resultsBox.classList.add('open');
  }

  function closeResults() {
    resultsBox.classList.remove('open');
  }

  function findMatches(query) {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return students.filter((s) => s.name.toLowerCase().includes(needle)).slice(0, 6);
  }

  function pickStudent(student) {
    input.value = student.name;
    closeResults();
    focusOnStudent(student.id);
  }

  input.addEventListener('input', () => {
    const matches = findMatches(input.value);
    if (matches.length === 0 && input.value.trim() === '') {
      closeResults();
    } else {
      renderResults(matches);
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const [firstMatch] = findMatches(input.value);
    if (firstMatch) pickStudent(firstMatch);
  });

  resultsBox.addEventListener('click', (event) => {
    const row = event.target.closest('.search-result');
    if (!row) return;
    const student = students.find((s) => s.id === row.dataset.id);
    if (student) pickStudent(student);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-box')) closeResults();
  });
}
