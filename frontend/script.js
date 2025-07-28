async function getFact() {
  const topic = document.getElementById('search-input').value.trim();
  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  document.getElementById('loading').style.display = 'block';

  try {
    const response = await fetch(`http://localhost:5500/api/wiki?topic=${encodeURIComponent(topic)}`);
    const data = await response.json();

    document.getElementById('title').textContent = data.title || 'No title found';
    document.getElementById('summary').textContent = data.extract || 'No summary found';
    document.getElementById('link').href = data.url || '#';
  } catch (error) {
    document.getElementById('title').textContent = 'Oops! Something went wrong.';
    document.getElementById('summary').textContent = '';
    document.getElementById('link').href = '#';
  }

  document.getElementById('loading').style.display = 'none';
}