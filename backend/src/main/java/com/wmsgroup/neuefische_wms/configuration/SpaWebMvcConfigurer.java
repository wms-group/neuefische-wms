package com.wmsgroup.neuefische_wms.configuration; // Oder ein passendes Paket

import lombok.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class SpaWebMvcConfigurer implements WebMvcConfigurer {

    /**
     * Configuration für spa handling.
     * @param registry parameter
     */
    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        // Standard-Handler für statische Ressourcen (JS, CSS, Bilder etc.)
        registry.addResourceHandler("/**") // Alle Pfade abdecken
                .addResourceLocations("classpath:/static/") // Wo die statischen Dateien liegen
                .resourceChain(true) // Wichtig für den Resolver
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(final @NonNull String resourcePath, final @NonNull Resource location) throws IOException {
                        // Versuche, die angeforderte Ressource zu finden (z.B. /assets/main.js)
                        Resource requestedResource = location.createRelative(resourcePath);

                        // Wenn die Ressource existiert und lesbar ist ODER es ein API-Pfad ist,
                        // gib sie zurück (oder lass Spring normal weitermachen für API).
                        // Andernfalls (wahrscheinlich eine Frontend-Route wie /characters) gib index.html zurück.
                        // Der Check auf /api/ ist optional, da @RestController Vorrang haben sollte,
                        // aber er schadet als zusätzliche Sicherheit nicht.
                        if (requestedResource.exists() && requestedResource.isReadable() || resourcePath.startsWith("api/")) {
                            return requestedResource;
                        } else {
                            // Fallback auf index.html für unbekannte Pfade (SPA-Routen)
                            // Stelle sicher, dass deine gebaute index.html wirklich unter /static/index.html liegt
                            Resource indexHtml = new ClassPathResource("/static/index.html");
                            // Prüfe sicherheitshalber, ob die index.html existiert
                            if (indexHtml.exists()) {
                                return indexHtml;
                            } else {
                                // Wenn selbst die index.html fehlt, gib null zurück,
                                // damit Spring einen Standard-404 erzeugen kann.
                                return null;
                            }
                        }
                    }
                });
    }
}