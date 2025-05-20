FROM openjdk:21
EXPOSE 8080
COPY backend/target/neuefische-wms-0.0.1-SNAPSHOT.jar /wms-app.jar
ENTRYPOINT ["java","-jar","/wms-app.jar"]