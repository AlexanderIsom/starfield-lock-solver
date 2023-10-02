<script setup lang ="ts">
import Key from '~/components/Key';
import { finalKey } from '~/util/solve';

const props = defineProps<{
  isOpen: boolean;
  solution: Array<finalKey> | undefined
  onClose: () => void;
}>();
</script>
<template>
  <UModal v-model="props.isOpen" prevent-close :ui="{ body: { base: 'w-full' } }">
    <div>hello</div>
    <!-- <UCard>
      <template #header>
        <div class="flex items-end justify-center">
          Solution
        </div>
      </template>
      <div class="flex justify-center gap-10 flex-wrap">
        <div v-for=" key  in  solution " class="text-center">
          turn key {{ key.key.getIndex() + 1 }} {{ key.offset
            < 0 ? "left" : "right" }} {{ Math.abs(key.offset) }} times <Key class="mt-4" :index="key.key.getIndex()"
            :offset="key.offset" :clickable="false" :ignoreStyle="true" />
        </div>
      </div>
      <template #footer>
        <div class="flex items-end justify-end">
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="props.onClose">
            Close</UButton>
        </div>
      </template>
    </UCard> -->
  </UModal>
</template>