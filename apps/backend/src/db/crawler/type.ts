export interface FPTRPaginationResponse {
	totalCount: number;
	filter: Filter;
	items: Item2[];
	validSlug: boolean;
}

export interface Filter {
	advancedFilter: AdvancedFilter[];
	quickFilter: any[];
	sort: Sort[];
	settingGroupFilter: any[];
}

export interface AdvancedFilter {
	id: number;
	component: string;
	type: string;
	name: string;
	priorityWeight: number;
	typeValue: string;
	autoGetValue: boolean;
	isFastFilter: boolean;
	key: string;
	items: Item[];
	tooltip: string;
	showPriceRange?: boolean;
	priceStep?: number;
	min?: number;
	max?: number;
	displayImageBrand?: boolean;
}

export interface Item {
	id: number;
	name: string;
	image?: string;
	value?: any[];
	min?: number;
	max?: number;
	key: string;
	description: string;
	active: boolean;
	color?: string;
	isTrend?: boolean;
	imageSpecification: any;
	quantity?: number;
}

export interface Sort {
	id: number;
	value: string;
	name: string;
	active: boolean;
}

export interface Item2 {
	propertyNameOfUpc: string;
	score: number;
	code: string;
	name: string;
	displayName: string;
	typePim: string;
	type: string;
	slug: string;
	price: number;
	industry: Industry;
	brand: Brand;
	productType: ProductType;
	group?: Group;
	keySellingPoints: KeySellingPoint[];
	units: Unit[];
	image: Image;
	originalPrice: number;
	currentPrice: number;
	discountPercentage: number;
	endTimeDiscount: string;
	promotions: Promotion[];
	installment?: Installment;
	attributes: any;
	totalInventory: number;
	skus: Sku[];
}

export interface Industry {
	code: string;
	name: string;
}

export interface Brand {
	code: string;
	name: string;
}

export interface ProductType {
	code: string;
	name: string;
}

export interface Group {
	code: string;
	name: string;
}

export interface KeySellingPoint {
	id: number;
	code: number;
	icon: string;
	title: string;
	description: string;
}

export interface Unit {
	isDefault: boolean;
	code: number;
	level: number;
	name: string;
	ratio: number;
}

export interface Image {
	src: string;
	title: string;
}

export interface Promotion {
	content: string;
	image: Image2;
	channel: string;
	promotionType: string;
	pageUrl: string;
	beginTime: string;
	discountAmount: number;
	endTime: string;
}

export interface Image2 {
	src: string;
	title: string;
}

export interface Installment {
	amountPerMonth?: number;
	isZeroPercent: boolean;
}

export interface Sku {
	name: string;
	displayName: string;
	sku: string;
	type: string;
	slug: string;
	refCode: string;
	statusOnWeb: StatusOnWeb;
	productStatus: ProductStatus;
	isShowPriceText: boolean;
	displayPriceText: string;
	shortDisplayName: string;
	priceDisplayOption: any;
	originalPrice: number;
	currentPrice: number;
	discountPercentage: number;
	endTimeDiscount: string;
	newPrice: number;
	qtyAvailable: number;
	promotions: Promotion2[];
	variants: Variant[];
	image: string;
	badges: Badge[];
	labels: Label[];
}

export interface StatusOnWeb {
	code: number;
	displayName: string;
}

export interface ProductStatus {
	code: number;
	displayName: string;
}

export interface Promotion2 {
	content: string;
	image: Image3;
	channel: string;
	promotionType: string;
	pageUrl: string;
	beginTime: string;
	discountAmount: number;
	endTime: string;
}

export interface Image3 {
	src: string;
	title: string;
}

export interface Variant {
	displayOrder: number;
	code?: string;
	displayValue: string;
	propertyName: string;
	value: string;
}

export interface Badge {
	id: number;
	name: string;
	image: string;
}

export interface Label {
	name: string;
	code: string;
	discountAmount: number;
	image: string;
}

export interface SpecResponse {
	status: number;
	message: string;
	data: Data;
}

export interface Data {
	image: Image;
	attributeItem: AttributeItem[];
}

export interface Image {
	primaryImage: PrimaryImage;
	slideImages: SlideImage[];
	skuCode: string;
	productType: ProductType;
	brand: Brand;
	industry: Industry;
	skuType: string;
	refCode: string;
	productCondition: string;
	accessories: any[];
	group: Group;
}

export interface PrimaryImage {
	url: string;
}

export interface SlideImage {
	url: string;
}

export interface ProductType {
	code: string;
	name: string;
}

export interface Brand {
	code: string;
	name: string;
}

export interface Industry {
	code: string;
	name: string;
}

export interface Group {
	code: string;
	name: string;
}

export interface AttributeItem {
	groupName: string;
	groupIcon: any;
	attributes: Attribute[];
}

export interface Attribute {
	id: number;
	propertyName: string;
	displayName: string;
	isCompare: boolean;
	icon: any;
	unit?: string;
	hyperLink: string;
	type: string;
	value: any;
}
