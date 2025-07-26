// Investor form submission
function initializeInvestorForm() {
    const form = document.getElementById('investorForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec';
    
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => response.text())
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Submitted successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    form.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error sending message.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                });
        });
    }
}

// Initialize page functionality
function initializePage() {
    initializeInvestorForm();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);