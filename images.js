function findImages(Building) {
    clearImages();
    var wikiname = Building.json.name;
    wikiname = wikiname.replaceAll("- Lv.", "Lvl")
    wikiname = wikiname.replaceAll(" ", "_")
    if (wikiname.search("Lv.") >= 0) {
        var x = wikiname.search("-_");
        if (x <= 7 && x >= 0) {
            wikiname = wikiname.substr(x + 2) + " Lvl " + wikiname.substr(4, x - 5);
        }
    }
    wikiname += ".png"
    var asset = Building.json.asset_id
    asset = asset.substr(0, 2) + "SS_" + asset.substr(2);
    var link = "https://foezz.innogamescdn.com/assets/city/buildings/" + asset + ".png"
    addImg(link, wikiname);

    if (Building.json.type == "production" || Building.json.type == "goods") {
        var j = 0;
        for (let product in Building.json.available_products) {
            j += 1;
            var Product = Building.json.available_products[product];
            wikiname = Building.json.name + "_" + j;
            wikiname = wikiname.replace(" ", "_") + ".png"
            link = "https://foezz.innogamescdn.com/assets/city/gui/production_icons/" + Product["asset_name"] + ".png"
            addImg(link, wikiname);
        }
    }
}

function clearImages() {
    var div = document.getElementById("images");
    div.innerHTML = '';
}
function clearDownload() {
    var div = document.getElementById("download");
    div.innerHTML = '';
}


function removeImg(img) {
    var div = document.getElementById("images");
    img.className = "forSelection";
    img.onclick = function () {
        selectImg(this);
    };
    div.appendChild(img);
}

function selectAll() {
    var all = document.getElementsByClassName("forSelection");
    if (all.length>0) {
        for (let i = 0; i < all.length; i++) {
            var img = all[0];
            selectImg(img);
        }
    }

}

function selectImg(img) {
    var div = document.getElementById("download");
    img.className = "forDownload";
    img.onclick = function () {
        removeImg(this);
    };
    div.appendChild(img);
}

function addImg(src, name) {
    var div = document.getElementById("images");
    var img = document.createElement("img");
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

    var zip = new JSZip();
    var all = document.getElementsByClassName("forDownload");
    if (all.length>0) {
        for (let i = 0; i < all.length; i++) {
            var img = all[i];
            var img1 = getBase64Image(img);
            zip.file(img.title, img1, { base64: true });
        }
        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "Images for wiki.zip");

        });
    }
}


function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
