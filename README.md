# Sistema de Gestión de Incapacidades Médicas

## 📋 Descripción del Proyecto

Sistema integral para la gestión digital de incapacidades médicas, licencias de maternidad/paternidad y accidentes laborales/tránsito. Centraliza y automatiza los procesos de recepción, validación, radicación, seguimiento y cobro de incapacidades.

## 🎯 Objetivos del Sistema

### Objetivos de Negocio

| ID | Objetivo |
|----|----------|
| **ON-1** | Estandarizar el procedimiento de recepción, validación y radicación |
| **ON-2** | Garantizar cumplimiento de requisitos legales y plazos establecidos |
| **ON-3** | Optimizar proceso de conciliación y cobro de incapacidades |
| **ON-4** | Fortalecer control documental y trazabilidad |

## 🚀 Características por Release

### Release 1.0 - Funcionalidad Básica

- ✅ **CAR-01**: Registro digital con validación documental
- ✅ **CAR-02**: Recepción multicanal (presencial, líderes, correo)
- ✅ **CAR-03**: Radicación automática en portales EPS/ARL
- ✅ **CAR-04**: Seguimiento de estados (transcrita, cobrada, rechazada, pagada)
- ✅ **CAR-07**: Alertas de plazos legales
- ✅ **CAR-08**: Control de archivo físico y digital

### Release 2.0 - Reportes y Conciliación

- 🔄 **CAR-05**: Conciliación contable automática
- 🔄 **CAR-06**: Reportes de ausentismo y seguimiento
- 🔄 **CAR-10**: Indicadores y auditoría de gestión

### Release 3.0 - Integraciones Avanzadas

- ⏳ **CAR-09**: Integración con sistemas contables y alertas avanzadas

## 👥 Roles y Responsabilidades

| Rol | Responsabilidades |
|-----|-------------------|
| **Colaborador** | Reportar incapacidades y entregar documentación completa |
| **Líder Inmediato** | Gestionar reemplazos y dar continuidad operativa |
| **Recepcionista/Auxiliar** | Recepción y verificación inicial de documentación |
| **Auxiliar Gestión Humana** | Radicación, seguimiento y conciliación |
| **Tesorería/Contabilidad** | Validación y registro de pagos recibidos |
| **Jurídica** | Gestión de casos de rechazo improcedente |

## 📊 Flujo del Proceso

### 1. Recepción de Incapacidades

**Canales disponibles:**

- 📍 Presencial (Recepción)
- 🏢 Oficinas principales
- 👥 Líderes comerciales
- 📧 Correo electrónico

### 2. Validación Documental

**Documentación requerida por tipo:**

| Tipo | Documentos Obligatorios |
|------|------------------------|
| **Enfermedad General** | Incapacidad + Epicrisis (>2 días) |
| **Accidente Tránsito** | Incapacidad + Epicrisis + FURIPS |
| **Accidente Laboral** | Incapacidad + Epicrisis |
| **Licencia Maternidad** | Incapacidad + Epicrisis + certificados |
| **Licencia Paternidad** | Epicrisis + certificados |

### 3. ranscripción a EPS/ARL

**Plazos de transcripción por entidad:**

| EPS | Tiempo Transcripción |
|-----|---------------------|
| Salud Total | 12 meses - accidentes tránsito / 15 días |
| Nueva EPS | 12 meses |
| SOS | 12 meses |
| Sanitas | 3 años |
| SURA EPS | 150 días calendario |
| Asmet Salud | 12 meses |

### 4. Seguimiento de Estados

- **🟡 Transcrita**: En verificación por la entidad
- **🟢 Cobrada**: Aprobada y pendiente de pago
- **🔴 Rechazada**: Requiere subsanación
- **🔵 Pagada**: Proceso completado

### 5. Cobro y Conciliación

- Verificación diaria de estados
- Gestión de cobro persuasivo
- Conciliación mensual con contabilidad
- Base de datos de seguimiento

## Stack Tecnológico

- **Frontend**: TypeScript, CSS, HTML (React)
- **Backend**: C#
- **Base de Datos**: MariaDB
- **Servidor**: Debian

## Plazos Legales Críticos

| Proceso | Plazo | Observaciones |
|---------|-------|---------------|
| Licencia Paternidad | 30 días calendario | Desde día de nacimiento |
| Transcripción general | 12 meses - 3 años | Según EPS |
| Cobro jurídico | 180 días sin pago | Tras gestión persuasiva |
| Concepto rehabilitación | Día 150 | Para incapacidades prolongadas |

## Porcentajes de Reconocimiento

| Días | Porcentaje | Responsable |
|------|------------|-------------|
| 1-2 | 100% IBC | Empresa |
| 3-90 | 67% IBC | EPS |
| 91-180 | 50% IBC | EPS |
| 181+ | Fondo de Pensiones | Colaborador |

## 📊 Reportes y Monitoreo

### Reportes Obligatorios

- Reporte mensual de ausentismo (primeros 3 días de cada mes)
- Seguimiento incapacidades >90, 120, 150, 180 días
- Indicadores de gestión y auditoría
- Conciliación contable mensual

## 🔒 Gestión Documental y Seguridad

### Archivo Físico

- Organizado por entidad y fecha de inicio
- Carpeta ascendente por colaborador
- Envío a gestión documental una vez pagada

### Archivo Digital

- Escaneo y organización por colaborador
- Eliminación segura de documentos sensibles (historia clínica)
- Evidencias documentales de todas las gestiones

## ⚖️ Gestión de Casos Especiales

### Cobro Jurídico

**Casos que aplican:**

- Incapacidades negadas con causales improcedentes
- Incumplimiento de acuerdos de pago por EPS

**Proceso:**

1. Derecho de petición
2. Acción de tutela (si no hay respuesta)
3. Seguimiento por área jurídica

## Criterios de Aceptación del Proyecto

- ✅ Implementación del procedimiento en toda la organización
- ✅ Base de datos digital consolidada de incapacidades
- ✅ Protocolos de verificación, cobro y conciliación aprobados
- ✅ Capacitación completa a colaboradores y líderes

---

*Sistema diseñado para optimizar la gestión de incapacidades médicas, garantizando cumplimiento normativo y eficiencia operativa.*
