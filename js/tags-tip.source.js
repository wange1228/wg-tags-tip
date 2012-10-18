$(function() {
	var wangeTagsTipRun = (function() {
		/**
		 * 全局配置
		**/
		var config = {
			tags: [],			// 标签
			searEl: $('input[name="s"]').eq(0),			// 搜索 input 元素
			formEl: $('input[name="s"]').eq(0).parents('form').eq(0),		// 表单元素
			wrapEl: null,		// 提示层元素
			wrapperId: 'wange_tag_wrapper',
			currentClass: 'wange_tag_cur',
			ajaxUrl: wangeTagsTipConfig.blogUrl + '/?action=tag_cloud'		// 异步请求地址
		};
		
		/**
		 * 设置外层元素样式
		 * @return config.wrapEl {Element} 返回外层元素
		**/
		var setStyle = function() {
			var wrapEl = config.wrapEl,
				searEl = config.searEl;
			wrapEl.css({
				width: searEl.outerWidth(),
				top: searEl.offset().top + searEl.outerHeight(),
				left: searEl.offset().left
			});
			
			return config.wrapEl;
			
		};

		/**
		 * 生成提示的 HTML 结构
		 * @param data {Array} 标签数据
		 * @return config.wrapEl {Element} 返回外层元素
		**/
		var buildTips = function(data) {
			var dataArrLen = data.length,
				dataLi = '';
				
			for (var i = 0; i < dataArrLen; i++) {
				dataLi += '<li>' + data[i] + '</li>';
			}
			
			
			$('ul', config.wrapEl).replaceWith('<ul>' + dataLi + '</ul>');
			
			
			return config.wrapEl;
		};
		
		/**
		 * 匹配标签
		**/
		var matchTags = function() {
			var searEl = config.searEl,
				formEl = config.formEl,
				wrapEl = config.wrapEl,
				currentClass = config.currentClass,
				wrapperId = config.wrapperId,
				tagsArr = config.tags,
				tagsArrLen = tagsArr.length,
				goIndex = -1;
				
			searEl.keyup(function(ev) {
				var _this = $(this),
					searVal = $.trim(_this.val()),							// 当前输入的字符串
					matchedTags = [],										// 清空匹配数据项
					maxMatchedTagsIndex = 0,								// 匹配标签的最大索引值
					keyCode = ev.keyCode;									// 按键
				
				
				if (searVal != '') {	// 当有内容输入的时候才执行
					// 生成结构并显示
					for (var i = 0; i < tagsArrLen; i++) {
						if (tagsArr[i].toLowerCase().indexOf(searVal.toLowerCase()) != -1) {
							matchedTags.push(tagsArr[i]);
						}
					}
					maxMatchedTagsIndex = matchedTags.length - 1;
					buildTips(matchedTags).show();
					
					
					switch(keyCode) {
						case 40:	// 按下
							goIndex++;
							if (goIndex > maxMatchedTagsIndex) {
								goIndex = 0;
							}
							$('li', wrapEl).eq(goIndex).addClass(currentClass).siblings().removeClass(currentClass);
						break;
						
						case 38:	// 按上
							goIndex--;
							if (goIndex < 0) {
								goIndex = maxMatchedTagsIndex;
							}
							$('li', wrapEl).eq(goIndex).addClass(currentClass).siblings().removeClass(currentClass);
						break;
						
						case 13:	// 按回车键
							wrapEl.hide();
						break;
					}
				} else {	// 当输入内容为空的时候才执行
					wrapEl.hide();
				}
					
			});
			
			searEl.keypress(function(ev) {
				var _this = $(this),
					keyCode = ev.keyCode,									// 按键
					curTagEl = $('.' + currentClass, wrapEl);
				
				switch(keyCode) {
					case 13:	// 按回车
						if (curTagEl.length != 0) {
							ev.preventDefault();
							searEl.val(curTagEl.html());
							curTagEl.removeClass(currentClass);
						}
					break;
				}
	
			});
			
			$('li', wrapEl).live('mouseover', function() {
				$(this).addClass(currentClass).siblings().removeClass(currentClass);
			});
			
			$('li', wrapEl).live('click', function() {
				var _this = $(this);
				searEl.val(_this.html());
				_this.removeClass(currentClass);
				wrapEl.hide();
			});
		};
		
		
		/**
		 * 异步请求所有标签
		**/
		var ajaxTags = function() {
			$.ajax({
				url: config.ajaxUrl + '&number=0',
				dataType: 'html',
				complete: function(data) {
					// 把字符串分割成标签数据
					config.tags = data.responseText.split(',');
					
					// 插入结构
					$('body').append('<div id="' + config.wrapperId + '"><ul></ul></div>');
					// 设定外层元素
					config.wrapEl = $('#' + config.wrapperId);
					buildTips(config.tags);
					
					// 设置样式
					setStyle();
					
					// 匹配标签
					matchTags();
				}
			});
		};
		
		return {
			init: function() {
				ajaxTags();
			}
		}
	})();
	
	wangeTagsTipRun.init();
});