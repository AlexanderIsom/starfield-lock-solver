<script setup lang ="ts">
const props = defineProps<{
	isOpen: boolean;
	messages: Array<string>;
	onClose: () => void;
}>();
</script>
<template>
	<div>
		<UModal v-model="props.isOpen" prevent-close>
			<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
				<template #header>
					<div class="flex items-end justify-center">
						Invalid Config
					</div>
				</template>
				<div v-for="(message, index) in messages" :key="index">
					<UIcon name="i-material-symbols-warning-outline-rounded" class="text-rose-600" />
					{{ message }}
				</div>
				<template #footer>
					<div class="flex items-end justify-end">
						<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
							@click="props.onClose">
							Close</UButton>
					</div>
				</template>
			</UCard>
		</UModal>
	</div>
</template>