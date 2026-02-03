import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloseCircle } from "@solar-icons/react";
import { toast } from "sonner";

interface EditBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetData: any[];
}

interface BudgetCategory {
  category: string;
  budget: string;
}

export function EditBudgetModal({
  open,
  onOpenChange,
  budgetData,
}: EditBudgetModalProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { category: "", budget: "" },
  ]);
  const [totalBudget, setTotalBudget] = useState("");
  const [planManagerName, setPlanManagerName] = useState("");
  const [planManagerEmail, setPlanManagerEmail] = useState("");

  // Load existing data when modal opens
  useEffect(() => {
    if (open && budgetData && budgetData.length > 0) {
      const loadedCategories = budgetData.map((item) => ({
        category: item.category || "",
        budget: item.planValue?.replace("$", "").replace(".", "") || "",
      }));
      setCategories(loadedCategories);
      
      // Load plan manager data from first category
      if (budgetData[0]?.planManager) {
        setPlanManagerName(budgetData[0].planManager.name || "");
        setPlanManagerEmail(budgetData[0].planManager.email || "");
      }
    }
  }, [open, budgetData]);

  const addCategory = () => {
    setCategories([...categories, { category: "", budget: "" }]);
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setCategories(newCategories);
  };

  const handleUpdate = () => {
    console.log("Updating budget:", {
      categories,
      totalBudget,
      planManagerName,
      planManagerEmail,
    });
    toast.success("Budget updated successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold text-gray-900">
              Edit
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
          <h3 className="text-lg font-montserrat-bold text-gray-900">
            Budget Allocation by Category
          </h3>

          {/* Categories */}
          {categories.map((cat, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-bold text-gray-900">
                  Category
                </Label>
                <Input
                  value={cat.category}
                  onChange={(e) => updateCategory(index, "category", e.target.value)}
                  placeholder="Core"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-bold text-gray-900">
                  Budget
                </Label>
                <Input
                  value={cat.budget}
                  onChange={(e) => updateCategory(index, "budget", e.target.value)}
                  placeholder="$40,000"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>
            </div>
          ))}

          {/* Add Category Button */}
          <button
            onClick={addCategory}
            className="text-sm text-primary-600 hover:text-primary-700 font-montserrat-semibold flex items-center gap-1"
          >
            + Add Category
          </button>

          {/* Total Budget */}
          <div className="space-y-2">
            <Label className="text-sm font-montserrat-bold text-gray-900">
              Total Budget Match Plan Value
            </Label>
            <Input
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              placeholder="&70,00000"
              className="font-montserrat"
            />
            <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
              <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                i
              </span>
              Required
            </p>
          </div>

          {/* Plan Manager Name */}
          <div className="space-y-2">
            <Label className="text-sm font-montserrat-bold text-gray-900">
              Plan Manager Name
            </Label>
            <Input
              value={planManagerName}
              onChange={(e) => setPlanManagerName(e.target.value)}
              placeholder="Rose"
              className="font-montserrat"
            />
            <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
              <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                i
              </span>
              Required
            </p>
          </div>

          {/* Plan Manager Email */}
          <div className="space-y-2">
            <Label className="text-sm font-montserrat-bold text-gray-900">
              Plan Manager Email
            </Label>
            <Input
              type="email"
              value={planManagerEmail}
              onChange={(e) => setPlanManagerEmail(e.target.value)}
              placeholder="rose@gmail.com"
              className="font-montserrat"
            />
            <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
              <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                i
              </span>
              Required
            </p>
          </div>

          {/* Update Button */}
          <Button
            onClick={handleUpdate}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
