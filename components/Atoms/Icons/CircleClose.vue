<script setup>
const props = defineProps({
    postModal: {
        type: Boolean,
        required: false,
        default: false,
    },
    color: {
        type: String,
        required: false,
        default: '#333333', // Preto como cor padrão
    }
});
</script>

<template>
    <svg width="40" height="40" viewBox="0 0 40 40" :fill="props.postModal ? '#fff' : 'none'"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0.5 20C0.5 9.23045 9.23045 0.5 20 0.5C30.7696 0.5 39.5 9.23045 39.5 20C39.5 30.7696 30.7696 39.5 20 39.5C9.23045 39.5 0.5 30.7696 0.5 20Z"
            :stroke="props.color" />
        <path d="M14 26L26 14" stroke="#0F0A14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M26 26L14 14" stroke="#0F0A14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>
