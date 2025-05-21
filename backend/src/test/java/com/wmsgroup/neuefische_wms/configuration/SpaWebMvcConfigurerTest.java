package com.wmsgroup.neuefische_wms.configuration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class SpaWebMvcConfigurerTest {

    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate restTemplate;

    @Test
    void unknownResourceFallsBackToIndexHtml() {
        // Annahme: index.html enthält das Wort "<!DOCTYPE html>"
        String body = restTemplate.getForObject("http://localhost:" + port + "/irgendwas.js", String.class);

        // Fallback von SPA: index.html wird geliefert
        assertThat(body).contains("<!DOCTYPE html>");
    }

    @Test
    void existingResourceIsReturned() {
        // Annahme: index.html enthält das Wort "<!DOCTYPE html>"
        String body = restTemplate.getForObject("http://localhost:" + port + "/test-resource.js", String.class);

        // Fallback von SPA: index.html wird geliefert
        assertThat(body).contains("const testResource = \"\";");
    }

    @Test
    void apiIsNotFallbacked() {
        // Dein echter API-Controller gibt KEIN index.html zurück
        String body = restTemplate.getForObject("http://localhost:" + port + "/api/ping", String.class);

        assertThat(body).doesNotContain("<!DOCTYPE html>");
    }
}