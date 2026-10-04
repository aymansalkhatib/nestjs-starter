# WhatsApp Client

The OTP delivery seam. Feature code injects the `WHATSAPP_NOTIFIER` token
and calls `IWhatsAppNotifier`, so the transport can change without touching
any caller.

The starter binds a **mock**: `StubWhatsAppNotifier` writes the code to the
log and reports success, so no message leaves the server. Bind a real
sender before going live (see the `TODO(per-project)` in
[whatsapp.module.ts](whatsapp.module.ts)).

## Layers

```text
Feature code (e.g. OtpService)
        │   IWhatsAppNotifier
        ▼
WHATSAPP_NOTIFIER  ──►  StubWhatsAppNotifier  (logs the code)
```

- **`interfaces/whatsapp-notifier.interface.ts`** — `IWhatsAppNotifier`
  contract: `sendOtp`. Add more methods here as your domain needs them.
- **`providers/stub-whatsapp.notifier.ts`** — the mock. Logs
  `[WA-STUB] otp phone=… code=…` and returns success.
- **`constants/whatsapp.token.ts`** — `WHATSAPP_NOTIFIER` DI token.
- **`whatsapp.module.ts`** — `@Global()`. Binds the token to the mock.

## Usage

```ts
constructor(@Inject(WHATSAPP_NOTIFIER) private readonly whatsapp: IWhatsAppNotifier) {}

await this.whatsapp.sendOtp(phone, code);
```

Each call returns `{ messageId, dispatchedAt }`. `OtpService` caps the call
with a 5-second timeout: if the notifier throws or hangs, the code stays
valid and the API response carries a `warning` asking the user to contact
support.

## Plugging in a real sender

1. Implement `IWhatsAppNotifier` on an official API — Meta's
   [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
   (authentication templates) or a Business Solution Provider such as
   Twilio.
2. Bind it to `WHATSAPP_NOTIFIER` in [whatsapp.module.ts](whatsapp.module.ts).
3. Add its credentials to a Zod schema in
   [../config/schemas/](../config/schemas/) so the app refuses to boot
   without them.

Feature code stays untouched: the interface keeps the message contract
(`sendOtp`) stable.
