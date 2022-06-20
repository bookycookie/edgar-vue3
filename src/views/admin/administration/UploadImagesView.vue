<script setup lang="ts">
import { ref } from 'vue';

const image = ref();

const save = (formData: any) => {
	console.log('Uploaded');
};
const filesChange = () => {
	console.log('selected file', image.value.files);
};
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Upload images</template>
			<template #content>
				<div class="row ms-5">
					<ul>
						<li>
							Filenames MUST be in the format:
							<code>&lt;alt_id2&gt;.jpg</code>
							, eg.
							<code>0012345678.jpg</code>
						</li>
						<li>(existing files with the same name will be overwritten)</li>
						<li>No more than 100 files at a time.</li>
					</ul>
				</div>

				<form enctype="multipart/form-data" novalidate>
					<div class="dropbox">
						<input
							ref="image"
							type="file"
							multiple
							accept="image/*"
							class="input-file"
							@change="filesChange" />
					</div>
				</form>
			</template>
		</Card>
	</div>
</template>
