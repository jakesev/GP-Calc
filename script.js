// Function to format numbers with commas
function formatNumberWithCommas(value) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove any non-numeric characters except the decimal point
function cleanNumber(value) {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
}

// Function to format input fields with dollar sign and commas
function formatCurrencyInput(inputField) {
    inputField.addEventListener('input', function () {
        let cleanValue = cleanNumber(inputField.value);
        if (cleanValue !== '') {
            inputField.value = '$' + formatNumberWithCommas(cleanValue);
        } else {
            inputField.value = '$'; // Reset to just the dollar sign if empty
        }
    });
}

// Function to format percentage input field
function formatPercentageInput(inputField) {
    inputField.addEventListener('input', function () {
        let cleanValue = cleanNumber(inputField.value);
        if (cleanValue !== '') {
            inputField.value = '%' + cleanValue;
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);
        } else {
            inputField.value = '%'; // Reset to just the percentage symbol if empty
        }
    });
}

// Function to round up to the nearest $10
function roundToNearestTen(value) {
    return Math.ceil(value / 10) * 10;
}

// Apply formatting to the input fields
formatCurrencyInput(document.getElementById('inputRevenue'));
formatCurrencyInput(document.getElementById('inputCost'));
formatPercentageInput(document.getElementById('inputPercentage'));

// Calculation function
document.getElementById('calculateButton').addEventListener('click', function () {
    const revenue = parseFloat(cleanNumber(document.getElementById('inputRevenue').value));
    const cost = parseFloat(cleanNumber(document.getElementById('inputCost').value));
    const percentage = parseFloat(cleanNumber(document.getElementById('inputPercentage').value));

    if (isNaN(revenue) || isNaN(cost) || isNaN(percentage)) {
        alert('Please enter valid numbers');
        return;
    }

    // Calculate adjusted revenue based on given margin
    const margin = percentage / 100;
    let adjustedRevenue = cost / (1 - margin);

    // Round adjusted revenue to nearest $10
    const roundedAdjustedRevenue = roundToNearestTen(adjustedRevenue);

    // Adjust the discount so that the adjusted revenue matches the nearest $10
    const adjustedMargin = 1 - (cost / roundedAdjustedRevenue);
    const newPercentage = adjustedMargin * 100;

    // Calculate the difference/change
    const change = roundedAdjustedRevenue - revenue;

    // Format numbers with commas
    const formatCurrency = (num) => {
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // Display adjusted revenue and new percentage
    document.getElementById('resultAdjustedRevenue').textContent = `Adjusted Revenue: ${formatCurrency(roundedAdjustedRevenue)}`;
    document.getElementById('resultChange').textContent = `New GP %: ${newPercentage.toFixed(2)}%`;

    // Show the Copy Button and assign the clean discount value (with 2 decimal places)
    const copyButton = document.getElementById('copyButton'); // Copy button reference
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
    document.getElementById('inputRevenue').value = '$';
    document.getElementById('inputCost').value = '$';
    document.getElementById('inputPercentage').value = '%';
    document.getElementById('resultAdjustedRevenue').textContent = '';
    document.getElementById('resultChange').textContent = '';
    document.getElementById('copyButton').style.display = 'none'; // Hide Copy button again
    this.style.display = 'none'; // Hide Clear button itself
});
