import { describe, expect, it } from 'vitest';
import { inspectOpenApi } from './openapi-inspector.service';

const document = `openapi: 3.1.0
info: { title: Orders, version: 2.0.0 }
servers:
  - url: https://{tenant}.example.test/v2
    variables:
      tenant: { default: demo }
paths:
  /orders/{orderId}:
    parameters:
      - name: orderId
        in: path
        required: true
        schema: { type: string, example: order-7 }
    get:
      operationId: getOrder
      summary: Read an order
      parameters:
        - name: verbose
          in: query
          required: true
          schema: { type: boolean }
      responses:
        '200': { description: OK }
  /orders:
    post:
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/NewOrder' }
      responses:
        '201': { description: Created }
components:
  schemas:
    NewOrder:
      type: object
      properties:
        quantity: { type: integer, minimum: 1 }
        customer: { type: string, example: Ada }
`;

describe('OpenAPI inspector', () => {
  it('lists operations and produces deterministic local request and payload examples', () => {
    const report = inspectOpenApi(document);
    expect(report).toContain('Operations: 2');
    expect(report).toContain('GET /orders/{orderId} — Read an order [getOrder]');
    expect(report).toContain('https://demo.example.test/v2/orders/order-7?verbose=false');
    expect(report).toContain('POST /orders');
    expect(report).toContain('"quantity": 1');
    expect(report).toContain('"customer": "Ada"');
  });

  it('reports supported structural gaps without claiming full conformance', () => {
    const report = inspectOpenApi('{"openapi":"2.0","info":{},"paths":{}}');
    expect(report).toContain('openapi must declare a supported 3.0.x or 3.1.x');
    expect(report).toContain('info.title must be a non-empty string');
    expect(report).toContain('Operations: 0');
  });

  it('reports external references instead of fetching them', () => {
    const externalDocument = ['openapi: 3.1.0', 'info: { title: A, version: \'1\' }', 'paths:', '  /x:', '    $ref: https://example.com/path.yaml'].join('\n');
    expect(() => inspectOpenApi(externalDocument))
      .not.toThrow();
    const report = inspectOpenApi(externalDocument);
    expect(report).toContain('External reference');
  });
});
