// src/app/models/product.dto.ts

export interface AttributeValueDto {
  attributeTypeId: string;   // Guid from the backend
  value: string;
}

export interface ProductDto {
  productId?: string;        // nullable Guid → optional string
  name: string;
  sku: string;
  description: string;
  price: number;
  isActive: boolean;
  categoryIds: LookupAttribute[];     // List<Guid> → string[]
  attributes: AttributeValueDto[];
  imageUrls: any[];
}
export interface LookupAttribute {
  parentCategoryId: string;               // Guid from the backend
    childCategoryId: string;
}
export interface AddedAttribute {
  attributeId: string | null;
  attributeValue: string;
}

