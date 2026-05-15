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

    header:true,

    complete: async function(results){

      console.log(results.data);

      let totalUpload = 0;

      for(const item of results.data){

        if(!item.Item) continue;

        try{

          await addDoc(collection(db, "sales"), {

            date: item.Date || "",

            sku: item.Item || "",

            itemName: item["Item Name"] || "",

            department: item.Department || "",

            departmentName: item["Department Desc"] || "",

            qty: Number(item["Sales Qty"]) || 0,

            amount: Number(item["Sales Amount"]) || 0,

            createdAt: new Date()

          });

          totalUpload++;

          console.log("Uploaded:", item.Item);

        }catch(error){

          console.error(error);

        }

      }

      alert(totalUpload + " data berhasil upload ke Firebase");

    }

  });

});
