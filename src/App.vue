<template lang="ejs">
  <div id="app">
    <router-view></router-view>
		<!-- 更新可用弹框 -->
		<el-dialog
			:visible.sync="updateAvailableModal"
			title="更新提示"
			width="30%">
			<div
				v-loading="updateDescLoading"
				v-html="updateDesc"></div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="updateAvailableModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					@click="onHandleConfirmDownloadUpdate">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 更新下载进度 -->
		<el-dialog
			title="下载进度"
			:visible.sync="updateDownloadModal"
			width="30%"
      class="download-modal">
			<div class="download-progress-container">
				<el-progress
					type="circle"
					:percentage="downloadPercent"
					status="success"></el-progress>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'app',
	data() {
		return {
			updateDownloadModal: false,
			downloadPercent: 0,
			updateAvailableModal: false,
			updateDescLoading: false,
			updateDesc: ''
		}
	},
	mounted() {
		this.fetchGlobalData()
		this.initElectron()
	},
	beforeDestroy() {
		const ipcRenderer = require('electron').ipcRenderer
		// remove只能移除单个事件，单独封装removeAll移除所有事件
		ipcRenderer.removeAll(['message', 'downloadProgress', 'isUpdateNow'])
	},
	methods: {
		initElectron() {
			if(!process.env.IS_ELECTRON) return

			const ipcRenderer = require('electron').ipcRenderer
			this.listenAppUpdateEvent()

			ipcRenderer.send('checkForUpdate')
			ipcRenderer.on('update-available', async () => {
				this.updateAvailableModal = true

				// 获取更新描述信息
				this.updateDescLoading = true

				try {
					const result = await this.$service.commonService.getUpdateDesc()
					if(result) {
						const { version, description } = result
						this.updateDesc = `
							<h3 style="font-size: 18px;">新版本：${version}</h3>
							<ul>${description.map(item => `<li>${item}</li>`)}</ul>
						`
					}
				}catch(error) {
					this.$message.error(error)
				}finally {
					this.updateDescLoading = false
				}
			})
		},
		listenAppUpdateEvent() {
			const ipcRenderer = require('electron').ipcRenderer

			ipcRenderer.on('message', (event, text) => {
				this.notifyInstance && this.notifyInstance.close()
				this.notifyInstance = this.$notify({
					title: '提示',
          message: text,
          type: 'warning'
				})
			})

			//注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
			ipcRenderer.on('downloadProgress', (event, progressObj) => {
        console.log(progressObj)
				const downloadPercent = Math.trunc(progressObj.percent) || 0
				if(downloadPercent < 100) {
					if(!this.updateDownloadModal) {
						this.updateDownloadModal = true
					}
				}else {
					this.updateDownloadModal = false
				}

				this.downloadPercent = downloadPercent
			})

			ipcRenderer.on('isUpdateNow', () => {
				ipcRenderer.send('isUpdateNow')
			})

			ipcRenderer.on('error', () => {
				this.downloadPercent = 0
				this.updateDownloadModal = false
			})
		},
		onHandleConfirmDownloadUpdate() {
			const ipcRenderer = require('electron').ipcRenderer
			ipcRenderer.send('downloadUpdate')
		},
		...mapActions(['fetchGlobalData'])
	},
}
</script>

<style lang="stylus">
@import '~@/assets/styles/index.styl';

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height 100%
</style>

<style lang="stylus" scoped>
.download-modal
  & >>> .el-dialog__close
    font-size 30px

  .download-progress-container
    text-align center

		& >>> .el-icon-check
			font-size 30px
</style>
