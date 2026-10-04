import { Global, Module } from '@nestjs/common';
import { WHATSAPP_NOTIFIER } from './constants/whatsapp.token';
import { StubWhatsAppNotifier } from './providers/stub-whatsapp.notifier';

@Global()
@Module({
  providers: [
    // TODO(per-project): bind a real sender (e.g. the official WhatsApp Cloud API) before going live.
    { provide: WHATSAPP_NOTIFIER, useClass: StubWhatsAppNotifier },
  ],
  exports: [WHATSAPP_NOTIFIER],
})
export class WhatsAppModule {}
