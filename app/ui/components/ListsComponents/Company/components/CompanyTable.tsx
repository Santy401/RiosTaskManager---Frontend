import { Table, TableBody } from "@/app/ui/components/StyledComponents/table"
import { CompanyTableHeader } from "./CompanyTableHeader"
import { CompanyTableRow } from "./CompanyTableRow"
import { CompanyEmptyState } from "./CompanyEmptyState"

import type { CompanyFromAPI } from "@/app/domain/entities/Company"

interface CompanyTableProps {
  hasCompanies: boolean;
  paginatedCompanies: CompanyFromAPI[];
  isDeletingCompany: (id: string) => boolean;
  showPasswords: { [key: string]: boolean };
  showAllPasswords: boolean;
  togglePasswordVisibility: (id: string) => void;
  maskPassword: (password: string, companyId: string) => string;
  formatDate: (date: string) => string;
  getDisplayValue: (value: string | null | undefined) => string;
  getDianStatus: (dian: string) => "default" | "secondary";
  getDianBadgeClass: (dian: string) => string;
  handleContextMenu: (e: React.MouseEvent, id: string, name: string) => void;
  handleDoubleClick: (e: React.MouseEvent, id: string, name: string) => void;
  handleDoubleTap: (e: any, id: string, name: string) => void;
  openCreateModal: () => void;
}

export function CompanyTable({
  hasCompanies,
  paginatedCompanies,
  isDeletingCompany,
  showPasswords,
  showAllPasswords,
  togglePasswordVisibility,
  maskPassword,
  formatDate,
  getDisplayValue,
  getDianStatus,
  getDianBadgeClass,
  handleContextMenu,
  handleDoubleClick,
  handleDoubleTap,
  openCreateModal
}: CompanyTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <CompanyTableHeader />
          <TableBody>
            {hasCompanies ? (
              paginatedCompanies.map((company) => (
                <CompanyTableRow
                  key={company.id}
                  company={company}
                  isDeleting={isDeletingCompany(company.id)}
                  showPasswords={showPasswords}
                  showAllPasswords={showAllPasswords}
                  togglePasswordVisibility={togglePasswordVisibility}
                  maskPassword={maskPassword}
                  formatDate={formatDate}
                  getDisplayValue={getDisplayValue}
                  getDianStatus={getDianStatus}
                  getDianBadgeClass={getDianBadgeClass}
                  handleContextMenu={handleContextMenu}
                  handleDoubleClick={handleDoubleClick}
                  handleDoubleTap={handleDoubleTap}
                />
              ))
            ) : (
              <CompanyEmptyState openCreateModal={openCreateModal} />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}