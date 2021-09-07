function dataToWiki(Building) {
  let Wikitext;
  if (Building.json.type === "production" && !(Building.json.is_special)) {
    Wikitext = "{{PROTAB";

    for (let j in Building.json["available_products"]) {
      let Product = Building.json.available_products[j];
      const xx = 65 + parseInt(j);
      const XX = String.fromCharCode(xx);
      Wikitext += String.fromCharCode(13) + "|" + XX + "1 = " + Product["name"] + "|" + XX + "2 = " + numberWithCommas(Product.product.resources.supplies);
    }
    Wikitext += String.fromCharCode(13) + "}}";

    return Wikitext;
  }
  const rowspan = createRowspan(Building);
  Wikitext = multiageWiki.tableDef;
  for (let i = 0; i < Building.header.length; i++) {
    if (i === 0) {
      Wikitext += String.fromCharCode(13) + multiageWiki["styleFirstRow"] + Building.header[i]
    } else {
      Wikitext += String.fromCharCode(13) + multiageWiki["styleRow"] + Building.header[i];
    }
  }

  for (let i = 0; i < Building.AgeData.length; i++) {
    Wikitext += String.fromCharCode(13) + "|-"
    for (let j = 0; j < Building.AgeData[i].length; j++) {
      if (rowspan[i][j] > 0) {
        Wikitext += String.fromCharCode(13) + '| ' + ((rowspan[i][j] > 1) ? "rowspan = " + rowspan[i][j] + " | " : "") + Building.AgeData[i][j];
      }
    }
  }
  Wikitext += String.fromCharCode(13) + "|}";
  return Wikitext;
}


function createRowspan(Building) {
  let rowspan = createArray(Building.AgeData.length, Building.AgeData[0].length);

  for (let i = 0; i < Building.AgeData.length; i++) {
    for (let j = 0; j < Building.AgeData[i].length; j++) {
      rowspan[i][j] = 1;
    }
  }
  for (let i = rowspan.length - 1; i > 0; i--) {
    for (let j = rowspan[i].length - 1; j > 0; j--) {
      if (Building.AgeData[i][j] === Building.AgeData[i - 1][j]) {
        rowspan[i - 1][j] += rowspan[i][j]
        rowspan[i][j] = 0;
      }
    }
  }
  return rowspan;
}

function createArray(length) {
  let arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    const args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}
