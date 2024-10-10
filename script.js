// Function to format numbers with commas
function formatNumberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas and symbols before parsing
function cleanNumber(value) {
    return value.replace(/[$,%]/g, '').replace(/,/g, '');
}

// Function to add currency sign dynamically to inputs
function addCurrencySymbol(inputField, symbol) {
    inputField.addEventListener('input', function () {
        let value = cleanNumber(inputField.value); // Clean any symbols before reapplying
        if (!isNaN(value) && value !== '') {
            inputField.value = symbol + formatNumberWithCommas(value);
        } else {
            inputField.value = symbol; // Reset if empty or invalid
        }
    });
}

// Applying dollar sign and comma separator for Revenue and Cost inputs
addCurrencySymbol(document.getElementById('inputRevenue'), '$');
addCurrencySymbol(document.getElementById('inputCost'), '$');

// Applying percentage symbol for GP % input
document.getElementById('inputPercentage').addEventListener('input', function () {
    let value = cleanNumber(document.getElementById('inputPercentage').value);
    if (!isNaN(value) && value !== '') {
        document.getElementById('inputPercentage').value ='%'+ value ;
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
