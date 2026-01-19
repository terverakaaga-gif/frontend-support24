import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CloseCircle } from "@solar-icons/react";
import { InvoiceModal } from "./InvoiceModal";

interface ProviderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: any;
}

// Mock data
const providerDetails = {
  name: "HopeCare Services Ltd",
  logo: null,
  serviceType: "Personal Care",
  budgetCategory: "Core",
  amountSpent: "$12,500.00",
  percentOfBudget: 62,
  lastInvoiceDate: "25 Oct, 2025",
  status: "Current",
  invoices: [
    {
      id: "#1234556",
      providerName: "HopeCare Services Ltd",
      serviceDate: "23 Oct, 2025",
    },
    {
      id: "#1234556",
      providerName: "HopeCare Services Ltd",
      serviceDate: "23 Oct, 2025",
    },
    {
      id: "#1234556",
      providerName: "HopeCare Services Ltd",
      serviceDate: "23 Oct, 2025",
    },
  ],
};

export function ProviderDetailsModal({
  open,
  onOpenChange,
  provider,
}: ProviderDetailsModalProps) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  if (!provider) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-montserrat-bold text-gray-900">
                Provider Details
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
            {/* Summary Overview */}
            <div>
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                Summary Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">Name of Provider:</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={providerDetails.logo || undefined} />
                      <AvatarFallback className="bg-gray-800 text-white text-xs">
                        HC
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-montserrat-bold text-gray-900">
                      {providerDetails.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">Service Type:</span>
                  <span className="font-montserrat-bold text-gray-900">
                    {providerDetails.serviceType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">Budget Category:</span>
                  <span className="font-montserrat-bold text-gray-900">
                    {providerDetails.budgetCategory}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">Amount Spent:</span>
                  <span className="font-montserrat-bold text-gray-900">
                    {providerDetails.amountSpent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">% of Category Budget:</span>
                  <span className="font-montserrat-bold text-gray-900">
                    {providerDetails.percentOfBudget}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">Last Invoice Date:</span>
                  <span className="font-montserrat-bold text-gray-900">
                    {providerDetails.lastInvoiceDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">Status:</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-montserrat">
                    {providerDetails.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Invoice History */}
            <div>
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                Invoice History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                        Invoice ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                        Provider Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                        Service Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerDetails.invoices.map((invoice, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-montserrat text-gray-900">{invoice.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={providerDetails.logo || undefined} />
                              <AvatarFallback className="bg-gray-800 text-white text-xs">
                                HC
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-montserrat text-gray-900">
                              {invoice.providerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-montserrat text-gray-900">
                            {invoice.serviceDate}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                            className="border-primary-600 text-primary-600 hover:bg-primary-50 font-montserrat-semibold"
                          >
                            View Invoice
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Modal */}
      <InvoiceModal
        open={showInvoiceModal}
        onOpenChange={setShowInvoiceModal}
        invoice={selectedInvoice}
      />
    </>
  );
}
