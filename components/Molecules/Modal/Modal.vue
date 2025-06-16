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
                class="bg-white rounded-2xl md:rounded-2xl px-4 py-3 md:p-6 w-full md:min-w-[450px] h-auto md:h-auto md:max-w-md shadow-lg transform transition-all overflow-y-auto relative">
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
</style>
