import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
const FloorEdit = ({ floorId }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`floors/update/${floorId}`);
  };

  return (
    <div className="flex justify-center items-center gap-1">
      <Button size="icon" variant="ghost" onClick={handleEdit}>
        <FaEdit color="gray" className="!w-6 !h-6" />
      </Button>
    </div>
  );
};

export default FloorEdit;
