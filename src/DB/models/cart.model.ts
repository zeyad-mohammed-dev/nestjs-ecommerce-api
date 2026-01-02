import { Product } from "./product.model";
import { User } from "./user.model";
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ _id: false })
export class CartItem {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: Product.name,
  })
  product: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    default: 1,
  })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: User.name,
  })
  user: Types.ObjectId;

  @Prop({
    type: [CartItemSchema],
    default: [],
  })
  items: CartItem[];
}

export type CartDocument = HydratedDocument<Cart>;

export const cartSchema = SchemaFactory.createForClass(Cart);

export const CartModel = MongooseModule.forFeature([
  {
    name: Cart.name,
    schema: cartSchema,
  },
]);
