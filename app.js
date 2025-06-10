// set up firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCEPm9lj3zMbWJVMaysoeFxmLCQFYwS1Ic",
    authDomain: "essay-tracker-project.firebaseapp.com",
    databaseURL: "https://essay-tracker-project-default-rtdb.firebaseio.com",
    projectId: "essay-tracker-project",
    storageBucket: "essay-tracker-project.firebasestorage.app",
    messagingSenderId: "122663238518",
    appId: "1:122663238518:web:03cc0a8767237337a65857"
};

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
        status: "unread"
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

  // sorting
  arr.sort((a, b) => {
    const pr = { high: 0, medium: 1, low: 2 };
    if (a.status !== b.status) return a.status === "unread" ? -1 : 1;
    return pr[a.priority] - pr[b.priority];
  });

  // displaying
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
      
      <button class="toggle">${status === "unread" ? "Mark Read" : "Mark Unread"}</button>
      <button class="delete">Delete</button>
    `;

    // event listeners
    div.querySelector('.toggle').onclick = () => {
        db.ref('essays/' + id).update({ status: status === "read" ? "unread" : "read" });
    };
  
    div.querySelector('.delete').onclick = () => {
        db.ref('essays/' + id).remove();
    };

    list.appendChild(div);
  });
});

// toggle read/unread
function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    db.ref('essays/' + id).update({ status: newStatus });
}

// delete essay
function deleteEssay(id) {
    db.ref('essays/' + id).remove();
}