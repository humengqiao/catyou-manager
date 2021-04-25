// 登录页主题特效
export const loginBgEffectComponent = {
	1: '',
  // 1: 'flyStart',
  2: ''
}

// 注册css houdini属性
export const loginBtnLinearGradientCssHoudiniPropertyList = [
	{
		key: 'loginBtn-1-start',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#ff9569'
	},
	{
		key: 'loginBtn-1-end',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#e92758'
	},
	{
		key: 'loginBtn-2-start',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#78b5e3'
	},
	{
		key: 'loginBtn-2-end',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#164488'
	},
	{
		key: 'loginBtn-3-start',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#FAFAD2'
	},
	{
		key: 'loginBtn-3-end',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#FF8C00'
	},
	{
		key: 'loginBtn-4-start',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#FF69B4'
	},
	{
		key: 'loginBtn-4-end',
		syntax: '<color>',
		inherits: false,
		'initial-value': '#8B008B'
	}
]

// 登录页按钮过渡效果
export const loginBtnLinearGradient = (direction, startThreshold, endThreshold) => {
	return {
		1: `linear-gradient(to ${direction}, var(--loginBtn-start) ${startThreshold}, var(--loginBtn-end) ${endThreshold})`,
		2: `linear-gradient(to ${direction}, var(--loginBtn-start) ${startThreshold}, var(--loginBtn-end) ${endThreshold})`,
		3: `linear-gradient(to ${direction}, var(--loginBtn-start) ${startThreshold}, var(--loginBtn-end) ${endThreshold})`,
		4: `linear-gradient(to ${direction}, var(--loginBtn-start) ${startThreshold}, var(--loginBtn-end) ${endThreshold})`
	}
}
