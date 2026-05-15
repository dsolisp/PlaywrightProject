import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

let configured = false;

function parseOtelHeaders(raw?: string): Record<string, string> {
  if (!raw) return {};
  // OTEL_EXPORTER_OTLP_HEADERS commonly looks like: "k1=v1,k2=v2"
  return raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return acc;
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      if (k) acc[k] = v;
      return acc;
    }, {});
}

/** Portfolio contract: shared-docs/docs/OTEL_TEST_RUN_ATTRIBUTES.md */
function testRunResourceAttributes(serviceName: string): Record<string, string> {
  const attrs: Record<string, string> = { 'service.name': serviceName };
  const sha = process.env.GITHUB_SHA ?? process.env.GIT_SHA ?? '';
  if (sha) attrs['git.sha'] = sha;
  const suite = process.env.OTEL_TEST_SUITE ?? '';
  if (suite) attrs['test.suite'] = suite;
  return attrs;
}

export function configureTracing(serviceName: string) {
  if (configured) return;

  // Minimal diagnostics for local debug (set OTEL_DIAG=debug).
  if (process.env.OTEL_DIAG === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT; // e.g. http://localhost:4318/v1/traces
  const spanProcessors = [];
  if (endpoint) {
    const headers = parseOtelHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS);
    spanProcessors.push(
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: endpoint,
          headers: Object.keys(headers).length ? headers : undefined,
        }),
      ),
    );
  }

  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes(testRunResourceAttributes(serviceName)),
    spanProcessors,
  });

  provider.register();

  // Auto-instrument outbound HTTP(S) so downstream calls appear as child spans.
  registerInstrumentations({
    instrumentations: [new HttpInstrumentation()],
  });

  configured = true;
}
