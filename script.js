// Function to format numbers with commas
function formatNumberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas and symbols before parsing
function cleanNumber(value) {
    return value.replace(/[$,%]/g, '').replace(/,/g, '');
}

// Function to format input with symbols (like $, %)
function formatWithSymbol(inputField, symbol) {
    inputField.addEventListener('input', function () {
        let cleanValue = cleanNumber(inputField.value); // Remove existing commas and symbols
        if (!isNaN(cleanValue) && cleanValue !== '') {
            // Apply the symbol and re-add commas
            inputField.value = symbol + formatNumberWithCommas(cleanValue);
        } else {
            inputField.value = symbol; // Reset to just the symbol if empty
        }
    });
}

// Adding dollar symbol and comma formatting for Revenue and Cost fields
formatWithSymbol(document.getElementById('inputRevenue'), '$');
formatWithSymbol(document.getElementById('inputCost'), '$');

// Adding percentage symbol formatting for GP % field
document.getElementById('inputPercentage').addEventListener('input', function () {
    let cleanValue = cleanNumber(document.getElementById('inputPercentage').value);
    if (!isNaN(cleanValue) && cleanValue !== '') {
        document.getElementById('inputPercentage').value = cleanValue + '%';
    } else {
        document.getElementById('inputPercentage').value = '';
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
});
