// Sets up the globe.gl scene: the dim Earth texture, the highlighted India
// polygon overlay, one point per student (each in their own color), a
// continuous slow auto-rotate, hover tooltips, and the click -> profile
// panel flow.
//
// Nothing in this file needs to change when a student adds their own
// data/students/<name>.json — it just renders whatever loadStudents() gives it.

const INDIA_VIEW = { lat: 22.5, lng: 80, altitude: 2.2 };

let globeInstance = null;
let allStudents = [];
let selectedStudentId = null;
let resumeRotateTimer = null;

function studentById(id) {
  return allStudents.find((s) => s.id === id);
}

// A spinning globe is a moving target — pause the rotation for a few
// seconds whenever the user touches it, so pins are actually clickable,
// then let it drift back into its slow spin on its own.
function pauseRotation(delayMs) {
  globeInstance.controls().autoRotate = false;
  clearTimeout(resumeRotateTimer);
  resumeRotateTimer = setTimeout(() => {
    globeInstance.controls().autoRotate = true;
  }, delayMs);
}

function hexToRgb(hex) {
  const value = parseInt(hex.replace('#', ''), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

// Bigger while its profile is open.
function pointRadiusFor(student) {
  return student.id === selectedStudentId ? 0.55 : 0.32;
}

function pointColorFor(student) {
  return colorForStudent(student.id);
}

function pointLabel(student) {
  const topInterest = student.interests && student.interests[0];
  return `
    <div class="globe-tooltip">
      <strong>${student.name}</strong>
      <span>${student.city}${topInterest ? ' · ' + topInterest : ''}</span>
    </div>
  `;
}

function refreshLayers() {
  const selected = selectedStudentId ? studentById(selectedStudentId) : null;

  globeInstance
    .pointsData(allStudents)
    .ringsData(selected ? [selected] : []);
}

// Called on point click and on selecting a student from the search box.
function selectStudent(student) {
  selectedStudentId = student.id;
  pauseRotation(3000);
  refreshLayers();
  globeInstance.pointOfView({ lat: student.lat, lng: student.lng, altitude: 1.5 }, 1000);
  openProfile(student, backToGlobe);
}

// Passed into profile-panel.js as the "Back" handler.
function backToGlobe() {
  selectedStudentId = null;
  refreshLayers();
  globeInstance.pointOfView(INDIA_VIEW, 800);
  closeProfile();
}

// Used by search.js to fly to a student without a page reload.
function focusOnStudent(id) {
  const student = studentById(id);
  if (student) selectStudent(student);
}

async function loadIndiaBoundary() {
  const response = await fetch('data/india-boundary.geojson');
  const geojson = await response.json();
  return geojson.features;
}

async function initGlobe(students) {
  allStudents = students;

  const indiaFeatures = await loadIndiaBoundary();

  globeInstance = Globe()(document.getElementById('globe-container'))
    .backgroundColor('rgba(0,0,0,0)')
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    .showAtmosphere(true)
    .atmosphereColor('#008080')
    .atmosphereAltitude(0.15)
    // India border overlay — the only country highlighted, per the workshop's
    // "only India matters here" scope. See data/india-boundary.geojson.
    .polygonsData(indiaFeatures)
    .polygonCapColor(() => 'rgba(0, 128, 128, 0.28)')
    .polygonSideColor(() => 'rgba(0, 128, 128, 0.12)')
    .polygonStrokeColor(() => '#14b8b8')
    .polygonAltitude(0.006)
    // Student pins
    .pointsData(students)
    .pointAltitude(0.012)
    .pointRadius(pointRadiusFor)
    .pointColor(pointColorFor)
    .pointLabel(pointLabel)
    .onPointClick(selectStudent)
    .onPointHover((point) => {
      document.getElementById('globe-container').style.cursor = point ? 'pointer' : 'grab';
    })
    // Pulse ring on whichever student is currently selected, in their color
    .ringsData([])
    .ringColor((student) => {
      const { r, g, b } = hexToRgb(colorForStudent(student.id));
      return (t) => `rgba(${r}, ${g}, ${b}, ${1 - t})`;
    })
    .ringMaxRadius(3)
    .ringPropagationSpeed(2)
    .ringRepeatPeriod(1200);

  globeInstance.pointOfView(INDIA_VIEW, 0);

  // Keeps spinning always — dragging just adds on top of it, it never stops.
  globeInstance.controls().autoRotate = true;
  globeInstance.controls().autoRotateSpeed = 0.6;

  // The globe/profile slide (see .app-layout.profile-open in style.css)
  // resizes #globe-container via a CSS transition, not a window resize —
  // keep the WebGL canvas in sync with it as it shrinks and grows back.
  const container = document.getElementById('globe-container');
  new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    globeInstance.width(width).height(height);
  }).observe(container);

  // Any touch on the globe (even one that misses a pin) pauses the spin
  // so the follow-up click has something to actually land on.
  container.addEventListener('pointerdown', () => pauseRotation(3000));

  renderStats(students);
}

function renderStats(students) {
  const states = new Set(students.map((s) => s.state));
  const cities = new Set(students.map((s) => s.city));

  document.getElementById('stat-students').textContent = students.length;
  document.getElementById('stat-states').textContent = states.size;
  document.getElementById('stat-cities').textContent = cities.size;
}
