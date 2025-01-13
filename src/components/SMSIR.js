import  { pdfGenerator }  from "./pdfGenerator.mjs";
import { DateTime } from "luxon";
import fs from "fs-extra"


export default async  function buildSMSIR(data) {
    const projectArray = data.formData.project.split(",");
    data.formData.project = projectArray[0];
    data.date  = DateTime.fromISO(data.date).toFormat("dd/MM/yyyy HH:mm");
    console.log(data.date) 
    const test = await  pdfGenerator(data.fileName, data);
    console.log(data)
    // const pdf = fs.readFileSync(data.fileName, "utf-8");
    // const pdfBlob = new Blob([pdf]);
    //console.log(pdfBlob)
    //fs.unlinkSync(data.fileName);
    callMsGraphFileUpload(data, test);
    //console.log(pdf)
}

async function callMsGraphFileUpload(
  data,
  pdf
  ) {
    const headers = new Headers();
    const bearer = `Bearer ${data.accessToken}`;
  
    headers.append("Authorization", bearer);
  
    const options = {
      method: "PUT",
      headers: headers,
      body: pdf,
    };
  
    return fetch(
      `https://graph.microsoft.com/v1.0/sites/${data.siteId}/drives/${data.driveId}/root:/SMSIR/${data.fileName}:/content`,
      options
    )
      .then((response) => console.log(response.json()))
      .catch((error) => console.log(error));
  }