// Function to format numbers with commas
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas before parsing to a float
function removeCommas(number) {
    return number.replace(/,/g, '');
}

// Event listener to add comma separators as user types
function addCommaSeparatorsToInput(inputField) {
    inputField.addEventListener('input', function (e) {
        const value = inputField.value.replace(/,/g, '');
        if (!isNaN(value) && value !== '') {
            inputField.value = formatNumberWithCommas(value);
        }
    });
}

// Add comma separators to revenue and cost inputs
document.getElementById('inputRevenue').addEventListener('input', function () {
    addCommaSeparatorsToInput(this);
});

document.getElementById('inputCost').addEventListener('input', function () {
    addCommaSeparatorsToInput(this);
});

// Calculation function
document.getElementById('calculateButton').addEventListener('click', function() {
    const revenue = parseFloat(removeCommas(document.getElementById('inputRevenue').value));
    const cost = parseFloat(removeCommas(document.getElementById('inputCost').value));
    const percentage = parseFloat(document.getElementById('inputPercentage').value);

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

    // Display results
    document.getElementById('resultAdjustedRevenue').textContent = `Adjusted Revenue: ${formatCurrency(adjustedRevenue)}`;

    if (change > 0) {
        document.getElementById('resultChange').textContent = `Increase by: ${formatCurrency(change)}`;
    } else if (change < 0) {
        document.getElementById('resultChange').textContent = `Decrease by: -${formatCurrency(Math.abs(change))}`;
    } else {
        document.getElementById('resultChange').textContent = 'No adjustment needed';
    }
});
