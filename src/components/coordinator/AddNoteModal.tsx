import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CloseCircle, Letter, Link } from "@solar-icons/react";
import { toast } from "sonner";

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddNoteModal({ open, onOpenChange }: AddNoteModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddNote = () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }
    // Handle add note logic here
    console.log("Adding note:", { title, description });
    toast.success("Note added successfully!");
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold text-gray-900">
              Add Note
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <CloseCircle className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label className="text-sm font-montserrat-bold text-gray-900">
              Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Provide title here..."
              className="font-montserrat"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label className="text-sm font-montserrat-bold text-gray-900">
              Description
            </Label>
            
            {/* Rich Text Editor Toolbar */}
            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-t-lg bg-gray-50">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-200"
                type="button"
                title="Bold"
              >
                <span className="text-sm font-montserrat-bold text-gray-600">B</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-200"
                type="button"
                title="Italic"
              >
                <span className="text-sm font-montserrat italic text-gray-600">I</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-200"
                type="button"
                title="Underline"
              >
                <span className="text-sm font-montserrat underline text-gray-600">U</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-200"
                type="button"
                title="Link"
              >
                <Link className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Textarea */}
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description here"
              className="font-montserrat min-h-[200px] rounded-t-none border-t-0"
            />
          </div>

          {/* Add Note Button */}
          <Button
            onClick={handleAddNote}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
          >
            Add Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
