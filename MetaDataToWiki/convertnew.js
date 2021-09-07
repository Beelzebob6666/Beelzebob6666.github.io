function convertNew() {

    const ProductionsRaw = {                          
        "money": 0,
        "supplies": 0,
        "medals": 0,
        "goods": 0,
        "strategy_points":0,
        "premium":0,
        "clan_power" :0,
        "clan_goods": 0,
        "att_boost_attacker": 0,
        "def_boost_defender": 0,
        "att_boost_defender": 0,
        "def_boost_attacker": 0,
        "coin_production": 0,
        "supply_production": 0,
            
    }
    const ProductionsMotivated = {                          
        "money": 0,
        "supplies": 0,
        "goods": 0,
        "strategy_points":0,
        "clan_goods": 0,

    }
    
    let createHeader = true;
    alert('new');
    for (let Age in Building.json.components) {
        const AgeJson = Building.json.components[Age];
        if (Age === "AllAge") {
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
                let pop = AgeJson.staticResources.resources.resources.population;
                if (pop) {
                    //var popeff = Math.round(pop / Building.size)
                    pop = numberWithCommas(pop)
                    if (pop > 0) {
                        pop = "+" + pop;
                        //popeff = "+" + popeff;
                    }
                    AgeData.push(pop);
                    //AgeData.push(popeff);
                    if (createHeader) {
                        Building.header.push(prodHeaders["population"]);
                        //Building.header.push("...");
                    }
                }
            } catch (err) {
                alert("err in pop")
            }
            //happiness
            try {
                let hap = AgeJson.happiness.provided;
                if (hap) {
                    var hapeff = Math.round(hap / Building.size)
                    hap = numberWithCommas(hap);
                    hapeff = numberWithCommas(hapeff);
                    if (hap > 0) {
                        hap = "+" + hap;
                        hapeff = "+" + hapeff;
                    }
                    AgeData.push(hap);
                    if (Building.size != 1) {
                        AgeData.push(hapeff)
                    }
                    if (createHeader) {
                        Building.header.push(prodHeaders["provided_happiness"]);
                        Building.header.push(prodHeaders["hapeff"]);
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
