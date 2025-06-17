<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useProductsStore } from '~/stores/products';
import type { Product, ProductInput } from '~/types/products';
import ConfirmModal from '../Molecules/ConfirmModal.vue';

const store = useProductsStore();
const searchName = ref('');
const searchBarcode = ref('');
const searchType = ref<'name' | 'barcode'>('name');
const searchTerm = ref('');
const showFilterDropdown = ref(false);
const sortField = ref<'id' | 'price'>('id');
const showForm = ref(false);
const modalValidate = ref(false);
const showModalConfirm = ref(false);
const isLoading = ref<boolean>(true)
const formMode = ref<'create' | 'edit'>('create');
const sortAsc = ref(true);
const selectedProductId = ref<number | null>(null);
const currentPage = ref(1);
const pageSize = computed(() => store.pageSize);
const totalPages = computed(() => Math.ceil(store.totalRecords / pageSize.value));


async function applySearch() {
    const name = searchType.value === 'name' ? searchTerm.value : '';
    const barcode = searchType.value === 'barcode' ? searchTerm.value : '';
    await store.fetchProducts(currentPage.value, pageSize.value, name, barcode);
}
const filterOptions = computed(() => [
    { key: 'name', label: 'Buscar por Nome' },
    { key: 'barcode', label: 'Buscar por Código de Barras' },
]);

function selectFilter(type: 'name' | 'barcode') {
    searchType.value = type;
    showFilterDropdown.value = false;
    // Aqui você pode também limpar o searchTerm se quiser
}

const formProduct = ref<ProductInput>({
    title: '',
    price: 0,
    description: '',
    image: new File([], ''),  // Valor inicial vazio
});


onMounted(async () => {
    isLoading.value = true
    await store.initializeProducts(1, pageSize.value);
    isLoading.value = false
});

const produtosFiltrados = computed(() => {
    if (!searchName.value.trim()) return store.products;

    const termo = searchName.value.toLowerCase();

    return store.products.filter(product =>
        product.title.toLowerCase().includes(termo) ||
        product.description.toLowerCase().includes(termo)
    );
});

