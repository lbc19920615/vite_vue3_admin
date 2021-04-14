<template>
  <div>
    <img @click="toggleClick" class="hamburger" :class="{'is-active':isActive}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAQCAYAAADqDXTRAAAAl0lEQVQ4jdXVIQqCQRCG4WcXo8Fj2CwG7yEYFavgbSwLBrsXEYxGb2EQTBosBpVd2H/FF6Z97MvAzE5IKSngXhL+RKzxSCm9wnyoIf1Jp++kfexaSkc4YtFKusIBwy6FPAdpgC2mGflqK5MyhdWImGOTmQ81KuKGNWa41OnlO6+DtMcYp5ZSOGOi8Z7CFcsupaV/7/9emQco0BKn229jJAAAAABJRU5ErkJggg==">
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
.hamburger {
	display: inline-block;
	cursor: pointer;
	transform: rotate(180deg);
	transition: .38s;
	transform-origin: 50% 50%;
}
.hamburger.is-active {
	transform: rotate(0deg);
}
</style>
