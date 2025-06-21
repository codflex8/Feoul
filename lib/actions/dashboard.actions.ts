"use server";

import { Project } from "@/types/dashboard.types";
import { Unit } from "@/types/map.types";
import { cookies } from "next/headers";

export const getHome = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/dashboard/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    return data.items || data; // Handle both cases where data is nested or direct
  } catch (error) {
    console.error(
      "An error occurred while getting projects from the API:",
      error
    );
    throw error;
  }
};

// Projects
export const getProjects = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/dashboard/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || data; // Handle both cases where data is nested or direct
  } catch (error) {
    console.error(
      "An error occurred while getting projects from the API:",
      error
    );
    throw error;
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProjectById = async (projectId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/dashboard/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || data; // Handle both cases where data is nested or direct
  } catch (error) {
    console.error(
      "An error occurred while getting projects from the API:",
      error
    );
    throw error;
  }
};
export const addProject = async (projectData: Project) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  const formData = new FormData();

  formData.append("name", projectData.name);
  formData.append("number", projectData.number);
  formData.append("city", projectData.city);
  formData.append("status", projectData.status);
  formData.append("buildingsNumber", projectData.buildingsNumber);
  formData.append("lat", projectData.lat);
  formData.append("lng", projectData.lng);

  projectData.document.forEach((file) => {
    formData.append("document", file);
  });

  try {
    const response = await fetch(`${API_URL}/dashboard/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // استخدام FormData بدلاً من JSON.stringify
    });

    if (!response.ok) {
      throw new Error(`Failed to add new project: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while adding new project:", error);
    throw error;
  }
};

import axios from "axios";

export const updateProject = async (project: any, id: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  const updatedProject = { ...project };
  console.log("Updated project data:", updatedProject);

  try {
    const response = await axios.put(
      `${API_URL}/dashboard/projects/${id}`,
      updatedProject,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("An error occurred while updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    if (!projectId) {
      throw new Error("❌ Project ID is missing!");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      throw new Error("❌ Authentication token is missing!");
    }

    console.log("🚀 Sending DELETE request for project:", projectId);

    const response = await fetch(`${API_URL}/dashboard/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🛠 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete project: ${response.status} - ${errorText}`
      );
    }

    console.log("✅ Project deleted successfully!");
    return await response.json();
  } catch (error) {
    console.error("❌ Error while deleting project:", error.message);
    throw error;
  }
};
// end of projects

// Category
export const getCategories = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/unit-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the categories from the API:",
      error
    );
    throw error;
  }
};

export const addCategory = async (categoryData: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  console.log("Category Data:", categoryData);

  try {
    const payload = {
      ...categoryData,
      status:
        categoryData.status === "منشورة"
          ? "published"
          : categoryData.status === "مسودة"
          ? "draft"
          : "deleted",
    };

    const response = await fetch(`${API_URL}/dashboard/unit-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("Response Data:", responseData);

    if (!response.ok) {
      console.error("Server Error:", responseData);
      throw new Error(`Failed to add new category: ${response.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error("An error occurred while adding new category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(
      `${API_URL}/dashboard/unit-category/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while deleting category:", error);
    throw error;
  }
};
export const updateCategory = async (categoryId: string, updatedData: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  console.log("Category ID:", categoryId);
  console.log("Updated Data:", updatedData);

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const response = await fetch(
      `${API_URL}/dashboard/unit-category/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      throw new Error(`Failed to update category: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Updated category:", data);
    return data;
  } catch (error) {
    console.error("An error occurred while updating the category:", error);
    throw error;
  }
};

// Interests
export const getInterests = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/dashboard/unit-intreset`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || data;
  } catch (error) {
    console.error(
      "An error occurred while getting projects from the API:",
      error
    );
    throw error;
  }
};
export const updateInterest = async (interestId: string, interestData: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(
      `${API_URL}/dashboard/unit-intreset/${interestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(interestData), // Include the request body
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update interest: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while updating interest:", error);
    throw error;
  }
};

export const deleteInterest = async (interestId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(
      `${API_URL}/dashboard/unit-intreset/${interestId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete interest: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while deleting interest:", error);
    throw error;
  }
};

// Units
export const getUnits = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/units`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the units from the API:",
      error
    );
    throw error;
  }
};

export const getFloors = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/unit-floor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the units from the API:",
      error
    );
    throw error;
  }
};

export const getFloorById = async (floorId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/unit-floor/${floorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the units from the API:",
      error
    );
    throw error;
  }
};

export const getUnitById = async (unitId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/units/${unitId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the units from the API:",
      error
    );
    throw error;
  }
};

export const addUnit = async (unitData: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    console.error("❌ Authentication token is missing!");
    throw new Error("Authentication token is required.");
  }

  try {
    console.log("📡 Sending request to API...");
    const response = await fetch(`${API_URL}/dashboard/units`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unitData),
    });

    console.log("🚀 ~ addUnit ~ response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add new unit: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ API response:", data);
    return data;
  } catch (error) {
    console.error("❌ An error occurred while adding new unit:", error);
    throw error;
  }
};

export const addFloor = async (floorData: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  console.log("floorData", floorData);

  if (!token) {
    console.error("❌ Authentication token is missing!");
    throw new Error("Authentication token is required.");
  }

  try {
    console.log("📡 Sending request to API...");
    const response = await fetch(`${API_URL}/dashboard/unit-floor`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: floorData,
    });

    console.log("🚀 ~ addUnit ~ response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add new floor: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ API response:", data);
    return data;
  } catch (error) {
    console.error("❌ An error occurred while adding new floor:", error);
    throw error;
  }
};

export const updateFloor = async (floorId: string, floorData: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/unit-floor/${floorId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: floorData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update floorData: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("An error occurred while updating floorData:", error);
    throw error;
  }
};

export const updateUnit = async (unitId: string, unitData: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/units/${unitId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unitData), // Include the request body
    });

    if (!response.ok) {
      throw new Error(`Failed to update unit: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while updating unit:", error);
    throw error;
  }
};

export const updateUnitStatus = async (unitId: string, status: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(
      `${API_URL}/dashboard/units/${unitId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(status),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update status unit: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while updating unit status:", error);
    throw error;
  }
};

export const deleteUnit = async (unitId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/unit/${unitId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete unit: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while deleting unit:", error);
    throw error;
  }
};

// Financial
export const getFinancial = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/dashboard/financial`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch financial data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while getting the financial data from the API:",
      error
    );
    throw error;
  }
};
export const getFloor = async (unitId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const response = await fetch(
      `${API_URL}/dashboard/unit-floor?unitId=${unitId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch floor designs");
    }

    const data = await response.json();
    return data?.floors || [];
  } catch (error) {
    console.error("An error occurred while fetching floor designs:", error);
    throw error;
  }
};

export const getIssues = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/dashboard/issues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || data; // Handle both cases where data is nested or direct
  } catch (error) {
    console.error(
      "An error occurred while getting issues from the API:",
      error
    );
    throw error;
  }
};
