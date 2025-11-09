package io.github.isaac.reservas.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        // Define esquema de seguridad Bearer JWT
        final String securitySchemeName = "bearer-jwt";

        SecurityScheme bearerAuth = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        return new OpenAPI()
                .info(new Info()
                        .title("Reservas API")
                        .description("API para la gestión de aulas, horarios, usuarios y reservas")
                        .version("v1")
                        .contact(new Contact()
                                .name("Equipo Reservas")
                                .email("soporte@example.com"))
                        .license(new License().name("MIT")))
                .components(new Components().addSecuritySchemes(securitySchemeName, bearerAuth))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName));
    }
}
