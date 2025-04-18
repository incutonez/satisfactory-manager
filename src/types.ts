export type TCategory = "ore" | "ingot";

export type TSetTimeout = ReturnType<typeof setTimeout> | undefined;

export type TItemKey = "aluminumIngot" | "iodineInfusedFilter" | "ironPlate" | "ironRod" | "ironIngot" | "cable" | "reinforcedIronPlate" | "wire" | "concrete" | "rotor" | "compactedCoal" | "fuel" | "rocketFuel" | "copperSheet" | "modularFrame" | "screws" | "nitricAcid" | "turbofuel" | "emptyFluidTank" | "packagedRocketFuel" | "crystalOscillator" | "motor" | "packagedTurbofuel" | "darkMatterCrystal" | "ionizedFuel" | "supercomputer" | "coolingSystem" | "ficsiteTrigon" | "turboMotor" | "timeCrystal" | "darkMatterResidue" | "reanimatedSam" | "excitedPhotonicMatter" | "diamonds" | "alcladAluminumSheet" | "superpositionOscillator" | "neuralQuantumProcessor" | "aiExpansionServer" | "magneticFieldGenerator" | "packagedIonizedFuel" | "samFluctuator" | "steelPipe" | "fusedModularFrame" | "radioControlUnit" | "ficsiteIngot" | "biochemicalSculptor" | "assemblyDirectorSystem" | "cateriumIngot" | "emptyCanister" | "packagedFuel" | "circuitBoard" | "plastic" | "encasedIndustrialBeam" | "rubber" | "steelBeam" | "polymerResin" | "heavyOilResidue" | "petroleumCoke" | "quartzCrystal" | "steelIngot" | "versatileFramework" | "packagedOil" | "packagedHeavyOilResidue" | "packagedWater" | "copperIngot" | "aluminumScrap" | "aluminumCasing" | "aluminaSolution" | "silica" | "computer" | "heavyModularFrame" | "smartPlating" | "highSpeedConnector" | "automatedWiring" | "stator" | "aiLimiter" | "quickwire" | "modularEngine" | "adaptiveControlUnit" | "pressureConversionCube" | "encasedPlutoniumCell" | "plutoniumPellet" | "nonFissileUranium" | "uraniumWaste" | "sulfuricAcid" | "copperPowder" | "heatSink" | "electromagneticControlRod" | "plutoniumWaste" | "nuclearPasta" | "encasedUraniumCell" | "battery" | "dissolvedSilica" | "thermalPropulsionRocket" | "blackPowder" | "ficsonium" | "singularityCell" | "ballisticWarpDrive" | "gasFilter" | "alienProtein" | "bluePowerSlug" | "alienDnaCapsule" | "mercerSphere" | "purplePowerSlug" | "yellowPowerSlug" | "smokelessPowder" | "ficsmasWonderStar" | "ficsmasOrnamentBundle" | "ficsmasTreeBranch" | "ficsmasWreath" | "candyCane" | "ficsmasActualSnow" | "ficsmasBow" | "ficsmasGift" | "redFicsmasOrnament" | "blueFicsmasOrnament" | "copperFicsmasOrnament" | "ironFicsmasOrnament" | "explosiveRebar" | "stunRebar" | "ironRebar" | "homingRifleAmmo" | "clusterNobelisk" | "nobelisk" | "gasNobelisk" | "nukeNobelisk" | "pulseNobelisk" | "sweetFireworks" | "fancyFireworks" | "sparklyFireworks" | "snowball" | "rebarGun" | "rifle" | "hazmatSuit" | "nobeliskDetonator" | "xenoZapper" | "objectScanner" | "portableMiner" | "hoverpack" | "jetpack" | "xenoBasher" | "chainsaw" | "bladeRunners" | "zipline" | "gasMask" | "candyCaneBasher" | "factoryCart" | "goldenFactoryCart" | "shatterRebar" | "turboRifleAmmo" | "rifleAmmo" | "ironOre" | "coal" | "nitrogenGas" | "sulfur" | "water" | "sam" | "bauxite" | "cateriumOre" | "copperOre" | "rawQuartz" | "limestone" | "uranium" | "crudeOil" | "leaves" | "wood" | "biomass" | "solidBiofuel" | "liquidBiofuel" | "packagedLiquidBiofuel" | "packagedAluminaSolution" | "packagedNitrogenGas" | "packagedNitricAcid" | "packagedSulfuricAcid" | "fabric" | "mycelia" | "hogRemains" | "spitterRemains" | "stingerRemains" | "hatcherRemains" | "powerShard" | "somersloop" | "plutoniumFuelRod" | "uraniumFuelRod" | "ficsoniumFuelRod" | "parachute" | "alienPowerMatrix";

export interface IInventoryItem {
	id: TItemKey;
	name: string;
	image?: string;
	category?: TCategory;
	recipes: IInventoryRecipe[];
	producingTotal: number;
	consumingTotal: number;
	total: number;
}

export interface IRecipeItem {
	itemId: TItemKey;
	recipeType: TRecipeType;
	amountPerCycle: number;
	// IRecipe.cyclesPerMinute * amountPerCycle
	amountPerMinute: number;
	// amountPerMinute * (IInventoryRecipe.overclockValue / 60)
	amountPerMinuteDisplay: number;
	// amountPerCycle * (IInventoryRecipe.overclockValue / 60)
	amountPerCycleDisplay: number;
}

export type TRecipeType = "consumes" | "produces" | "both";

export interface IInventoryRecipe {
	id: string;
	recipeId: string;
	recipeName: string;
	overclockValue: number;
	somersloopValue: number;
	machineCount: number;
	// In seconds
	productionCycleTime: number;
	// 60 / productionCycleTime
	cyclesPerMinute: number;
	isAlternate: boolean;
	items: IRecipeItem[];
	producedIn: string[];
}

export interface IRecipe {
	id: string;
	name: string;
	// In seconds
	productionCycleTime: number;
	// 60 / productionCycleTime
	cyclesPerMinute: number;
	isAlternate: boolean;
	items: IRecipeItem[];
	producedIn: string[];
}

export interface IMachine {
	id: string;
	name: string;
	image: string;
}
