import { Injectable } from '@nestjs/common';
import { Pagination } from './pagination-util.interface';

@Injectable()
export class PaginationUtilService extends Pagination {
  // (lưu số lượng item cần bỏ qua khi truy vấn dữ liệu.)
  private _skip!: number;
  public get skip(): number {
    return this._skip;
  }
  public set skip(value: number) {
    this._skip = value;
  }

  // (lưu tổng số trang - hiển thị cho client biết có bao nhiêu trang dữ liệu.)
  private _totalPages!: number;
  public get totalPages(): number {
    return this._totalPages;
  }
  public set totalPages(value: number) {
    this._totalPages = value;
  }

  // (Lưu tổng số phần tử (items) trong toàn bộ dữ liệu.)
  private totalItems!: number;

  // (tính toán thông tin phân trang (skip, tổng số trang) dựa trên số trang hiện tại, số phần tử mỗi trang và tổng số phần tử, rồi lưu lại để sử dụng.)
  paging({ page = 1, itemPerPage = 5, totalItems = 0 }) {
    this.totalItems = totalItems;
    const skip = (page - 1) * itemPerPage;
    this.skip = skip;
    const totalPages = Math.ceil(totalItems / itemPerPage);
    this.totalPages = totalPages;
    return this;
  }

  // (chuẩn hóa response API phân trang.)
  format<T>(list: T) {
    return {
      list,
      totalPages: this.totalPages,
      totalItems: this.totalItems,
    };
  }
}
