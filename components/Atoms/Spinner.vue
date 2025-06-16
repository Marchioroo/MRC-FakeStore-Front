<script setup lang="ts">
const props = defineProps({
    color: {
        type: String,
        required: false,
        default: "#f9a8d4"
    }
})
</script>

<template>
    <div class="flex justify-center items-center">
        <svg class="animate-spin h-8 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path :fill="props.color" d="M25 5a20 20 0 1 0 20 20h-5a15 15 0 1 1 -15-15V5z" />
        </svg>
    </div>

</template>
