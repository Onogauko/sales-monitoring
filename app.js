import { db } from './firebase.js';

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

    header: false,
    skipEmptyLines: true,

    complete: async function(results){

      console.log(results.data);

      let totalUpload = 0;

      // mulai dari row data asli
      for(let i = 9; i < results.data.length; i++){

        const row = results.data[i];

        if(!row[5]) continue;

        try{

          await addDoc(collection(db, "sales"), {

            date: row[0],

            holdingCompany: row[1],

            company: row[2],

            department: row[3],

            departmentName: row[4],

            sku: row[5],

            itemName: row[6],

            barcode: row[7],

            category: row[8],

            qty: Number(row[9]) || 0,

            amount: Number(row[10]) || 0,

            createdAt: new Date()

          });

          totalUpload++;

          console.log("Uploaded:", row[5]);

        }catch(error){

          console.error(error);

        }

      }

      alert(totalUpload + " data berhasil upload ke Firebase");

    }

  });

});
