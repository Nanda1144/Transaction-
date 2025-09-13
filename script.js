

// Global variables
let currentUser = null;
let items = [];
let transactions = [];
let transactionChart = null;
let profitChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Load data from local storage
    loadData();
    
    // Set up event listeners
    document.getElementById('addItemForm').addEventListener('submit', addItem);
    document.getElementById('itemImage').addEventListener('change', previewImage);
    
    // Initialize charts
    initializeCharts();
    
    // Update dashboard
    updateDashboard();
    
    // Show login section by default
    showSection('login');
});

// Load data from local storage
function loadData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
        items = JSON.parse(savedItems);
        renderItems();
    }
    
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
    
    const savedProfile = localStorage.getItem('hotelProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        document.getElementById('hotelName').textContent = profile.name || 'Hotel Name';
        document.getElementById('hotelAddress').textContent = profile.address || 'Address';
        document.getElementById('hotelLocation').textContent = profile.location || 'Location';
        document.getElementById('hotelPhone').textContent = profile.phone || 'Phone Number';
        
        document.getElementById('editHotelName').value = profile.name || '';
        document.getElementById('editHotelAddress').value = profile.address || '';
        document.getElementById('editHotelLocation').value = profile.location || '';
        document.getElementById('editHotelPhone').value = profile.phone || '';
    }
}

// Save data to local storage
function saveData() {
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Toggle floating menu
function toggleMenu() {
    const menuItems = document.getElementById('menuItems');
    menuItems.classList.toggle('show');
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Close menu
    document.getElementById('menuItems').classList.remove('show');
    
    // Update section-specific content
    if (sectionName === 'items') {
        renderItems();
    } else if (sectionName === 'dashboard') {
        updateDashboard();
    } else if (sectionName === 'profit') {
        updateProfitChart();
    }
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in a real app, this would be server-side)
    if (username && password) {
        currentUser = { username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showSection('home');
    } else {
        alert('Please enter both username and password');
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showSection('login');
}

// Show add item form
function showAddItemForm() {
    document.getElementById('addItemModal').style.display = 'block';
}

// Close add item form
function closeAddItemForm() {
    document.getElementById('addItemModal').style.display = 'none';
    document.getElementById('addItemForm').reset();
    document.getElementById('imagePreview').innerHTML = '<img src="images/default-item.png" alt="Preview">';
}

// Preview image before upload
function previewImage() {
    const preview = document.getElementById('imagePreview');
    const file = document.getElementById('itemImage').files[0];
    const reader = new FileReader();
    
    reader.onloadend = function() {
        preview.innerHTML = `<img src="${reader.result}" alt="Preview">`;
    }
    
    if (file) {
        reader.readAsDataURL(file);
    }
}

// Add new item
function addItem(e) {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const category = document.getElementById('itemCategory').value;
    const imageFile = document.getElementById('itemImage').files[0];
    
    let imageSrc = 'images/default-item.png';
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
            imageSrc = reader.result;
            saveNewItem();
        }
        reader.readAsDataURL(imageFile);
    } else {
        saveNewItem();
    }
    
    function saveNewItem() {
        const newItem = {
            id: Date.now(),
            name,
            price,
            category,
            image: imageSrc
        };
        
        items.push(newItem);
        saveData();
        renderItems();
        closeAddItemForm();
        updateDashboard();
    }
}

