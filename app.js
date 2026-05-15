import { db } from './firebase.js';

import {
  collection,
  writeBatch,
  doc
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

      const progressText =
      document.getElementById("totalSales");

      let totalUpload = 0;

      const rows = results.data.slice(9);

      const chunkSize = 500;

      for(let i = 0; i < rows.length; i += chunkSize){

        const batch = writeBatch(db);

        const chunk = rows.slice(i, i + chunkSize);

        for(const row of chunk){

          if(!row[5]) continue;

          const docRef = doc(collection(db, "sales"));

          batch.set(docRef, {

            date: row[0] || "",

            holdingCompany: row[1] || "",

            company: row[2] || "",

            department: row[3] || "",

            departmentName: row[4] || "",

            sku: row[5] || "",

            itemName: row[6] || "",

            barcode: row[7] || "",

            category: row[8] || "",

            qty: Number(row[9]) || 0,

            amount: Number(row[10]) || 0,

            createdAt: new Date()

          });

          totalUpload++;

        }

        await batch.commit();

        const percent =
        Math.floor((totalUpload / rows.length) * 100);

        progressText.innerText =
        percent + "% Uploading... (" +
        totalUpload +
        "/" +
        rows.length +
        ")";

        console.log(percent + "%");

      }

      progressText.innerText =
      "Upload selesai: " +
      totalUpload +
      " data";

      alert(
        totalUpload +
        " data berhasil upload"
      );

    }

  });

});
