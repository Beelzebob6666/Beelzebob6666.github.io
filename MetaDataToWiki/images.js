function generateBuildingFileName(buildingName) {
    let wikiName = buildingName.replaceAll("- Lv.", "Lvl")
    wikiName = wikiName.replaceAll(" ", "_")
    if (wikiName.search("Lv.") >= 0) {
        const x = wikiName.search("-_");
        if (x <= 7 && x >= 0) {
            wikiname = wikiname.substr(x + 2) + "_Lvl_" + wikiname.substr(4, x - 5);
        }
    }
    return wikiName + ".png"
}

function findImages(Building) {
    clearImages();

    let asset = Building.json.asset_id
    asset = asset.substr(0, 2) + "SS_" + asset.substr(2);
    let link = "https://foezz.innogamescdn.com/assets/city/buildings/" + asset + ".png"
    const buildingFileName = generateBuildingFileName(Building.json.name);
    addImg(link, buildingFileName);

    if (Building.json.type === "production" || Building.json.type === "goods") {
        let j = 0;
        for (let product in Building.json.available_products) {
            j += 1;
            const Product = Building.json.available_products[product];
            let wikiName = Building.json.name + "_" + j;
            wikiName = wikiName.replace(" ", "_") + ".png"
            link = "https://foezz.innogamescdn.com/assets/city/gui/production_icons/" + Product["asset_name"] + ".png"
            addImg(link, wikiName);
        }
    }
}

function clearImages() {
    const div = document.getElementById("images");
    div.innerHTML = '';
}
function clearDownload() {
    const div = document.getElementById("download");
    div.innerHTML = '';
}

function removeImg(img) {
    const div = document.getElementById("images");
    img.className = "forSelection";
    img.onclick = function () {
        selectImg(this);
    };
    div.appendChild(img);
}

function selectAll() {
    const all = document.getElementsByClassName("forSelection");
    for (let i = 0; i < all.length; i++) {
        selectImg(all[0]);
    }

}

function selectImg(img) {
    const div = document.getElementById("download");
    img.className = "forDownload";
    img.onclick = function () {
        removeImg(this);
    };
    div.appendChild(img);
}

function addImg(src, name) {
    const div = document.getElementById("images");
    const img = document.createElement("img");
    img.src = src;
    img.title = name;
    img.crossOrigin = "anonymous";
    img.className = 'forSelection';
    img.onclick = function () {
        selectImg(this);
    };
    div.appendChild(img);

}

function download() {
    const zip = new JSZip();
    const all = document.getElementsByClassName("forDownload");
    if (all.length>0) {
        for (let i = 0; i < all.length; i++) {
            const img = all[i];
            const img1 = getBase64Image(img);
            zip.file(img.title, img1, { base64: true });
        }
        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "Images for wiki.zip");
        });
    }
    clearDownload();
}

function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
