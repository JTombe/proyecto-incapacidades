# Roadmap: Proyecto incapacidades

El proyecto está dividido en tres *releases* principales, priorizando las características del sistema para cada fase

|ID Caract.| Descripción | Objetivo de Negocio Asociado | Prioridad |
| :---: | :--- | :--- | :---: |
|CAR-01 | Registro digital de incapacidades con validación de requisitos documentales.| ON-1| Alta|
| CAR-02 | Módulo de recepción multicanal (presencial, líderes comerciales, correo electrónico). | ON-1 | Alta |
| CAR-03 | Radicación automática de incapacidades en portales de EPS y ARL.| ON-2 |Alta |
| CAR-04 | Seguimiento al estado de las incapacidades (transcrita, cobrada, rechazada, pagada). | ON-4 | Alta |
| CAR-07 | Alertas de plazos legales (30 días para paternidad, 12 meses para radicación en EPS, etc.). | ON-2| Media |
|CAR-08|Control de archivo físico y digital, con eliminación segura de documentos sensibles como la historia clínica.|ON-4|Alta|

**CAR-01**: **Registro digital de incapacidades con validación de requisitos documentales.**

1. Diseñar y crear el formulario de registro de incapacidades (digital).
2. Definir los campos obligatorios y tipos de datos para la validación.
3. Implementar reglas de validación de requisitos documentales (e.g., fechas, firmas, datos del colaborador).
4. Desarrollar la funcionalidad de adjunto de archivos para la documentación.
5. Crear la base de datos digital para almacenar los registros.

**CAR-02**: **Módulo de recepción multicanal (presencial, líderes comerciales, correo electrónico).**

1. Habilitar la subida de documentos por parte del colaborador o líder inmediato (portal web/módulo de usuario).
2. Configurar la bandeja de entrada de correo electrónico institucional para la ingesta de documentos.
3. Desarrollar una interfaz para que el personal administrativo registre la documentación recibida presencialmente.

**CAR-03**: **Radicación automática de incapacidades en portales de EPS y ARL.**

1. Identificar y documentar los flujos de radicación y credenciales de los portales de EPS/ARL.
2. Desarrollar módulos de integración/conexión (*APIs* o *RPA*) con los portales identificados.
3. Implementar la funcionalidad de envío automático de documentos validados.
4. Capturar y registrar la evidencia de radicación (número de radicado, fecha).

**CAR-04**: **Seguimiento al estado de las incapacidades (transcrita, cobrada, rechazada, pagada).**

1. Definir los estados del flujo de vida de una incapacidad.
2. Implementar la trazabilidad y registro de cambios de estado.
3. Crear un panel de seguimiento para el Auxiliar de Gestión Humana.
4. Notificar a los involucrados sobre el cambio de estado (e.g., transcrita, rechazada).

**CAR-07**: **Alertas de plazos legales (30 días para paternidad, 12 meses para radicación en EPS, etc.).**

1. Investigar y parametrizar los plazos legales clave (e.g., maternidad, paternidad, radicación).
2. Desarrollar un motor de reglas para disparar alertas.
3. Implementar el envío de notificaciones internas (e.g., al Auxiliar de Gestión Humana) antes del vencimiento.

**CAR-08**: **Control de archivo físico y digital, con eliminación segura de documentos sensibles como la historia clínica.**

1. Implementar protocolos de indexación para asociar el archivo físico con el registro digital.
2. Desarrollar la funcionalidad de marcado de documentos sensibles.
3. Implementar una política o módulo de eliminación segura y auditada para documentos sensibles.

***

## **Release 2.0: Conciliación Automática de Pagos y Reportes de Ausentismo**

**Tema Principal:** Conciliación automática de pagos y generación de reportes de ausentismo
**Objetivos de Negocio Prioritarios (Asociados a las características):** Optimizar el proceso de conciliación y cobro (ON-3), y fortalecer el control y la trazabilidad (ON-4).

| ID Caract. | Descripción | Objetivo de Negocio Asociado | Prioridad [cite: 35] |
| :---: | :--- | :--- | :---: |
| CAR-05 | Conciliación contable de pagos y base de datos de seguimiento por entidad y colaborador. | ON-3 | Media |
| CAR-06 | Generación de reportes de ausentismo y seguimiento a incapacidades superiores a 90 días. | ON-4 | Media |
| CAR-10 | Indicadores y auditoría de gestión (evidencias de radicación, tiempos y resultados). | ON-4 | Alta |

**CAR-05**: **Conciliación contable de pagos y base de datos de seguimiento por entidad y colaborador.**

1. Definir la estructura de la base de datos de conciliación de pagos (pagos esperados vs. pagos recibidos).
2. Desarrollar un módulo para la carga o ingreso de reportes de pago de EPS/ARL.
3. Implementar la lógica de cruce y conciliación de pagos.
4. Generar reportes de diferencias de conciliación para Tesorería/Contabilidad.

**CAR-06**: **Generación de reportes de ausentismo y seguimiento a incapacidades superiores a 90 días.**

1. Diseñar el formato y métricas del reporte de ausentismo.
2. Desarrollar los filtros y la lógica de cálculo para el reporte (por colaborador, área, entidad).
3. Implementar un reporte de seguimiento específico para casos de larga duración (más de 90 días).

**CAR-10**: **Indicadores y auditoría de gestión (evidencias de radicación, tiempos y resultados).**

1. Definir los Indicadores Clave de Desempeño (*KPIs*) de gestión (tiempos de radicación, tasas de rechazo/pago).
2. Desarrollar un panel (*dashboard*) de indicadores para la Gerencia/Gestión Humana.
3. Crear el módulo de auditoría y *logs* de eventos (quién hizo qué y cuándo).

***

## Release 3.0: Integración Contable y Alertas Avanzadas de Gestión

**Tema Principal:** Integración con sistemas contables y alertas avanzadas de gestión[cite: 38].
[cite_start]**Objetivo de Negocio Prioritario (Asociado a la característica):** Optimizar el proceso de conciliación y cobro (ON-3)

| ID Caract. | Descripción | Objetivo de Negocio Asociado | Prioridad |
| :---: | :--- | :--- | :---: |
| CAR-09 | Soporte al cobro persuasivo y escalamiento a Cartera y Jurídica (derechos de petición, tutela). | ON-3 | Alta |

**CAR-09**: **Soporte al cobro persuasivo y escalamiento a Cartera y Jurídica (derechos de petición, tutela).** [cite: 35]

1. Definir los criterios de escalamiento de casos (e.g., rechazo improcedente, incumplimiento de pago).
2. Desarrollar una funcionalidad para generar automáticamente o pre-llenar plantillas de documentos legales (derechos de petición).
3. Implementar un *workflow* de asignación y seguimiento de casos de cobro/jurídicos.
4. Desarrollar la integración de envío de información al Sistema Contable y a Jurídica.
