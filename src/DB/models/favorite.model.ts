import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: true })
export class Favorite {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "User",
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "Product",
  })
  product: Types.ObjectId;
}

export type FavoriteDocument = HydratedDocument<Favorite>;

const favoriteSchema = SchemaFactory.createForClass(Favorite);

favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export const FavoriteModel = MongooseModule.forFeature([
  {
    name: Favorite.name,
    schema: favoriteSchema,
  },
]);
