FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiamos todo el repositorio (context debe apuntar a la raíz) y publicamos el proyecto API
COPY . .
WORKDIR /src/backend/API

RUN dotnet restore "Incapacidades.API.csproj"
RUN dotnet publish "Incapacidades.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "Incapacidades.API.dll"]
