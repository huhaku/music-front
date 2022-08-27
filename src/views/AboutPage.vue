<template>
	<div class="about-page">
	  <div class="about-box">
	    <div class="aboutItem">
	      <div>作者：</div>
	      <div>千与琥珀</div>
	    </div>
	    <div class="thanks">
	      <div>致谢：</div>
	      <div class="thanksItem">
	        <div class="Link">Vue.js</div>
	        <div class="Link">DCloud</div>
	        <div class="Link">Element</div>
	        <div class="Link">node-music-api</div>
			<div class="Link">凤舞九天 / 迷你音乐移动版</div>
	      </div>
	    </div>
	  </div>
	</div>
</template>

<script>
	export default {
		name: 'about-page',
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.about-page {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.about-box {
	  padding: 15px;
	}
	
	.aboutItem {
	  margin-top: 5px;
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  font-size: 16px;
	}
	
	.programDescription {
	  border: 1px solid #c5b5f0;
	  padding: 8px;
	  border-radius: 10px;
	  margin-top: 10px;
	}
	
	.descriptionHeader {
	  font-size: 16px;
	}
	
	.descriptionBody {
	  margin-top: 10px;
	  font-size: 14px;
	  text-indent: 2em;
	  line-height: 18px;
	}
	
	.thanks {
	  border: 1px solid #c5b5f0;
	  padding: 8px;
	  border-radius: 10px;
	  margin-top: 10px;
	  font-size: 16px;
	}
	
	.thanksItem {
		
	}
	
	.thanksItem > div {
	  margin-top: 10px;
	}
</style>
