<template>
	<div class="container">
		<el-breadcrumb
			v-if="breadList.length > 0"
			separator-class="el-icon-arrow-right">
			<transition-group name="breadcrumb" appear>
				<template v-for="(item, index) in breadList">
					<el-breadcrumb-item
						v-if="index < breadList.length - 1"
						class="bread-item-container"
						:key="item.path"
						:to="{ path: item.path }">
						{{ item.name }}
						<i
							v-if="breadList.length === 1"
							:key="item.path"
							class="el-icon-arrow-right"></i>
					</el-breadcrumb-item>
					<el-breadcrumb-item
						v-else
						class="bread-item-container"
						:key="item.path">
						{{ item.name }}
						<i
							v-if="breadList.length === 1"
							:key="item.path"
							class="el-icon-arrow-right"></i>
					</el-breadcrumb-item>
				</template>
			</transition-group>
		</el-breadcrumb>
		<router-view></router-view>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'Permission',
	computed: {
		...mapGetters({
			breadList: 'breadListGetter'
		})
	},
	beforeDestroy() {
		this.setBread([])
	},
	methods: {
		...mapActions(['setBread'])
	},
}
</script>

<style lang="stylus" scoped>
	.container
		display flex
		flex-direction column
		height 100%
		padding 20px

		.bread-item-container
			& >>> .el-breadcrumb__inner
				font-size 16px
</style>
