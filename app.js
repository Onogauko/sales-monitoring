let salesData = [];
let filteredData = [];

const ctx = document.getElementById('salesChart');

const salesChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Sales',
      data: [],
      borderWidth: 3
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

  if(!file){
    return;
  }

  Papa.parse(file, {

    header:false,
    skipEmptyLines:true,

    complete:function(results){

      console.log(results.data);

      salesData = [];

      for(let i = 9; i < results.data.length; i++){

        const row = results.data[i];

        // skip kalau sku kosong
        if(!row[5]) continue;

        salesData.push({

          date: row[0] || "",

          department: row[3] || "",

          departmentName: row[4] || "",

          sku: String(row[5]),

          itemName: row[6] || "",

          qty: Number(row[9]) || 0,

          amount: Number(row[10]) || 0

        });

      }

      console.log("TOTAL DATA:", salesData.length);

      filteredData = salesData;

      renderDashboard(filteredData);

    }

  });

});

// FILTER

document
.getElementById('filterBtn')
.addEventListener('click', function(){

  const keyword =
  document.getElementById('searchItem')
  .value
  .toLowerCase();

  filteredData = salesData.filter(item => {

    return (
      item.itemName.toLowerCase().includes(keyword) ||
      item.sku.toLowerCase().includes(keyword)
    );

  });

  renderDashboard(filteredData);

});

// RENDER DASHBOARD

function renderDashboard(data){

  // TOTAL

  let totalSales = 0;
  let totalQty = 0;

  data.forEach(item => {

    totalSales += item.amount;
    totalQty += item.qty;

  });

  document.getElementById('totalSales')
  .innerText = rupiah(totalSales);

  document.getElementById('totalQty')
  .innerText = totalQty;

  document.getElementById('totalSku')
  .innerText = new Set(data.map(x => x.sku)).size;

  document.getElementById('totalItem')
  .innerText = data.length;

  // CHART

  const dailySales = {};

  data.forEach(item => {

    if(!dailySales[item.date]){
      dailySales[item.date] = 0;
    }

    dailySales[item.date] += item.amount;

  });

  salesChart.data.labels =
  Object.keys(dailySales);

  salesChart.data.datasets[0].data =
  Object.values(dailySales);

  salesChart.update();

  // TABLE

  const itemMap = {};

  data.forEach(item => {

    if(!itemMap[item.sku]){

      itemMap[item.sku] = {
        itemName:item.itemName,
        qty:0,
        amount:0
      };

    }

    itemMap[item.sku].qty += item.qty;

    itemMap[item.sku].amount += item.amount;

  });

  const sortedItems =
  Object.entries(itemMap)
  .sort((a,b) => b[1].amount - a[1].amount);

  const table =
  document.getElementById('salesTable');

  table.innerHTML = '';

  sortedItems.forEach(item => {

    table.innerHTML += `

      <tr>
        <td>${item[0]}</td>
        <td>${item[1].itemName}</td>
        <td>${item[1].qty}</td>
        <td>${rupiah(item[1].amount)}</td>
      </tr>

    `;

  });

}
