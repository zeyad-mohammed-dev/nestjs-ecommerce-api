import { BadRequestException, Injectable } from "@nestjs/common";
import {
  CartDocument,
  CartRepository,
  ProductRepository,
  UserDocument,
} from "src/DB";
import { AddToCartDto } from "./dto/add-to-cart.dto";

@Injectable()
export class CartService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  async addToCart({
    user,
    productData,
  }: {
    user: UserDocument;
    productData: AddToCartDto;
  }) {
    //check if product exists and in stock
    const product = await this.productRepository.findOne({
      filter: {
        _id: productData.productId,
        stock: {
          $gte: productData.quantity,
        },
      },
    });
    if (!product) {
      throw new BadRequestException("Product not found or out of stock");
    }

    //check if user has a cart
    const userCart = await this.cartRepository.findOne({
      filter: {
        userId: user._id,
      },
    });

    if (!userCart) {
      //create new cart with item data
      const cart = await this.cartRepository.create({
        data: [
          {
            userId: user._id,
            items: [
              {
                productId: productData.productId,
                quantity: productData.quantity,
              },
            ],
          },
        ],
      });
      //check if cart created successfully
      if (cart) {
        return "added to cart";
      } else {
        throw new BadRequestException("Failed to add to cart");
      }
    } else {
      //if user has a cart find the product index
      const productIndex = userCart.items.findIndex(
        (item) =>
          item.productId.toString() === productData.productId.toString(),
      );
      //if product not found in cart push it to items and save and return added
      if (productIndex === -1) {
        userCart.items.push({
          productId: productData.productId,
          quantity: productData.quantity,
        });
        await userCart.save();
        return "added to cart";
      } else {
        //if product found in cart
        const foundItem = userCart.items[productIndex];
        //if quantity + productData.quantity > product.stock throw error and update quantity with available stock
        if (foundItem.quantity + productData.quantity > product.stock) {
          userCart.items[productIndex].quantity = product.stock;
          await userCart.save();
          throw new BadRequestException(`Available stock is ${product.stock}`);
        } else {
          //if quantity + productData.quantity <= product.stock update quantity and save and return added
          userCart.items[productIndex].quantity += productData.quantity;
          await userCart.save();
          return "added to cart";
        }
      }
    }
  }
}
