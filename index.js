/*
Парсит документацию Apple и упаковывает в TS types
All properties are optional by default
After openning page there is a timeout for 1s
*/

const puppeteer = require("puppeteer");
const fs = require("fs").promises;

let text = "";
const startURL =
  "https://developer.apple.com/documentation/appstoreservernotifications/jwstransactiondecodedpayload";
const startName = "AppStoreNotificationTransactionInfo";
let counter = 0;

(async function () {
  const startTime = Date.now();
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "font"].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });

  console.log(`Created in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  await openPage(page, startName, startURL);

  await browser.close();

  console.log(`Done in ${((Date.now() - startTime) / 60000).toFixed(1)}min`);
})();

async function openPage(page, name, url) {
  try {
    counter++;
    const startTime = Date.now();
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    await page.waitForTimeout(1000);

    console.log(
      `Openned num ${counter} in ${((Date.now() - startTime) / 1000).toFixed(
        1
      )}s`
    );

    const obj = await page.evaluate(
      (name, url) => {
        return parsePage(name, url);

        function parsePage(name, url) {
          const returnObj = { str: "", links: [] };

          let str = `/** ${url} */\n`;

          const titleE = document.querySelector(".eyebrow");
          if (!titleE || !titleE.textContent) {
            str += `TODO;`;
            returnObj.str = str;
            return returnObj;
          }

          const title = titleE.textContent.trim();
          if (title === "Object") {
            str += `interface ${name} {`;

            const rows = document.querySelectorAll(`.row.param`);
            if (!rows || !rows.length) {
              str += `}`;
              returnObj.str = str;
              return returnObj;
            }

            str += `\n`;

            for (const [i, row] of rows.entries()) {
              const keyE = row.querySelector(`.property-name`);
              const commentE = row.querySelector(`.content`);
              const typeE = row.querySelector(`.property-type`);
              const typeLinkE = row.querySelector(`.property-type a`);
              const typeMetaE = row.querySelectorAll(`.property-metadata`)[1];
              if (!keyE || !typeE) continue;

              const key = keyE.textContent.trim();
              const type = typeE.textContent.trim();
              const keyName = key
                .split("_")
                .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                .join("");

              if (typeLinkE && typeLinkE.href) {
                returnObj.links.push({
                  name: keyName,
                  url: typeLinkE.href,
                });
              }

              if (commentE && commentE.textContent) {
                str += `  /** ${commentE.textContent.trim()}*/\n`;
              }

              str += `  '${key}'?: ${
                typeLinkE && typeLinkE.href ? keyName : type
              };`;

              if (typeMetaE && typeMetaE.textContent) {
                str += ` /** ${typeMetaE.textContent.trim()} */`;
              }

              str += `\n`;

              if (rows.length - 1 !== i) {
                str += `\n`;
              }
            }

            str += `}`;
            returnObj.str = str;
            return returnObj;
          } else if (title === "Type") {
            const typeE = document.querySelector(".declaration .source");
            if (!typeE || !typeE.textContent) {
              str += `TODO;`;
              returnObj.str = str;
              return returnObj;
            }
            const type = typeE.textContent.trim().split(" ")[0];

            const possibleValuesE = document.querySelector(".datalist");
            if (possibleValuesE) {
              str += `type ${name} = /** ${type} */\n`;

              const nameEls = Array.from(
                possibleValuesE.querySelectorAll(".param-name")
              );
              const commentEls = Array.from(
                possibleValuesE.querySelectorAll(".value-content")
              );
              for (const [i, nameEl] of nameEls.entries()) {
                str += `  | '${nameEl.textContent.trim()}'`;

                if (nameEls.length - 1 === i) {
                  str += `;`;
                }

                if (!commentEls[i]) {
                  str += ` // TODO`;
                } else {
                  str += ` /** ${commentEls[i].textContent.trim()} */`;
                }

                if (nameEls.length - 1 !== i) {
                  str += `\n`;
                }
              }
            } else {
              str += `type ${name} = ${type};`;
            }

            returnObj.str = str;
            return returnObj;
          } else {
            str += `TODO;`;
            returnObj.str = str;
            return returnObj;
          }
        }
      },
      name,
      url
    );

    text += obj.str;
    text += `\n\n`;

    await fs.writeFile(`${__dirname}/parsed.d.ts`, text);

    if (obj.links.length) {
      for (const { name, url } of obj.links) {
        await openPage(page, name, url);
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}
