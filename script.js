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
    if (change > 0) {
        document.getElementById('resultChange').textContent = `Increase by: ${formatCurrency(change)}`;
    } else if (change < 0) {
        document.getElementById('resultChange').textContent = `Decrease by: -${formatCurrency(Math.abs(change))}`;
    } else {
        document.getElementById('resultChange').textContent = 'No adjustment needed';
    }

    // Show Copy Button and Assign the Clean Discount Value
    const copyButton = document.getElementById('copyButton');
    copyButton.style.display = 'inline-block'; // Show the button
    copyButton.value = cleanNumber(change.toString()); // Store the clean value without symbols or commas
});

// Copy Functionality
document.getElementById('copyButton').addEventListener('click', function () {
    const cleanValue = this.value;
    
    // Create a temporary text area to copy the value
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = cleanValue;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    alert('Discount value copied: ' + cleanValue);
});
