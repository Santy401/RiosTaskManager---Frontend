interface CompanyHeaderProps {
  totalCompanies: number;
}

export function CompanyHeader({ totalCompanies }: CompanyHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold text-foreground">Empresas</h1>
      <p className="text-sm text-muted-foreground">
        {totalCompanies} empresas registradas
      </p>
    </div>
  )
}