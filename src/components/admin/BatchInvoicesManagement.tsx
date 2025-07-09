import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Eye, 
  Clock, 
  DollarSign, 
  Receipt, 
  RefreshCw,
  Building,
  ChevronDown,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Mail,
  Download,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import our types and hooks
import { useGetBatchInvoices, useGetBatchInvoiceStats } from "@/hooks/useBatchInvoiceHooks";
import { 
  BatchInvoiceFilters, 
  BatchInvoice,
  BATCH_INVOICE_STATUS_CONFIG,
  BatchInvoiceStatus
} from "@/entities/BatchInvoice";

const BatchInvoicesManagement: React.FC = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [filters, setFilters] = useState<BatchInvoiceFilters>({
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // API calls
  const { data: batchInvoicesData, isLoading, error } = useGetBatchInvoices(filters);
  const { data: stats, isLoading: statsLoading } = useGetBatchInvoiceStats(filters);

  // Helper functions
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const formatDateShort = (dateString: string) => format(new Date(dateString), "d MMM yyyy");
  const formatDateTime = (dateString: string) => format(new Date(dateString), "PPp");
  const getFullName = (user: { firstName: string; lastName: string }) => `${user.firstName} ${user.lastName}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Filter change handlers
  const handleFilterChange = (key: keyof BatchInvoiceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' || value === '' ? undefined : value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Note: Search is handled client-side since API doesn't support search
  };

  const handleDateFilterChange = () => {
    setFilters(prev => ({
      ...prev,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewBatchInvoice = (id: string) => {
    navigate(`/admin/batch-invoices/${id}`);
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = filters.status || filters.startDate || filters.endDate || searchTerm;

  // Client-side search filtering
  const filteredBatchInvoices = useMemo(() => {
    if (!batchInvoicesData?.batchInvoices || !searchTerm) {
      return batchInvoicesData?.batchInvoices || [];
    }

    const searchTermLower = searchTerm.toLowerCase();
    return batchInvoicesData.batchInvoices.filter(invoice => {
      const participantName = getFullName(invoice.participantId).toLowerCase();
      const workerName = getFullName(invoice.workerId).toLowerCase();
      const batchNumber = invoice.batchNumber.toLowerCase();
      const invoiceNumber = invoice.invoiceNumber.toLowerCase();
      
      return participantName.includes(searchTermLower) || 
             workerName.includes(searchTermLower) || 
             batchNumber.includes(searchTermLower) ||
             invoiceNumber.includes(searchTermLower);
    });
  }, [batchInvoicesData?.batchInvoices, searchTerm]);

  // Status badge component
  const getStatusBadge = (status: BatchInvoiceStatus) => {
    const config = BATCH_INVOICE_STATUS_CONFIG[status];
    return (
      <Badge variant={config.variant} className={cn("text-sm", config.color)}>
        {config.label}
      </Badge>
    );
  };

  // Email status badges
  const getEmailStatusBadge = (sent: boolean, type: 'participant' | 'worker') => {
    if (sent) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
          <Mail className="h-3 w-3 mr-1" />
          Sent
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
        <Mail className="h-3 w-3 mr-1" />
        Not Sent
      </Badge>
    );
  };

  // Statistics cards
  const StatCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: number | string; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
      </CardContent>
    </Card>
  );

  // Pagination Controls
  const PaginationControls = () => {
    if (!batchInvoicesData?.totalPages || batchInvoicesData.totalPages <= 1) return null;

    const { page, totalPages, totalResults } = batchInvoicesData;
    const startItem = ((page - 1) * (filters.limit || 20)) + 1;
    const endItem = Math.min(page * (filters.limit || 20), totalResults);

    return (
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500">
          Showing {startItem} to {endItem} of {totalResults} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === page;
              
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading && !batchInvoicesData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Batch Invoices</h1>
            <p className="text-gray-600 mt-1">Manage and monitor batch invoice generation</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Batch Invoices</h3>
              <p className="text-gray-600 mb-4">
                There was an error loading the batch invoices. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Batch Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and monitor batch invoice generation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button onClick={() => navigate('/admin/batch-invoices/generate')}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Batch
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={FileText}
            color="text-blue-600"
          />
          <StatCard
            title="Pending"
            value={stats.pendingCount}
            icon={Clock}
            color="text-yellow-600"
          />
          <StatCard
            title="Completed"
            value={stats.completedCount}
            icon={Receipt}
            color="text-green-600"
          />
          <StatCard
            title="Total Amount"
            value={formatCurrency(stats.totalAmount)}
            icon={DollarSign}
            color="text-purple-600"
          />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search batch number, invoice number, names..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? formatDateShort(startDate.toISOString()) : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate || undefined}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? formatDateShort(endDate.toISOString()) : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate || undefined}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={handleDateFilterChange}
                disabled={!startDate && !endDate}
              >
                Apply Date Filter
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Batch Invoices ({batchInvoicesData?.totalResults || 0})
          </CardTitle>
          <CardDescription>
            {hasActiveFilters 
              ? `Showing filtered results from ${batchInvoicesData?.totalResults || 0} batch invoices`
              : 'All batch invoices in the system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBatchInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No batch invoices found</h3>
              <p className="text-gray-600">
                {hasActiveFilters 
                  ? "No batch invoices match your current filters." 
                  : "No batch invoices have been generated yet."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatchInvoices.map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium">
                        {invoice.batchNumber}
                      </TableCell>
                      <TableCell>
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <p className="font-medium">{getFullName(invoice.workerId)}</p>
                            <p className="text-sm text-gray-600">{invoice.workerId.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <p className="font-medium">{getFullName(invoice.participantId)}</p>
                            <p className="text-sm text-gray-600">{invoice.participantId.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(invoice.startDate)}</p>
                          <p className="text-gray-600">to {formatDate(invoice.endDate)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {getEmailStatusBadge(invoice.sentToParticipant, 'participant')}
                          {getEmailStatusBadge(invoice.sentToWorker, 'worker')}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.invoiceTotal)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(invoice.generatedAt)}</p>
                          <p className="text-gray-600">{format(new Date(invoice.generatedAt), "h:mm a")}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBatchInvoice(invoice._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <PaginationControls />
    </div>
  );
};

export default BatchInvoicesManagement; 