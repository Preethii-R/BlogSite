// Light/Dark mode toggle with localStorage
const modeToggle = document.getElementById('mode-toggle');
const body = document.body;

function setMode(mode) {
  if (mode === 'dark') {
    body.classList.add('dark');
    modeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    modeToggle.textContent = '🌙';
  }
  localStorage.setItem('theme', mode);
}

// On load, set mode from localStorage or system preference
(function() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    setMode(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setMode('dark');
  } else {
    setMode('light');
  }
})();

modeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark');
  setMode(isDark ? 'light' : 'dark');
});

// Blog post form logic
const postForm = document.getElementById('post-form');
const postsList = document.getElementById('posts-list');
const postDate = document.getElementById('post-date');

// Sample posts (only used if no posts in localStorage)
const samplePosts = [
  {
    title: '✨ The Art of Simplicity',
    author: 'Jane Doe',
    date: '2024-04-27',
    content: 'Discover how simplicity in design and life can lead to greater happiness and productivity. Embrace minimalism and let go of the unnecessary clutter!'
  },
  {
    title: '🌱 Growing with Every Post',
    author: 'Jane Doe',
    date: '2024-04-25',
    content: 'Blogging is a journey of growth. Every post is a step forward, a new lesson learned, and a new connection made. Start your journey today!'
  }
];

function savePosts(posts) {
  localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function loadPosts() {
  const data = localStorage.getItem('blogPosts');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}

function renderPosts(posts) {
  postsList.innerHTML = '';
  posts.forEach((post, idx) => {
    const dateObj = new Date(post.date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = dateObj.toLocaleDateString(undefined, options);
    const article = document.createElement('article');
    article.className = 'post';
    article.setAttribute('data-idx', idx);
    article.innerHTML = `
      <div class="post-header">
        <h2 class="post-title">${post.title}</h2>
        <div class="post-meta">${dateStr} &middot; by ${post.author}</div>
        <button class="delete-btn" title="Delete post">🗑️</button>
      </div>
      <div class="post-content">
        <p>${post.content.replace(/\n/g, '<br>')}</p>
      </div>
    `;
    postsList.appendChild(article);
  });
}

// Set default date to today
if (postDate) {
  const today = new Date();
  postDate.value = today.toISOString().slice(0, 10);
}

// Load and render posts on page load
let posts = loadPosts();
if (!posts.length) {
  posts = samplePosts.slice();
  savePosts(posts);
}
renderPosts(posts);

if (postForm) {
  postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const author = document.getElementById('post-author').value.trim();
    const date = document.getElementById('post-date').value;
    const content = document.getElementById('post-content').value.trim();
    if (!title || !author || !date || !content) return;
    posts.unshift({ title, author, date, content });
    savePosts(posts);
    renderPosts(posts);
    postForm.reset();
    // Reset date to today
    postDate.value = new Date().toISOString().slice(0, 10);
  });
}

// Delete post logic (event delegation)
if (postsList) {
  postsList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
      const postElem = e.target.closest('.post');
      const idx = Array.from(postsList.children).indexOf(postElem);
      if (idx > -1) {
        posts.splice(idx, 1);
        savePosts(posts);
        renderPosts(posts);
      }
    }
  });
} 