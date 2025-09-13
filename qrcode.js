// Store transactions array globally
let transactions = [];

// Load initial transactions if any (this could be persisted in real app)
const transactionsList = document.getElementById('transactions-list');

// Handle QR code upload
document.getElementById('qr-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const qrImage = document.getElementById('user-qr-code');
            qrImage.src = e.target.result; // Set uploaded image as QR code
        };
        reader.readAsDataURL(file);
    }
});

// Function to render transactions in table
function renderTransactions() {
    transactionsList.innerHTML = ''; // Clear current list
    transactions.forEach(tx => {
        const tr = document.createElement('tr');
        tr.className = 'border-t'; // Add border for rows

        tr.innerHTML = `
          <td class="p-3">${tx.payer}</td>
          <td class="p-3">${tx.dateTime}</td>
          <td class="p-3">₹${tx.amount}</td>
          <td class="p-3">${tx.status}</td>
        `;

        transactionsList.appendChild(tr);
    });
}

// Example function to simulate payment and add transaction dynamically
function simulateQRPayment() {
    // Create a new transaction example with current datetime
    const now = new Date();
    const tx = {
        payer: 'Customer XYZ',
        dateTime: now.toLocaleString(),
        amount: (Math.random() * 1000 + 100).toFixed(2),
        status: 'Received'
    };

    transactions.push(tx); // Add new transaction
    renderTransactions();  // Refresh the table
}

// Initialize rendering if transactions exist
renderTransactions();
