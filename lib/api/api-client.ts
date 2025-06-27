export const addProject = async (projectData: any) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

  const formData = new FormData();

  formData.append("name", String(projectData.name));
  formData.append("number", String(projectData.number));
  formData.append("city", String(projectData.city));
  formData.append("type", String(projectData.type));
  formData.append("status", String(projectData.status));
  formData.append("buildingsNumber", String(projectData.buildingsNumber));
  formData.append("lat", String(projectData.lat));
  formData.append("lng", String(projectData.lng));
  formData.append("templateId", "Se34d1ce-50f2-4438-a77a-53545261ece9");

  if (projectData.document.length > 0) {
    formData.append("document", projectData.document[0]);
  }

  try {
    const response = await fetch("http://13.59.197.112/api/v1/dashboard/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ لا تضف Content-Type يدويًا مع FormData!
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server response:", data);
      throw new Error(data.message || "فشل في إضافة المشروع");
    }

    return data;
  } catch (error) {
    console.error("An error occurred while adding the project:", error);
    throw error;
  }
};
