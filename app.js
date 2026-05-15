let salesData = [];

function rupiah(number){

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(number);

}

// INIT CHART

const canvas = document.getElementById('salesChart');

let salesChart = null;

if(canvas){

  salesChart = new Chart(canvas, {

    type:'line',

    data:{
      labels:[],
      datasets:[{
        label:'Sales',
        data:[],
        borderWidth:2
      }]
    }

  });

}

// UPLOAD CSV

const csvInput =
document.getElementById('csvFile');

csvInput.addEventListener('change', function(e){

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

        if(!row || !row[5]){
          continue;
        }

        salesData.push({

          date: String(row[0] || ""),

          sku: String(row[5] || ""),

          itemName: String(row[6] || ""),

          qty: parseFloat(
            String(row[9] || "0")
            .replace(/,/g,'')
          ) || 0,

          amount: parseFloat(
            String(row[10] || "0")
            .replace(/,/g,'')
          ) || 0

        });

      }

      console.log("DATA MASUK:", salesData.length);

      renderDashboard();

    }

  });

});

// RENDER

function renderDashboard(){

  let totalSales = 0;

  let totalQty = 0;

  const dailySales = {};

  const itemMap = {};

  salesData.forEach(item => {

    totalSales += item.amount;

    totalQty += item.qty;

    // chart

    if(!dailySales[item.date]){
      dailySales[item.date] = 0;
    }

    dailySales[item.date] += item.amount;

    // table

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

  // cards

  document.getElementById('totalSales')
  .innerText = rupiah(totalSales);

  document.getElementById('totalQty')
  .innerText = totalQty;

  document.getElementById('totalSku')
  .innerText = Object.keys(itemMap).length;

  document.getElementById('totalItem')
  .innerText = salesData.length;

  // chart

  if(salesChart){

    salesChart.data.labels =
    Object.keys(dailySales);

    salesChart.data.datasets[0].data =
    Object.values(dailySales);

    salesChart.update();

  }

  // table

  const salesTable =
  document.getElementById('salesTable');

  salesTable.innerHTML = '';

  const sortedItems =
  Object.entries(itemMap)
  .sort((a,b) => b[1].amount - a[1].amount)
  .slice(0,100);

  sortedItems.forEach(item => {

    salesTable.innerHTML += `

      <tr>

        <td>${item[0]}</td>

        <td>${item[1].itemName}</td>

        <td>${item[1].qty}</td>

        <td>${rupiah(item[1].amount)}</td>

      </tr>

    `;

  });

}
