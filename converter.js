const raw = {
    json: {},
}

const Building = {
    json: '',
    size: 0,
    header: [],
    AgeData: [],
}

var AllowFocusLost = false;
const parsedData = {}

/**
 * Gets the data from FoE.
 * 
 * @param {string} url URL to the json data
 * @returns {Promise|Object}
 */
function downloadJson(url) {
    if (Object.keys(raw.json).length) {
        return raw.json
    }

    return fetch(url).then(response => response.json())
}

function getAges() {
    var select = document.getElementById("filterAge");
    for (age in ages) {

        select.options.add(new Option(age, age));
    }
}

async function getData() {
    var is_special = document.getElementById('isSpecial').checked;
    var filterType = document.getElementById('filterTypeCB').checked;
    var Type = document.getElementById('filterType').value;
    var filterAge = document.getElementById('filterAgeCB').checked;
    var Age = document.getElementById('filterAge').value;
    //Reset Building List
    var options = document.querySelectorAll('#Buildings option');
    options.forEach(o => o.remove());

    raw.json = await downloadJson(document.getElementById('rawdata').value)

    // Creating the selector for the list of buildings
    let optionObjects = []
    for (let i in raw.json) {
        const row = raw.json[i]
        const opt = createSelectOption(i, row, filterType, Type, is_special, filterAge, Age);
        if (opt) {
            optionObjects.push(opt)
        }
        parsedData[i] = parseRow(row);
    }
    var select = document.getElementById('Buildings');
    sortSelect(select, optionObjects);
    select.selectedIndex = 0;
}

function createSelectOption(i, row, shouldFilterForType, typeToFilterFor, onlySpecial, shouldFilterForAge, ageToFilterFor) {
    var typeOfRow = row.type;
    var test = row.components;
    if (test) {
        typeOfRow = row.components.AllAge.tags.tags[0].buildingType
    }
    if (row.requirements) {
        if (row.requirements.min_era) {
            var ageOfRow = row.requirements.min_era;
        } else {
            var ageOfRow = "none";
        }
    } else {
        var ageOfRow = "none";
    }

    const buildingTypeMatches = ((shouldFilterForType && (typeOfRow == typeToFilterFor)) || !(shouldFilterForType))
    const specialMatches = (((onlySpecial) && (row.is_special)) || !(onlySpecial))
    const AgeMatches = ((shouldFilterForAge && (ageOfRow == ageToFilterFor)) || !(shouldFilterForAge))

    if (buildingTypeMatches && specialMatches && AgeMatches) {
        return new Option(row.name, i)
    }
    return null;
}

function sortSelect(selElem, options) {
    options.sort((x, y) => x.text.localeCompare(y.text));
    // Clear the old elements
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }

    // Adding the new elements
    selElem.options.add(new Option('nothing selected', ''));
    for (let option of options) {
        selElem.options.add(option);
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$("#Buildings").change(function () {
    Building.json = raw.json[$(this).children(":selected").attr("value")];
    findImages(Building);
    if (Building.json.components) { // building has new json formatting
        convertNew(Building);
    } else {
        convertOld(Building);
    }
    var Wikitext = dataToWiki(Building);
    var Wiki = document.getElementById("Wiki");
    Wiki.value = Wikitext;
    AllowFocusLost=true;
    Wiki.select();
    document.execCommand('copy');
    $(this).focus();
    AllowFocusLost=false;
});

$("#Buildings").focusout(function(){
    if (!AllowFocusLost) {
        $(this).focus();
    }
  });

function convertNew() {
    var createHeader = true;
    alert('new');
    for (let Age in Building.json.components) {
        var AgeJson = Building.json.components[Age];
        if (Age == "AllAge") {
            Building.size = AgeJson.placement.size.x * AgeJson.placement.size.y;
        } else {
            var AgeData = [];
            //Age
            if (ages[Age]) {
                AgeData.push(ages[Age]); //push Wiki Age if available
            } else {
                AgeData.push(Age); //push raw age if no wikidata available
            }
            if (createHeader) {
                Building.header.push("...");
            }
            //population
            try {
                var pop = AgeJson.staticResources.resources.resources.population;
                if (pop) {
                    var popeff = Math.round(pop / Building.size)
                    if (pop >> 0) {
                        pop = "+" + pop;
                        popeff = "+" + popeff;
                    }
                    AgeData.push(pop);
                    AgeData.push(popeff);
                    if (createHeader) {
                        Building.header.push("...");
                        Building.header.push("...");
                    }
                }
            } catch (err) {
                alert("err in pop")
            }
            //happiness
            try {
                var hap = AgeJson.happiness.provided;
                if (hap) {
                    var hapeff = Math.round(hap / Building.size)
                    if (hap >> 0) {
                        hap = "+" + hap;
                        hapeff = "+" + hapeff;
                    }
                    AgeData.push(hap);
                    AgeData.push(hapeff);
                    if (createHeader) {
                        Building.header.push("...");
                        Building.header.push("...");
                    }
                }
            } catch (err) { }
            //Productions
            if (AgeJson.production) {
                if (AgeJson.production.autoStart) { //non-production building (one option)
                    var ProdJson = AgeJson.production.options[0].products
                    for (let i in ProdJson) {
                        if (ProdJson[i].onlyWhenMotivated) {

                        }
                    }
                } else { //production building (six options) or goods building (four options)

                }
            }
            //Boosts







            // add data of current Age to Age table
            Building.AgeData.push(AgeData);

            //create table Header only with first age passed
            createHeader = false
        }
    }
    alert(Building.AgeData)
}

