"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VideoPopupProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPopup({ videoUrl, isOpen, onClose }: VideoPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>فيديو الوحدة</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <video controls className="w-full rounded-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>إغلاق</Button>
        </div>
      </DialogContent>
    </Dialog>
    
  );
}