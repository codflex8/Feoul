import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  deleteInterest,
  updateUnitStatus,
} from "@/lib/actions/dashboard.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const ActionInterest = ({ id, item }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "هل أنت متأكد أنك تريد حذف هذا الاهتمام؟"
    );
    if (!isConfirmed) return;

    try {
      await deleteInterest(id);
      toast({
        title: "نجاح",
        description: "تم حذف الاهتمام بنجاح!",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error in deleteInterest:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الاهتمام",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      await updateUnitStatus(item?.unit?.id, status);
      router.refresh();
      setOpen(false);
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الاهتمام بنجاح!",
        variant: "default",
      });
    } catch (error) {
      setOpen(false);
      console.error("❌ Error in updateInterest:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الاهتمام",
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[300px]">
          <DialogHeader>
            <DialogTitle>تغيير حالة الاهتمام</DialogTitle>
          </DialogHeader>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reserve">reserved</SelectItem>
              <SelectItem value="saled">saled</SelectItem>
              <SelectItem value="avaliable">avaliable</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleSave}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionInterest;
