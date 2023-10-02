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
        <div>
          <!-- keys go here -->
        </div>
        <template #footer>
          <div class="flex items-end justify-end">
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="props.onClose">
              Close</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>