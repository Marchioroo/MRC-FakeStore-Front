<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useProductsStore } from '~/stores/products';
import type { Product, ProductInput } from '~/types/products';
import ConfirmModal from '../Molecules/ConfirmModal.vue';

const store = useProductsStore();
console.log('Store:', store.products);

const showForm = ref(false);
const modalValidate = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const formProduct = ref<ProductInput>({
    title: '',
    price: 0,
    description: '',
    image: new File([], ''),  // Valor inicial vazio
});
const selectedProductId = ref<number | null>(null);

const currentPage = ref(1);
const pageSize = computed(() => store.pageSize);
const totalPages = computed(() => Math.ceil(store.totalRecords / pageSize.value));
const produtos = computed(() => store.products);

onMounted(async () => {
    await store.initializeProducts(1, pageSize.value);
});

async function loadPage(page: number) {
    currentPage.value = page;
    await store.fetchProducts(page, pageSize.value);
}

// Abrir formulário para criar novo produto
function openCreateForm() {
    formMode.value = 'create';
    formProduct.value = { title: '', price: 0, description: '' };
    showForm.value = true;
}

// Abrir formulário para editar produto existente
function openEditForm(product: Product) {
    formMode.value = 'edit';
    selectedProductId.value = product.id;
    formProduct.value = {
        title: product.title,
        price: product.price,
        description: product.description,
        barcode: product.barcode,
        category: product.category
    };
    showForm.value = true;
}

async function handleSave(payload: { product: ProductInput; imageFile: File }) {
    modalValidate.value = true;
    if (formMode.value === 'create') {
        await store.createProduct(payload.product, payload.imageFile);
    } else if (formMode.value === 'edit' && selectedProductId.value !== null) {
        await store.updateProduct(selectedProductId.value, payload.product, payload.imageFile);
    }
    setTimeout(() => {
        modalValidate.value = false;
        showForm.value = false;
    }, 2000);


    await loadPage(currentPage.value);
}


// Excluir produto
async function handleDelete(productId: number) {
    if (confirm('Confirma exclusão?')) {
        await store.deleteProduct(productId);
        await loadPage(currentPage.value);
    }
}
</script>


<template>
    <MoleculesActionsProduct :show="showForm" :mode="formMode" :formProduct="formProduct" @close="showForm = false"
        @save="handleSave" />
    <MoleculesModalShortModal v-model="modalValidate" :auto-close="1000">
        <div>
            <div class="flex flex-col justify-centr items-center">
                <NuxtImg src="/img/animationCheck.gif" />
                <span>Produto criado com sucesso!</span>
            </div>
        </div>
    </MoleculesModalShortModal>

    <div class="p-4 md:p-8 space-y-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📦 Gerenciamento de Produtos</h1>

        <!-- Botão Novo Produto -->
        <div>
            <button @click="openCreateForm"
                class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow transition">
                + Novo Produto
            </button>
        </div>

        <!-- Cabeçalho da Lista (só aparece no desktop) -->
        <div
            class="hidden md:grid grid-cols-[50px_80px_1fr_120px_200px_150px_150px] bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded">
            <div>ID</div>
            <div>Imagem</div>
            <div>Título</div>
            <div>Preço</div>
            <div>Descrição</div>
            <div>Código de Barras</div>
            <div class="text-center">Ações</div>
        </div>

        <!-- Lista de Produtos -->
        <div v-for="product in produtos" :key="product.id"
            class="rounded-md p-3 bg-white shadow-sm hover:shadow-md transition md:grid md:grid-cols-[50px_80px_1fr_120px_200px_150px_150px] md:items-center">

            <!-- ID -->
            <div class="text-sm md:text-center font-semibold text-gray-700">
                <span class="md:hidden font-bold">ID: </span>{{ product.id }}
            </div>

            <!-- Imagem -->
            <div class="flex justify-center">
                <img :src="product.image" alt="Imagem Produto"
                    class="w-16 h-16 object-cover rounded border shadow-sm" />
            </div>

            <!-- Título -->
            <div class="font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis text-gray-800">
                <span class="md:hidden font-bold">Título: </span>{{ product.title }}
            </div>

            <!-- Preço -->
            <div>
                <span class="md:hidden font-bold">Preço: </span>R$ {{ product.price.toFixed(2) }}
            </div>

            <!-- Descrição -->
            <div class="truncate text-gray-600 max-w-full md:max-w-[180px]">
                <span class="md:hidden font-bold">Descrição: </span>{{ product.description }}
            </div>

            <!-- Código de Barras -->
            <div>
                <span class="md:hidden font-bold">Código: </span>{{ product.barcode }}
            </div>

            <!-- Ações -->
            <div class="flex justify-center md:justify-center space-x-2 mt-2 md:mt-0">
                <button @click="openEditForm(product)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow">
                    Editar
                </button>
                <button @click="handleDelete(product.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shadow">
                    Excluir
                </button>
            </div>
        </div>

        <!-- Paginação -->
        <div class="flex justify-center space-x-2 mt-4">
            <button v-for="page in totalPages" :key="page" @click="loadPage(page)" :class="[
                'px-4 py-1 rounded text-sm',
                currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            ]">
                {{ page }}
            </button>
        </div>



    </div>
</template>
