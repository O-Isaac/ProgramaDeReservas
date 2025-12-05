"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getApiBaseUrl, resetApiBaseUrl, updateApiBaseUrl } from "@/lib/api-client"
import { toast } from "sonner"
import { ArrowLeft, RefreshCw, Save } from "lucide-react"

export default function EndpointSettingsPage() {
  const [endpointInput, setEndpointInput] = useState(getApiBaseUrl())
  const [currentEndpoint, setCurrentEndpoint] = useState(getApiBaseUrl())
  const [endpointError, setEndpointError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const synced = getApiBaseUrl()
    setEndpointInput(synced)
    setCurrentEndpoint(synced)
  }, [])

  const handleSave = () => {
    setEndpointError("")
    setIsSaving(true)
    try {
      const updated = updateApiBaseUrl(endpointInput)
      setCurrentEndpoint(updated)
      setEndpointInput(updated)
      toast.success("Endpoint actualizado")
    } catch (error: any) {
      const message = error?.message || "No se pudo actualizar el endpoint"
      setEndpointError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setEndpointError("")
    setIsSaving(true)
    const restored = resetApiBaseUrl()
    setCurrentEndpoint(restored)
    setEndpointInput(restored)
    toast.success("Endpoint restablecido")
    setIsSaving(false)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/10 px-4 py-12">
      <div className="absolute inset-0 opacity-50" aria-hidden>
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-12 rounded-[48px] border border-border/40" />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Zona avanzada</p>
            <h1 className="text-3xl font-semibold text-foreground">Configurar endpoint</h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Cambia el servidor al que apunta la app antes de iniciar sesión. Ideal para movernos entre desarrollo local, staging o producción sin recompilar.
            </p>
          </div>
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
          </Button>
        </div>

        <div className="bg-card/80 backdrop-blur rounded-3xl border border-border/70 shadow-xl p-8 space-y-8">
          <section className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Endpoint activo</p>
            <p className="font-mono text-sm text-foreground break-all bg-muted/40 border border-border/60 rounded-2xl px-4 py-3">
              {currentEndpoint}
            </p>
          </section>

          <section className="space-y-3">
            <label className="text-xs font-medium text-foreground uppercase tracking-wide">Nuevo endpoint</label>
            <input
              type="text"
              value={endpointInput}
              onChange={(event) => setEndpointInput(event.target.value)}
              className="w-full px-4 py-3 border border-border rounded-2xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm font-mono"
              placeholder="https://mi-servidor:8080"
              spellCheck={false}
            />
            {endpointError && <p className="text-xs text-destructive">{endpointError}</p>}
          </section>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 min-w-[160px] gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar endpoint"}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isSaving} className="flex-1 min-w-[160px] gap-2">
              <RefreshCw className="h-4 w-4" />
              Restablecer
            </Button>
          </div>

          <section className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Consejos rápidos</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground/90">
              <li>Admite URLs con http o https; agrega el protocolo si lo omites.</li>
              <li>El valor se guarda en este navegador y afecta a toda la app.</li>
              <li>Tras cambiarlo, vuelve al login e inicia sesión con normalidad.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
