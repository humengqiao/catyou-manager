import { updateDescUrl } from '@config/app-update'
import axios from 'axios'

// 获取更新描述
export const getUpdateDesc = () => {
	return axios
		.get(updateDescUrl)
		.then(result => result.data)
}
