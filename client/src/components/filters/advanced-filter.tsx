import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  X, 
  Search, 
  Calendar, 
  DollarSign,
  Building,
  Users,
  FileText,
  RefreshCw
} from "lucide-react";

interface FilterConfig {
  type: 'text' | 'select' | 'number' | 'date-range' | 'boolean';
  label: string;
  key: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface AdvancedFilterProps {
  title: string;
  filters: FilterConfig[];
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
  activeFilters: Record<string, any>;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdvancedFilter({
  title,
  filters,
  onFilterChange,
  onReset,
  activeFilters,
  isOpen,
  onToggle
}: AdvancedFilterProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(activeFilters);

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    }
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => 
      activeFilters[key] !== '' && 
      activeFilters[key] !== null && 
      activeFilters[key] !== undefined
    ).length;
  };

  const renderFilterField = (filter: FilterConfig) => {
    const value = localFilters[filter.key] || '';

    switch (filter.type) {
      case 'text':
        return (
          <div key={filter.key} className="space-y-2">
            <Label htmlFor={filter.key}>{filter.label}</Label>
            <Input
              id={filter.key}
              placeholder={filter.placeholder}
              value={value}
              onChange={(e) => handleFilterUpdate(filter.key, e.target.value)}
            />
          </div>
        );

      case 'select':
        return (
          <div key={filter.key} className="space-y-2">
            <Label>{filter.label}</Label>
            <Select value={value} onValueChange={(newValue) => handleFilterUpdate(filter.key, newValue)}>
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || "Seçin"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div key={filter.key} className="space-y-2">
            <Label htmlFor={filter.key}>{filter.label}</Label>
            <Input
              id={filter.key}
              type="number"
              placeholder={filter.placeholder}
              value={value}
              onChange={(e) => handleFilterUpdate(filter.key, e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtreler
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
        
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Temizle
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {title} Filtreleri
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFilterCount()} aktif filtre
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {filters.map(renderFilterField)}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={getActiveFilterCount() === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Filtreleri Temizle
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {getActiveFilterCount() > 0 
              ? `${getActiveFilterCount()} filtre aktif`
              : 'Filtre seçilmedi'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}