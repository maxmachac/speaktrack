const topicsContainer = document.querySelector('#topics');

function showMessage(message) {
  topicsContainer.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.className = 'topic-item alert alert-warning message';
  paragraph.textContent = message;
  topicsContainer.append(paragraph);
}

async function showTopics() {
  try {
    const response = await fetch('./topics.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load topics.json (HTTP ${response.status}).`);

    const data = await response.json();
    const topics = Array.isArray(data.topics) ? data.topics : [];

    topicsContainer.replaceChildren();
    for (const [index, topic] of topics.entries()) {
      if (topic === null || topic === undefined || String(topic).trim() === '') continue;
      const paragraph = document.createElement('p');
      paragraph.className = 'topic-item card border border-base-300 bg-base-100 shadow-sm';
      paragraph.style.setProperty('--item-index', index);
      paragraph.textContent = String(topic);
      topicsContainer.append(paragraph);
    }

    if (topicsContainer.children.length === 0) showMessage('No topics found in topics.json.');
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Could not read topics from topics.json.');
  }
}

void showTopics();