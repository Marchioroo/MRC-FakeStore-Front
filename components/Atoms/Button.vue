<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
        default: 'Me clica ai',
    },
    filter: {
        type: Boolean,
        required: false,
    },
    isLoading: {
        type: Boolean,
        required: false,
    },
    isDisabled: {
        type: Boolean,
        required: false,
    },
});
</script>

<template>
    <button :disabled="props.isDisabled || props.isLoading" :class="[
        'w-[90px] h-[35px] text-white rounded-lg transition-all outline-none flex items-center justify-center', props.isDisabled || props.isLoading
            ? 'bg-gray-400 cursor-not-allowed opacity-50'
            : 'bg-[#515763] hover:bg-[#5d697c]'
    ]">
        <div v-if="props.filter">
            <AtomsIconsFilter class="w-4 h-4 hidden md:inline-block mr-1 " />
        </div>

        <template v-if="props.isLoading">
            <AtomsSpinner class="!w-5" color="#fff" />
        </template>
        <template v-else>
            {{ props.title }}
        </template>
    </button>
</template>
