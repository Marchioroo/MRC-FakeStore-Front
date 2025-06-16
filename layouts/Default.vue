<template>
    <div class="relative w-full min-h-screen flex flex-col bg-[#F5F7F7]">
        <div class="flex-grow card">
            <NuxtPage />
        </div>

        <div class="w-full">
            <OrganismsFooter />
        </div>
    </div>
</template>
<style>
.card {
    background-color: #ffffff;
    opacity: 0.9;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='20'><path d='M 0 10 Q 25 0, 50 10 T 100 10' stroke='%23e6bbce' fill='none' stroke-width='2' opacity='0.15'/></svg>");
    background-repeat: repeat;
    background-size: 20px 5px;
    border-radius: 8px;
    z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
