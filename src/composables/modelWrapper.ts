import { computed, WritableComputedRef } from 'vue';
export default function useModelWrapper<T>(props: any, emit: any, name = 'modelValue'): WritableComputedRef<T> {
	return computed({
		get: () => props[name],
		set: (value) => emit(`update:${name}`, value),
	});
}
