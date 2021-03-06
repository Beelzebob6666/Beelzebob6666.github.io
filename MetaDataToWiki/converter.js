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
    const select = document.getElementById("filterAge");
    for (let age in ages) {
        select.options.add(new Option(age, age));
    }
}

async function getData() {
    const is_special = document.getElementById('isSpecial').checked;
    const filterType = document.getElementById('filterTypeCB').checked;
    const Type = document.getElementById('filterType').value;
    const filterAge = document.getElementById('filterAgeCB').checked;
    const Age = document.getElementById('filterAge').value;
    //Reset Building List
    const options = document.querySelectorAll('#Buildings option');
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
    }
    const select = document.getElementById('Buildings');
    sortSelect(select, optionObjects);
    select.selectedIndex = 0;
}

function createSelectOption(i, row, shouldFilterForType, typeToFilterFor, onlySpecial, shouldFilterForAge, ageToFilterFor) {
    let typeOfRow = '';
    let ageOfRow = 'none';
    
    if (row.components) {
        typeOfRow = row.components.AllAge.tags.tags[0].buildingType;
        if (row.components.AllAge?.era?.era) ageOfRow = row.components.AllAge.era.era;
        let rarity=row?.components?.AllAge?.value?.rarity;
        is_specialOfRow = !rarity || rarity === "epic";
    } else {
        if (row.requirements && row.requirements.min_era) {
            ageOfRow = row.requirements.min_era;
        }
        is_specialOfRow = row.is_special;
        typeOfRow = row.type;
    }
    
    const buildingTypeMatches = ((shouldFilterForType && (typeOfRow === typeToFilterFor)) || !(shouldFilterForType))
    const specialMatches = (((onlySpecial) && (is_specialOfRow)) || !(onlySpecial))
    const AgeMatches = ((shouldFilterForAge && (ageOfRow === ageToFilterFor)) || !(shouldFilterForAge))

    if (buildingTypeMatches && specialMatches && AgeMatches) {
        return new Option(row.name, i)
    }
    return null;
}

/**
 * Sorts the element in the building selector by name
 * @param {HTMLSelectElement} selElem
 * @param {Array<HTMLOptionElement>}options
 */
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

/**
 * Converts a number to a string with thousand separators
 *
 * @param {number} x
 * @returns {string}
 */
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
    AllowFocusLost = true;
    Wiki.select();
    document.execCommand('copy');
    $(this).focus();
    AllowFocusLost = false;
    let t=Building.json.name + "";
    let re= new RegExp(" \- Lv\. [0-9]*")
    console.log(t);
    t = t.replace(re, "");
    re= new RegExp("Lv\. [0-9]* \- ")
    t = t.replace(re, "");
    let url=`https://forgeofempires.fandom.com/wiki/${t}?veaction=editsource`;
    if ($('#OpenWiki')[0].checked) window.open(url,'_blank');
    $('#WikiLink')[0].href = url;
});

$("#Buildings").focusout(function () {
    if (!AllowFocusLost) {
        $(this).focus();
    }
});

function setChainOutput() {
    chainOutput = !chainOutput;
}

function fileKey(e) {
    if (e.code == "Enter") {
        getData()
    }
}