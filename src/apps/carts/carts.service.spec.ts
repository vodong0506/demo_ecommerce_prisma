import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';
import { CartsModule } from './carts.module';
import { CartsService } from './carts.service';

describe('CartService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [CartsModule],
    });

    service = await module.resolve<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
