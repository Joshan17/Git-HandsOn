// Loads every JSON file listed in data/students/index.json and merges
// them into one array of student objects.
//
// Plain static hosting can't list a folder's contents, so we keep a
// manifest file (data/students/index.json) with the filenames instead.
// If you just added your own data/students/your-name.json and your pin
// isn't showing up, you almost certainly forgot to add its filename to
// that manifest — see README.md.
//
// Files starting with "_" (like _example.json) are templates, not real
// students, so we skip them here.

async function loadStudents() {
  const manifestResponse = await fetch('data/students/index.json');
  const filenames = await manifestResponse.json();

  const studentFilenames = filenames.filter((name) => !name.startsWith('_'));

  const students = await Promise.all(
    studentFilenames.map(async (filename) => {
      const response = await fetch(`data/students/${filename}`);
      return response.json();
    })
  );

  return students;
}
