<?php
/*
Plugin Name: 万戈牌 WordPress 搜索自动匹配提示标签关键词
Plugin URI: http://wange.im/wg-tags-tip.html
Description: 麻麻说了，插件名字越长越霸气，不求好用，但求霸气！
Version: 1.0
Author: 万戈
Author URI: http://wange.im
License: GPL
*/

function wange_tag_cloud() {
	if ( isset($_GET['action']) && $_GET['action'] == 'tag_cloud') {
		$number = $_GET['number'];
		$cloud_array = wp_tag_cloud('number=' . $number . '&format=array&echo=false&orderby=count&order=DESC');
		if ($cloud_array) {
			$cloud_string = implode(',', $cloud_array);
			$str = preg_replace('/<a [^>]*>|<\/a>/','',$cloud_string);
		}
		echo $str;
		die();
	} else {
		return;
	}
}
add_action('init', 'wange_tag_cloud');

//脚本和样式
add_action('wp_head', 'tagstip_js_css');
function tagstip_js_css() {
	$tagstipStyleUrl = WP_PLUGIN_URL . '/wg-tags-tip/style.css';
	wp_register_style('tagstipStyleSheet', $tagstipStyleUrl);
	wp_print_styles( 'tagstipStyleSheet');

	wp_deregister_script( 'jquery' );
	wp_register_script('jquery', plugins_url('js/jquery.js', __FILE__), '', '1.7.1', 0 );
	wp_print_scripts( 'jquery' );
	
	wp_register_script('tags-tip-init', plugins_url('js/tags-tip-init.js', __FILE__), '', '1.0', 0 );
	wp_print_scripts( 'tags-tip-init' );
	?>
	<script type="text/javascript">
        var wangeTagsTipConfig = {
            pluginUrl: '<?php echo WP_PLUGIN_URL . "/wg-tags-tip/" ;?>',
            blogUrl: '<?php echo get_bloginfo("url") ?>'
        };
	</script>
<?php }
?>