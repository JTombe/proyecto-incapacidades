# =========================================================
# Etapa 1: Build (Construcción)
# =========================================================

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia el archivo de proyecto (csproj) y restaura las dependencias
COPY *.csproj .
RUN dotnet restore

# Copia el resto de los archivos del proyecto y construye
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# =========================================================
# Etapa 2: Final (Ejecución)
# =========================================================

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Define el puerto que la aplicación Kestrel expone
# Debe coincidir con el puerto interno configurado en docker-compose (8080)
EXPOSE 8080


# ENTRYPOINT ["dotnet", "TuProyecto.dll"]
# NOTA: Reemplaza "TuProyecto.dll" con el nombre real de tu archivo DLL publicado.