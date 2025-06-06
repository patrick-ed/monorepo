# --- Build Stage ---
FROM gradle:8.7-jdk21-alpine AS build
WORKDIR /home/gradle/src
COPY build.gradle.kts settings.gradle.kts ./
COPY src ./src
RUN gradle build --no-daemon

# --- Package Stage ---
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]