#!/bin/bash
# ============================================
#  Script de despliegue de Base de Datos MariaDB/MySQL
#  Proyecto: proyecto_incapacidades
#  Autor: FG
# ============================================

SERVER="localhost"
DATABASE="proyecto_incapacidades"
USER=""
PASSWORD=""

# Si se pasan parámetros, reemplazar los valores por defecto
if [ ! -z "$1" ]; then SERVER=$1; fi
if [ ! -z "$2" ]; then DATABASE=$2; fi
if [ ! -z "$3" ]; then USER=$3; fi
if [ ! -z "$4" ]; then PASSWORD=$4; fi

# Directorio raíz del script
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."

# --------------------------------------------
# 🔍 Detectar el binario de MySQL/MariaDB automáticamente
# --------------------------------------------
MYSQL_CMD="mysql"

if ! command -v $MYSQL_CMD &> /dev/null; then
    if [ -f "/c/Program Files/MariaDB 12.0/bin/mysql.exe" ]; then
        MYSQL_CMD="/c/Program Files/MariaDB 12.0/bin/mysql.exe"
    elif [ -f "/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" ]; then
        MYSQL_CMD="/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe"
    elif [ -f "/c/xampp/mysql/bin/mysql.exe" ]; then
        MYSQL_CMD="/c/xampp/mysql/bin/mysql.exe"
    else
        echo "❌ No se encontró el cliente MySQL/MariaDB (mysql.exe)."
        echo "   Asegúrate de tener instalado MariaDB/MySQL y verifica la ruta."
        exit 1
    fi
fi

echo "============================================"
echo "   INICIANDO DESPLIEGUE DE BASE DE DATOS"
echo "============================================"
echo "Servidor: $SERVER"
echo "Base de datos: $DATABASE"
echo "Cliente: $MYSQL_CMD"
echo "--------------------------------------------"

# Carpetas en orden de ejecución
folders=(
    "migrations/001_core"
    "migrations/002_indexes"
    "migrations/003_views"
    "migrations/004_procedures"
    "migrations/005_triggers"
    "migrations/006_security"
    "seeds/prod"
)

# Crear la base de datos si no existe
echo "🧱 Verificando base de datos..."
"$MYSQL_CMD" -h"$SERVER" -u"$USER" -p"$PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$DATABASE\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if [ $? -ne 0 ]; then
    echo "❌ Error al crear/verificar la base de datos."
    exit 1
fi

# Procesar carpetas y ejecutar los SQL
for folder in "${folders[@]}"; do
    fullpath="$BASE_DIR/$folder"
    if [ -d "$fullpath" ]; then
        echo "📂 Procesando carpeta: $folder"
        for file in "$fullpath"/*.sql; do
            if [ -f "$file" ]; then
                echo "   ▶ Ejecutando: $(basename "$file")"
                "$MYSQL_CMD" -h"$SERVER" -u"$USER" -p"$PASSWORD" "$DATABASE" < "$file"
                if [ $? -ne 0 ]; then
                    echo "❌ Error ejecutando $file"
                    exit 1
                fi
            fi
        done
    else
        echo "⚠️ Carpeta no encontrada: $folder"
    fi
done

echo "============================================"
echo "   DESPLIEGUE FINALIZADO EXITOSAMENTE"
echo "============================================"
