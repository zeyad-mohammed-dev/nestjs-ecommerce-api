import { CategoryService } from './category.service';
import { Body, Controller, Get } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  allCategory(): {
    message: string;
    data: { categories: { id: number; category: string }[] };
  } {
    const categories = this.categoryService.allCategory();
    return { message: 'Done', data: { categories } };
  }
}
