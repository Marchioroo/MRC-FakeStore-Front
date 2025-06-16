<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
    modelValue: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const searchTerm = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    searchTerm.value = newVal;
});

function updateValue(event: Event) {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
}

function limparCampo() {
    searchTerm.value = "";
    emit("update:modelValue", "");
}
</script>

<template>
    <div>
        <div class="relative flex items-center w-full px-2">
            <input type="text" :value="searchTerm" :placeholder="props.placeholder || 'Buscar...'" @input="updateValue"
                class="rounded-md block w-full border border-gray-200 px-4 py-2.5 pr-10 shadow-md bg-white" />

            <AtomsIconsSearch v-if="searchTerm === ''"
                class="absolute right-5 h-5 w-5 text-gray-400 pointer-events-none" />
            <AtomsIconsCircleClose v-else @click="limparCampo"
                class="absolute right-5 h-5 w-5 text-gray-400 cursor-pointer" />
        </div>
    </div>
</template>
