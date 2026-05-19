<template lang="pug">
nav.flex.mb-6
	.flex.rounded-lg.overflow-hidden.border.border-gray-300
		NuxtLink(
			to="/"
			:class="[$route.path === '/' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100', 'px-4 py-2 text-sm font-medium transition-colors']"
		) Running
		NuxtLink(
			to="/lifting"
			:class="[$route.path === '/lifting' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100', 'px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300']"
		) Lifting
</template>
