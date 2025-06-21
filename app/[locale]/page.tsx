// "use client";
import { getProjects } from "@/lib/actions/map.actions";
import { Landmark, Project } from "@/types/map.types";
import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/components/Map"), {
  // ssr: false, // ✅ Ensures this component is only loaded on the client
});
const Home = async () => {
  // const [projects, setProjects] = useState<Project[]>([]);
  const projects: Project[] = await getProjects();
  // useEffect(() => {
  //   getProjects()
  //     .then((projects) => {
  //       setProjects(projects);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // {
  //   name: "جدة الاقتصادية",
  //   type: "landmark",
  //   position: [21.61771232688202, 39.108999777915926],
  // },
  // {
  //   name: "مستشفى الملك فيصل التخصصي",
  //   type: "hospital",
  //   position: [21.770263451063823, 39.13114853975212],
  // },

  // {
  //   name: "ذا فيلج مول",
  //   type: "mall",
  //   position: [21.74862702953911, 39.15133233153959],
  // },
  // {
  //   name: "مطار الملك عبدالعزيز الدولي",
  //   type: "airport",
  //   position: [21.684309940837224, 39.166557015393195],
  // },
  // { name: "مسجد الرحمة", type: "mosque", position: [21.597301, 39.133099] },
  // {
  //   name: "كلية البترجي",
  //   type: "educate",
  //   position: [21.77000222473089, 39.132095963606325],
  // },
  // {
  //   name: "الواجهة البحرية",
  //   type: "landmark",
  //   position: [39.131359,21.746152],
  // },
  // {
  //   name: "جدة سوبر دوم",
  //   type: "mall",
  //   position: [21.77000222473089, 39.132095963606325],
  // },
  // {
  //   name: "مدينة الملك عبد الله الرياضية",
  //   type: "sport",
  //   position: [21.77000222473089, 39.132095963606325],
  // },
  // {
  //   name: "مول 7",
  //   type: "mall",
  //   position: [21.74899278671903, 39.15154034413249],
  // },

  const basicLandmarks: Landmark[] = [
    {
      name: "جدة الاقتصادية",
      type: "landmark", // ✅ تصنيف موحد
      position: [21.736408, 39.085589],
    },
    {
      name: "مستشفى الملك فيصل التخصصي",
      type: "hospital", // ✅ مستشفى
      position: [21.74156603299471, 39.17364161349414],
    },
    {
      name: "ذا فيلج مول",
      type: "mall", // ✅ 
      position: [21.774, 39.170434],
    },
    {
      name: "مطار الملك عبدالعزيز الدولي",
      type: "airport", // ✅ مطار
      position: [21.712583951459784, 39.17785399999999],
    },
    {
      name: "مسجد الرحمة",
      type: "mosque", // ✅ مسجد
      position: [21.650659577594876, 39.10081736911323],
    },
    {
      name: "كلية البترجي",
      type: "educate", // ✅ مؤسسة تعليمية
      position: [21.76936154084302, 39.13186090553342],
    },
    {
      name: "الواجهة البحرية",
      type: "landmark", // ✅ معلم
      position: [21.59662425354329, 39.105470553677876],
    },
    {
      name: "جدة سوبر دوم",
      type: "mall", // ✅ مول
      position: [21.74869664809694, 39.15122196033627],
    },
    {
      name: "مدينة الملك عبد الله الرياضية",
      type: "sport", // ✅ منشأة رياضية
      position: [21.763474154797894, 39.16434436218291],
    },
  ];
const landmarks: Landmark[] = [
    {
      name: "الحمدانية",
      type: "landmark",
      position: [21.75020100984902, 39.19562593537216],
    },
    {
      name: "الصالحية",
      type: "landmark",
      position: [21.763991951065744, 39.222748433335305],
    },
    {
      name: "الكوثر",
      type: "landmark",
      position: [21.729551980810026, 39.20618311009747],
    },
    
  ];
  return (
    <div>
      <Map
        projects={projects}
        basicLandmarks={basicLandmarks}
        landmarks={landmarks}
      />
    </div>
  );
};

export default Home;
