# Git Handson Session

A rotating globe of where our class comes from. Every pin on the map is a student.

🔗 **Live site:** [add your deployed link here]

## Add Your Profile

1. **Clone the repo and create a branch**
   ```
   git clone <repo-url>
   cd git-handson-session
   git switch -c feature/your-name
   ```

2. **Copy the template**
   ```
   cp data/students/_example.json data/students/your-name.json
   ```

3. **Edit `data/students/your-name.json`** with your details:
   ```json
   {
     "id": "your-name",
     "name": "Your Name",
     "state": "Your State",
     "city": "Your City",
     "lat": 0.0,
     "lng": 0.0,
     "interests": ["Something", "Something else"],
     "quote": "A one-liner about you.",
     "github": "your-github-username"
   }
   ```
   Only `id`, `name`, `state`, `city`, `lat`, `lng` are required.

4. **Register yourself** by adding your filename to `data/students/index.json`:
   ```json
   ["_example.json", "upendra.json", "your-name.json"]
   ```
   This step is easy to forget — if your pin doesn't show up after merging, check this file first.

5. **Commit, push, and open a PR**
   ```
   git add data/students/your-name.json data/students/index.json
   git commit -m "Add your-name to Git Handson Session"
   git push -u origin feature/your-name
   ```
   Then open a pull request against `main`.

6. **After your PR is merged**, refresh the site — your pin should appear on the globe.
