import 'dotenv/config';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  serviceName: process.env.BASELIME_DATASET,
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: process.env.BASELIME_DATASET,
    [SEMRESATTRS_SERVICE_VERSION]: '1.0.0',
  }),
  traceExporter: new OTLPTraceExporter({
    url: 'https://otel.baselime.io/v1/traces',
    headers: {
      'x-api-key': process.env.BASELIME_API_KEY,
      'x-baselime-dataset': process.env.BASELIME_DATASET,
    },
    timeoutMillis: 1000,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'https://otel.baselime.io/v1/metrics',
      headers: {
        'x-api-key': process.env.BASELIME_API_KEY,
        'x-baselime-dataset': process.env.BASELIME_DATASET,
      },
      timeoutMillis: 1000,
    }),
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // '@opentelemetry/instrumentation-pino': {
      //   logKeys: {
      //     traceId: 'trace_id',
      //     spanId: 'span_id',
      //     traceFlags: 'trace_flags',
      //   },
      // },

      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-fastify': { enabled: false },
      '@opentelemetry/instrumentation-amqplib': { enabled: false },
      '@opentelemetry/instrumentation-aws-lambda': { enabled: false },
      '@opentelemetry/instrumentation-aws-sdk': { enabled: false },
      '@opentelemetry/instrumentation-winston': { enabled: false },
      '@opentelemetry/instrumentation-bunyan': { enabled: false },
    }),
  ],
});
sdk.start();
