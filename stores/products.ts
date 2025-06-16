import { defineStore } from "pinia";
import type {
  Product,
  PaginatedProducts,
  ProductInput,
} from "~/types/products";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 5,
    initialized: false,
  }),

  actions: {
    async fetchProducts(page: number = 1, size: number = 5) {
      try {
        const response = await fetch(
          `http://localhost:5086/api/Products?pageNumber=${page}&pageSize=${size}`
        );
        const data = await response.json();
        this.products = data.data;
        this.totalRecords = data.totalRecords;
        this.pageNumber = data.pageNumber;
        this.pageSize = data.pageSize;
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },

    async initializeProducts(page: number = 1, size: number = 5) {
      if (this.products.length === 0) {
        await this.fetchProducts(page, size);
      }
    },

    async deleteProduct(id: number) {
      try {
        const { error } = await useFetch(
          `http://localhost:5086/api/Products/${id}`,
          {
            method: "DELETE",
          }
        );

        if (error.value) {
          console.error("Erro ao deletar produto:", error.value);
          return;
        }

        await this.fetchProducts(this.pageNumber, this.pageSize);
      } catch (err) {
        console.error("Erro inesperado ao deletar:", err);
      }
    },

    async createProduct(newProduct: ProductInput, imageFile: File) {
      try {
        const formData = new FormData();
        formData.append("title", newProduct.title);
        formData.append("price", newProduct.price.toString());
        formData.append("description", newProduct.description);
        formData.append("barcode", newProduct.barcode || "");
        formData.append("category", newProduct.category || "");
        formData.append("image", imageFile);

        await $fetch("http://localhost:5086/api/Products/register-with-image", {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Erro ao criar produto:", error);
      }
    },

    async updateProduct(
      id: number,
      updatedProduct: ProductInput,
      imageFile: File
    ) {
      try {
        const formData = new FormData();
        formData.append("title", updatedProduct.title);
        formData.append("price", updatedProduct.price.toString());
        formData.append("description", updatedProduct.description);
        formData.append("barcode", updatedProduct.barcode || "");
        formData.append("category", updatedProduct.category || "");
        formData.append("image", imageFile);

        await $fetch(`http://localhost:5086/api/Products/${id}`, {
          method: "PUT",
          body: formData,
        });
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
      }
    },
  },
});
