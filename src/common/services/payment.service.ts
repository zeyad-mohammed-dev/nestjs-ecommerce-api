import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Request } from "express";
import Stripe from "stripe";

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET as string);
  }

  async createCheckoutSession({
    customer_email,
    cancel_url = process.env.CANCEL_URL as string,
    success_url = process.env.SUCCESS_URL as string,
    metadata = {},
    discounts = [],
    mode = "payment",
    line_items,
  }: Stripe.Checkout.SessionCreateParams): Promise<
    Stripe.Response<Stripe.Checkout.Session>
  > {
    console.log("Payment Service");
    const session = await this.stripe.checkout.sessions.create({
      customer_email,
      cancel_url,
      success_url,
      metadata,
      discounts,
      mode,
      line_items,
    });

    return session;
  }

  async createCoupon(
    data: Stripe.CouponCreateParams,
  ): Promise<Stripe.Response<Stripe.Coupon>> {
    const coupon = await this.stripe.coupons.create(data);
    return coupon;
  }

  async createPaymentMethod(
    data: Stripe.PaymentMethodCreateParams = {
      type: "card",
      card: { token: "tok_visa" },
    },
  ): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    const method = await this.stripe.paymentMethods.create(data);
    console.log({ method });

    return method;
  }

  async retrievePaymentIntent(
    id: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const intent = await this.stripe.paymentIntents.retrieve(id);
    if (intent?.status != "requires_confirmation") {
      throw new NotFoundException(
        "Fail to find matching payment intent intent",
      );
    }
    console.log({ intent });

    return intent;
  }

  async confirmPaymentIntent(
    id: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const intent = await this.retrievePaymentIntent(id);
    const confirm = await this.stripe.paymentIntents.confirm(intent.id, {
      payment_method: "pm_card_visa",
    });

    if (confirm.status != "succeeded") {
      throw new BadRequestException("Fail to confirm this intent");
    }
    console.log({ confirm });

    return confirm;
  }

  async createPaymentIntent(
    data: Stripe.PaymentIntentCreateParams,
    methodData?: Stripe.PaymentMethodCreateParams,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const method = await this.createPaymentMethod(methodData);
    const intent = await this.stripe.paymentIntents.create({
      amount: data.amount * 100,
      currency: data.currency || "egp",
      payment_method: method.id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    console.log(intent);

    return intent;
  }

  async webhook(req: Request): Promise<Stripe.CheckoutSessionCompletedEvent> {
    const endpointSecret = process.env.STRIPE_HOOK_SECRET as string;

    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;
    event = this.stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      endpointSecret,
    );

    // Handle the event
    if (event.type != "checkout.session.completed") {
      throw new BadRequestException("Fail to pay this session");
    }
    return event;
  }
}
