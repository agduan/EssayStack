// set up firebase config
// const firebaseConfig = {
//     apiKey: // api key here - TODO
//     authDomain:
//     databaseURL:
//     projectId:
//     storageBucket:
//     messagingSenderId:
//     appId:
// };

// initialize firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// new essay submission
document.getElementById('essayForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newEssay = {
        title: document.getElementById('title').value,
        link: document.getElementById('link').value,
        notes: document.getElementById('notes').value,
        priority: document.getElementById('priority').value,
        dateAdded: new Date().toISOString(),
        // status: "unread" - TODO
    };

    db.ref('essays').push(newEssay);
    this.reset();
});

// display essays
db.ref('essays').on('value', (snapshot) => {
  const list = document.getElementById('essayList');
  list.innerHTML = '';

  const data = snapshot.val() || {};
  const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));

  arr.sort((a, b) => {
    const pr = { high: 0, medium: 1, low: 2 };
    if (a.status !== b.status) return a.status === "unread" ? -1 : 1;
    return pr[a.priority] - pr[b.priority];
  });

  arr.forEach(({ title, link, notes, dateAdded, status, priority }) => {
    const div = document.createElement('div');
    div.className = `essay ${status} ${priority}`;

    let hostname = "";
    try {
      hostname = new URL(link).hostname.replace('www.', '');
    } catch (_) {}

    div.innerHTML = `
      <h3><a href="${link || '#'}" target="_blank">${title}</a></h3>
      ${hostname ? `<p class="hostname">${hostname}</p>` : ""}
      <p class="notes">${notes}</p>
      <p class="date">${new Date(dateAdded).toLocaleDateString()}</p>
    `;

    list.appendChild(div);
  });
});