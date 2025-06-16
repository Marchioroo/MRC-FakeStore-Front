<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
    <footer class="bg-[#42393b] text-white py-6">
        <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p class="text-sm">&copy; {{ year }} Marchioro FakeStore. Todos os direitos reservados.</p>

            <div class="flex space-x-4 mt-4 md:mt-0">
                <a href="#" class="hover:underline">Instagram</a>
                <a href="#" class="hover:underline">WhatsApp</a>
                <a href="#" class="hover:underline">E-mail</a>
            </div>
        </div>
    </footer>
</template>
