const topicsContainer = document.querySelector('#topics');

function showMessage(message) {
  topicsContainer.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.className = 'topic-item message';
  paragraph.textContent = message;
  topicsContainer.append(paragraph);
}

function toggleTopicStrikeThrough(position) {
  const topic = topicsContainer.children.item(position - 1);
  if (!(topic instanceof HTMLButtonElement)) return;

  const isStruckThrough = topic.classList.toggle('is-struck-through');
  topic.setAttribute('aria-pressed', String(isStruckThrough));
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
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'topic-item';
      button.setAttribute('aria-pressed', 'false');
      button.textContent = String(topic);
      const position = topicsContainer.children.length + 1;
      button.addEventListener('click', () => toggleTopicStrikeThrough(position));
      topicsContainer.append(button);
    }

    if (topicsContainer.children.length === 0) showMessage('No topics found in topics.json.');
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Could not read topics from topics.json.');
  }
}

void showTopics();