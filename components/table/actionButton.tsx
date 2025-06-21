import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { deleteUnit } from "@/lib/actions/dashboard.actions";
import { toast } from "@/hooks/use-toast";
const ActionButtons = ({ unitId }: { unitId: string }) => {
   const router = useRouter();

  const handleEdit = () => {
    router.push(`buildings/update/${unitId}`);
  };

  const handleDelete = async () => {
    try {
      await deleteUnit(unitId);
      toast({
        title: "نجاح",
        description: "تم حذف الوحدة بنجاح!",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error in deleteUnit:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الوحدة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center gap-1">
      <Button size="icon" variant="ghost" onClick={handleDelete}>
        <MdDelete color="red" className="!w-6 !h-6" />
      </Button>
      <Button size="icon" variant="ghost" onClick={handleEdit}>
        <FaEdit color="gray" className="!w-6 !h-6" />
      </Button>
    </div>
  );
};

export default ActionButtons;
