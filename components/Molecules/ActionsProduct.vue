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

function limitBarcodeLength(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.value.length > 9) {
    target.value = target.value.slice(0, 9);
    props.formProduct.barcode = Number(target.value);
  }
}
function limitPriceLength(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.value.length > 5) {
    target.value = target.value.slice(0, 5);
    props.formProduct.price = Number(target.value);
  }
}
</script>

<template>
  <MoleculesModal v-model="props.show" @close="handleClose">
    <div class="bg- rounded shadow w-full max-w-md ">
      <div class="w-full bg-[#42393b]">
        <h2 class="text-2xl font-bold text-white px-6 p-4">
          {{ mode === 'create' ? 'Cadastrar Produto' : 'Editar Produto' }}
        </h2>
      </div>

      <!-- Título -->
      <div class="p-6 space-y-5">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Título:</label>
          <input v-model="props.formProduct.title" maxlength="50" type="text"
            class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400" />
          <p class="text-xs text-gray-500">Restam {{ 50 - (props.formProduct.title?.length || 0) }} caracteres.</p>
          <p v-if="fieldErrors.title" class="text-red-500 text-xs">{{ fieldErrors.title }}</p>
        </div>

        <!-- Preço -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Preço (até 5 dígitos):</label>
          <input v-model.number="props.formProduct.price" type="number" @input="limitPriceLength"
            class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400" />
          <p v-if="fieldErrors.price" class="text-red-500 text-xs">{{ fieldErrors.price }}</p>
        </div>

        <!-- Descrição -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Descrição:</label>
          <textarea v-model="props.formProduct.description" maxlength="500"
            class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400"></textarea>
          <p class="text-xs text-gray-500">Restam {{ 500 - (props.formProduct.description?.length || 0) }} caracteres.
          </p>
          <p v-if="fieldErrors.description" class="text-red-500 text-xs">{{ fieldErrors.description }}</p>
        </div>

        <!-- Código de Barras -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Código de Barras:</label>
          <input v-model.number="props.formProduct.barcode" type="number" @input="limitBarcodeLength"
            class="border border-gray-300 p-2 w-full rounded" />
        </div>

        <!-- Categoria -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Categoria:</label>
          <input v-model="props.formProduct.category"
            class="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-0 hover:border-gray-400" />
        </div>

        <!-- Imagem -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Imagem:</label>
          <label for="imageUpload"
            class="inline-block cursor-pointer bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded shadow transition">
            Escolher Imagem
          </label>
          <input id="imageUpload" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
          <p v-if="fieldErrors.image" class="text-red-500 text-xs">{{ fieldErrors.image }}</p>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button @click="handleClose"
            class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer">
            Cancelar
          </button>
          <button @click="handleSave"
            class="px-4 py-2 bg-[#45936c] text-white rounded hover:!bg-[#367456] shadow cursor-pointer">
            Salvar
          </button>
        </div>
      </div>
    </div>
  </MoleculesModal>
</template>