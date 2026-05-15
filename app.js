let salesData = [];

const ctx = document.getElementById('salesChart');

const salesChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Sales',
      data: [],
      borderWidth: 2
    }]
  }
});

// FORMAT RUPIAH

function rupiah(number){

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(number);

}

// UPLOAD CSV

document
.getElementById('csvFile')
.addEventListener('change', function(e){

  const file = e.target.files[0];

  Papa.parse(file, {

    header:false,
    skipEmptyLines:true,

    complete:function(results){

      salesData = [];

      // mulai dari row data asli
      for(let i = 9; i < results.data.length; i++){

        const row = results.data[i];

        if(!row[5]) continue;

        salesData.push({

          date: row[0],

          department: row[3],

          departmentName: row[4],

          sku: row[5],

          itemName: row[6],

          qty: Number(row[9]) || 0,

          amount: Number(row[10]) || 0

        });

      }

      console.log(salesData);

      renderDashboard(salesData);

    }

  });

});

// RENDER DASHBOARD

function renderDashboard(data){

  // TOTAL SALES

  let totalSales = 0;

  let totalQty = 0;

  data.forEach(item => {

    totalSales += item.amount;

    totalQty += item.qty;

  });

  document.getElementById('totalSales')
  .innerText = rupiah(totalSales);

  // SALES BY DATE

  const dailySales = {};

  data.forEach(item => {

    if(!dailySales[item.date]){
      dailySales[item.date] = 0;
    }

    dailySales[item.date] += item.amount;

  });

  const labels = Object.keys(dailySales);

  const values = Object.values(dailySales);

  salesChart.data.labels = labels;

  salesChart.data.datasets[0].data = values;

  salesChart.update();

  // TOP ITEM

  const itemMap = {};

  data.forEach(item => {

    if(!itemMap[item.itemName]){
      itemMap[item.itemName] = 0;
    }

    itemMap[item.itemName] += item.amount;

  });

  const sortedItems =
  Object.entries(itemMap)
  .sort((a,b) => b[1] - a[1])
  .slice(0,10);

  const topItemsContainer =
  document.getElementById('topItems');

  topItemsContainer.innerHTML = '';

  sortedItems.forEach(item => {

    topItemsContainer.innerHTML += `

      <div class="top-item">

        <span>${item[0]}</span>

        <strong>${rupiah(item[1])}</strong>

      </div>

    `;

  });

}
