<script setup lang="ts">
const model = defineModel<boolean>()
const emit = defineEmits<{ (e: 'closeModalClickOut', value: boolean): void }>()

const closeModal = () => {
    model.value = false
    emit('closeModalClickOut', model.value = false)
}
</script>
<template>
    <transition name="slide-fade">
        <div v-if="model" class="fixed inset-0 bg-gray-200  flex items-center justify-center z-50 p-2"
            @click.self="closeModal()">

            <div
                class="bg-white rounded-2xl md:rounded-2xl px-4 py-3 md:p-6 w-full md:min-w-[350px] h-auto md:h-auto md:max-w-md shadow-lg transform transition-all overflow-y-auto relative">
                <slot />
            </div>
        </div>
    </transition>
</template>


<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.4s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(50px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(50px);
}

/* .card {
    background-color: #ffffff;
    opacity: 0.9;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='20'><path d='M 0 10 Q 25 0, 50 10 T 100 10' stroke='%23e6bbce' fill='none' stroke-width='2'/></svg>");
    background-repeat: repeat;
    background-size: 20px 5px;
    padding: 20px;
    border-radius: 8px;
    z-index: 10;
} */
</style>
