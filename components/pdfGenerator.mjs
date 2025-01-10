import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import path from "path"
import fss from "fs";
import fs from "fs-extra"
import { timeout } from "puppeteer";

async function compile (data) {
  const html = await fs.readFileSync("./components/templates/SMSIR/test.hbs", "utf-8");
  const doc = Handlebars.compile(html)(data);
  return doc
};




export async function pdfGenerator (fileName, data) {

  try {
    //const html = fs.readFile("./components/templates/test.hbs");
    //console.log(html);
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: "chrome"
    });
    const page = await browser.newPage();

    const content = await compile(data);
    await timeout(5000)
    await page.setContent(content);
    //await page.addStyleTag({ path: "./components/templates/SMSIR/test-output.css" });
    await page.emulateMediaType("print");


    let buffer = await page.pdf({
      path: "./" + fileName,
      format: "A4",
      margin: { top: 30, bottom: 50, left: 20, right: 20 },
      printBackground: true,
    });

    //if you don't want to save the file on disk you can uncomment this code
    fss.unlink(`./${fileName}`, (err => {
      if (err) console.log(err);
      else {
        console.log("Temporary report pdf deleted");
      }
    }));

    await browser.close();
    
    return Promise.resolve(buffer);
  } catch (error) {
    return Promise.reject("error ", error);
  }
};
