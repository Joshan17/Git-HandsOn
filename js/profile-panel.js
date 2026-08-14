// Slide transition + profile rendering. openProfile()/closeProfile() just
// toggle a class on the layout container — the actual slide is a CSS
// transition (see .app-layout.profile-open in css/style.css).

let onBackHandler = null;

function openProfile(student, onBack) {
  onBackHandler = onBack;

  const avatar = document.getElementById('profile-avatar');
  const color = colorForStudent(student.id);
  avatar.style.setProperty('--avatar-color', color);
  avatar.innerHTML = icon('user', 'avatar-icon');

  document.getElementById('profile-name').textContent = student.name;
  document.getElementById('profile-location').textContent = `${student.city}, ${student.state}`;

  const quoteEl = document.getElementById('profile-quote');
  if (student.quote) {
    quoteEl.textContent = `“${student.quote}”`;
    quoteEl.style.display = '';
  } else {
    quoteEl.style.display = 'none';
  }

  const interestsSection = document.getElementById('interests-section');
  const interestsList = document.getElementById('profile-interests');
  if (student.interests && student.interests.length) {
    interestsList.innerHTML = student.interests.map((i) => `<li>${i}</li>`).join('');
    interestsSection.style.display = '';
  } else {
    interestsSection.style.display = 'none';
  }

  const githubLink = document.getElementById('profile-github');
  if (student.github) {
    githubLink.href = `https://github.com/${student.github}`;
    githubLink.innerHTML = `${icon('github', 'inline-icon')} @${student.github} on GitHub`;
    githubLink.style.display = '';
  } else {
    githubLink.style.display = 'none';
  }

  document.getElementById('app-layout').classList.add('profile-open');
}

function closeProfile() {
  document.getElementById('app-layout').classList.remove('profile-open');
}

document.getElementById('back-button').addEventListener('click', () => {
  if (onBackHandler) onBackHandler();
});
