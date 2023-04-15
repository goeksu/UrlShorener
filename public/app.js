document.getElementById('shorten-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalUrl = document.getElementById('original-url').value;
    const response = await fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
    });

    if (response.ok) {
        const { shortId } = await response.json();
        const shortUrl = `${window.location.origin}/${shortId}`;

        document.getElementById('short-url').href = shortUrl;
        document.getElementById('short-url').textContent = shortUrl;
        document.getElementById('result').classList.remove('d-none');
    } else {
        alert('An error occurred. Please try again.');
    }
});
