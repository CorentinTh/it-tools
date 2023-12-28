import { expect, test } from '@playwright/test';

test.describe('Tool - Properties to YAML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/properties-to-yaml');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Properties to YAML - IT Tools');
  });

  test('', async ({ page }) => {
    await page.getByTestId('input').fill(`
spring.mvc.async.request-timeout=-1
spring.output.ansi.enabled=NEVER
spring.config.import=optional:file:.env[.properties]
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=\${DATABASE_URI}
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false
management.endpoints.web.base-path=/internal
management.endpoints.web.exposure.include[0]=health
management.endpoints.web.exposure.include[1]=info
management.endpoint.info.enabled=true
management.endpoint.health=
        `.trim());

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual(`
spring:
  mvc:
    async:
      request-timeout: "-1"
  output:
    ansi:
      enabled: NEVER
  config:
    import: optional:file:.env[.properties]
  datasource:
    driverClassName: com.mysql.cj.jdbc.Driver
    url: \${DATABASE_URI}
  jpa:
    hibernate:
      naming:
        physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
    database-platform: org.hibernate.dialect.MySQLDialect
    open-in-view: "false"
management:
  endpoints:
    web:
      base-path: /internal
      exposure:
        include:
          - health
          - info
  endpoint:
    info:
      enabled: "true"
    health: ""
    `.trim(),
    );
  });
});
