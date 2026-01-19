import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CloseCircle, Download, DocumentText, Printer } from "@solar-icons/react";

interface InvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
}

// Mock data
const invoiceData = {
  id: "#12345678",
  providerName: "HopeCare Services Ltd",
  providerLogo: null,
  serviceDate: "23 Oct, 205",
  details: {
    amount: "$500.00",
    budgetCategory: "Core",
    paymentDate: "23 Oct, 2025",
    status: "Paid",
  },
  note: "",
};

export function InvoiceModal({ open, onOpenChange, invoice }: InvoiceModalProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold text-gray-900">
              Invoice
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
          {/* Invoice Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={invoiceData.providerLogo || undefined} />
                <AvatarFallback className="bg-gray-800 text-white">HC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900">
                  {invoiceData.providerName}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-montserrat-bold text-gray-900">Invoice</h3>
              <p className="text-sm font-montserrat-semibold text-gray-600">
                Invoice ID:{invoiceData.id}
              </p>
              <p className="text-sm text-gray-600 font-montserrat">
                Service Date: {invoiceData.serviceDate}
              </p>
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <h3 className="text-base font-montserrat-bold text-gray-900 mb-4">
              Invoice Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                      Budget Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                      Payment Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4">
                      <span className="font-montserrat-semibold text-gray-900">
                        {invoiceData.details.amount}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-montserrat text-gray-900">
                        {invoiceData.details.budgetCategory}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-montserrat text-gray-900">
                        {invoiceData.details.paymentDate}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-montserrat">
                        {invoiceData.details.status}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Note */}
          <div>
            <h3 className="text-base font-montserrat-bold text-gray-900 mb-3">
              Add Note
            </h3>
            <Textarea
              placeholder="Provide a detailed description here"
              className="font-montserrat min-h-[120px]"
              value={invoiceData.note}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 bg-primary-50 p-4 rounded-lg">
            <Button
              variant="ghost"
              className="flex-1 bg-white border border-primary-200 text-primary-600 hover:bg-primary-50 font-montserrat-semibold"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white border border-gray-200 hover:bg-gray-50"
            >
              <DocumentText className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white border border-gray-200 hover:bg-gray-50"
            >
              <Printer className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
