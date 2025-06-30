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


// إضافة الشقة السكنية
export interface Apartment {
  id: string;
  number: string;
  name: string;
  buildingId: string;
  building: ResidentialBuilding;
  price: number;
  landSpace: number;
  buildSpace: number;
  bedroomNumber: number;
  bathroomNumber: number;
  position_x: number;
  position_y: number;
  status: "متاح" | "محجوز" | "مباع";
  images: string[];
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