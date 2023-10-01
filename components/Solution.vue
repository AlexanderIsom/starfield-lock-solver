<script setup lang ="ts">
const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
}>();
</script>
<template>
  <div>
    <UModal v-model="props.isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Modal
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="props.onClose" />
          </div>
        </template>
        <div>
          
        </div>
      </UCard>
    </UModal>
  </div>
</template>