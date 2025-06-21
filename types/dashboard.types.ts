export interface Project  {
  id:string;
  number: string;
  name: string;
  lat: string;
  lng: string;
  location: string;
  city: string;
  status: "مسودة" | "منشور" | "محذوف";
  model: string;
  updatedAt: Date;
  createdAt: Date;
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