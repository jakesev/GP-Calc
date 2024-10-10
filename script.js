// Function to format numbers with commas
function formatNumberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas and symbols before parsing
function cleanNumber(value) {
    return value.replace(/[$,%]/g, '').replace(/,/g, '');
}

// Function to add currency or percentage sign dynamically to inputs
function formatWithSymbol(inputField, symbol) {
    inputField.addEventListener('input', function () {
        let cleanValue = cleanNumber(inputField.value); // Clean any symbols before reapplying
        if (!isNaN(cleanValue) && cleanValue !== '') {
            inputField.value = symbol + formatNumberWithCommas(cleanValue);
        } else {
            inputField.value = symbol; // Reset to just the symbol if empty
        }
    });
}

// Adding dollar symbol and comma formatting for Revenue and Cost fields
formatWithSymbol(document.getElementById('inputRevenue'), '$');
formatWithSymbol(document.getElementById('inputCost'), '$');

// Handling the GP% input field so that % stays at the start
document.getElementById('inputPercentage').addEventListener('input', function () {
    let inputField = document.getElementById('inputPercentage');
    let cleanValue = cleanNumber(inputField.value); // Remove % and commas

    // Apply % at the start, and prevent it from moving
    if (!isNaN(cleanValue) && cleanValue !== '') {
        inputField.value = '%' + cleanValue;
        // Keep the cursor at the right position (right after the number)
        inputField.setSelectionRange(inputField.value.length, inputField.value.length);
    } else {
        inputField.value = '%'; // Reset to just the percentage symbol
        inputField.setSelectionRange(1, 1); // Keep cursor right after %
    }
});

// Calculation function
document.getElementById('calculateButton').addEventListener('click', function () {
    const revenue = parseFloat(cleanNumber(document.getElementById('inputRevenue').value));
    const cost = parseFloat(cleanNumber(document.getElementById('inputCost').value));
    const percentage = parseFloat(cleanNumber(document.getElementById('inputPercentage').value));

    if (isNaN(revenue) || isNaN(cost) || isNaN(percentage)) {
        alert('Please enter valid numbers');
        return;
    }

    // Calculate adjusted revenue and change
    const margin = percentage / 100;
    const adjustedRevenue = cost / (1 - margin);
    const change = adjustedRevenue - revenue;

    // Format numbers with commas
    const formatCurrency = (num) => {
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // Display adjusted revenue
    document.getElementById('resultAdjustedRevenue').textContent = `Adjusted Revenue: ${formatCurrency(adjustedRevenue)}`;

    // Display change result
    const copyButton = document.getElementById('copyButton'); // Copy button reference

    if (change > 0) {
        document.getElementById('resultChange').textContent = `Increase by: ${formatCurrency(change)}`;
    } else if (change < 0) {
        document.getElementById('resultChange').textContent = `Decrease by: -${formatCurrency(Math.abs(change))}`;
    } else {
        document.getElementById('resultChange').textContent = 'No adjustment needed';
    }

    // Show the Copy Button and assign the clean discount value (with 2 decimal places)
    copyButton.style.display = 'inline-block'; // Ensure the button is visible
    copyButton.setAttribute('data-discount', Math.abs(change).toFixed(2)); // Store the clean number with 2 decimal places

    // Show the Clear button below the Copy button when Copy button is visible
    document.getElementById('clearButton').style.display = 'inline-block';
});

// Copy functionality when button is clicked
document.getElementById('copyButton').addEventListener('click', function () {
    const discountValue = this.getAttribute('data-discount'); // Get the stored discount value with 2 decimal places

    // Create a temporary text area to copy the value
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = discountValue;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    // Show the notification with the copied message
    showNotification(`Discount value copied: ${discountValue}`);
});

// Show notification function
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message; // Set the message
    notification.classList.remove('hidden');
    notification.classList.add('show');
    
    // Automatically hide the notification after the specified duration
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, duration);
}

// Clear all inputs and results
document.getElementById('clearButton').addEventListener('click', function () {
    document.getElementById('inputRevenue').value = '';
    document.getElementById('inputCost').value = '';
    document.getElementById('inputPercentage').value = '';
    document.getElementById('resultAdjustedRevenue').textContent = '';
    document.getElementById('resultChange').textContent = '';
    document.getElementById('copyButton').style.display = 'none'; // Hide Copy button again
    this.style.display = 'none'; // Hide Clear button itself
});
