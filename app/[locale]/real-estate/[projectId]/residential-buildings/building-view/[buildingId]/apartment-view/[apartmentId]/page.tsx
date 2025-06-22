import { getApartmentById } from "@/lib/actions/map.actions";
import ApartmentViewPage from "./ApartmentViewPage";
import { notFound } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ apartmentId: string }>;
}) => {
  const apartmentId = (await params).apartmentId;
  const apartment = await getApartmentById(apartmentId);

  if (!apartment) {
    notFound();
  }

  return <ApartmentViewPage apartment={apartment} />;
};

export default page;