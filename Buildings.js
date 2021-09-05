function parseRow(row) {
    const buildingType = row.type || row.components.AllAge.tags.tags[0].buildingType;
    switch (buildingType) {
        case "culture":
        case "decoration":
            return new CultureBuilding(row)
        case "production":
        case "residential":
        case "goods":
            return new ProductionBuilding(row)
        case "military":
            return new MilitaryBuilding(row)
        default:
            console.log('Unkown type: ' + buildingType)
    }
    //return new BuildingClass()
}

class Resources {
    constructor(resourceNode) {
        if (resourceNode === undefined) {
            this.money = 0
            this.supplies = 0
            this.population = 0
            this.premium = 0
            this.goods = 0
            this.unit = undefined
            return;
        }
        this.money = resourceNode.resources.money || 0
        this.supplies = resourceNode.resources.supplies || 0
        this.population = resourceNode.resources.population || 0
        this.premium = resourceNode.resources.premium || 0
        this.goods = resourceNode.resources.deposit_id || 0
        this.unit = resourceNode.resources.unit_id
    }
}

class BaseBuilding {
    constructor(row) {
        this.id = row.id
        this.name = row.name
        this.size = { x: row.width, y: row.length }

        this.abilities = row.abilities
        this.constructionTime = row.construction_time

        this.costs = new Resources(row.requirements?.cost)
        this.isMultiAge = row.is_multi_age
        this.isSpecial = row.is_special
    }
}

class Requirement {
    constructor(requirements) {
        this.minEra = requirements.min_era
        this.technology = requirements.tech_id
        this.neededTechnology = requirements.tech_id || null
        this.needsStreetConnnection = requirements.street_connection_level
    }
}

class CultureBuilding extends BaseBuilding {
    constructor(row) {
        super(row)
        this.happiness = row.provided_happiness
        this.sellingResource = new Resources(row.resaleResources)
        this.requirements = new Requirement(row.requirements)

        this.constructionTime = row.construction_time
        this.firstEraAvailable = row.requirements.min_era
    }

    getPolishedHappiness() {
        return this.happiness * 2;
    }
}

class Production {
    constructor(product) {
        this.name = product.name
        this.productionTime = product.productionTime
        this.requiredResources = new Resources(product.product)
    }
}


class ProductionBuilding extends BaseBuilding {
    constructor(row) {
        super(row)
        if (row.available_products) {
            this.products = row.available_products.map(x => new Production(x))
        } else if (row.products) {
            this.products = row.products.map(x => new Production(x))
        } else {
            this.products = []
        }
    }

    getProducts() {
        return this.products
    }
}

class MilitaryBuilding extends ProductionBuilding {
    constructor(row) {
        super(row)
        this.usableSlots = row.usable_slots
    }
}