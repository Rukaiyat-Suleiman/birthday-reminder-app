document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('birthdayForm');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.getElementById('btnText');
    const toastContainer = document.getElementById('toast-container');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            dob: formData.get('dob')
        };

        // Loading state
        const originalText = btnText.textContent;
        btnText.textContent = 'Saving...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showToast(result.message || 'Saved successfully', 'success');
                form.reset();
            } else {
                showToast(result.message || 'An error occurred', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        } finally {
            // Restore button
            btnText.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        }
    });

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconHtml = type === 'success' 
            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

        toast.innerHTML = `
            <div class="toast-icon">${iconHtml}</div>
            <div class="toast-message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }
});