// Render items
function renderItems() {
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.innerHTML = '';
    
    if (items.length === 0) {
        itemsGrid.innerHTML = '<p>No items added yet. Click "Add Item" to get started.</p>';
        return;
    }
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="price">$${item.price.toFixed(2)}</div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                </div>
            </div>
        `;
        itemsGrid.appendChild(itemCard);
    });
    
    // Update total items count
    document.getElementById('totalItems').textContent = items.length;
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(item => item.id !== id);
        saveData();
        renderItems();
        updateDashboard();
    }
}

// Edit item (simplified for demo)
function editItem(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        const newName = prompt('Enter new name:', item.name);
        if (newName !== null) {
            const newPrice = prompt('Enter new price:', item.price);
            if (newPrice !== null) {
                item.name = newName;
                item.price = parseFloat(newPrice);
                saveData();
                renderItems();
            }
        }
    }
}

// Initialize charts
function initializeCharts() {
    // Transaction Chart
    const transactionCtx = document.getElementById('transactionChart').getContext('2d');
    transactionChart = new Chart(transactionCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Transactions',
                data: [],
                backgroundColor: 'rgba(74, 111, 220, 0.6)',
                borderColor: 'rgba(74, 111, 220, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Profit Chart
    const profitCtx = document.getElementById('profitChart').getContext('2d');
    profitChart = new Chart(profitCtx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Drinks', 'Desserts', 'Other'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Update dashboard
function updateDashboard() {
    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Filter today's transactions
    const todayTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        return transactionDate === todayString;
    });
    
    // Calculate today's revenue
    const todayRevenue = todayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Update dashboard
    document.getElementById('todayTransactions').textContent = todayTransactions.length;
    document.getElementById('todayRevenue').textContent = `$${todayRevenue.toFixed(2)}`;
    
    // Update transaction chart
    updateTransactionChart();
}

// Update transaction chart
function updateTransactionChart() {
    // Get date range (default to last 7 days)
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    let startDate, endDate;
    
    if (dateFrom && dateTo) {
        startDate = new Date(dateFrom);
        endDate = new Date(dateTo);
    } else {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
    }
    
    // Generate date labels
    const labels = [];
    const data = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString());
        
        // Filter transactions for this date
        const dayTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
            return transactionDate === dateString;
        });
        
        // Calculate total for this date
        const total = dayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        data.push(total);
    }
    
    // Update chart
    transactionChart.data.labels = labels;
    transactionChart.data.datasets[0].data = data;
    transactionChart.update();
}

// Update profit chart
function updateProfitChart() {
    // Calculate profit by category
    const profitByCategory = {
        food: 0,
        drink: 0,
        dessert: 0,
        other: 0
    };
    
    transactions.forEach(transaction => {
        const item = items.find(item => item.id === transaction.itemId);
        if (item) {
            profitByCategory[item.category] += transaction.amount;
        }
    });
    
    // Update chart
    profitChart.data.datasets[0].data = [
        profitByCategory.food,
        profitByCategory.drink,
        profitByCategory.dessert,
        profitByCategory.other
    ];
    profitChart.update();
}

// Generate QR code
function generateQR() {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    
    // In a real app, this would be a payment link or unique identifier
    const paymentData = `Payment for Hotel/Restaurant - ${Date.now()}`;
    
    QRCode.toCanvas(qrContainer, paymentData, {
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    }, function (error) {
        if (error) console.error(error);
        console.log('QR code generated successfully!');
    });
}

// Save profile
function saveProfile() {
    const profile = {
        name: document.getElementById('editHotelName').value,
        address: document.getElementById('editHotelAddress').value,
        location: document.getElementById('editHotelLocation').value,
        phone: document.getElementById('editHotelPhone').value
    };
    
    localStorage.setItem('hotelProfile', JSON.stringify(profile));
    
    // Update display
    document.getElementById('hotelName').textContent = profile.name || 'Hotel Name';
    document.getElementById('hotelAddress').textContent = profile.address || 'Address';
    document.getElementById('hotelLocation').textContent = profile.location || 'Location';
    document.getElementById('hotelPhone').textContent = profile.phone || 'Phone Number';
    
    alert('Profile saved successfully!');
}

// Edit banner (simplified for demo)
function editBanner() {
    alert('Banner editing would be implemented in a full version');
}

// Edit profile picture (simplified for demo)
function editProfilePic() {
    alert('Profile picture editing would be implemented in a full version');
}

// Generate daily report
function generateDailyReport() {
    alert('Daily report would be generated in a full version');
}

// Generate weekly report
function generateWeeklyReport() {
    alert('Weekly report would be generated in a full version');
}

// Generate monthly report
function generateMonthlyReport() {
    alert('Monthly report would be generated in a full version');
}

// Reset all data
function resetData() {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        localStorage.removeItem('items');
        localStorage.removeItem('transactions');
        localStorage.removeItem('hotelProfile');
        location.reload();
    }
}

// Show transaction history
function showTransactionHistory() {
    document.getElementById('transactionModal').style.display = 'block';
    renderTransactionHistory();
}

// Close transaction modal
function closeTransactionModal() {
    document.getElementById('transactionModal').style.display = 'none';
}

// Render transaction history
function renderTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionList.innerHTML = '<p>No transactions yet.</p>';
        return;
    }
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedTransactions.forEach(transaction => {
        const item = items.find(item => item.id === transaction.itemId);
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        transactionItem.innerHTML = `
            <div class="transaction-info">
                <h4>${item ? item.name : 'Unknown Item'}</h4>
                <div class="transaction-date">${formattedDate}</div>
            </div>
            <div class="transaction-amount">$${transaction.amount.toFixed(2)}</div>
        `;
        
        transactionList.appendChild(transactionItem);
    });
}

// Process payment (simplified for demo)
function processPayment(itemId) {
    const item = items.find(item => item.id === itemId);
    if (item) {
        const transaction = {
            id: Date.now(),
            itemId: item.id,
            amount: item.price,
            date: new Date().toISOString()
        };
        
        transactions.push(transaction);
        saveData();
        updateDashboard();
        
        alert(`Payment of $${item.price.toFixed(2)} for ${item.name} processed successfully!`);
    }
}






