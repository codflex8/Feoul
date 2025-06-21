"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";  
import UpdateProjectPage from "./UpdateProjectPage";
import { getProjectById } from "@/lib/actions/dashboard.actions";

const UpdateProject = () => {
  const { id } = useParams();  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);  
        setProject(data);
      } catch (error) {
        console.error("فشل في جلب بيانات المشروع:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return <p>جاري تحميل بيانات المشروع...</p>;
  }

  if (!project) {
    return <p>لم يتم العثور على المشروع.</p>;
  }

  return <UpdateProjectPage project={project} />;  
};

export default UpdateProject;
