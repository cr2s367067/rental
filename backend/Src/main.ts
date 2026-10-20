import { SwaggerModule } from '@nestjs/swagger';
import { createApplication, schema } from './bootstrap';
async function main() {
  const app = await createApplication();
  SwaggerModule.setup('api/docs', app, schema(app));
  await app.listen(Number(process.env.PORT || 3100), '0.0.0.0');
}
main().catch(() => {
  console.error('Application startup failed; verify environment and service health');
  process.exit(1);
});
