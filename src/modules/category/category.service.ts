import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  allCategory() {
    return [{ id: 2, category: 'clothes' }];
  }
}
