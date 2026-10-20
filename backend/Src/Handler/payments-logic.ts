import { Body, Controller, Get, Post, Param, Req, Query, Headers } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { BillingManager } from '../../Managers/billing-manager';
import { PaymentsManager } from '../../Managers/payments-manager';
import {
  CreateObligationInput,
  RecordPaymentInput,
  ReversePaymentInput,
  ObligationView,
  ObligationList,
  PaymentView,
  PaymentAdjustmentView,
  ObligationQuery,
} from '../Contracts/payment.contract';
import type { AuthRequest } from '../Infrastructure/transport';
const Idempotent = () =>
  ApiHeader({
    name: 'Idempotency-Key',
    required: true,
    description: 'Stable key for this intent; same key/payload replays the original result',
    schema: { type: 'string', minLength: 1, maxLength: 128, pattern: '^[-A-Za-z0-9._:]+$' },
  });
@Controller()
@ApiCookieAuth()
export class PaymentsLogic {
  constructor(
    private billing: BillingManager,
    private payments: PaymentsManager,
  ) {}
  @Get('obligations')
  @ApiOperation({ operationId: 'listAllObligations' })
  @ApiOkResponse({ type: ObligationList })
  all(@Req() req: AuthRequest, @Query() query: ObligationQuery) {
    return this.billing.list(req.actor, query);
  }
  @Get('contracts/:id/obligations')
  @ApiOperation({ operationId: 'listObligations' })
  @ApiOkResponse({ type: ObligationList })
  list(@Req() req: AuthRequest, @Param('id') id: string, @Query() query: ObligationQuery) {
    return this.billing.list(req.actor, { ...query, contract_id: id });
  }
  @Post('contracts/:id/obligations')
  @ApiOperation({ operationId: 'createObligation' })
  @ApiCreatedResponse({ type: ObligationView })
  create(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: CreateObligationInput) {
    return this.billing.create(req.actor, id, body);
  }
  @Post('obligations/:id/payments')
  @ApiOperation({ operationId: 'recordPayment' })
  @ApiCreatedResponse({ type: PaymentView })
  @Idempotent()
  record(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: RecordPaymentInput,
    @Headers('idempotency-key') key: string,
  ) {
    return this.payments.record(req.actor, id, body, key);
  }
  @Post('payments/:id/reversal')
  @ApiOperation({ operationId: 'reversePayment' })
  @ApiCreatedResponse({ type: PaymentAdjustmentView })
  @Idempotent()
  reverse(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: ReversePaymentInput,
    @Headers('idempotency-key') key: string,
  ) {
    return this.payments.reverse(req.actor, id, body, key);
  }
}
