import { BadRequestException, Injectable } from "@nestjs/common";
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
