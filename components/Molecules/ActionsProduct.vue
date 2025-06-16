<script setup lang="ts">
import type { Product, ProductInput } from '~/types/products';
import { ref } from 'vue';

const props = defineProps<{
  show: boolean;
  mode: 'create' | 'edit';
  formProduct: ProductInput;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: { product: ProductInput; imageFile: File }): void;
}>();

const imageFile = ref<File | null>(null);

// Erros individuais
const fieldErrors = ref<{
  title?: string;
  description?: string;
  price?: string;
  image?: string;
}>({});

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0];
  } else {
    imageFile.value = null;
  }
}

function validateForm() {
  fieldErrors.value = {};

  if (!props.formProduct.title || props.formProduct.title.length < 3) {
    fieldErrors.value.title = 'O título deve ter pelo menos 3 caracteres.';
  }

  if (!props.formProduct.description || props.formProduct.description.length < 5) {
    fieldErrors.value.description = 'A descrição deve ter pelo menos 5 caracteres.';
  }

  if (!props.formProduct.price || props.formProduct.price <= 0) {
    fieldErrors.value.price = 'O preço deve ser maior que zero.';
  }

  if (!imageFile.value && props.mode === 'create') {
    fieldErrors.value.image = 'A imagem é obrigatória.';
  }

  return Object.keys(fieldErrors.value).length === 0;
}

function handleClose() {
  emit('close');
}

function handleSave() {
  if (validateForm()) {
    emit('save', { product: props.formProduct, imageFile: imageFile.value ? imageFile.value : new File([], '') });
  }
}
</script>

<template>
  <MoleculesModal v-model="props.show" @close="handleClose">
    <div class="bg-white p-6 rounded shadow w-full max-w-md space-y-5">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ mode === 'create' ? 'Cadastrar Produto' : 'Editar Produto' }}
      </h2>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Título:</label>
        <input v-model="props.formProduct.title"
          class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400" />
        <p v-if="fieldErrors.title" class="text-red-500 text-xs">{{ fieldErrors.title }}</p>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Preço:</label>
        <input v-model.number="props.formProduct.price" type="number"
          class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400" />
        <p v-if="fieldErrors.price" class="text-red-500 text-xs">{{ fieldErrors.price }}</p>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Descrição:</label>
        <textarea v-model="props.formProduct.description"
          class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400"></textarea>
        <p v-if="fieldErrors.description" class="text-red-500 text-xs">{{ fieldErrors.description }}</p>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Código de Barras:</label>
        <input v-model="props.formProduct.barcode"
          class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400" />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Categoria:</label>
        <input v-model="props.formProduct.category"
          class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400" />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Imagem:</label>
        <input type="file" accept="image/*" @change="handleFileChange"
          class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:bg-gray-100 hover:file:bg-gray-200 focus:outline-none" />
        <p v-if="fieldErrors.image" class="text-red-500 text-xs">{{ fieldErrors.image }}</p>
      </div>

      <div class="flex justify-end space-x-2 pt-4">
        <button @click="handleClose" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
          Cancelar
        </button>
        <button @click="handleSave" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow">
          Salvar
        </button>
      </div>
    </div>
  </MoleculesModal>
</template>
