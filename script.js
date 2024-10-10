document.getElementById('calculateButton').addEventListener('click', function() {
    const revenue = parseFloat(document.getElementById('inputRevenue').value.replace(/,/g, ''));
    const cost = parseFloat(document.getElementById('inputCost').value.replace(/,/g, ''));
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
