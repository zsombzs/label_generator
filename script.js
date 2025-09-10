let logoPath = "logo.png";

document.getElementById("excelFile").addEventListener("change", handleFile, false);

function handleFile(e) {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = function(event) {
    let data = new Uint8Array(event.target.result);
    let workbook = XLSX.read(data, { type: 'array' });
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    let json = XLSX.utils.sheet_to_json(sheet);

    renderLabels(json);
  };
  reader.readAsArrayBuffer(file);
}

function renderLabels(data) {
    const container = document.getElementById("labels");
    container.innerHTML = "";
    let pageDiv = null;
  
    data.forEach((row, index) => {
      if (index % 24 === 0) {
        pageDiv = document.createElement("div");
        pageDiv.className = "page";
        container.appendChild(pageDiv);
      }
  
      const div = document.createElement("div");
      div.className = "label";
  
      const line1 = (row["első_sor"] || "").substring(0, 20);
  
      const secondLineText = (row["második_sor"] || "").substring(0, 10);
  
      const kiszereles = row["kiszerelés"] || "";
  
      const ar = row["Ár"] || "";
  
      const ftPerL = row["Ft/l"] || "";
  
      const ftPerKg = row["Ft/kg"] || "";
  
      const pricePerUnit = ftPerL ? ftPerL + " Ft/l" : ftPerKg ? ftPerKg + " Ft/kg" : "";
  
      div.innerHTML = `
        <img src="${logoPath}" class="logo">
        <div class="line1">${line1}</div>
        <div class="line2">
          <span class="left">${secondLineText}</span>
        </div>
        <div class="kiszereles">${kiszereles}</div>
        <div class="line3">${("cikkszám: " + (row["cikkszám"] || "")).substring(0, 20)}</div>
        <div class="bottom">
            <div class="price-box1">
            <span class="amount">${ar ? ar : ""},-</span>
            <span class="unit">Ft</span>
            </div>
            <div class="price-box2">
            <span class="amount">
                ${pricePerUnit ? pricePerUnit.replace(/,? ?Ft(\/l|\/kg)?/, "") : ""},-
            </span>
            <span class="unit">
                ${pricePerUnit ? pricePerUnit.match(/Ft(\/l|\/kg)?/)?.[0] || "" : ""}
            </span>
            </div>
        </div>

      `;
  
      pageDiv.appendChild(div);
    });
  }
  
  
  
  
  

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#downloadBtn");
    btn.addEventListener("click", generatePDF);

    const sablonBtn = document.querySelector("#sablonBtn");
    sablonBtn.addEventListener("click", downloadTemplate);
});

function generatePDF() {
    let element = document.getElementById("labels");
    let opt = {
      margin: 0,
      filename: "cimkek.pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function downloadTemplate() {
    const link = document.createElement("a");
    link.href = "excel_sablon.xlsm";
    link.download = "excel_sablon.xlsm";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
