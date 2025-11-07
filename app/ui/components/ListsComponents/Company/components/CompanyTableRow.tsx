import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { TableCell, TableRow } from "@/app/ui/components/StyledComponents/table"
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react"

import type { CompanyFromAPI } from "@/app/domain/entities/Company"

interface CompanyTableRowProps {
  company: CompanyFromAPI;
  isDeleting: boolean;
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
}

export function CompanyTableRow({
  company,
  isDeleting,
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
  handleDoubleTap
}: CompanyTableRowProps) {
  return (
    <TableRow
      key={company.id}
      className={`border-border hover:bg-secondary/30 ${isDeleting ? 'opacity-50 pointer-events-none' : ''
        }`}
      onContextMenu={(e) => !isDeleting && handleContextMenu(e, company.id, company.name)}
      onDoubleClick={(e) => !isDeleting && handleDoubleClick(e, company.id, company.name)}
      onClick={(e) => !isDeleting && handleDoubleTap(e, company.id, company.name)}
      onTouchStart={(e) => !isDeleting && handleDoubleTap(e, company.id, company.name)}
    >
      {/* Logo */}
      <TableCell>
        {isDeleting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              <Building2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </TableCell>

      {/* NOMBRE */}
      <TableCell className="font-medium">
        {isDeleting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-muted-foreground">Eliminando...</span>
          </div>
        ) : (
          <span className="text-foreground">{getDisplayValue(company.name)}</span>
        )}
      </TableCell>

      {/* TIPO */}
      <TableCell>
        {isDeleting ? (
          <div className="h-6 flex items-center">
            <span className="text-xs text-muted-foreground">-</span>
          </div>
        ) : (
          <Badge variant="outline" className="text-xs">
            {getDisplayValue(company.tipo)}
          </Badge>
        )}
      </TableCell>

      {/* NIT */}
      <TableCell className="text-muted-foreground">
        {isDeleting ? '-' : getDisplayValue(company.nit)}
      </TableCell>

      {/* CÉDULA */}
      <TableCell className="text-muted-foreground">
        {isDeleting ? '-' : getDisplayValue(company.cedula)}
      </TableCell>

      {/* CLAVE DIAN */}
      <TableCell>
        {isDeleting ? (
          <div className="h-6 flex items-center">
            <span className="text-xs text-muted-foreground">-</span>
          </div>
        ) : (
          <Badge
            variant={getDianStatus(company.dian)}
            className={getDianBadgeClass(company.dian)}
          >
            {getDisplayValue(company.dian)}
          </Badge>
        )}
      </TableCell>

      {/* FIRMA ELEC. */}
      <TableCell className="text-muted-foreground">
        {isDeleting ? '-' : getDisplayValue(company.firma)}
      </TableCell>

      {/* SOFTWARE CONTABLE */}
      <TableCell className="text-muted-foreground">
        {isDeleting ? '-' : getDisplayValue(company.softwareContable)}
      </TableCell>

      {/* USUARIO */}
      <TableCell className="text-muted-foreground">
        {isDeleting ? '-' : getDisplayValue(company.usuario)}
      </TableCell>

      {/* CLAVE SOFTWARE */}
      <TableCell className="text-muted-foreground font-mono text-sm">
        {isDeleting ? '••••••••' : maskPassword(company.contraseña, company.id)}
      </TableCell>

      {/* SERVIDOR CORREO */}
      <TableCell className="text-muted-foreground">
        {isDeleting ? '-' : getDisplayValue(company.servidorCorreo)}
      </TableCell>

      {/* E-MAIL */}
      <TableCell className="text-muted-foreground">
        {isDeleting ? '-' : getDisplayValue(company.email)}
      </TableCell>

      {/* CLAVE CORREO */}
      <TableCell>
        {isDeleting ? (
          <span className="text-muted-foreground font-mono text-sm">••••••••</span>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-mono text-sm">
              {maskPassword(company.claveCorreo, company.id)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={() => togglePasswordVisibility(company.id)}
              disabled={showAllPasswords}
            >
              {showAllPasswords || showPasswords[company.id] ?
                <EyeOff className="h-3 w-3" /> :
                <Eye className="h-3 w-3" />
              }
            </Button>
          </div>
        )}
      </TableCell>

      {/* CLAVE CC */}
      <TableCell className="text-muted-foreground font-mono text-sm">
        {isDeleting ? '••••••••' : maskPassword(company.claveCC, company.id)}
      </TableCell>

      {/* CLAVE SS */}
      <TableCell className="text-muted-foreground font-mono text-sm">
        {isDeleting ? '••••••••' : maskPassword(company.claveSS, company.id)}
      </TableCell>

      {/* CLAVE ICA */}
      <TableCell className="text-muted-foreground font-mono text-sm">
        {isDeleting ? '••••••••' : maskPassword(company.claveICA, company.id)}
      </TableCell>

      {/* Fechas */}
      <TableCell className="text-muted-foreground text-sm">
        {isDeleting ? '-' : formatDate(company.createdAt)}
      </TableCell>

      <TableCell className="text-muted-foreground text-sm">
        {isDeleting ? '-' : formatDate(company.updatedAt)}
      </TableCell>
    </TableRow>
  )
}