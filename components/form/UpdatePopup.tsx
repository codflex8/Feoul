"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UpdatePopupProps<T> {
  rowData: T;
  onUpdate: (updatedData: T) => void;
  onClose: () => void;
  fields: { key: keyof T; label: string }[];
}

export default function UpdatePopup<T>({ rowData, onUpdate, onClose, fields }: UpdatePopupProps<T>) {
  const [formData, setFormData] = useState<T>(rowData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData); // Call the update function
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تحديث البيانات</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((field) => (
            <Input
              key={field.key as string}
              name={field.key as string}
              value={formData[field.key] as string}
              onChange={handleChange}
              placeholder={field.label}
            />
          ))}
          <Button onClick={handleSubmit}>حفظ التغييرات</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}