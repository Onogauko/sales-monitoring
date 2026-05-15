const ctx = document.getElementById('salesChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Mon','Tue','Wed','Thu','Fri'],
    datasets: [{
      label: 'Sales',
      data: [12,19,3,5,2],
      borderWidth: 2
    }]
  }
});

document
.getElementById('csvFile')
.addEventListener('change', function(e){

  const file = e.target.files[0];

  Papa.parse(file, {
    header:true,

    complete:function(results){

      console.log(results.data);

      alert('CSV berhasil dibaca');

    }
  });

});
