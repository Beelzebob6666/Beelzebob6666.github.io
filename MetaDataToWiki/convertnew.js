function convertNew() {
    Building.AgeData = [];
    Building.header = [];
    let createHeader = true;
    
    for (let Age in Building.json.components) {
        const AgeJson = Building.json.components[Age];
        if (Age === "AllAge") {
            Building.size = AgeJson.placement.size.x * AgeJson.placement.size.y;
        } else {
            var AgeData = [];
            const ProductionsRaw = {                          
                "money": 0,
                "supplies": 0,
                "medals": 0,
                "goods": 0,
                "strategy_points":0,
                "premium":0,
                "clan_power" :0,
                "clan_goods": 0,
                "BP-Production": 0,
                "Unit-Production" : 0,
                }
            const ProductionsMotivated = {                          
                "money": 0,
                "supplies": 0,
                "medals": 0,
                "goods": 0,
                "strategy_points":0,
                "premium":0,
                "clan_power" :0,
                "clan_goods": 0,
                "BP-Production": 0,
                "Unit-Production" : 0,
                }
            var productionSpecial = [];
           
            //Age
            if (ages[Age]) {
                AgeData.push(ages[Age]); //push Wiki Age if available
            } else {
                AgeData.push(Age); //push raw age if no wikidata available
            }
            if (createHeader) {
                Building.header.push(prodHeaders["age"]);
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
                        Building.header.push(prodHeaders["provided_population"]);
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
                        hap = "+" + numberWithCommas(hap);
                        hapeff = "+" + numberWithCommas(hapeff);
                    } else {
                        hap = numberWithCommas(hap);
                        hapeff = numberWithCommas(hapeff);
                    }
                    AgeData.push(hap);
                    if (Building.size != 1) {
                        AgeData.push(hapeff)
                    }
                    if (createHeader) {
                        Building.header.push(prodHeaders["provided_happiness"]);
                        if (Building.size != 1) {
                            Building.header.push(prodHeaders["hapeff"]);
                        }

                    }
                }
            } catch (err) { }
            //Productions
            if (AgeJson.production) {
                if (AgeJson.production.autoStart) { //non-production building (one option)
                    var ProdJson = AgeJson.production.options[0].products
                    for (let i in ProdJson) {
                        switch (ProdJson[i].type) {
                            case "resources":
                                if (ProdJson[i].onlyWhenMotivated) {
                                    getResources(ProdJson[i].playerResources.resources, ProductionsMotivated, "goods");
                                } else {
                                    getResources(ProdJson[i].playerResources.resources, ProductionsRaw, "goods");
                                }
                                break;
                            case "guildResources":
                                if (ProdJson[i].onlyWhenMotivated) {
                                    getResources(ProdJson[i].guildResources.resources, ProductionsMotivated, "clan_goods");
                                } else {
                                    getResources(ProdJson[i].guildResources.resources, ProductionsRaw, "clan_goods");
                                }

                                break;
                            case "genericReward":
                                lookupJson = AgeJson.lookup.rewards[ProdJson[i].reward.id]
                                productionSpecial.push([ProdJson[i].onlyWhenMotivated, lookupJson.name, lookupJson.amount])
                                break;
                        }
                        
                    }
                } else { //production building (six options) or goods building (four options)

                }
                for (let prod in ProductionsRaw) {
                    if (ProductionsRaw[prod]>0) {
                        AgeData.push(numberWithCommas(ProductionsRaw[prod]));
                        if (createHeader) {
                            Building.header.push(prodHeaders[prod]);
                        }
                    }   
                }
                for (let prod in ProductionsMotivated) {
                    if (ProductionsMotivated[prod]>0) {
                        AgeData.push(numberWithCommas(ProductionsMotivated[prod]));
                        if (createHeader) {
                            Building.header.push(headerExtra["mot"] + prodHeaders[prod]);
                        }
                    }   
                }
                for (let i in productionSpecial) {
                    AgeData.push(numberWithCommas(productionSpecial[i][2]))
                    if (createHeader) {
                        Building.header.push(((productionSpecial[i][0]) ? headerExtra["mot"] : "") + specialProducts[productionSpecial[i][1]]);
                    }
                }
            }
            //Boosts
            if (AgeJson.boosts) {
                for (let i in AgeJson.boosts.boosts) {
                    var Boost = AgeJson.boosts.boosts[i];
                    AgeData.push(Boost.value+"%");
                    if (createHeader) {
                        Building.header.push(prodHeaders[Boost.type]);
                    }
                }
            }

            // add data of current Age to Age table
            Building.AgeData.push(AgeData);

            //create table Header only with first age passed
            createHeader = false
        }
    }
}

function getResources(products, Productions, goodsDefault) {
    for (prod in products) {
        prodX= prod + "";
        if (categoryGoods.includes(prodX)) {
            prodX = goodsDefault;
        }
        Productions[prodX] += products[prod];
    }    
    return Productions;
}
