# SmartBus backend — deploy to Render / Railway / Fly.io (not Vercel: Spring Boot
# needs a long-running JVM, which serverless platforms don't provide).
# Render: New Web Service -> Docker -> env vars PG_URL, PG_USER, PG_PASSWORD,
#   APP_JWT_SECRET, APP_CORS_ORIGINS=https://<your-app>.vercel.app
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/smartbus-backend-*.jar app.jar
EXPOSE 8081
ENV PORT=8081
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8081} -jar app.jar"]
