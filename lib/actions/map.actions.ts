"use server";

import {
  PaginatedCategories,
  PaginatedProjects,
  Project,
  Unit,
  UnitsData,
} from "@/types/map.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const Login = async (data: { username: string; password: string; }) => {
  console.log("🚀 ~ Login ~ data:", data)
  try {
    const response = await fetch(`http://3.24.242.183/api/v1/dashboard/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("🚀 ~ Login ~ result:", result)
    return result; 
  } catch (error) {
    console.error("An error occurred during login:", error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/public/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache:"no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data: PaginatedProjects = await response.json();
    const { items: projects } = data;
    return projects;
  } catch (error) {
    console.error(
      "An error occurred while getting projects from the API:",
      error
    );
    throw error;
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const response = await fetch(`${API_URL}/public/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache:"no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }

    const data: { project: Project; unitsData: UnitsData } =
      await response.json();

    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the project from the API:",
      error
    );
    throw error;
  }
};

export const getUnits = async () => {
  try {
    const response = await fetch(`${API_URL}/v1/public/units`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache:"no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    const units = await response.json();
    return units;
  } catch (error) {
    console.error(
      "An error occurred while getting the units from the API:",
      error
    );
    throw error;
  }
};

export const getUnitById = async (unitId: string) => {
  try {
    const response = await fetch(`${API_URL}/public/units/${unitId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache:"no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    const unit: Unit = await response.json();
    return unit;
  } catch (error) {
    console.error(
      "An error occurred while getting the unit from the API:",
      error
    );
    throw error;
  }
};
 export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/public/unit-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const categories: PaginatedCategories = await response.json();
    return categories;
  } catch (error) {
    console.error(
      "An error occurred while getting the categories from the API:",
      error
    );
    throw error;
  }
};

export const getPlaces = async () => {
  try {
    const response = await fetch(
      `${API_URL}/public/project-facilities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    const { items: places } = data;
    return places;

    return places;
  } catch (error) {
    console.error(
      "An error occurred while getting the categories from the API:",
      error
    );
    throw error;
  }
};


export const addInterest = async (addInterest: any) => {
  try {
    const response = await fetch(`${API_URL}/public/unit-intreset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addInterest),  
    });

    if (!response.ok) {
      throw new Error(`Failed to add new interested: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while adding new interested:", error);
    throw error;
  }
};

export const addissues = async (addissues: any) => {
  try {
    const response = await fetch(`${API_URL}/public/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addissues),  
    });

    if (!response.ok) {
      throw new Error(`Failed to add new interested: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while adding new interested:", error);
    throw error;
  }
};
