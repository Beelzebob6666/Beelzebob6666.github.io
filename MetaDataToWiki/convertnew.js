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
            const ProductionsRaw = {...NewProductions};
            const ProductionsMotivated = {...NewProductions};
            var productionSpecial = [];
            var productionRandom = [];
            
           
            //Age
            if (ages[Age]) {
                AgeData.push(ages[Age]); //push Wiki Age if available
            } else {
                AgeData.push(Age); //push raw age if no wikidata available
            }
            if (createHeader) {
                Building.header.push(prodHeaders.age);
            }
            //population
            try {
                let pop = AgeJson.staticResources?.resources?.resources?.population;
                if (pop) {
                    
                    if (pop > 0) {
                        pop = "+" + numberWithCommas(pop);
                    } else {
                        pop = numberWithCommas(pop);
                    }
                    AgeData.push(pop);
                    if (createHeader) {
                        Building.header.push(prodHeaders.provided_population);
                    }
                }
            } catch (err) {
                alert("err in pop")
            }
            //happiness
            try {
                let hap = AgeJson.happiness.provided;
                if (hap) {
                    let hapeff = Math.round(hap / Building.size)
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
                        Building.header.push(prodHeaders.provided_happiness);
                        if (Building.size != 1) {
                            Building.header.push(prodHeaders.hapeff);
                        }

                    }
                }
            } catch (err) { }
            //Productions
            if (AgeJson.production) {
                if (AgeJson.production.autoStart) { //non-production building (one option)
                    let ProdJson = AgeJson.production.options[0].products
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
                                let lookupJson = AgeJson.lookup.rewards[ProdJson[i].reward.id];
                                productionSpecial.push([ProdJson[i].onlyWhenMotivated, lookupJson.name, lookupJson.amount || 1])
                                break;
                            case "random":
                                for (let r in ProdJson[i].products) {
                                    let randomProd = ProdJson[i].products[r];
                                    let lookupJson = AgeJson.lookup.rewards[randomProd.product.reward.id];
                                    productionRandom.push([ProdJson[i].onlyWhenMotivated, lookupJson.name, lookupJson.amount, Math.floor(randomProd.dropChance*1000)/10 + "%"]);
                                    console.log(productionRandom);
                                }
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
                for (let i in productionSpecial) {
                    if (!productionSpecial[i][0]) {
                        AgeData.push(numberWithCommas(productionSpecial[i][2]))
                        if (createHeader) {
                            Building.header.push(((productionSpecial[i][0]) ? headerExtra.mot : "") + getSpecial(productionSpecial[i][1]));
                        }
                    }
                }
                for (let i in productionRandom) {
                    if (!productionRandom[i][0]) {
                        AgeData.push(numberWithCommas(productionRandom[i][2]))
                        if (createHeader) {
                            Building.header.push(((productionRandom[i][0]) ? headerExtra.mot : "") + productionRandom[i][3] + headerExtra.chance + getSpecial(productionRandom[i][1]));
                        }
                    }
                }
                for (let prod in ProductionsMotivated) {
                    if (ProductionsMotivated[prod]>0) {
                        AgeData.push(numberWithCommas(ProductionsMotivated[prod]));
                        if (createHeader) {
                            Building.header.push(headerExtra.mot + prodHeaders[prod]);
                        }
                    }   
                }
                for (let i in productionSpecial) {
                    if (productionSpecial[i][0]) {
                        AgeData.push(numberWithCommas(productionSpecial[i][2]))
                        if (createHeader) {
                            Building.header.push(((productionSpecial[i][0]) ? headerExtra.mot : "") + getSpecial(productionSpecial[i][1]));
                        }
                    }
                }
                for (let i in productionRandom) {
                    if (productionRandom[i][0]) {
                        AgeData.push(numberWithCommas(productionRandom[i][2]))
                        if (createHeader) {
                            Building.header.push(((productionRandom[i][0]) ? headerExtra.mot : "") + productionRandom[i][3] + headerExtra.chance + getSpecial(productionRandom[i][1]));
                        }
                    }
                }
            }
            //Boosts
            if (AgeJson.boosts) {
                for (let i in AgeJson.boosts.boosts) {
                    let Boost = AgeJson.boosts.boosts[i];
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

function getSpecial(SpecialString) {
    y = SpecialString.replace(" of ", "");
    y = y.replace("Fragments", "Fragment");
    y = y.replace(/\d*? (.*?)/,"$1");
    y = y.replaceAll(" ","");

    x = specialProducts[y];
    if (!x) x = SpecialString;

    return x
}