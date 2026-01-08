import { Product } from "./product.model";
import { User } from "./user.model";
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export enum PaymentMethodEnum {
  CASH = "cash",
  CARD = "card",
}

export enum OrderStatusEnum {
  PENDING = "pending",
  SHIPPED = "shipped",
  PAID = "paid",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}
@Schema({ _id: false })
export class OrderItem {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: Product.name,
  })
  productId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    default: 1,
  })
  quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop({
    type: [OrderItemSchema],
    default: [],
  })
  items: OrderItem[];

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  subTotal: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discount: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  total: number;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: [String],
  })
  instructions: string[];

  @Prop({
    type: String,
    required: true,
  })
  phone: string;

  @Prop({
    type: String,
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.CASH,
  })
  paymentMethod: PaymentMethodEnum;

  @Prop({
    type: String,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  orderStatus: OrderStatusEnum;
}

export type OrderDocument = HydratedDocument<Order>;

const orderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: orderSchema,
  },
]);
