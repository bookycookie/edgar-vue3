<template>
	<div class="custom-skeleton p-4">
		<div class="flex mb-3">
			<Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
			<div>
				<Skeleton width="10rem" class="mb-2"></Skeleton>
				<Skeleton width="5rem" class="mb-2"></Skeleton>
				<Skeleton height=".5rem"></Skeleton>
			</div>
		</div>
		<Skeleton width="100%" height="150px"></Skeleton>
		<div class="flex justify-content-center mt-3">
			<Skeleton width="4rem" height="2rem"></Skeleton>
			<Skeleton width="4rem" height="2rem"></Skeleton>
		</div>
	</div>
	<div class="custom-skeleton p-4">
		<ul class="m-0 p-0">
			<div class="flex">
				<Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
				<div style="flex: 1">
					<Skeleton width="100%" class="mb-2"></Skeleton>
					<Skeleton width="75%"></Skeleton>
				</div>
			</div>
			<br />
			<div class="flex">
				<Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
				<div style="flex: 1">
					<Skeleton width="100%" class="mb-2"></Skeleton>
					<Skeleton width="75%"></Skeleton>
				</div>
			</div>
			<br />
			<div class="flex">
				<Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
				<div style="flex: 1">
					<Skeleton width="100%" class="mb-2"></Skeleton>
					<Skeleton width="75%"></Skeleton>
				</div>
			</div>
			<br />
			<div class="flex">
				<Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
				<div style="flex: 1">
					<Skeleton width="100%" class="mb-2"></Skeleton>
					<Skeleton width="75%"></Skeleton>
				</div>
			</div>
		</ul>
	</div>
</template>
