/**
 * 製品関連のAPIサービス
 */

import { apiClient } from './apiClient';
import type { ProductResponse, ProductCreateData, ProductUpdateData } from '@/types/models';
import type { 
  ProductListResponse,
  ProductDetailResponse,
  ProductCreateResponse,
  ProductUpdateResponse,
  ProductDeleteResponse
} from '@/types/api';
import { API_ENDPOINTS } from '@/types/api';

export class ProductService {
  /**
   * 製品一覧を取得
   */
  async getProducts(): Promise<ProductResponse[]> {
    try {
      const response = await apiClient.get<ProductResponse[]>(
        API_ENDPOINTS.PRODUCTS.LIST
      );
      
      // バックエンドは直接配列を返すため、そのまま使用
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Get products error:', error);
      throw new Error('製品一覧の取得に失敗しました');
    }
  }

  /**
   * 製品詳細を取得
   */
  async getProduct(id: number): Promise<ProductResponse> {
    try {
      const response = await apiClient.get<ProductResponse>(
        API_ENDPOINTS.PRODUCTS.DETAIL(id)
      );
      
      // バックエンドは直接オブジェクトを返すため、そのまま使用
      return response;
    } catch (error) {
      console.error('Get product error:', error);
      throw new Error('製品詳細の取得に失敗しました');
    }
  }

  /**
   * 製品を作成
   */
  async createProduct(productData: ProductCreateData): Promise<ProductResponse> {
    try {
      // 日付をISO形式に変換してバックエンドに送信
      const formattedData = {
        ...productData,
        expiry_date: new Date(productData.expiry_date).toISOString()
      };
      
      const response = await apiClient.post<ProductResponse>(
        API_ENDPOINTS.PRODUCTS.CREATE,
        formattedData
      );
      
      // バックエンドは直接オブジェクトを返すため、そのまま使用
      return response;
    } catch (error) {
      console.error('Create product error:', error);
      throw new Error('製品の作成に失敗しました');
    }
  }

  /**
   * 製品を更新
   */
  async updateProduct(id: number, productData: ProductUpdateData): Promise<ProductResponse> {
    try {
      // 日付をISO形式に変換してバックエンドに送信
      const formattedData = {
        ...productData,
        expiry_date: new Date(productData.expiry_date).toISOString()
      };
      
      const response = await apiClient.put<ProductResponse>(
        API_ENDPOINTS.PRODUCTS.UPDATE(id),
        formattedData
      );
      
      // バックエンドは直接オブジェクトを返すため、そのまま使用
      return response;
    } catch (error) {
      console.error('Update product error:', error);
      throw new Error('製品の更新に失敗しました');
    }
  }

  /**
   * 製品を削除
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      // バックエンドは削除時に空レスポンスを返す可能性が高い
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    } catch (error) {
      console.error('Delete product error:', error);
      throw new Error('製品の削除に失敗しました');
    }
  }

  /**
   * 製品の通知設定を切り替え
   */
  async toggleProductNotification(id: number, isNotified: boolean): Promise<ProductResponse> {
    try {
      const response = await apiClient.put<ProductUpdateResponse>(
        API_ENDPOINTS.PRODUCTS.UPDATE(id),
        { is_notified: isNotified }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || '通知設定の変更に失敗しました');
      }
      
      return response.data;
    } catch (error) {
      console.error('Toggle notification error:', error);
      throw error;
    }
  }

  /**
   * 期限切れ間近の製品を取得
   */
  async getUrgentProducts(daysThreshold: number = 3): Promise<ProductResponse[]> {
    try {
      const products = await this.getProducts();
      
      // フロントエンドで期限切れ間近の製品をフィルタリング
      return products.filter(product => {
        const daysLeft = product.days_left;
        return daysLeft >= 0 && daysLeft <= daysThreshold;
      });
    } catch (error) {
      console.error('Get urgent products error:', error);
      throw error;
    }
  }

  /**
   * 期限切れの製品を取得
   */
  async getExpiredProducts(): Promise<ProductResponse[]> {
    try {
      const products = await this.getProducts();
      
      // フロントエンドで期限切れの製品をフィルタリング
      return products.filter(product => product.days_left < 0);
    } catch (error) {
      console.error('Get expired products error:', error);
      throw error;
    }
  }

  /**
   * 製品統計を取得
   */
  async getProductStats(): Promise<{
    total: number;
    expired: number;
    urgent: number;
    safe: number;
  }> {
    try {
      const products = await this.getProducts();
      
      const stats = {
        total: products.length,
        expired: 0,
        urgent: 0,
        safe: 0,
      };
      
      products.forEach(product => {
        const daysLeft = product.days_left;
        if (daysLeft < 0) {
          stats.expired++;
        } else if (daysLeft <= 3) {
          stats.urgent++;
        } else {
          stats.safe++;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Get product stats error:', error);
      throw error;
    }
  }
}

// サービスのシングルトンインスタンス
export const productService = new ProductService();

export default productService;