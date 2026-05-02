const CURATED = new Set([
  'chesshook',
  'chesshook-intermediary',
  'chesshook2',
  'munakas',
  'korppu',
  'commandlineclicker',
  'discord-fs',
  'imp',
]);

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.repos');

  try {
    const res = await fetch('https://api.github.com/users/0mlml/repos?sort=pushed&per_page=100');
    if (!res.ok) throw new Error(res.status);

    const repos = await res.json();

    const filtered = repos
      .filter(r => !r.fork && r.language && !CURATED.has(r.name))
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    container.innerHTML = '';

    for (const repo of filtered) {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = repo.homepage || repo.html_url;
      card.target = '_blank';
      card.rel = 'noopener';

      card.innerHTML = `
        <div class="card-header">
          <div class="card-name">${repo.name}</div>
          <div class="card-arrow">↗</div>
        </div>
        <div class="card-desc">${repo.description || ''}</div>
        <div class="card-lang">${repo.language}</div>
      `;

      container.appendChild(card);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });

    container.querySelectorAll('.card').forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(12px)';
      c.style.transition = `opacity .4s ease ${(i % 6) * 0.06}s, transform .4s ease ${(i % 6) * 0.06}s`;
      io.observe(c);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="grid-loading">could not load repositories.</div>';
  }
});
