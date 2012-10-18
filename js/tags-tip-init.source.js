/**
 * 万戈牌 WordPress 搜索自动匹配提示关键词
 * @author 万戈
**/
$(function() {
	var wangeTagsTip = function() {
		var searEl = $('input[name="s"]').eq(0),	// 搜索输入框
			allowRequest = true,					// 允许发送请求
			scriptUrl = wangeTagsTipConfig.pluginUrl + 'js/tags-tip.js';			// 异步载入 tags-tip.js
		
		searEl
		.attr('autocomplete', 'off')		// 关闭默认的输入框提示
		.bind('focus', function() {			// 绑定 focus 事件
			if (allowRequest) {
				$.ajax({
					url: scriptUrl,
					dataType: 'script',
					complete: function() {
						allowRequest = false;			// 请求成功后阻止再次请求
					}
				});
			}
		});
	};
	
	wangeTagsTip();
});