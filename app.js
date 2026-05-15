let salesData = [];
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
  .sort((a,b) => b[1].amount - a[1].amount)
  .slice(0,100);

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
