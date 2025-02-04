import puppeteer from "puppeteer";
import fs from "fs";
import Handlebars from "handlebars";

export async function pdfGenerator(fileName, data, template) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    const content = await compile(data, template);
    await timeout(5000);
    await page.setContent(content);
    await page.emulateMediaType("print");

    let buffer = await page.pdf({
      path: "./" + fileName,
      format: "A4",
      margin: { top: 30, bottom: 50, left: 20, right: 20 },
      printBackground: true,
    });

    // Uncomment this code if you don't want to save the file on disk

    fs.unlink(`./${fileName}`, (err) => {
      if (err) console.log(err);
      else {
        console.log("Temporary report pdf deleted");
      }
    });

    return buffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function compile(data, template) {
  let html, doc;
  switch (template) {
    case "SMSIR":
      html = await fs.promises.readFile(
        "./src/components/templates/SMSIR/SMSIR.hbs",
        "utf-8"
      );
      doc = Handlebars.compile(html)(data);
      return doc;
    case "haulageAccident":
      html = await fs.promises.readFile(
        "./src/components/templates/haulageAccident/haulageAccident.hbs",
        "utf-8"
      );
      doc = Handlebars.compile(html)(data);
      return doc;
    default:
      throw new Error("Invalid template");
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
