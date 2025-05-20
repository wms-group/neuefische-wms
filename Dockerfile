FROM openjdk:21
EXPOSE 8080
COPY backend/target/wms-app.jar /wms-app.jar
ENTRYPOINT ["java","-jar","/wms-app.jar"]