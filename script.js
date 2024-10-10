// Function to format numbers with commas
function formatNumberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas from the formatted number
function removeCommas(value) {
    return value.replace(/,/g, '');
}

// Add comma separators to an input field while typing
function applyCommaSeparator(inputField) {
    inputField.addEventListener('input', function () {
        let value = removeCommas(inputField.value); // Remove commas before re-formatting
        if (!isNaN(value) && value !== '') {
            inputField.value = formatNumberWithCommas(value);
        }
    });
}

// Applying comma separator for revenue and cost input fields
applyCommaSeparator(document.getElementById('inputRevenue'));
applyCommaSeparator(document.getElementById('inputCost'));

// Calculation logic
document.getElementById('calculateButton').addEventListener('click', function () {
    const revenue = parseFloat(removeCommas(document.getElementById('inputRevenue').value));
    const cost = parseFloat(removeCommas(document.getElementById('inputCost').value));
    const percentage = parseFloat(document.getElementById('inputPercentage').value);

    if (isNaN(revenue) || isNaN(cost) || isNaN(percentage)) {
        alert('Please enter valid numbers');
        return;
    }

    // Calculate adjusted revenue and the change
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
