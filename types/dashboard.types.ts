export interface Project  {
  id:string;
  number: string;
  name: string;
  lat: string;
  lng: string;
  location: string;
  city: string;
  status: "مسودة" | "منشور" | "محذوف";
  type: "housing_unit" | "apartment_building"; // إضافة نوع المشروع
  model: string;
  updatedAt: Date;
  createdAt: Date;
  buildingsNumber?: string;
  document?: File[];
};

export type Interest = {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  area: string
  buildingNumber: number
  buildingStatus: "متاح" | "محجوز" | "مباع"
}

export type Category = {
  id: number;
  name: string;
  color: string;
  status: "مسودة" | "منشور" | "محذوف";
};

export interface Unit  {
  id: string;
  number: string;
  name: string;
  model: string;
  estate: string;
  landSpace: string;
  buildSpace: string;
  totalArea: string;
  bedroomNumber: number;
  bathroomNumber: number;
  template: string;
  price: string;
  videoUrl: string;
  floors: number;
  floorsDesign: string[]
};

// إضافة نوع العمارة السكنية
export interface BuildingType {
  id: string;
  name: string;
  buildingImage: string;
  apartmentImages: string[];
  video?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResidentialBuilding {
  id: string;
  number: number;
  size: number;
  position: string[];
  buildingType: {
    name: string;
  };
  project: {
    name: string;
  } | null;
  apartments: {
    id: string;
    index: number;
    size: number;
    direction: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ✅ إضافة نوع الشقق السكنية الجديد
export interface ApartmentType {
  id: string;
  name: string; // اسم النموذج
  price: number; // السعر
  bathroomNumber: number; // عدد دورات المياه
  bedroomNumber: number; // عدد غرف النوم
  netArea: number; // المساحة الصافية للشقة
  images: string[]; // صور النموذج
  createdAt: Date;
  updatedAt: Date;
}

// ✅ تحديث الشقة السكنية
export interface Apartment {
  id: string;
  number: string; // رقم الشقة
  apartmentType: ApartmentType; // نوع الشقة (النموذج)
  floorNumber: number; // رقم الدور
  building: ResidentialBuilding; // العمارة السكنية
  lat: number; // الموقع lat
  lng: number; // الموقع lng
  status: "متاح" | "محجوز" | "مباع";
  createdAt: Date;
  updatedAt: Date;
}

export type Operation = {
  number: number;
  name: string;
  price: number;
  operationType: string; 
  description: string;
  clientName: string; 
  date: string; 
  status: string; 
};

export type issues = {
name: string;
phoneNumber: string;
description: string;
}

// ✅ إضافة أنواع للاستيراد من Excel
export interface ExcelImportData {
  buildingTypes?: BuildingType[];
  residentialBuildings?: ResidentialBuilding[];
  apartmentTypes?: ApartmentType[];
  apartments?: Apartment[];
}

export interface ExcelImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors?: string[];
}