watch(produtosFiltrados, (newValue) => {
    console.log('Produtos filtrados:', newValue);
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

async function handleSave(payload: { product: ProductInput; imageFile: File },) {
    modalValidate.value = true;
    if (formMode.value === 'create') {
        await store.createProduct(payload.product, payload.imageFile);
    } else if (formMode.value === 'edit' && selectedProductId.value !== null) {
        await store.updateProduct(selectedProductId.value, payload.product, payload.imageFile);
    }
    showForm.value = false;
    setTimeout(() => {
        modalValidate.value = false;
    }, 2000);

    await loadPage(currentPage.value);
}


function openDeleteConfirm(productId: number) {
    selectedProductId.value = productId;
    showModalConfirm.value = true;
}

const handleConfirmationModal = async (result: 'confirm' | 'cancel') => {
    if (result === 'confirm' && selectedProductId.value !== null) {
        await handleDelete(selectedProductId.value);
    }
    showModalConfirm.value = false;
    selectedProductId.value = null;
};

async function handleDelete(productId: number) {
    await store.deleteProduct(productId);
    await loadPage(currentPage.value);
}

const produtosOrdenados = computed(() => {
    const produtos = [...produtosFiltrados.value];

    return produtos.sort((a, b) => {
        const aVal = sortField.value === 'price' ? a.price : a.id;
        const bVal = sortField.value === 'price' ? b.price : b.id;

        return sortAsc.value ? aVal - bVal : bVal - aVal;
    });
});

function toggleSort(field: 'id' | 'price') {
    if (sortField.value === field) {
        sortAsc.value = !sortAsc.value;
    } else {
        sortField.value = field;
        sortAsc.value = true;
    }
}

watch(searchTerm, (newVal) => {
    if (newVal === "") {
        applySearch();
    }
});
</script>


<template>
    <MoleculesConfirmModal v-model="showModalConfirm" title="Deseja remover este produto?"
        subtitle="Você tem certeza que deseja continuar?" @closeConfirm="handleConfirmationModal" />
    <MoleculesActionsProduct :show="showForm" :mode="formMode" :formProduct="formProduct" @close="showForm = false"
        @save="handleSave" />
    <MoleculesModalShortModal v-model="modalValidate" :auto-close="1000">
        <div>
            <div class="flex flex-col justify-centr items-center">
                <NuxtImg src="/img/animationCheck.gif" />
                <span v-if="formMode === 'create'">Produto criado com sucesso!</span>
                <span v-else>Produto editado com sucesso!</span>
            </div>
        </div>
    </MoleculesModalShortModal>


    <div class="p-4 md:p-8 space-y-6">

        <div class="flex flex-col md:flex-row justify-between px-4 md:px-8 space-y-2 md:space-y-0 md:space-x-4">

            <AtomsSearch v-model="searchTerm" :searchType="searchType" @input="applySearch"
                class="!w-full md:!w-[500px] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-75"
                :placeholder="searchType === 'name' ? 'Buscando por nome' : 'Buscando por código de barras'" />

            <!-- Botões - ficam abaixo no mobile, ao lado no desktop -->
            <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">

                <AtomsButton title="Novo Produto" @click="openCreateForm"
                    class="!bg-[#e3604d] hover:!bg-[#c94f3c] h-[30px] !rounded-sm !text-xs cursor-pointer w-full md:w-[100px]" />

                <div class="relative">
                    <AtomsButton title="Filtrar" :filter="true" @click="showFilterDropdown = !showFilterDropdown"
                        class="!bg-[#45936c] hover:!bg-[#367456] h-[30px] !rounded-sm !text-xs cursor-pointer w-full md:w-[100px]" />

                    <div v-if="showFilterDropdown"
                        class="absolute right-0 mt-1 bg-white rounded shadow-md text-sm z-10 w-[180px]">
                        <div v-for="option in filterOptions" :key="option.key"
                            @click="selectFilter(option.key as 'name' | 'barcode')"
                            class="cursor-pointer hover:bg-gray-100 px-3 py-2">
                            {{ option.label }}
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <div v-if="isLoading" class="p-10">
            <AtomsSpinner />
        </div>

        <!-- Cabeçalho da Lista (só aparece no desktop) -->
        <div v-else-if="produtosFiltrados.length > 0" class="p-4 md:p-8 space-y-6">
            <div
                class="hidden md:grid grid-cols-[50px_80px_1fr_120px_200px_150px_150px] bg-[#e5ead4] text-gray-700 font-semibold py-2 px-3 rounded">
                <div @click="toggleSort('id')" class="cursor-pointer select-none">
                    ID {{ sortField === 'id' ? (sortAsc ? '↑' : '↓') : '' }}
                </div>
                <div>Produto</div>
                <div class="md:ml-5">Título</div>
                <div @click="toggleSort('price')" class="cursor-pointer select-none">
                    Preço {{ sortField === 'price' ? (sortAsc ? '↑' : '↓') : '' }}
                </div>
                <div>Descrição</div>
                <div>Código de Barras</div>
                <div class="text-center">Ações</div>
            </div>

            <!-- Lista de Produtos -->
            <div v-for="product in produtosOrdenados" :key="product.id"
                class="rounded-md p-4 bg-white shadow-sm hover:shadow-md transition md:grid md:grid-cols-[50px_80px_1fr_120px_200px_150px_150px] md:items-center">

                <div class="text-sm md:text-center font-semibold text-gray-700">
                    <span class="md:hidden font-bold">ID: </span>{{ product.id }}
                </div>

                <div class="flex justify-center">
                    <img :src="product.image" alt="Imagem Produto"
                        class="w-20 h-20 md:w-16 md:h-16 object-cover rounded shadow-lg" />
                </div>

                <div class="font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis md:ml-5 text-gray-800">
                    <span class="md:hidden font-bold">Título: </span>{{ product.title }}
                </div>

                <div>
                    <span class="md:hidden font-bold ">Preço: </span>R$ {{ product.price.toFixed(2) }}
                </div>

                <div class="truncate text-gray-600 max-w-full md:max-w-[180px]">
                    <span class="md:hidden font-bold">Descrição: </span>{{ product.description }}
                </div>

                <div>
                    <span class="md:hidden font-bold">Código: </span>{{ product.barcode }}
                </div>

                <div class="flex justify-center md:justify-center space-x-2 mt-2 md:mt-0">

                    <AtomsButton title="Editar" @click="openEditForm(product)"
                        class="!bg-[#45936c] hover:!bg-[#367456] text-white px-3 py-1 rounded-sm text-sm shadow w-[100px] cursor-pointer" />
                    <AtomsButton title="Excluir" @click="openDeleteConfirm(product.id)"
                        class="bg-[#e3604d] hover:!bg-[#c94f3c] text-white px-3 py-1 rounded-sm text-sm shadow w-[100px] cursor-pointer" />

                </div>
            </div>

            <!-- Paginação -->
            <div class="flex justify-center space-x-2 mt-4">
                <button v-for="page in totalPages" :key="page" @click="loadPage(page)" :class="[
                    'px-4 py-1 rounded text-sm cursor-pointer',
                    currentPage === page
                        ? 'bg-[#42393b] text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                ]">
                    {{ page }}
                </button>
            </div>

        </div>
        <div v-else>
            <div class="flex flex-col items-center justify-center p-4">
                <div class="text-lg">Nenhum conteudo encontrado</div>
                <div>
                    <NuxtImg src="/img/kanbanlogo.png" class="w-25 h-25" />
                </div>
            </div>
        </div>
    </div>


</template>
