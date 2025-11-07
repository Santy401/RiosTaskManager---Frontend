import { TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"

export function CompanyTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-border hover:bg-transparent">
        <TableHead className="text-muted-foreground font-medium">Logo</TableHead>
        <TableHead className="text-muted-foreground font-medium">NOMBRE</TableHead>
        <TableHead className="text-muted-foreground font-medium">TIPO</TableHead>
        <TableHead className="text-muted-foreground font-medium">NIT</TableHead>
        <TableHead className="text-muted-foreground font-medium">CÉDULA</TableHead>
        <TableHead className="text-muted-foreground font-medium">CLAVE DIAN</TableHead>
        <TableHead className="text-muted-foreground font-medium">FIRMA ELEC.</TableHead>
        <TableHead className="text-muted-foreground font-medium">SOFTWARE CONTABLE</TableHead>
        <TableHead className="text-muted-foreground font-medium">USUARIO</TableHead>
        <TableHead className="text-muted-foreground font-medium">CLAVE SOFTWARE</TableHead>
        <TableHead className="text-muted-foreground font-medium">SERVIDOR CORREO</TableHead>
        <TableHead className="text-muted-foreground font-medium">E-MAIL</TableHead>
        <TableHead className="text-muted-foreground font-medium">CLAVE CORREO</TableHead>
        <TableHead className="text-muted-foreground font-medium">CLAVE CC</TableHead>
        <TableHead className="text-muted-foreground font-medium">CLAVE SS</TableHead>
        <TableHead className="text-muted-foreground font-medium">CLAVE ICA</TableHead>
        <TableHead className="text-muted-foreground font-medium">Creada</TableHead>
        <TableHead className="text-muted-foreground font-medium">Actualizada</TableHead>
      </TableRow>
    </TableHeader>
  )
}
