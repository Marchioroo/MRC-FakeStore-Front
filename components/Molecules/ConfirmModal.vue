<script setup lang="ts">

const props = defineProps({
    showModalConfirm: {
        type: Boolean
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    }
})


const emit = defineEmits<{
    (e: 'closeConfirm', result: 'confirm' | 'cancel'): void;
}>();

const closeModal = (val: 'Confirm' | 'Cancel') => {
    if (val === 'Confirm') {
        emit('closeConfirm', 'confirm');
    } else {
        emit('closeConfirm', 'cancel');
    }
};
</script>

<template>
    <MoleculesModalShortModal>
        <div class="w-full items-center text-lg flex flex-col mb-5">
            <div>{{ props.title }}</div>
        </div>

        <div class="flex flex-row gap-2 w-full items-center justify-center">
            <AtomsButton title="Confirmar" class="cursor-pointer text-xs !bg-green-500 hover:!bg-green-600"
                @click="closeModal('Confirm')" />
            <AtomsButton title="Cancelar" class="cursor-pointer text-xs !bg-red-500 hover:!bg-red-600"
                @click="closeModal('Cancel')" />
        </div>
    </MoleculesModalShortModal>

</template>